<template>
  <v-chart
    :ref="mapRef"
    :options="options"
    :autoresize="autoresize"
    :init-options="initOptions"
    :theme="theme"
    @click="chartClick"
  />
</template>

<script>
import { sync, call } from 'vuex-pathify'
import echarts        from 'vue-echarts'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import geoJsonUsa from '@/static/geography/geo.usa.json'

echarts.registerMap(`usa`, geoJsonUsa, {
  Alaska: { left: -140, top: 30, width: 15 },
  Hawaii: { left: -130, top: 25, width: 5 }
})

export default {
  name: `a-figure-geomap`,

  data: () => ({
    autoresize:  true,
    chart:       null,
    initOptions: { title: { text: `Select State` } },
    isLoading:   null,
    mapRef:      `usaMap`,
  }),

  computed: {
    where:         sync(`search/explore/options@variables.where.value`),
    selectedState: sync(`search/explore/options@variables.where.value.State`),
    options:       sync(`charts/geomap/options`),
    theme:         sync(`charts/theme`)
  },

  watch: {
    selectedState (val, old) {
      const stateFull = this.$util.tool.convertState(val)
      const stateFullOld = this.$util.tool.convertState(old)

      if (val) {
        this.chart.dispatchAction({
          type: `highlight`,
          name: stateFull
        })
      }

      if (old) {
        this.chart.dispatchAction({
          type: `downplay`,
          name: stateFullOld
        })
      }
    }
  },

  mounted () {
    this.chart = this.$refs.usaMap
  },

  methods: {
    updateWhere: call(`search/explore/updateWhere`),
    chartClick (item) {
      const param = {
        text:  `State`,
        value: `State`,
        model: this.$util.tool.convertState(item.name),
        exact: true
      }
      this.updateWhere(param)
    }
  }
}
</script>
