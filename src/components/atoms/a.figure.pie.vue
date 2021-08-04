<template>
  <v-chart :options="options" autoresize />
</template>

<script>
// import ECharts from 'vue-echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import _       from 'lodash'
import queries from '@/plugins/apollo/queries'

export default {
  name: `a-figure-pie`,

  data: () => ({
    query:     [],
    isLoading: true
  }),

  computed: {
    options () {
      return {
        color: [`#D7263D`, `#1B998B`, `#2E294E`, `#F46036`, `#E2C044`],
        title: {
          text: `Registered Voter Population by Religion`,
          x:    `center`
        },
        tooltip: {
          trigger:   `item`,
          // formatter: `{a} <br/>{b}: {c} ({d}%)`
          formatter: `{b}: {c} ({d}%)`
        },
        legend: {
          type:            `scroll`,
          orient:          `vertical`,
          left:            10,
          top:             10,
          bottom:          10,
          backgroundColor: `rgba(255, 255, 255, .7)`,
          padding:         10,
          textStyle:       {
            fontFamily: `Roboto`
          },
          data: [...new Set(this.query.map(label => label.name))]
        },
        series: [
          {
            // name: `pie`,
            type:              `pie`,
            radius:            [`50%`, `80%`],
            avoidLabelOverlap: false,
            hoverOffset:       5,
            itemStyle:         {
              emphasis: {
                shadowBlur:    10,
                shadowOffsetX: 0,
                shadowColor:   `rgba(0, 0, 0, 0.5)`
              }
            },
            label: {
              normal: {
                show:     false,
                position: `center`
              },
              emphasis: {
                shadowBlur:    10,
                shadowOffsetX: 0,
                shadowColor:   `rgba(0, 0, 0, 0.5)`
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.query
          }
        ]
      }
    }
  },

  methods: {
    summarize (data) {
      return _(data)
        .groupBy(`name`)
        .map((value, name) => ({
          name,
          value: value.length
        }))
        .values()
        .value()
    }
  },

  apollo: {
    getPie: {
      query:  queries.qGetBirthYearByReligion,
      manual: true,
      result ({ data }) {
        this.query = this.summarize(data.results)
      },
      error (error) {
        console.error(`❌ Error fetching data from GraphQL ("query.qGetBirthYearByReligion"): `, error)
      },
      watchLoading (isLoading) {
        this.isLoading = isLoading
      },
      update: data => data.getPie
    }
  }
}
</script>
