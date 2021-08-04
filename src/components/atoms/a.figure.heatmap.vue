<template>
  <v-chart :options="options" autoresize />
</template>

<script>
import echarts from 'vue-echarts'
import _       from 'lodash'
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/component/visualMap'
import queries from '@/plugins/apollo/queries'

// const { queries } = gq

const myX = [
  `Unknown`,
  `Protestant`,
  `Catholic`,
  `Buddhist`,
  `Jewish`,
  `Eastern Orthodox`,
  `E`,
  `Mormon`,
  `Hindu`,
  `Islamic`,
  `Shinto`,
  `Sikh`
]
const myY = [
  `Null Or Empty In Source System`,
  `Unaffiliated`,
  `Democrat Party`,
  `Republican Party`,
  `Other`,
  `Libertarian`,
  `Independent Party`,
  `None`
]
const myData = [
  [`Unknown`, `Null Or Empty In Source System`, 55],
  [`Unknown`, `Democrat Party`, 37],
  [`Unknown`, `Unaffiliated`, 31],
  [`Unknown`, `Republican Party`, 17],
  [`Unknown`, `Libertarian`, 2],
  [`Unknown`, `Independent Party`, 1],
  [`Unknown`, `Other`, 1],
  [`Protestant`, `Unaffiliated`, 67],
  [`Protestant`, `Null Or Empty In Source System`, 252],
  [`Protestant`, `Democrat Party`, 101],
  [`Protestant`, `Republican Party`, 115],
  [`Protestant`, `Other`, 10],
  [`Protestant`, `Concerned Citizens Party Of Conneticut`, 1],
  [`Protestant`, `Libertarian`, 2],
  [`Protestant`, `Independent Party`, 7],
  [`Protestant`, `None`, 1],
  [`Catholic`, `Null Or Empty In Source System`, 80],
  [`Catholic`, `Unaffiliated`, 44],
  [`Catholic`, `Republican Party`, 39],
  [`Catholic`, `Democrat Party`, 68],
  [`Catholic`, `Other`, 4],
  [`Buddhist`, `Null Or Empty In Source System`, 9],
  [`Buddhist`, `Unaffiliated`, 6],
  [`Buddhist`, `Democrat Party`, 5],
  [`Jewish`, `Democrat Party`, 3],
  [`Jewish`, `Unaffiliated`, 4],
  [`Jewish`, `Null Or Empty In Source System`, 3],
  [`Jewish`, `Republican Party`, 2],
  [`Eastern Orthodox`, `Null Or Empty In Source System`, 4],
  [`Eastern Orthodox`, `Democrat Party`, 1],
  [`Eastern Orthodox`, `Republican Party`, 1],
  [`E`, `Democrat Party`, 3],
  [`E`, `Republican Party`, 1],
  [`Mormon`, `Republican Party`, 2],
  [`Mormon`, `Unaffiliated`, 1],
  [`Mormon`, `Libertarian`, 1],
  [`Mormon`, `Democrat Party`, 1],
  [`Hindu`, `Unaffiliated`, 2],
  [`Hindu`, `Null Or Empty In Source System`, 4],
  [`Hindu`, `Democrat Party`, 1],
  [`Islamic`, `Democrat Party`, 3],
  [`Islamic`, `Null Or Empty In Source System`, 2],
  [`Islamic`, `Unaffiliated`, 1],
  [`Islamic`, `Republican Party`, 1],
  [`Islamic`, `Independent Party`, 1],
  [`Shinto`, `Null Or Empty In Source System`, 1],
  [`Shinto`, `Other`, 1],
  [`Sikh`, `Democrat Party`, 1]
]

export default {
  name: `a-figure-heatmap`,

  data: () => ({
    queryData: [],
    yLabels:   [],
    xLabels:   []
  }),

  computed: {
    options () {
      return {
        tooltip: {
          position: `top`
        },
        animation: false,
        // grid: {
        //   // width: `80%`
        //   borderWidth: 0,
        //   containLabel: true
        //   // top: 10,
        //   // left: `center`
        //   // y: `10%`
        // },
        xAxis:     {
          // fontFamily: `Roboto`,
          type:      `category`,
          data:      myX,
          // showMinLabel: true,
          splitArea: {
            show: true
          }
        },
        yAxis: {
          type:      `category`,
          data:      myY,
          splitArea: {
            show: true
          },
          z:         2,
          axisLabel: {
            // fontFamily: `Roboto`,
            // fontWeight: 500,
            inside:          true,
            backgroundColor: `rgba(255, 255, 255, .6)`,
            padding:         [4, 8, 2, 4],
            // width: `50%`,
            // left: `20%`,
            z:               3
          }
        },
        visualMap: {
          min:   0,
          show:  false,
          max:   40,
          color: [`#D7263D`, `#2E294E`]
        },
        series: [
          {
            // label: {
            //   show: true
            // },
            // name: `Punch Card`,
            type:      `heatmap`,
            data:      myData,
            itemStyle: {
              // borderColor: `transparent`,
              emphasis: {
                shadowBlur:  10,
                shadowColor: `rgba(0, 0, 0, 0.5)`
              }
            }
          }
        ]
      }
    }
  },

  methods: {
    summarize (data) {
      const summary = _(data)
        .groupBy(`name`)
        .map((value, name) => ({
          name,
          parties: value.reduce((party, { value }) => {
            const thisParty = party
            thisParty[value] = (party[value] || 0) + 1
            return thisParty
          }, {})
        }))
        .values()
        .value()

      return this.rearrange(summary)
    },
    rearrange (summary) {
      return _.flatMap(summary, item => _.map(item.parties, (party, index) => [item.name, index, party]))
    }
  },

  apollo: {
    getHeatmap: {
      query: queries.qGetBirthYearByReligion,
      result ({ data, loading }) {
        // this.isLoading = true
        // this.yLabels = new Set(data.results.map(label => label.value))
        // this.xLabels = new Set(data.results.map(label => label.name))
        // let thisSummary = this.summarize(data.results)
        // this.queryData = thisSummary
        // this.isLoading = false
      },
      error (error) {
        console.error(`❌ Error fetching data from GraphQL ("query.qGetBirthYearByReligion"): `, error)
      },
      update: data => data.getHeatmap
    }
  }
}
</script>
