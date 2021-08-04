<template>
  <q-select
    v-model="where.State"
    :options="states"
    emit-value
    hide-dropdown-icon
    option-label="full"
    option-value="abbr"
    use-input
    v-bind="pSelect"
    @filter="filterStates"
    @clear="delete where.State"
  >
    <template #prepend>
      <q-icon size="xs" name="mdi-earth" />
    </template>
  </q-select>
</template>

<script>
import { sync }    from 'vuex-pathify'
import { pSelect } from '@/static/props'
import states      from '@/static/lookup/states.usa'

export default {
  name: `a.picker.states`,

  data: () => ({
    pSelect,
    states
  }),

  computed: {
    where: sync(`search/explore/options@variables.where.value`),
  },

  methods: {
    filterStates (val, update) {
      if (!val) return update(() => { this.states = states })

      return update(() => {
        const value = val.toLowerCase()
        this.states = states.filter(x =>
          x.full.toLowerCase().indexOf(value) > -1
          || x.abbr.toLowerCase().indexOf(value) > -1)
      })
    },
  }
}
</script>
