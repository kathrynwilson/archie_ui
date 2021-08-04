import geomap from './module.chart.geomap'

// State
export const state = {
  theme: { textStyle: { fontFamily: `Roboto` } }
}

export default {
  namespaced: true,
  state,
  modules:    {
    geomap,
  }
}
