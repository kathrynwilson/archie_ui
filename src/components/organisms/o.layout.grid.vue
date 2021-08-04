<template>
  <v-grid
    :col-num="12"
    :is-draggable="!isLocked"
    :is-resizable="!isLocked"
    :layout="layout"
    :row-height="100"
    :auto-size="true"
  >
    <v-grid-item
      v-for="(item, index) in layout"
      :key="index"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      :min-h="2"
      :min-w="2"
      :drag-ignore-from="dragIgnoreFrom"
      :drag-allow-from="dragAllowFrom"
    >
      <q-card style="height: inherit">
        <component :is="item.type" />
        <q-card-actions class="fixed-bottom-left">
          <q-icon :color="isLocked ? `transparent` : `auto`" class="drag" name="mdi-cursor-move">
            <q-tooltip v-if="!isLocked">Click and hold to move</q-tooltip>
          </q-icon>
        </q-card-actions>
      </q-card>
    </v-grid-item>
  </v-grid>
</template>

<script>
import { get, call } from 'vuex-pathify'
import datatable     from '@/components/atoms/a.figure.table'
import geomap        from '@/components/atoms/a.figure.geomap'
import heatmap       from '@/components/atoms/a.figure.heatmap'
import pie           from '@/components/atoms/a.figure.pie'
import scatter       from '@/components/atoms/a.figure.scatter'
import issues        from '@/components/atoms/a.figure.top-issues'

export default {
  name: `o-layout-grid`,

  components: {
    datatable,
    geomap,
    heatmap,
    issues,
    pie,
    scatter
  },

  data () {
    return {
      dragIgnoreFrom: `.no-drag`,
      dragAllowFrom:  `.drag`,
      layout:         [
        { x: 0, y: 4, w: 4, h: 5, i: 0, type: `pie`,       title: `Voter Population by Religion` },
        { x: 8, y: 4, w: 4, h: 5, i: 1, type: `scatter`,   title: `` },
        { x: 4, y: 4, w: 4, h: 5, i: 2, type: `heatmap`,   title: `Voter Population by Religion` },
        { x: 0, y: 0, w: 5, h: 4, i: 3, type: `issues`,    title: `` },
        // { x: 0, y: 0, w: 5, h: 4, i: 3, type: `geomap`,    title: `` },
        { x: 5, y: 0, w: 7, h: 4, i: 4, type: `datatable`, title: `` }
      ]
    }
  },

  computed: {
    isLocked: get(`display/layout/dashboardIsLocked`)
  }
}
</script>

<style>
.echarts {
  max-height: 100%;
  width: 100%;
  height: 100%;
}
</style>
