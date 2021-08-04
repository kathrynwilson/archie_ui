import Vue                  from 'vue'
import Vuex                 from 'vuex'

// Plugins
import createPersistedState from 'vuex-persistedstate'
import pathify              from './pathify'

// Modules
import charts               from './charts'
import display              from './display'
import search               from './search'
import session              from './session'

// pathify.debug()
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    pathify.plugin,
    createPersistedState({
      key: `vuex`,
      // paths: [`session.active`, `display.layout`, `search.explore`]
    })
  ],
  modules: {
    charts,
    display,
    search,
    session
  }
})
