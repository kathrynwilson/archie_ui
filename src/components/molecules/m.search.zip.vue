<template>
  <query-wrapper
    v-if="state"
    #query="{ data }"
    :fields="fields"
    :operation="operation"
    :variables="variables"
  >
    <q-select
      v-if="data"
      v-model="where.MailingAddressZip5"
      :disable="!state"
      :options="data"
      class="text-caption"
      clear-icon="mdi-close"
      color="text-primary"
      label="Zip code"
      clearable dense emit-value filled
      hide-dropdown-icon options-dense use-input
      @clear="delete where.MailingAddressZip5"
    >
      <template #prepend>
        <q-icon size="xs" class="q-mr-xs" name="mdi-home-group" />
      </template>
    </q-select>
  </query-wrapper>
</template>

<script>
import { sync }     from 'vuex-pathify'
import queryWrapper from "@/components/templates/t.wrapper.query"

export default {
  name: `m.search.zip`,

  components: {
    queryWrapper
  },

  data: () => ({
    operation: `dtDistrictsGet`,
    fields:    [`Zipcode`]
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
            State:   this.state,
            Zipcode: { gt: 0 }
          }
        }
      }
    }
  }
}
</script>
