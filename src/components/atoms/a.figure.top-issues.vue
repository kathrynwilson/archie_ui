<template>
  <ApolloQuery
    :query="gql => gql`${query}`"
    :variables="variables"
  >
    <template v-slot="{ result: { loading, error, data } }">
      <div v-if="loading" class="loading apollo">Loading...</div>

      <div v-else-if="error" class="error apollo">An error occurred</div>

      <div v-else-if="data" class="result apollo">
        <q-table
          :title="title"
          :data="getData(data)"
          :columns="columns"
          table-header-class="text-left"
          hide-bottom
          flat
        >
          <template #top-right>
            <q-btn icon="mdi-settings" round unelevated class="text-blue-grey-5" @click="showSettings" />
          </template>

          <template #body-cell-field="props">
            <q-td :props="props">
              <q-linear-progress
                stripe
                :value="props.value / total"
                rounded
                size="12px"
              >
                <q-tooltip content-class="bg-blue-grey-8 shadow-2">
                  A total of {{ props.value }} out of {{ total }} registered voters have this concern.
                </q-tooltip>
              </q-linear-progress>
            </q-td>
          </template>

          <template #header-cell-field>
            <q-th>
              Registered Voters: <span class="text-primary text-weight-bolder">{{ total }}</span>
            </q-th>
          </template>
        </q-table>
      </div>

      <div v-else class="no-result apollo" />
    </template>

    <q-dialog v-model="settingsModal">
      <settings id="test" class="shadow-0" style="max-width: 1200px" />
    </q-dialog>
  </ApolloQuery>
</template>

<script>
import { get, sync } from 'vuex-pathify'
import {
  map, sortBy, reverse, take, filter, includes, find, isNumber, compact, pickBy, omit
} from 'lodash'
import gql                from 'apollo-boost'
import settings           from '@/components/organisms/o.default-district.container'
import { fIssueSegments } from '@/static/fields/fields.topics'

