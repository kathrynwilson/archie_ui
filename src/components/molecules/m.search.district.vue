<template>
  <div>
    <q-select
      v-model="district"
      :disable="!state"
      :options="options"
      class="text-caption"
      color="primary"
      dense
      filled
      hide-dropdown-icon
      label="District"
      options-dense
    >
      <template #prepend>
        <q-icon size="xs" class="q-mr-xs" name="mdi-bank" />
      </template>
    </q-select>

    <query-wrapper
      v-if="district && state"
      #query="{ data }"
      :fields="[district.value]"
      :operation="operation"
      :variables="variables"
    >
      <q-select
        v-model="where[district.value]"
        :option-label="district.value"
        :option-value="district.value"
        :options="data"
        class="text-caption q-mt-md"
        color="primary"
        dense
        emit-value
        filled
        hide-dropdown-icon
        label="District number"
        options-dense
        use-input
        @clear="delete where[district.value]"
      >
        <template #prepend>
          <q-icon size="xs" class="q-mr-xs" name="mdi-map" />
        </template>
      </q-select>
    </query-wrapper>
  </div>
</template>

<script>
import { sync }       from 'vuex-pathify'
import map            from 'lodash/map'
import isEmpty        from 'lodash/isEmpty'
import { fDistricts } from '@/static/fields/fields.facets'
import queryWrapper   from '@/components/templates/t.wrapper.query'

export default {
  name: `m.search.district`,

  components: {
    queryWrapper
  },

  data: () => ({
    district:  null,
    operation: `dtDistrictsGet`,
    options:   fDistricts.fields
  }),

  computed: {
    ...sync(`search/explore/options@variables.where`, {
      state: `value.State`,
      where: `value`,
    }),
    variables () {
      return {
        where: {
          type:  `SequelizeJSON`,
          value: {
            State:                 this.state,
            [this.district.value]: { gte: 0 }
          }
        }
      }
    }
  },

  watch: {
    where (val, old) {
      if (old) {
        if (isEmpty(val)) this.district = null
      }
    },
    district (val, old) {
      if (old) {
        if (val !== old) delete this.where[old.value]
      }
    }
  }
}
</script>
