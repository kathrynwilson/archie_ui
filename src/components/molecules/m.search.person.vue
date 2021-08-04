<template>
  <div class="q-gutter-y-md">
    <q-input
      v-for="option in options"
      :key="option.index"
      v-model="option.model"
      v-bind="props"
      :label="option.label"
      @clear="delete where[option.value]"
      @input="value => value ? updateType(option) : delete where[option.value]"
    >
      <!-- clearable
      color="primary"
      class="text-body2"
      dense
      filled
      hide-hint
      type="text"
      clear-icon="mdi-close" -->
      <template #append>
        <q-btn
          flat
          round
          size="sm"
          tabindex="-1"
          :color="option.exact ? `primary` : `default`"
          :icon="option.exact ? `mdi-image-filter-center-focus-strong` : `mdi-image-filter-center-focus-weak`"
          @click="option.exact = !option.exact, updateType(option)"
        >
          <q-tooltip anchor="center right" self="center left">
            Click to {{ option.exact ? `disable` : `enable` }} exact matching.
          </q-tooltip>
        </q-btn>
      </template>
    </q-input>
  </div>
</template>

<script>
import { sync }    from 'vuex-pathify'
import { fPerson } from '@/static/fields/fields.facets'
import { pInput }  from '@/static/props'

export default {
  name: `m.search.person`,

  data: () => ({
    options: fPerson.fields,
    props:   pInput
  }),

  computed: {
    where: sync(`search/explore/options@variables.where.value`),
  },

  methods: {
    updateType (option) {
      if (!option.model) return

      this.where = {
        ...this.where,
        [option.value]: option.exact
          ? option.model
          : { like: `${option.model}%` }
      }
    }
  }
}
</script>
