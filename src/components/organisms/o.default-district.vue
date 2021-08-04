<template>
  <q-card>
    <q-toolbar class="bg-primary text-white" style="min-height: 40px">Default Demographic</q-toolbar>
    <q-card-section class="q-gutter-y-md">
      <q-select
        v-bind="pSelect"
        :value="state.label"
        label="State"
        :options="states"
        @input="setState"
      />
      <q-select
        v-bind="pSelect"
        :value="districtType.label"
        label="Default District Type"
        :options="districtTypes"
        @input="setDistrictType"
      />
      <q-select
        v-bind="pSelect"
        :value="districtValue.label"
        :disabled="!state.value || !districtType.value"
        label="Default District Value"
        :options="districtValues"
        @input="setDistrictValue"
      />
    </q-card-section>

    <q-separator />

    <q-card-actions class="q-pa-md">
      <q-btn
        color="primary"
        type="submit"
        label="Save"
        v-bind="pBtn"
        @click.prevent="submitSettings"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { pSelect, pBtn } from '@/static/props'

export default {
  name: `p-admin-settings`,

  props: {
    districtTypes:    { type: Array,    default: () => []                         },
    states:           { type: Array,    default: () => []                         },
    districtValues:   { type: Array,    default: () => []                         },
    setDistrictType:  { type: Function, default: () => null                       },
    setDistrictValue: { type: Function, default: () => null                       },
    setState:         { type: Function, default: () => `OK`                       },
    submitSettings:   { type: Function, default: () => null                       },
    districtType:     { type: Object,   default: () => ({ label: ``, value: `` }) },
    districtValue:    { type: Object,   default: () => ({ label: ``, value: `` }) },
    state:            { type: Object,   default: () => ({ label: ``, value: `` }) },
  },

  data: () => ({
    pBtn,
    pSelect,
  }),

  mounted () {}
}
</script>
