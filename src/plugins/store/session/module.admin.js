import _                   from 'lodash'
import topics              from '@/static/fields/fields.topics'
import without             from 'lodash/without'
import { UPDATEUSER }      from '@/plugins/apollo/mutations'
import { apolloClient }    from '@/plugins/apollo'
import { make, get, sync } from 'vuex-pathify'

const getDefaultState = () => ({
  allDefaults:        topics,
  savedDefaultFields: topics,
})

const state = getDefaultState()

const getters = {
  ...make.getters(state),
  // Get the current user's settings from the `active` module;
  // if it doesn't exist, set the user's settings to the defaults in this module's state
  settings: (state, getters, rootState, rootGetters) => rootGetters[`session/active/settings`]
}

const actions = {
  ...make.actions(state),
  resetState:  ({ state }) => { Object.assign(state, getDefaultState()) },
  fieldRemove: ({ state }, { item, alias }) => {
    // When a field is deselected, update the relative arrays accordingly
    const topic = state.savedDefaultFields[alias]
    state.savedDefaultFields[alias].fields = _.without(topic.fields, item) // Set the saved fields to what it was before, minus the newly deselected value
    state.savedDefaultFields[alias].fieldsAvailable.push(item) // Add the deselected value to the list of available fields
  },
  fieldRemoveAll: ({ state }, alias) => {
    const topic = state.savedDefaultFields[alias]
    const concatArray = _.concat(topic.fields, topic.fieldsAvailable)
    state.savedDefaultFields[alias].fields = []
    state.savedDefaultFields[alias].fieldsAvailable = concatArray
  },
  fieldSelect: ({ state }, { item, alias }) => {
    // When a field is selected, update the relative arrays accordingly
    const topic = state.savedDefaultFields[alias]
    state.savedDefaultFields[alias].fieldsAvailable = _.without(topic.fieldsAvailable, item) // Update the list of available fields to exclude the selected value
    state.savedDefaultFields[alias].fields.push(item) // Add the selected value to the list of fields
  },
  fieldSelectAll: ({ state }, alias) => {
    const topic = state.savedDefaultFields[alias]
    const concatArray = _.concat(topic.fields, topic.fieldsAvailable)
    state.savedDefaultFields[alias].fieldsAvailable = []
    state.savedDefaultFields[alias].fields = concatArray
  },
}

const mutations = make.mutations(state)

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
