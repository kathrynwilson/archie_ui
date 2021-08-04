import { make } from 'vuex-pathify'

const state = {
  drawer:            false,
  dashboardIsLocked: true,
  dashboardLayout:   [
    { x: 0, y: 4, w: 4, h: 5, i: 0, type: `pie`, title: `Voter Population by Religion` },
    { x: 8, y: 4, w: 4, h: 5, i: 1, type: `scatter`, title: `` },
    { x: 4, y: 4, w: 4, h: 5, i: 2, type: `heatmap`, title: `Voter Population by Religion` },
    { x: 0, y: 0, w: 5, h: 4, i: 3, type: `geomap`, title: `` },
    { x: 5, y: 0, w: 7, h: 4, i: 4, type: `datatable`, title: `` }
  ]
}

const actions = {
  ...make.actions(state),
  updateDrawer ({ state }) {
    state.drawer = !state.drawer
  },
  updateDashboardIsLocked ({ state }) {
    state.dashboardIsLocked = !state.dashboardIsLocked
  }
}

const mutations = make.mutations(state)

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
