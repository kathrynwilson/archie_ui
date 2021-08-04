<template>
  <q-layout
    class="bg-white"
    container
    style="max-width: 80vw; height: 800px; max-height: 80vh"
    view="hhh LpR lff"
  >
    <!-- <q-header class="bg-grey-10 q-pa-none"> -->
    <q-header class="q-pa-none">
      <q-toolbar class="bg-primary" style="z-index: 1">
        <q-toolbar-title class="text-subtitle1">{{ name }}</q-toolbar-title>

        <q-input
          #append
          v-model="filter"
          clear-icon="mdi-close"
          debounce="300"
          standout="bg-grey-2"
          placeholder="Search"
          type="search"
          clearable dark dense
        >
          <q-icon name="mdi-magnify" color="grey2" />
        </q-input>
      </q-toolbar>
      <q-tabs
        v-model="tab"
        align="right"
        class="text-white shadow-2 bg-blue-grey-10 "
        dark dense narrow-indicator shrink
      >
        <q-tab
          v-for="tab in tabs"
          :key="tab.index"
          :name="tab.label"
          :label="tab.label"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <q-page class="row justify-around">
        <q-card flat class="col-5 bg-transparent">
          <q-card-section class="fit">
            <simple-table :filter="filter" :data="context" :header="false" />
          </q-card-section>
        </q-card>

        <q-card flat class="col-5 shadow-2 bg-transparent">
          <q-card-section class="fit">
            <q-tab-panels
              v-model="tab"
              class="fit shadow-2"
              animated keep-alive
              transition-prev="fade"
              transition-next="fade"
            >
              <q-tab-panel
                v-for="tab in tabs"
                :key="tab.index"
                :name="tab.label"
                class="q-pa-none fit"
              >
                <q-scroll-area class="fit">
                  <query-wrapper
                    #query="{ data }"
                    class="fit"
                    :fields="tab.fields"
                    :operation="tab.operation"
                    :variables="getVariables(tab)"
                  >
                    <simple-table
                      :filter="filter"
                      :data="data"
                      :header="false"
                      :max="tab.max"
                      :sort="tab.sort"
                    />
                  </query-wrapper>
                </q-scroll-area>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { sync }     from 'vuex-pathify'
import map          from 'lodash/map'
import * as fields  from '@/static/fields/fields.topics'
import queryWrapper from '@/components/templates/t.wrapper.query'
import simpleTable  from '@/components/templates/t.table.simple'

const {
  fChamber, fDataTrust, fDemographicData, fInfoGroup,
  fIssueSegments, fNationalFlags, fVoterHistory
} = fields

export default {
  name: `t-card-user`,

  components: {
    queryWrapper,
    simpleTable
  },

  data: () => ({
    filter: ``,
    tab:    `Top Issues`,
    tabs:   [fIssueSegments, fVoterHistory, fDataTrust, fInfoGroup, fNationalFlags, fChamber]
  }),

  computed: {
    context:   sync(`search/explore/context`),
    contextId: sync(`search/explore/contextId`),
    name:      me => `${me.context.find(obj => obj.name === `FirstName`).field} ${me.context.find(obj => obj.name === `LastName`).field}`
  },

  methods: {
    getVariables (tab) {
      return {
        where: {
          type:  `SequelizeJSON`,
          value: { [tab.name]: this.contextId }
        }
      }
    }
  }
}
</script>

<style>
.scroll > .absolute.full-width {
  height: 100% !important;
}
</style>
