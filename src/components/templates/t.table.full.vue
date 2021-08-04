<template>
  <q-table
    :columns="columns"
    :data="data"
    :filter="filter"
    :loading="isLoading"
    :pagination.sync="pagination"
    :rows-per-page-options="rowsPerPageOptions"
    :sort-method="sortValues"
    class="fit no-wrap column justify-between"
    color="primary"
    :dense="dense"
    desc square
    @row-click="select"
  >
    <template v-slot:top-right>
      <q-toggle v-model="dense" size="sm" label="Compact table" />

      <slot name="export" class="q-ml-md" />
    </template>
  </q-table>
</template>

<script>
import { sync } from 'vuex-pathify'
import {
  map, sortBy, reverse, take, filter, includes, find, isNumber
} from 'lodash'
import fields from '@/static/fields'

export default {
  name: `t.table.full`,

  props: {
    data:    { type: Array,   default: () => [] },
    sort:    { type: Boolean, default: false    },
    filter:  { type: String,  default: ``       },
    columns: { type: Array,   default: () => fields.headers.fPersonDetails.fields },
  },

  data: () => ({
    dense:      true,
    page:       1,
    pagination: {
      descending:  false,
      page:        1,
      rowsPerPage: 25,
      sortBy:      `desc`,
    },
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  }),

  computed: {
    context:   sync(`search/explore/context`),
    contextId: sync(`search/explore/contextId`),
    dialog:    sync(`search/explore/dialog`),
    isLoading: sync(`search/explore/isLoading`),
  },

  methods: {
    select (event, row) {
      if (this.contextId) return
      this.$store.dispatch(`search/explore/updateContext`, row)
      this.contextId = row.DT_RegID || row.rnc_regid || row.RNC_RegID
      this.dialog = true
    },
    sortValues (rows, sortMethod, isDescending) {
      return this.sort
        ? take(reverse(sortBy(rows, `field`)), 5) // Sort, reverse, then select top five
        : rows
    }
  }
}
</script>

<style scoped>
.q-table__bottom {
  position: sticky !important;
  bottom: 0;
  background: white;
  z-index: 1;
}
</style>
