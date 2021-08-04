<template>
  <q-table
    :columns="columns"
    :data="data"
    :filter="filter"
    :loading="isLoading"
    :pagination.sync="pagination"
    :rows-per-page-options="rowsPerPageOptions"
    :hide-bottom="isIssue"
    :hide-header="!header"
    :sort-method="sortValues"
    class="fit no-wrap column justify-between"
    color="primary"
    :dense="dense"
    desc square
    @row-click="select"
  >
    <template v-slot:top-right>
      <q-toggle v-model="dense" size="sm" label="Compact table" />
    </template>

    <template v-slot:body-cell-field="props">
      <q-td :props="props">
        <q-linear-progress
          v-if="hasRanking(props.value)"
          :color="`${getColor(props.value)}`"
          :value="getValue(props.value)"
          rounded
          size="8px"
        />
        <q-icon
          v-else-if="hasBoolean(props.value)"
          :color="props.value ? `primary` : `grey-5`"
          :name="props.value ? `mdi-check-bold` : `mdi-close`"
        />
        <div
          v-else
          class="my-table-details"
        >
          {{ props.value }}
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { sync } from 'vuex-pathify'
import {
  sortBy, reverse, take, includes, find, isNumber
} from 'lodash'
import scores from '@/static/lookup/values.score'

export default {
  name: `t-table-simple`,

  props: {
    data:    { type: Array,   default: () => [] },
    header:  { type: Boolean, default: true     },
    sort:    { type: Boolean, default: false    },
    max:     { type: Number,  default: null     },
    filter:  { type: String,  default: ``       },
    columns: {
      type:    Array,
      default: () =>
        [{ label: ``, name: `name`,  style: `width: 50%; text-align: left`, field: row => row.name },
         { label: ``, name: `field`, style: `width: 50%; text-align: left`, field: row => row.field, sortBy () { return this.sort ? `field` : `name` } }]
    },
  },

  data: () => ({
    dense:      false,
    page:       1,
    pagination: {
      descending:  false,
      page:        1,
      rowsPerPage: 25,
      sortBy:      `desc`,
    },
  }),

  computed: {
    rowsPerPageOptions () { return this.max ? [this.max] : [5, 10, 25, 50, 100] },
    context:   sync(`search/explore/context`),
    contextId: sync(`search/explore/contextId`),
    dialog:    sync(`search/explore/dialog`),
    isLoading: sync(`search/explore/isLoading`),
    isIssue () { return this.max === 5 && this.sort === true }
  },

  methods: {
    hasBoolean (value) {
      return [true, false, 0].includes(value)
    },
    hasRanking (value) {
      // Determine if the progress bar should be shown
      const isRank = scores.map(score => score.label).includes(value)
      return isRank === true || this.isIssue
    },
    getColor (value) {
      if (isNumber(value)) return this.$util.tool.getColor(value, scores)
      return scores.find(score => score.label === value).color
    },
    getValue (value) {
      if (isNumber(value)) return value / 100
      return scores.find(score => score.label === value).value || value
    },
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
