<template>
  <div class="q-gutter-y-md">
    <q-card v-if="isWPA">
      <!-- TODO: add createdAt, updatedAt, createdBy to table -->
      <q-table
        :columns="orgHeaders"
        :data="organizations"
        :loading="!orgsLoaded"
        dense
        row-key="name"
        title="Organizations"
        @click:row="selectOrg"
      >
        <template #top-right>
          <q-btn v-bind="pBtn" class="q-my-sm" :dense="false" color="primary" label="Create Organization" @click="openCreateOrgModal" />
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="clickable"
              :style="{backgroundColor: (organization._id === props.row._id ? '#eeeeee' : 'transparent' ) }"
              @click="selectOrg(props.row)"
            >
              <q-btn
                v-if="col.name === `edit`"
                alt="Toggle active status"
                flat
                icon="mdi-pencil"
                round
                size="xs"
                title="Toggle active status"
                @click="populateForm(props.row)"
              />
              <q-btn
                v-else-if="col.name === `delete`"
                v-show="organization._id === props.row._id"
                alt="Delete"
                flat
                icon="mdi-delete"
                round
                size="xs"
                title="Delete organization"
                @click="deleteItem(props.row)"
              />
              <span v-else>{{ col.value }}</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <q-dialog v-model="orgCreateModalIsOpen">
        <modal
          title="Create Organization"
          button-text="Create"
          :inputs="orgInputs"
          :create="createOrganization"
          :close="() => orgCreateModalIsOpen = false"
        />
      </q-dialog>

      <q-dialog v-model="orgUpdateModalIsOpen">
        <modal
          :title="organization.name"
          button-text="Update"
          :inputs="orgInputs"
          :old-obj="organization"
          :update="updateOrganization"
          :close="() => orgUpdateModalIsOpen = false"
        />
      </q-dialog>
    </q-card>

    <q-card>
      <user-table :passusers="getUsers" :chosen-org-id="organization._id" />
    </q-card>
  </div>
</template>

<script>
import actions   from '@/plugins/util/auth'
import modal     from '@/components/templates/t.create-update-modal'
import queries   from '@/plugins/apollo/queries'
import userTable from '@/components/organisms/o.users-table'
import { pBtn }  from '@/static/props'
import { sync }  from 'vuex-pathify'

export default {
  name: `p-admin-users`,

  components: {
    userTable,
    modal,
  },

  data: () => ({
    pBtn,
    orgCreateModalIsOpen: false,
    orgUpdateModalIsOpen: false,
    organization:         {},
    organizations:        [],
    orgsLoaded:           false,
    usersForOrganization: [],
    orgInputs:            [
      { label: `Name`,            model: `name` },
      { label: `Email`,           model: `email` },
      { label: `Phone`,           model: `phone`, mask: `(###) ### - ####` },
      { label: `Primary Contact`, model: `contactName` }],
    orgHeaders: [
      { label: `Name`,            align: `left`,   field: `name`,        name: `name`,        sortable: true },
      { label: `Primary Contact Name`, align: `left`,   field: `contactName`, name: `contactName`, sortable: true },
      { label: `Email`,           align: `left`,   field: `email`,       name: `email`,       sortable: true },
      { label: `Phone`,           align: `left`,   field: `phone`,       name: `phone`,       sortable: true },
      { label: `Edit`,            align: `center`, field: ``,            name: `edit`,        sortable: false, headerClasses: `q-table--col-auto-width` },
      { label: `Delete`,          align: `center`, field: ``,            name: `delete`,      sortable: false, headerClasses: `q-table--col-auto-width` }],
  }),

  computed: {
    ...sync(`session/active@*`),
    isWPA () {
      return this.user.organization.name === `WPA`
    }
  },

  mounted () {
    this.getOrgs()
    if (this.user.organization) {
      this.selectOrg(this.user.organization)
    }
  },

  methods: {
    populateForm (item) {
      this.organization = item
      this.orgUpdateModalIsOpen = true
    },
    selectOrg (item) {
      this.organization = item
    },
    getUsers (users) {
      this.usersForOrganization = users
    },
    createOrganization (newOrg) {
      const orgErrors = validateOrg(newOrg)
      if (orgErrors) return alert(orgErrors)
      return actions.createOrganization(newOrg)
        .then(createOrgResponse => {
          this.organizations.unshift(createOrgResponse.data.organizationCreate)
          this.orgCreateModalIsOpen = false
        })
        .catch(createOrgError => {
          console.error(createOrgError)
          alert(`There was a problem creating the Organization`) // eslint-disable-line no-alert
        })
    },
    openCreateOrgModal () {
      this.orgCreateModalIsOpen = true
    },
    updateOrganization (updatedOrg) {
      const orgErrors = validateOrg(updatedOrg)
      if (orgErrors) return alert(orgErrors)
      return actions.updateOrganization(updatedOrg).then(updateOrgResponse => {
        if (updateOrgResponse.errors) {
          console.error(updateOrgResponse.errors)
          alert(`error while updating organizations`) // eslint-disable-line no-alert
        } else {
          const newOrg = updateOrgResponse.data.organizationUpdate
          this.organizations = this.organizations.map(org => {
            if (org._id === newOrg._id) return newOrg
            return org
          })
          this.orgUpdateModalIsOpen = false
        }
      }).catch(updateOrgError => {
        console.error(updateOrgError)
        alert(`There was a problem updating the Organization`) // eslint-disable-line no-alert
      })
    },
    getOrgs () {
      const _vm = this
      this.$apollo.query({
        query:     queries.qGetOrganizations,
        variables: {},
      })
        .then(response => {
          if (response.data) {
            _vm.organizations = response.data.results
            _vm.orgsLoaded = true
          } else {
            console.error(response.errors) // TODO: handle error such as auth error
          }
        })
        .catch(console.log)
    },
    deleteItem (org) {
      if (this.usersForOrganization.length > 0) return alert(`cannot delete organization that has active users`) // eslint-disable-line no-alert
      if (org._id === this.user.orgId) return alert(`cannot delete your own organization`) // eslint-disable-line no-alert
      return window.confirm(`Are you sure you want to delete ${org.name}?`) && this.deleteOrg(org) // eslint-disable-line no-alert
    },
    deleteOrg (org) {
      actions.deleteOrg(org._id)
        .then(delOrgRes => {
          if (!delOrgRes.errors) {
            this.organizations = this.organizations.filter(o => o._id !== delOrgRes.data.deletedId)
          } else this.handleErrors(delOrgRes.errors)
        })
        .catch(this.handleError)
    },
    handleError (e) {
      console.error(e)
      alert(`error occured. Please try again`) // eslint-disable-line no-alert
    }
  }
}
function validateOrg (org) {
  if (!org.name) return `name is required`
  if (invalidEmail(org.email)) return `invalid email`
  return null
}
// TODO: shared by o.users-table.vue. put in helpers
function invalidEmail (email) {
  if (!email) return false
  /* eslint-disable no-control-regex */
  const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  return !regex.test(email)
}
</script>
