// TODO: Heavily refactor, making use of vuex-pathify
import util            from '@/plugins/util/auth'
import { handleError } from '@/plugins/util/xhr'
import topics          from '@/static/fields/fields.topics'
import { make }        from 'vuex-pathify'

// NOTE: Load router asynchronously. Importing the router will prompt Webpack
// to immediately import everything that is included with it. This is
// problematic with the path mapping syntax of `vuex-pathify` and Vuex
// modules because it means that the components are being imported before
// the store on which they are dependent.
// https://github.com/davestewart/vuex-pathify/issues/53#issuecomment-541474316
// TODO: Refactor to avoid hacky async import (lazy-load routes, etc.)
const router = async () => import(`@/plugins/router`)
const redirect = path => router().then(r => r.default.push(path))

const state = {
  fileName:        ``,
  isImporting:     false,
  status:          { isLoggedIn: false, token: `` },
  user:            {},
  defaultSettings: {
    defaultDistrict: { type: `Congressional District`, value: `1` },
    defaultState:    `OK`,
    defaultFields:   topics,
  }
}

const getters = {
  // Because settings are stored as a string for database I/O, when they are requested
  // for use in a component, retrieve them as a JSON object
  settings: state => {
    try {
      if (state.user.settings) {
        return JSON.parse(state.user.settings)
      }
      return state.defaultSettings
    } catch (err) {
      return state.defaultSettings
    }
  }
}

const actions = {
  ...make.actions(state),
  login ({ dispatch, commit }, { username, password }) {
    commit(`loginRequest`, { username, password })
    util.login(username, password).then(
      response => {
        // TODO: figure out why then hits instead of catch
        // when there are errors and handle this better
        if (!response) return commit(`loginFailure`, error)
        commit(`loginSuccess`, response.data.login)
        return redirect(`/dashboard`)
      },
      error => {
        commit(`loginFailure`, error)
      }
    )
  },
  logout ({ commit }) {
    util.logout()
    commit(`logout`)
    redirect(`/login`)
  },
  // uploadCSV ({ commit }, { name, data }) {
  //   util.importCSV(name, data).then(r => {
  //     commit(`setIsImporting`)
  //   })
  // },
  storeFileName ({ commit }, fileName) {
    commit(`storeFileName`, fileName)
  },
  clearFileName ({ commit }) {
    commit(`clearFileName`)
  },
  updateUser ({ commit }, user) {
    commit(`updateUser`, user)
  },
  setIsImporting ({ commit }, isImporting) {
    commit(`setIsImporting`, isImporting)
  },
  updateSettings ({ commit }, payload) {
    commit(`updateSettings`, JSON.stringify(payload))
  }
}

const mutations = {
  ...make.mutations(state),
  loginRequest (state, user) {
    state.status = { loggingIn: true }
    state.user = user
  },
  loginFailure (state, err) {
    state.status = {}
    state.user = null
    handleError(err)
  },
  loginSuccess (state, response) {
    state.status = { isLoggedIn: true, token: response.token }
    state.user = response.user
  },
  logout (state) {
    state.status = {}
    state.user = null
    state.fileName = ``
    state.isImporting = false
  },
  storeFileName (state, fileName) {
    state.fileName = fileName
  },
  clearFileName (state) {
    state.fileName = ``
  },
  updateUser (state, user) {
    state.user = user
  },
  setIsImporting (state, isImporting) {
    state.isImporting = isImporting
  },
  updateSettings (state, settings) {
    state.user.settings = settings
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