export default {
  name: `a-figure-top-issues`,

  components: {
    settings
  },

  data: () => ({
    settingsModal: false,
    topic:         fIssueSegments,
    total:         0,
    operation:     `wpaiNationalFlagsSummaryGet`,
    columns:       [{ label: `Issue`, name: `name`,       align: `left`,                         field: row => row.name },
                    { label: ``,      name: `field`,      style: `width: 50%;`, field: row => row.field, sortBy: `field` },
                    { label: `Voters`,      name: `popTotal`, align: `left`,   field: row => row.popTotal, sortBy: `popTotal` },
                    { label: `Percent`,      name: `popPercent`, align: `left`, field: row => row.popPercent, sortBy: `popPercent` }
    ],
    fields: [`AAGrowth`,
             `AbortAngryKillingBabiesBig`,
             `AbortAngryKillingBabiesCons`,
             `AbortAngryWomensHealth`,
             `AngryAboutEverydaySexism`,
             `AngryAtRacistImm`,
             `AngryImmConsCalledRacist`,
             `Christian_Radio`,
             `ChristianityUnderAttackAngry`,
             `ChristianityUnderAttackAttackers`,
             `CleoGen`,
             `CleoGenelecOld`,
             `CleoGenelecPre`,
             `CleoGenelec`,
             `CleoPrimScores`,
             `CleoPrimaryOld`,
             `CleoPrimary`,
             `CongressTaxApproval`,
             `CongressionalDistrict`,
             `Conservative_Radio`,
             `CordCutter`,
             `Country_Radio`,
             `CountyFIPS`,
             `DemDownshifters`,
             `DisengagedR`,
             `EmbarrassedByPartyOften`,
             `Establishment_Moderate`,
             `Evangelical_Activist`,
             `Evangelical_Traditionalist`,
             `GOPDownshifters`,
             `GOPGOTV`,
             `GenericBallot_D`,
             `GenericBallot_R`,
             `GenericBallot_Swing`,
             `HispGrowth`,
             `Iss_Abort_Exceptions`,
             `Iss_Abort_NoExceptions`,
             `Iss_Abort_ProChoice`,
             `Iss_AgSubs_Oppose`,
             `Iss_AgSubs_Support`,
             `Iss_Climate_NonReg`,
             `Iss_Climate_Reg`,
             `Iss_Climate_Skeptic`,
             `Iss_CorpWelfare_IDX_Crony`,
             `Iss_CorpWelfare_IDX_FreeMarket`,
             `Iss_DebtCeil_Clean`,
             `Iss_DebtCeil_Conditions`,
             `Iss_DebtCeil_NoIncr`,
             `Iss_ExIm_Oppose`,
             `Iss_ExIm_Support`,
             `Iss_GreenSubs_Oppose`,
             `Iss_GreenSubs_Support`,
             `Iss_Guns_IDX_Defender`,
             `Iss_Guns_IDX_Grabber`,
             `Iss_Hcare_InsuranceMandate`,
             `Iss_Hcare_MedicaidProtect`,
             `Iss_Hcare_OCareSympathizer`,
             `Iss_HistoryDefenders`,
             `Iss_HistoryDeniers`,
             `Iss_Imm_DACAOppose`,
             `Iss_Imm_DACASupport`,
             `Iss_Imm_DeportOppose`,
             `Iss_Imm_DeportSupport`,
             `Iss_Imm_IDX_Amnesty`,
             `Iss_Imm_IDX_Hawk`,
             `Iss_Imm_WallOppose`,
             `Iss_Imm_WallSupport`,
             `Iss_Infra_BuildRoads`,
             `Iss_Infra_GasTaxFight`,
             `Iss_Infra_GasTaxHike`,
             `Iss_Infra_NoRoads`,
             `Iss_Islama_Phobic`,
             `Iss_Islama_Tolerant`,
             `Iss_ManufactureSubs_Oppose`,
             `Iss_ManufactureSubs_Support`,
             `Iss_Marriage_Gay`,
             `Iss_Marriage_Trad`,
             `Iss_NatSec_BigStick`,
             `Iss_NatSec_Doves`,
             `Iss_NatSec_Isolation`,
             `Iss_NatSec_Warriors`,
             `Iss_OilSubs_Oppose`,
             `Iss_OilSubs_Support`,
             `Iss_Pot_Illegal`,
             `Iss_Pot_Legal`,
             `Iss_Pot_Medical`,
             `Iss_Privacy_1984`,
             `Iss_Privacy_Snowden`,
             `Iss_Regs_Deregulate`,
             `Iss_Regs_RegSympathy`,
             `Iss_SchoolChoice_Oppose`,
             `Iss_SchoolChoice_Support`,
             `Iss_Shutdown_Open`,
             `Iss_Shutdown_Shut`,
             `Iss_Spend_DefenseSpend`,
             `Iss_Spend_DeficitHawk`,
             `Iss_Spend_EntitlementSpend`,
             `Iss_Tax_IDX_Cutters`,
             `Iss_Tax_IDX_HikeSympathizers`,
             `Iss_TermLimits_HighPriority`,
             `Iss_TermLimits_LowPriority`,
             `Iss_Trade_FreeTrade`,
             `Iss_Trade_Protectionist`,
             `LegislativeDistrict`,
             `Libertarian_Leaner`,
             `Media_Cable_Viewer`,
             `Media_Delayed_Viewer`,
             `Media_PremiumVideo_Viewer`,
             `Media_Satellite_Viewer`,
             `Media_StreamingMusic_Listener`,
             `Media_StreamingVideo_Viewer`,
             `MillennialPersuasion`,
             `Old_Guard_Conservative`,
             `PersuasionTargets`,
             `Pol_Cruz_Fav`,
             `Pol_Cruz_Unfav`,
             `Pol_Endorse_Cons`,
             `Pol_Endorse_Estab`,
             `Pol_Know_Aware`,
             `Pol_Know_Engaged`,
             `Pol_Know_Ignorant`,
             `Pol_NRA_NotVeryFav`,
             `Pol_NRA_VeryFav`,
             `Pol_Paul_Fav`,
             `Pol_Paul_Unfav`,
             `Pol_Pop_Populist`,
             `Pol_Pop_Unmotivated`,
             `Pol_Relig_High`,
             `Pol_Relig_Low`,
             `Pol_Relig_Mid`,
             `Pol_Tribe_Ideo`,
             `Pol_Tribe_Trump`,
             `Pol_Trump_Fav`,
             `Pol_Trump_Unfav`,
             `PrecinctNumber`,
             `Priv_Pol_McConnellFav`,
             `Priv_Pol_McConnellUnfav`,
             `Priv_Pol_RaceResent_High`,
             `Priv_Pol_RaceResent_Low`,
             `Priv_Pol_RaceResent_Mid`,
             `Priv_Pol_RyanFav`,
             `Priv_Pol_RyanUnfav`,
             `ProLife`,
             `Protect_Second_Amendment`,
             `RacismMinoritiesFaceMore`,
             `RacismWhitesFaceMore`,
             `RegistrationAddressZip5`,
             `SenateDistrict`,
             `Sports_Radio`,
             `Stop_Executive_Amnesty`,
             `Stop_Refugee_Resettlement`,
             `SwingWomen`,
             `Tea_Party_Conservative`,
             `Total`,
             `TrumpApprove`,
             `TrumpTaxApproval`,
             `Typ_AmericaFirst`,
             `Typ_CompCons`,
             `Typ_CultureWar`,
             `Typ_DisenchantEstab`,
             `Typ_EstabTrumper`,
             `Typ_EvangActivist`,
             `Typ_FreeMarketCons`,
             `Typ_ModGlobalist`,
             `Typ_RedTeamChristian`,
             `WomenBetter_Agree_partisan`,
             `WomenBetter_Agree`,
             `cleogenmatch`,
             `offlineact`,
             `onlineact`,
             `priority`,
             `pro_Reentry`,
             `pro_Sentencing`,
             `reformers`,
             `state`,
             `v1_Likely_Supporters`,
             `v1_Turnout_Targets`],
  }),

  computed: {
    title () {
      const { defaultState, defaultDistrict } = this.settings
      return `Top Issues in ${defaultState} ${defaultDistrict.type} ${defaultDistrict.value}`
    },
    query () {
      return `query wpaiNationalFlagsSummaryGet ($where: SequelizeJSON) {
        wpaiNationalFlagsSummaryGet (where: $where) {
          ${this.fields}
        }
      }`
    },
    settings: get(`session/active/settings`),
    variables () {
      return {
        where: {
          state:                                                 this.settings.defaultState,
          [this.settings.defaultDistrict.type.replace(/ /, ``)]: this.settings.defaultDistrict.value
        }
      }
    }
  },

  methods: {
    getPercent (numerator, denominator) {
      return ((numerator / denominator) * 100).toFixed(1)
    },
    showSettings () {
      this.settingsModal = true
    },
    getData (data) {
      const all = pickBy(data[this.operation][0], isNumber)
      this.total = all.Total
      const filtered = omit(all, `Total`)
      const mapped = map(filtered, (value, key) => ({
        name:       key,
        label:      key,
        field:      value,
        popTotal:   value,
        popPercent: `${this.getPercent(value, this.total)}%`
      }))

      return take(reverse(sortBy(mapped, `field`)), 5)
    }
  }
}
</script>
