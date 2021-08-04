<template>
  <settings
    :district-type="districtType"
    :district-types="districtTypes"
    :district-value="districtValue"
    :district-values="districtValues"
    :set-district-type="getDistrictType"
    :set-district-value="getDistrictValue"
    :set-state="setState"
    :state="state"
    :states="states"
    :submit-settings="submitSettings"
  />
</template>

<script>
import { sync, call }                   from 'vuex-pathify'
import { CON_DIST, LEG_DIST, SEN_DIST } from '@/static/constants'
import * as mutations                   from '@/plugins/apollo/mutations'
import actions                          from '@/plugins/util/auth'
import queries                          from '@/plugins/apollo/queries'
import states                           from '@/static/lookup/states.usa'
import settings                         from './o.default-district'

// TODO: find out why there is a mysterious extra space between words on the District type after you save
export default {
  name: `settings-container`,

  components: { settings },

  data () {
    return {
      districtTypes:  [],
      districtValues: [],
      defaultState:   { label: `Oklahoma`, value: `OK`             },
      districtType:   { label: SEN_DIST,   value: `SenateDistrict` },
      districtValue:  { label: ``,         value: ``               },
      state:          { label: `Oklahoma`, value: `OK`             },
      states:         states.map(x => ({ label: x.full, value: x.abbr })),
    }
  },

  computed: {
    ...sync(`session/active@*`),
  },

  watch: {
    districtValuesPayload (oldval, newval) {
      this.districtValues = this.districtValuesPayload.map(x => ({ label: x.districts, value: x.districts }))
    },
  },

  mounted () {
    try {
      const s = JSON.parse(this.user.settings).defaultState
      const ds = this.states.find(x => x.value === s)
      this.defaultState = ds
    } catch (e) { log(e) }
    this.districtType = getDistrictInfo(`type`, this.user.settings)
    this.districtValue = getDistrictInfo(`value`, this.user.settings)
    this.districtTypes = [CON_DIST, LEG_DIST, SEN_DIST]
      .map(x => ({ label: x, value: x.split(` `).join(``) }))
  },

  methods: {
    updateUser: call(`session/active/updateUser`),
    submitSettings () {
      const oldSettings = JSON.parse(this.user.settings)
      const newSettings = {
        defaultDistrict: {
          type:  this.districtType.label,
          value: this.districtValue.value,
        },
        defaultState: this.state.value
      }
      const finalSettings = { ...oldSettings, ...newSettings }
      const where = { _id: this.user._id }
      this.$apollo.mutate({
        mutation:  mutations.UPDATEUSER,
        variables: {
          user: {
            ...this.user,
            settings: JSON.stringify(finalSettings)
          },
          where,
        },
      }).then(res => {
        this.updateUser(res.data.userUpdate)
        if (!res.errors) alert(`user settings updated!`)
      })
    },
    setState (state) {
      if (state) {
        this.state = state
        this.$apollo.queries.districtValuesPayload.refetch()
        this.resetDistrictValue()
      }
    },
    getDistrictType (type) {
      this.setProp(`districtType`, type)
      this.resetDistrictValue()
    },
    getDistrictValue (val) {
      this.setProp(`districtValue`, val)
    },
    setProp (propName, propValue) {
      if (propValue) this[propName] = propValue
    },
    resetDistrictValue () {
      this.districtValue = {
        label: ``,
        value: ``,
      }
    }
  },

  apollo: {
    districtValuesPayload: {
      query () {
        if (this.districtType && this.districtType.label === LEG_DIST) return queries.qGetDistrictsLeg
        if (this.districtType && this.districtType.label === CON_DIST) return queries.qGetDistrictsCon
        if (this.districtType && this.districtType.label === SEN_DIST) return queries.qGetDistrictsSen
        return queries.qGetDistrictsSen
      },
      variables () {
        return {
          args: {
            [this.districtType.value || `SenateDistrict`]: { ne: null },
            State:                                         this.state.value || this.defaultState.value
          }
        }
      },
      result ({ data, errors }) {},
      error (error) {
        console.error(error)
      },
      update: data => data.results,
    },
  }
}

function getDistrictInfo (prop, settings) {
  try {
    const val = JSON.parse(settings).defaultDistrict[prop]
    return {
      label: val,
      value: val.split(` `).join(``),
    }
  } catch (e) {
    return { label: ``, value: `` }
  }
}
</script>
