<template>
  <q-card class="mx-auto">
    <!-- TODO: add search -->
    <q-table
      :columns="headers"
      :data="users || []"
      :loading="isLoading"
      :pagination.sync="userPagination"
      dense
      title="Users"
    >
      <template #top-right>
        <q-btn v-bind="pBtn" class="q-my-sm" :dense="false" color="primary" label="Create User" @click="userCreateModalIsOpen = true" />
      </template>

      <template #body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :class="col.name === `isActive` ? `q-py-none` : ``"
            :props="props"
          >
            <q-btn
              v-if="col.name === `isActive`"
              alt="Toggle active status"
              flat
              :icon="props.row.status === `active` ? `mdi-check` : `mdi-close`"
              round
              size="xs"
              title="Toggle active status"
              @click="toggleActive(props.row)"
            />
            <q-btn
              v-else-if="col.name === `edit`"
              alt="Edit user"
              flat
              icon="mdi-pencil"
              round
              size="xs"
              title="Edit user"
              @click="openEditModal(props.row)"
            />
            <q-btn
              v-else-if="col.name === `delete`"
              alt="Delete"
              flat
              icon="mdi-delete"
              round
              size="xs"
              title="Delete user"
              @click="deleteItem(props.row)"
            />
            <span v-else>{{ col.value }}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="userCreateModalIsOpen">
      <modal
        title="Create User"
        button-text="Create User"
        :inputs="createUserInputs"
        :create="create"
        :close="() => userCreateModalIsOpen = false"
      />
    </q-dialog>

    <q-dialog v-model="userUpdateModalIsOpen">
      <modal
        button-text="Update User"
        :title="user.fullName"
        :inputs="updateUserInputs"
        :old-obj="formatUser(user)"
        :update="update"
        :close="() => userUpdateModalIsOpen = false"
      />
    </q-dialog>
  </q-card>
</template>

<script>
/* eslint-disable no-control-regex */
import actions              from '@/plugins/util/auth'
import modal                from '@/components/templates/t.create-update-modal'
import { endpoint }         from '@/config'
import { generatePassword } from '@/plugins/util/helpers'
import { pBtn }             from '@/static/props'
import { sync }             from 'vuex-pathify'
import uid                  from 'quasar/src/utils/uid'
import { userFields }       from '@/plugins/apollo/fragments'

