<template>
  <q-page>
    <q-tabs
      v-model="tab"
      active-color="primary"
      narrow-indicator
      class="bg-grey-2 col-auto"
      style="position: sticky; top: 0"
      name="myTabs"
    >
      <q-tab
        v-for="tab in tabs"
        :key="tab.index"
        :name="tab.label"
      >
        {{ tab.label }}
      </q-tab>
    </q-tabs>

    <q-tab-panels v-model="tab" animated keep-alive>
      <q-tab-panel
        v-for="tab in tabs"
        :key="tab.index"
        :name="tab.label"
        class="q-pa-none"
      >
        <query-wrapper
          :operation="tab.operation"
          :fields="tab.fields"
          :variables="getVariables(tab)"
        >
          <simple-table slot-scope="{ data }" :data="data" />
        </query-wrapper>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { sync }     from 'vuex-pathify'
import map          from 'lodash/map'
import * as fields  from '@/static/fields/fields.topics'
import queryWrapper from '@/components/templates/t.wrapper.query'
import simpleTable  from '@/components/templates/t.table.simple'

const {
  fChamber,
  fDataTrust,
  fDemographicData,
  fInfoGroup,
  fIssueSegments,
  fNationalFlags,
  fVoterHistory
} = fields

export default {
  name: `a-data-tabs`,

  components: {
    queryWrapper,
    simpleTable
  },

  // props: [`tabs`],

  data: () => ({
    tab:  `Top Issues`,
    tabs: [fIssueSegments, fVoterHistory, fDataTrust, fInfoGroup, fNationalFlags, fChamber]
  }),

  computed: {
    contextId: sync(`search/explore/contextId`),
  },

  methods: {
    getVariables (tab) {
      return {
        limit: 600,
        where: {
          type:  `SequelizeJSON`,
          value: { [tab.name]: this.contextId }
        }
      }
    }
  }
}
</script>
