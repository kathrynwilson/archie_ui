import convertState from "@/plugins/util"

// Initial state
const state = {
  selectedItem: {
    full: null,
    abbr: null
  },
  options: {
    toolbox: {
      show:    true,
      feature: {
        dataZoom: {
          type: `inside`
        }
      }
    },
    tooltip: {
      position:           [`50%`, `90%`],
      trigger:            `item`,
      formatter:          `{b}`,
      confine:            true,
      transitionDuration: 0,
      padding:            [10, 20, 10, 20]
    },
    series: [{
      type:     `map`,
      map:      `usa`,
      markArea: {
        label: {
          show: true
        }
      },
      itemStyle: {
        normal: {
          areaColor:   `#fff`,
          borderWidth: 1,
          borderColor: `#bdbdbd`
        },
        emphasis: {
          color:       `#fff`,
          borderColor: `#e91b22`,
          borderWidth: 1,
          areaColor:   `#e91b22`
          // shadowBlur: 10,
          // shadowOffsetX: 0,
          // shadowColor: `rgba(0, 0, 0, 0.4)`
        }
      },
      label: {
        normal:   { show: false },
        emphasis: { show: false }
      }
    }]
  }
}

// Actions
const actions = {
  selectItem ({ commit }, item) { commit(`selectItem`, item) }
}

// Mutations
const mutations = {
  selectItem (state, payload) {
    state.selectedItem.full = payload
    state.selectedItem.abbr = convertState(payload)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
