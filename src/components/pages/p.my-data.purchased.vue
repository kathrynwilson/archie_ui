<template>
  <div class="row items-start justify-between q-gutter-x-lg">
    <q-card class="col-4">
      <vue-query-builder v-model="query" :rules="rules" />

      <q-separator />

      <q-card-actions>
        <q-space />
        <q-btn unelevated color="primary" @click="submit">Submit</q-btn>
      </q-card-actions>
    </q-card>

    <q-card v-show="results.length" class="col">
      <q-table
        :data="results || []"
        :columns="columns"
        flat
        dense
      >
        <template #top-right>
          <!-- v-bind="pBtn" -->
          <q-btn
            color="primary"
            icon-right="mdi-archive"
            label="Export CSV"
            @click="exportTable"
          />
        </template>
      </q-table>
    </q-card>
    <!-- <pre>{{ JSON.stringify(query, null, 2) }}</pre> -->
  </div>
</template>

<script>
import exportFile         from 'quasar/src/utils/export-file'
import VueQueryBuilder    from 'vue-query-builder'
import { fPersonDetails } from '@/static/fields/fields.headers'
import queries            from '@/plugins/apollo/queries'
import { sync }           from 'vuex-pathify'
import fp                 from 'lodash/fp'
import _                  from 'lodash'

// function wrapCsvValue (val, formatFn) {
//   // eslint-disable-next-line no-void
//   let formatted = formatFn !== void 0
//     ? formatFn(val)
//     : val
//   // eslint-disable-next-line no-void
//   formatted = formatted === void 0 || formatted === null
//     ? ``
//     : String(formatted)
//   formatted = formatted.split(`"`).join(`""`)

//   return `"${formatted}"`
// }

export default {
  name: `p-my-data-purchased`,

  components: {
    VueQueryBuilder,
  },

  data: () => ({
    results: [],
    columns: fPersonDetails.fields,
    rules:   [{
      type:  `text`,
      id:    `FirstName`,
      label: `FirstName`
    }],
    query: {
      logicalOperator: { id: `or`, label: `Or` },
      // children:        [{
      //   type:  `query-builder-rule`,
      //   query: {
      //     // rule:     `FirstName`,
      //     // operator: `equals`,
      //     // operand:  `FirstName`,
      //     // value:    ``
      //   }
      // }]
    }
  }),

  computed: {
    ...sync(`session/active`, { user: `user` }),
  },

  mounted () {
    this.getRules()
    this.$apollo.query({
      query:     queries.qGetUploads,
      variables: {},
    }).then(r => {
      const uniqueProps = fp.flow(fp.pluck(`properties`), fp.flatten, fp.uniq)(r.data.uploadsGet)
      this.rules = this.rules.concat(uniqueProps.map(x => ({
        type:  `text`,
        id:    `${x}-imported`,
        label: x,
      })))
    }).catch(log)
  },

  methods: {
    getRules () {
      const { dtVoterFile, wpaiNationalFlags } = this.user.organization.ownedProperties
      const otherProps = [...dtVoterFile, ...wpaiNationalFlags]
      this.rules = this.rules.concat(otherProps.map(x => {
        if (x === `Sex`) {
          return {
            type:    `radio`,
            id:      `${x}`,
            label:   x,
            choices: [
              { label: `Male`, value: `M` },
              { label: `Female`, value: `F` },
            ]
          }
        }
        return {
          type:  `text`,
          id:    `${x}`,
          label: x,
        }
      }))
    },

    submit () {
      this.$apollo.query({
        query:     queries.qVaultGet,
        variables: {
          query: this.query,
          // info:  [`FirstName`]
          // importedInfo: [`lastname`]
          info:  this.user.organization.ownedProperties.dtVoterFile
        },
      }).then(response => {
        this.results = response.data.vaultGet
      }).catch(log)
    },

    exportTable () {
      const csvItem = this.$util.tool.convertTableToCSV(this.results)
      const status = exportFile(
        `file.csv`,
        csvItem,
        `text/csv`
      )
    }
  }
}
</script>

<style>
.vue-query-builder > .q-card > .vqb-children > .q-card .row {
  flex-wrap: no-wrap !important;
}
</style>
