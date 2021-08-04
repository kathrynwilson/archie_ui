<template>
  <div>
    <q-card>
      <q-table
        :columns="headers"
        :data="groups || []"
        :loading="isLoading"
        flat
        title="Groups"
      >
        <template #header="props">
          <!-- This is so that there is a border above the custom icons in the #body slot -->
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th auto-width /> <!-- For edit icon -->
            <q-th auto-width /> <!-- For delete icon -->
          </q-tr>
        </template>

        <template #top-right>
          <q-btn v-bind="pBtn" :dense="false" color="primary" label="Create Group" @click="createModalIsOpen = true" />
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
            <q-td auto-width>
              <q-btn flat icon="mdi-pencil" size="sm" round @click="populateForm(props.row)" />
            </q-td>
            <q-td auto-width>
              <q-btn flat icon="mdi-delete" size="sm" round @click="deleteItem(props.row)" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="createModalIsOpen">
      <modal
        title="New Group"
        :inputs="inputs"
        button-text="Create"
        :create="create"
        :close="closeCreateModal"
      />
    </q-dialog>

    <q-dialog v-model="updateModalIsOpen">
      <modal
        :title="group.name"
        :inputs="inputs"
        :old-obj="group"
        button-text="Update"
        :update="update"
        :close="() => updateModalIsOpen = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import actions      from '@/plugins/util/auth'
import modal        from '@/components/templates/t.create-update-modal'
import { endpoint } from '@/config'
import { pBtn }     from '@/static/props'

export default {
  name: `p.admin.groups`,

  components: {
    modal,
  },

  data: () => ({
    pBtn,
    createModalIsOpen: false,
    groups:            [],
    group:             {},
    updateModalIsOpen: false,
    headers:           [
      { name: `name`,        label: `Name`,        field: `name`,        align: `left`, divider: true },
      { name: `description`, label: `Description`, field: `description`, align: `left`, divider: true }],
    inputs: [
      { label: `Name`,        model: `name`        },
      { label: `Description`, model: `description` }]
  }),

  computed: {
    isLoading () {
      return false
    }
  },

  mounted () {
    this.getGroups()
  },

  methods: {
    closeCreateModal () {
      this.createModalIsOpen = false
    },
    getGroups () {
      const _self = this
      actions.getGroups()
        .then(response => {
          if (!response.data) {
            handleError(response.errors, `there was a problem retrieving groups`)
          } else {
            _self.groups = response.data.results
          }
        })
        .catch(alert)
    },
    deleteItem (grp) {
      return window.confirm(`Are you sure you want to delete group ${grp.name}?`) && this.deleteGroup(grp)
    },
    deleteGroup (grp) {
      const _vm = this
      actions.deleteGroup(grp)
        .then(response => {
          if (this.errors) {
            // TODO: handle auth error
            alert(response.errors)
          } else {
            const newGroups = _vm.groups.filter(g => g._id !== response.data.deletedId)
            _vm.groups = newGroups
          }
        })
        .catch(alert)
    },
    populateForm (grp) {
      this.group = grp
      this.updateModalIsOpen = true
    },
    set (prop, val) {
      if (val) this.$set(this, prop, val)
      else {
        const _self = this
        Object.keys(prop).forEach(x => {
          _self.$set(_self, x, prop[x])
        })
      }
    },
    submitGroup (evt) {
      return alert(`unknown error occured. Please try again`)
    },
    create (grp) {
      if (!grp.name) return alert(`Name is required`) // eslint-disable-line no-alert
      const _vm = this
      return actions.createGroup(grp)
        .then(createGrpRes => {
          if (!createGrpRes.errors) {
            _vm.groups.push(createGrpRes.data.groupCreate)
            _vm.createModalIsOpen = false
          } else {
            handleError(createGrpRes.errors, `error while creating group`, _vm.user)
          }
        })
        .catch(e => handleError(e, `error while creating group`, _vm.user))
    },
    update (grp) {
      if (grp.name === this.group.name && grp.description === this.group.description) { return alert(`nothing changed`) }
      return actions.updateGroup(grp)
        .then(editGrpRes => {
          if (!editGrpRes) return
          if (!editGrpRes.errors) {
            const newGrp = editGrpRes.data.groupUpdate
            this.groups = this.groups.map(g => {
              if (g._id === newGrp._id) return newGrp
              return g
            })
            this.updateModalIsOpen = false
          } else {
            handleError(editGrpRes.errors, `error while updating group`, this.user)
          }
        })
        .catch(e => handleError(e, `error while updating group`, this.user))
    },
    reset (users) {
      this.set({
        users,
        isCreate:    false,
        isUpdate:    false,
        usersLoaded: false,
        user:        {}
      })
    }
  }
}

// Array -> Array
function transformGroups (userGroups, dbGroups) {
  if (!userGroups) return []
  return dbGroups.filter(dbg => userGroups.map(ug => ug.value).includes(dbg._id))
}
// String -> String -> null
function handleError (e, m, user) {
  let err = e
  if (Array.isArray(e)) [err] = e // destructuring, take first element of array and assign it to err
  if (e instanceof Object) err = e.message || m
  log(err.message || err)
  if (!user) return alert(m || err.message || err)
  if (err.includes(`duplicate key error`)) {
    if (err.includes(`email`)) return alert(`User with email of ${user.email} already exists.`)
    return alert(`duplicate key error`)
  }
  return alert(m || err.message || err)
}
</script>