export default {
  name: `o.users-table`,

  components: { modal },

  props: {
    chosenOrgId: { type: String,   default: ``         },
    passusers:   { type: Function, default: () => null }
  },

  data: () => ({
    pBtn,
    comboboxGroups:        [],
    dbGroups:              [],
    filesUploaded:         null,
    invite:                true,
    isCreate:              false,
    updateUserInputs:      [],
    createUserInputs:      [],
    userCreateModalIsOpen: false,
    userPagination:        { rowsPerPage: 10 },
    userUpdateModalIsOpen: false,
    users:                 [],
    usersLoaded:           false,
    headers:               [
      { label: `Full Name`, align: `left`,   field: `fullName`, name: `fullName `, divider: true  },
      { label: `Email    `, align: `left`,   field: `email`,    name: `email    `, divider: true  },
      { label: `Active`,    align: `center`, field: `isActive`, name: `isActive`,  divider: false, sortable: false, headerClasses: `q-table--col-auto-width` },
      { label: `Edit`,      align: `center`, field: ``,         name: `edit`,      divider: false, sortable: false, headerClasses: `q-table--col-auto-width` },
      { label: `Delete`,    align: `center`, field: ``,         name: `delete`,    divider: false, sortable: false, headerClasses: `q-table--col-auto-width` }],
    user: {
      fullName: ``,
      email:    ``,
      phone:    ``,
      password: ``,
      groups:   []
    },
  }),

  computed: {
    ...sync(`session/active@`, { currentUser: `user` }),
    isLoading () {
      return this.usersLoaded === this.users.length === 0
    }
  },

  watch: {
    chosenOrgId (newOrgId, oldOrgId) {
      this.getUsers(newOrgId)
    },
    comboboxGroups () {
      this.createUserInputs = [
        { label: `Full Name`,         model: `fullName`, type: `text`,     required: true  },
        { label: `Email`,             model: `email`,    type: `text`,     required: true  },
        { label: `Phone Number`,      model: `phone`,    type: `text`,     required: false, mask: `(###) ### - ####` },
        { label: `Groups`,            model: `groups`,   type: `dropdown`, required: false, items: this.comboboxGroups, multiple: true },
        {
          label:        `Send Invite Email`,
          model:        `invite`,
          type:         `checkbox`,
          required:     false,
          defaultValue: true,
          changeFunc:   evt => this.changeInvite(evt)
        }
      ]
    }
  },

  mounted () {
    this.getGroups()
  },

  methods: {
    changeInvite (isInvite) {
      if (isInvite === false) {
        this.createUserInputs = this.createUserInputs.concat({
          model:        `password`,
          label:        `Password`,
          type:         `text`,
          defaultValue: ``,
          required:     true,
          changeFunc:   null,
        })
      } else {
        this.createUserInputs = this.createUserInputs.filter(x => x.label !== `Password`)
      }
    },
    formatUser (user) {
      if (!user.groups) return user
      return { ...user, groups: user.groups.map(formatList) }
    },
    createUser () {
      this.set({
        userUpdateModalIsOpen: false,
        user:                  {}
      })
    },
    deleteItem (user) {
      if (user._id === this.currentUser._id) return alert(`cannot delete yourself`)
      return window.confirm(`Are you sure you want to delete ${user.fullName || user.email}?`) && this.deleteUser(user)
    },
    deleteUser (user) {
      const _vm = this
      actions.deleteUser(user)
        .then(response => {
          if (this.errors) {
            // TODO: handle auth error
            alert(response.errors)
          } else {
            _vm.users = _vm.users.filter(user => user._id !== response.data.userDelete._id)
            _vm.$nextTick(() => {
              _vm.passusers(_vm.users)
            })
          }
        })
        .catch(alert)
    },
    // TODO: find out why this doesn't call sometimes.
    // For example, create a user for an oranization,
    // it will pop into the list as expected.
    // then click on another org and back to the original and the new user won't be there
    // any time you change organization, corrosponding users should be fetched from api.
    // you have to refresh to make it work
    getUsers (orgId) {
      const _vm = this
      actions.getUsers(orgId)
        .then(response => {
          if (response.data) {
            _vm.users = response.data.results
            _vm.$nextTick(() => {
              _vm.passusers(_vm.users)
            })
          } else {
            handleError(response.errors, `error fetching users`)
          }
        })
        .catch(alert)
    },
    getGroups (orgId) {
      const _vm = this
      actions.getGroups()
        .then(response => {
          if (response.data) {
            const { results: dbGroups } = response.data
            const comboboxGroups = dbGroups.map(formatList)
            _vm.comboboxGroups = comboboxGroups
            _vm.dbGroups = dbGroups
          } else {
            handleError(response.errors, `there was a problem retrieving groups`)
          }
        })
        .catch(alert)
    },
    openEditModal (user) {
      this.updateUserInputs = this.createUserInputs
        .filter(
          x => x.model !== `invite` && x.model !== `password`
        )
      this.set({
        userUpdateModalIsOpen: true,
        user,
      })
    },
    set (prop, val) {
      if (val) this.$set(this, prop, val)
      else {
        const _vm = this
        Object.keys(prop).forEach(x => {
          _vm.$set(_vm, x, prop[x])
        })
      }
    },
    create (userData) {
      const _vm = this

      // validate user input
      if (!userData.email) return alert(`email is required`)
      if (!userData.fullName) return alert(`full name is required`)
      if (!userData.password && !userData.invite && !_vm.userUpdateModalIsOpen) return alert(`password is required`)
      if (invalidEmail(userData.email)) return alert(`invalid email`)

      const passwd = userData.password ? userData.password.trim() : generatePassword()
      const u = {
        ...userData,
        password:   passwd,
        groups:     transformGroups(userData.groups, _vm.dbGroups),
        inviteCode: userData.invite ? uid() : null,
        phone:      userData.phone ? userData.phone.split(``).filter(x => `1234567890`.includes(x)).join(``) : ``,
        invite:     undefined
      }

      return actions.createUser(u, _vm.chosenOrgId)
        .then(r => {
          if (r.data && r.data.userCreate) {
            const newUsers = [r.data.userCreate, ..._vm.users]
            this.reset(newUsers)
            if (userData.invite) {
              const errMsg = `error occured while emailing user`
              actions.inviteUser(u)
                .then(r => { if (r.errors) handleError(r.errors, errMsg) })
                .catch(e => handleError(e, errMsg))
            }
          } else {
            const err = r.errors[0].message
            handleError(err, u)
          }
        })
        .catch(e => handleError(e, `error creating user`, u))
    },
    // IDEA: lock email
    update (user) {
      const _vm = this
      actions.updateUser({ ...user, groups: transformGroups(user.groups, _vm.dbGroups) })
        .then(r => {
          if (r.errors) {
            handleError(r.errors, `error occured during update`)
          } else {
            const updatedUser = r.data.userUpdate
            const newUsers = _vm.users.map(u => {
              if (u._id === updatedUser._id) return updatedUser
              return u
            })
            this.reset(newUsers)
          }
        })
        .catch(e => {
          handleError(e, `error occured during update`)
        })
    },
    reset (users) {
      this.set({
        users,
        isCreate:              false,
        userUpdateModalIsOpen: false,
        userCreateModalIsOpen: false,
        usersLoaded:           false,
        user:                  {}
      })
    },
    toggleActive (user) {
      this.update({ ...user, status: user.status === `active` ? `disabled` : `active` })
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
    if (err.includes(`userName`)) return alert(`User with userName of ${user.email} already exists.`)
    return alert(`duplicate key error`)
  }
  return alert(m || err.message || err)
}

// TODO: shared by p.admin.users.vue. put in helpers
function invalidEmail (email) {
  const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  return !regex.test(email)
}

function formatList (x) {
  return { label: x.name, value: x._id }
}
</script>
