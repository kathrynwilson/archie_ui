<template>
  <q-card flat>
    <q-tabs v-model="tab" v-bind="pTabs">
      <q-tab v-for="(topic, index) in allDefaults" :key="index" :name="topic.label" :label="topic.label" />
    </q-tabs>

    <q-tab-panels v-model="tab">
      <q-tab-panel v-for="(topic, index) in allDefaults" :key="index" :name="topic.label" class="q-pa-none">
        <pick-list
          class="fit"
          :alias="topic.alias"
          :title="topic.label"
          :all-defaults="topic.fields"
          :all-available="savedDefaultFields[topic.alias].fieldsAvailable"
          :all-saved="savedDefaultFields[topic.alias].fields"
          :item-remove="fieldRemove"
          :item-select="fieldSelect"
          :item-remove-all="fieldRemoveAll"
          :item-select-all="fieldSelectAll"
          :save-items="saveFields"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
import _               from 'lodash'
import pickList        from '@/components/molecules/m.picklist'
import { UPDATEUSER }  from '@/plugins/apollo/mutations'
import { sync, call }  from 'vuex-pathify'
import { pBtn, pTabs } from '@/static/props'

export default {
  name: `o.default-fields`,

  components: { pickList },

  data: () => ({
    pBtn,
    pTabs,
    tab: `Top Issues`,
  }),

  computed: {
    ...sync(`session/admin`, {
      allDefaults:        `allDefaults`,
      savedDefaultFields: `savedDefaultFields`,
    }),
    ...sync(`session/active`, {
      user: `user`
    })
  },

  mounted () {},

  methods: {
    fieldRemove:    call(`session/admin/fieldRemove`),
    fieldRemoveAll: call(`session/admin/fieldRemoveAll`),
    fieldSelect:    call(`session/admin/fieldSelect`),
    fieldSelectAll: call(`session/admin/fieldSelectAll`),
    resetState:     call(`session/admin/resetState`),
    updateUser:     call(`session/active/updateUser`),
    saveFields () {
      return this.$apollo.mutate({
        mutation:  UPDATEUSER,
        variables: {
          user:  this.user,
          where: { _id: this.user._id },
        },
      }).then(res => {
        this.updateUser(res.data.userUpdate)
      })
    },
  }
}
</script>
