<template>
  <q-table
    v-if="results.length"
    :columns="columns"
    :data="results"
    :pagination.sync="pagination"
    class="sticky-header-table column"
    dense
    row-key="DT_RegID"
    table-header-class="text-white"
  >
    <template #bottom="props">
      <q-pagination
        v-model="pagination.page"
        :max="getPagination(props)"
        class="q-ml-auto"
        color="white"
        size="12px"
        text-color="grey-darken2"
      />
    </template>
  </q-table>
</template>

<script>
import { call, sync } from 'vuex-pathify'
import fields         from '@/static/fields'

export default {
  name: `a-figure-table`,

  data: () => ({
    columns:    fields.headers.fPersonDetails.fields,
    query:      null,
    results:    [],
    pagination: {
      sortBy:      `desc`,
      descending:  false,
      page:        1,
      rowsPerPage: 20,
    }
  }),

  mounted () {
    this.runQuery()
  },

  methods: {
    getPagination (props) {
      return Math.ceil(this.results.length / props.pagination.rowsPerPage)
    },
    getQuery () {
      this.query = this.$util.tool.makeQuery({
        operation: `dtVoterFileGet`,
        fields:    [`FirstName`, `MiddleName`, `LastName`, `Sex`, `AgeRange`, `CongressionalAgeRange`, `MailingAddressCity`, `State`, `MailingAddressZip5`, `CongressionalDistrict`, `LegislativeDistrict`, `SenateDistrict`, `DT_RegID`],
        variables: {
          limit: {
            type:  `Int`,
            value: 100
          },
          where: {
            type:  `SequelizeJSON`,
            value: {
              State: `OK`
            }
          }
        }
      })
    },
    runQuery () {
      this.getQuery()

      this.$apollo.addSmartQuery(`results`, {
        query () { return this.query.query },
        variables () { return this.query.variables },
        debounce:    500,
        fetchPolicy: `no-cache`,
        result ({ data }) { this.results = data.dtVoterFileGet },
        watchLoading (isLoading) { this.isLoading = isLoading },
        error (error) { console.error(`❌ Error retrieving query results in 'a.figure.table': `, error) },
        update:      data => data.results
      })
    }
  }
}
</script>

<style lang="sass">
.sticky-header-table
  overflow: hidden
  height: inherit

  .q-table__middle
    flex: 1

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: #e91b22

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
