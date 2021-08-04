// Core
import Vue                    from 'vue'
import echarts                from 'vue-echarts'
import grid                   from 'vue-grid-layout'
import { QueryBuilderPlugin } from '@syncfusion/ej2-vue-querybuilder'
import quasar                 from "quasar"
import iconSet                from 'quasar/icon-set/mdi-v4'
import store                  from '@/plugins/store'
import app                    from '@/components/app'

// Plugins
import apolloProvider         from '@/plugins/apollo'
import router                 from '@/plugins/router'
import logger                 from '@/plugins/logger'
import util                   from '@/plugins/util'

// Testing
import blank                  from '@/components/atoms/a.blank'
import './styles/index.sass'

Vue.config.productionTip = false

Vue.prototype.$util = util

Vue.use(quasar, { iconSet })
Vue.use(QueryBuilderPlugin)
Vue.component(`v-chart`, echarts)
Vue.component(`v-grid`, grid.GridLayout)
Vue.component(`v-grid-item`, grid.GridItem)
Vue.component(`blank`, blank)

new Vue({
  apolloProvider,
  store,
  router,
  logger,
  render: h => h(app)
}).$mount(`#app`)
