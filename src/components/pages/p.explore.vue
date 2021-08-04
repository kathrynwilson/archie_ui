<template>
  <div class="column fit no-wrap">
    <div class="row col-6 justify-between items-start q-pa-md">
      <div class="col-sm-12 col-md-4 col-lg-3 col-xl-2 bg-transparent q-gutter-y-md">
        <!-- Search -->
        <q-card>
          <q-toolbar class="bg-primary text-white" style="min-height: 40px">Select a state</q-toolbar>
          <q-card-section>
            <picker-states />
          </q-card-section>
        </q-card>

        <q-card>
          <q-toolbar class="bg-primary text-white" style="min-height: 40px">Search by</q-toolbar>
          <q-tabs v-model="tab" v-bind="pTabs">
            <q-tab :ripple="false" label="Person" name="person" />
            <q-tab :ripple="false" label="Region" name="region" />
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="person">
              <search-person />
            </q-tab-panel>
            <q-tab-panel name="region" class="q-gutter-y-md">
              <search-district />
              <search-zip />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>

        <q-card>
          <q-card-actions horizontal class="q-pa-md">
            <q-btn
              v-bind="pBtn"
              label="Reset"
              @click="resetAll"
            />
            <q-space />
            <q-btn
              color="primary"
              label="Search"
              v-bind="pBtn"
              :disable="!where.State || isLoading"
              :title="!where.State ? `choose state` : ``"
              :loading="isLoading"
              @click="search"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Map -->
      <div class="col-8 self-stretch">
        <q-card flat class="bg-transparent fit">
          <q-card-section class="fit">
            <figure-geomap />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Table -->
    <div class="row col-6 q-pa-md">
      <query-wrapper
        v-if="resultsCard"
        #query="{ data }"
        v-model="resultsCard"
        :fields="fields"
        :operation="operation"
        :variables="variables"
        class="col-12"
      >
        <full-table :columns="columns" :data="data">
          <template #export>
            <q-btn
              :disable="!data.length"
              v-bind="pBtn"
              color="primary"
              class="q-ml-md"
              label="Save to vault"
              @click="exportToVault(data)"
            >
              <q-tooltip anchor="top middle" self="bottom middle">
                Save these results to your vault.
              </q-tooltip>
            </q-btn>
          </template>
        </full-table>
      </query-wrapper>
    </div>

    <!-- Popup -->
    <q-dialog v-model="dialog" @hide="context = [], contextId = ``">
      <user-card />
    </q-dialog>
  </div>
</template>

<script>
import { call, sync }  from "vuex-pathify"
import { pBtn, pTabs } from '@/static/props'
import columns         from "@/static/fields/fields.headers"
import fields          from "@/static/fields"
import figureGeomap    from "@/components/atoms/a.figure.geomap"
import fullTable       from "@/components/templates/t.table.full"
import pickerStates    from "@/components/atoms/a.picker.states"
import queryWrapper    from "@/components/templates/t.wrapper.query"
import searchDistrict  from "@/components/molecules/m.search.district"
import searchPerson    from "@/components/molecules/m.search.person"
import searchZip       from "@/components/molecules/m.search.zip"
import userCard        from "@/components/templates/t.card.user"

export default {
  name: `p-explore`,

  components: {
    figureGeomap,
    fullTable,
    pickerStates,
    queryWrapper,
    searchDistrict,
    searchPerson,
    searchZip,
    userCard
  },

  data: () => ({
    // TODO: Consider moving appropriate fields to store
    // so they can be called with `vuex-pathify`
    pBtn,
    pTabs,
    columns:     fields.headers.fPersonDetails.fields,
    hasSearched: false,
    operation:   `exploreGet`,
    query:       null,
    resultsCard: false,
    tab:         `person`,
    fields:      [
      `FirstName`,
      `MiddleName`,
      `LastName`,
      `Sex`,
      `AgeRange`,
      `CongressionalAgeRange`,
      `MailingAddressCity`,
      `State`,
      `MailingAddressZip5`,
      `CongressionalDistrict`,
      `LegislativeDistrict`,
      `SenateDistrict`,
      `DT_RegID`
    ]
  }),

  computed: {
    ...sync(`search/explore`, {
      context:   `context`,
      contextId: `contextId`,
      dialog:    `dialog`,
      isLoading: `isLoading`,
      variables: `options@variables`,
      where:     `options@variables.where.value`
    })
  },

  mounted () {
    this.resetAll()
  },

  methods: {
    reset: call(`search/explore/resetState`),
    exportToVault (data) {
      const exportedIds = data.map(record => record.DT_RegID)
    },
    resetAll () {
      this.$apollo.skipAllQueries = true
      this.dialog = false
      this.resultsCard = false
      this.isLoading = false
      this.hasSearched = false
      this.reset()
    },
    search () {
      this.hasSearched = true
      this.resultsCard = true
    }
  }
}
</script>
