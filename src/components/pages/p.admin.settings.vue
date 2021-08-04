<template>
  <div class="row items-start justify-between">
    <q-card class="col-3">
      <default-district />
    </q-card>

    <q-card class="col-8">
      <default-fields />
    </q-card>
  </div>
</template>

<script>
import { pSelect, pBtn } from '@/static/props'
import defaultFields     from "@/components/organisms/o.default-fields"
import defaultDistrict   from "@/components/organisms/o.default-district.container"

export default {
  name: `p-admin-settings`,

  components: {
    defaultFields,
    defaultDistrict,
  },

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
  })
}
</script>
