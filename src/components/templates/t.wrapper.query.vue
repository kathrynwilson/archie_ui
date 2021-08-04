<template>
  <div style="max-height: inherit">
    <slot
      name="query"
      :data="data"
      :error="isError"
      :operation="operation"
    />
  </div>
</template>

<script>
import { sync } from 'vuex-pathify'
import map      from 'lodash/map'
import size     from 'lodash/size'
import scores   from '@/static/lookup/values.score'

export default {
  name: `t-wrapper-query`,

  props: {
    fields:    { type: Array,   default: () => [] },
    operation: { type: String,  default: ``       },
    sort:      { type: Boolean, default: false    },
    variables: { type: Object,  default: () => {} }
  },

  data: () => ({
    data:    [],
    error:   null,
    isError: null
  }),

  computed: {
    contextId: sync(`search/explore/contextId`),
    isLoading: sync(`search/explore/isLoading`),
    query:     me => me.$util.tool.makeQuery({
      operation: me.operation,
      fields:    me.fields,
      variables: me.variables
    })
    // NOTE: Might as well move the makeQuery function to this
    // component, since it will probably only ever be called from here
  },

  watch: {
    error (val, old) {
      if (val) this.isError = error
    }
  },

  methods: {
    castData (data) {
      // Decide how the returned data should be mapped
      // No data in response, so return an empty set to avoid errors
      if (!data) return null
      // Data is a list of values belonging to one record, probably to be used
      // in a simple table that displays two columns: one for keys, one for their respective values
      if (data[this.operation] && this.contextId) return this.getDataSolo(data)
      // Data is part of a list, probably in a `q-select` component,
      // so only the values are needed, and in order
      if (size(data[this.operation][0]) === 1) return this.getDataSome(data)
      // Data has several records that are going to be inserted into a table with columns,
      // so return as-is
      return this.getDataMany(data)
    },
    getDataMany (data) {
      // console.log(`:: getDataMany -> data`, data)
      return data[this.operation]
    },
    getDataSome (data) {
      // console.log(`:: getDataSome -> data`, data)
      return data[this.operation]
        .map(prop => prop[Object.keys(prop)[0]])
        .sort((a, b) => a - b)
    },
    getDataSolo (data) {
      // console.log(`:: getDataSolo -> data`, data)
      return map(data[this.operation][0], (value, key) => ({
        name:  key,
        label: key,
        field: value
      }))
    }
  },

  apollo: {
    data () {
      return {
        query:        () => this.query.query,
        variables:    () => this.query.variables,
        debounce:     500,
        error:        error => { this.error = error },
        manual:       true,
        result:       ({ data }) => { this.data = this.castData(data) },
        throttle:     500,
        update:       data => data.data,
        watchLoading: isLoading => { this.isLoading = isLoading },
      }
    }
  }
}
</script>
