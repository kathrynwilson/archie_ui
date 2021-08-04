import { make } from 'vuex-pathify'
import map      from 'lodash/map'

// This is built as a callback rather than a standard `state` declaration
// so that state can be reset back to these values (e.g. when someone wants to
// change their search criteria and execute a new search).
// This gets called from the `resetState` action, so it can be called from any
// component using `vuex-pathify` syntax.
//
// 📌 Example: `a.component.vue`
//
// import { call } from 'vuex-pathify'
//
// methods: {
//   reset: call(`search/explore/resetState`)
// }
//
const getDefaultState = () => ({
  // `Context` refers to the active search parameters as a user is browsing data,
  // such as the person record currently being viewed and its relevant data (in which
  // case `id` is referring either to that person's `DT_RegId` or `rnc_regid`).
  //
  // `Options` are the query options that are dynamically built as a user is selecting
  // search terms before executing.
  context:   [],
  contextId: ``,
  data:      [],
  dialog:    false,
  isLoading: false,
  operation: ``,
  query:     {},
  options:   {
    operation: ``,
    fields:    [],
    variables: {
      where: {
        type:  `SequelizeJSON`,
        value: {
          // State:     `OK`,
          // FirstName: { like: `Chris` },
          // LastName:  `Wilson`
        }
      }
    }
  },
})

const state = getDefaultState()

const actions = {
  ...make.actions(state),

  // Set state back to default values (see `getDefaultState` above)
  resetState ({ state }) {
    Object.assign(state, getDefaultState())
  },

  // Add an `id` field to the context object for ease of use between
  // fields with non-standardized names
  updateContext ({ state }, payload) {
    const addId = {
      id: payload.DT_RegID || payload.rnc_regid || payload.RNC_RegID,
      ...payload
    }

    const makeArray = map(addId, (value, key) => ({
      name:  key,
      label: key,
      field: value
    }))
    state.context = makeArray
  },

  /**
   * Receive an object and apply it to the current `where` search parameters
   *
   * @param {Object}  state   The module state (see above)
   * @param {Object}  payload The object to be transformed and applied (see properties)
   * 🔑 @property {String} value The name of the GraphQL field to be queried
   * 🔑 @property {String} model The value of the GraphQL field to be queried
   */
  updateWhere ({ state }, payload) {
    // Prepare an object consisting of all parameters currently in `where` EXCEPT
    // the one being passed in the payload. This is so that in the subsequent step,
    // if the payload's `model` is empty (meaning the text field was cleared),
    // that particular search parameter will be excluded from the new object,
    // removing it from the `where` parameters while leaving any other fields in tact.
    const { [payload.value]: _, ...objWithoutProp } = state.options.variables.where.value

    state.options.variables.where.value = {
      ...objWithoutProp,
      ...payload.model && {
        [payload.value]: payload.exact
          ? payload.model
          : { like: `${payload.model}%` }
      }
    }
  }
}

const mutations = make.mutations(state)

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
