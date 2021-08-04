<template>
  <q-splitter v-model="splitter" :limits="[30, 70]">
    <template #before>
      <q-toolbar style="min-height: 40px" class="bg-blue-grey-2">
        <span class="text-subtitle2 text-primary">Items Selected</span>
        <q-space />
        <span class="text-caption">{{ getVisibleNum(allSaved.length) }} of {{ allSaved.length }} ({{ getHiddenNum(allSaved) }} hidden)</span>
        <q-btn-group flat stretch>
          <q-btn size="sm" unelevated title="Show more" :disabled="limit >= allSaved.length" icon="mdi-eye" @click="limit += 100" />
          <q-btn size="sm" unelevated title="Show fewer" :disabled="limit === 100" icon="mdi-eye-off" @click="limit -= 100" />
          <q-btn size="sm" unelevated title="Deselect all" :disabled="!allSaved.length" icon="mdi-checkbox-multiple-blank-outline" @click="itemRemoveAll(alias)" />
          <!-- <q-btn size="sm" unelevated title="Remove all" :disabled="allSaved.length === 0" icon="mdi-minus-box" @click="itemRemoveAll(allSaved)" /> -->
        </q-btn-group>
        <q-btn v-bind="pBtn" color="primary" :dense="false" size="sm" label="Save" @click="saveItems" />
      </q-toolbar>


      <q-scroll-area style="height: 600px; max-width: 100%;">
        <q-chip
          v-for="item in getVisible(allSaved)"
          :key="item" :disabled="loading" :label="item"
          class="text-caption text-weight-medium"
          clickable color="blue-grey-1" square
          @click="itemRemove({item, alias})"
        >
          <q-tooltip :delay="1000" content-class="bg-primary shadow-2" :offset="[10, 10]">Click to remove.</q-tooltip>
        </q-chip>
      </q-scroll-area>
    </template>

    <template #after>
      <q-toolbar style="min-height: 40px" class="bg-blue-grey-2">
        <span class="text-subtitle2 text-primary">Items Available</span>
        <q-space />
        <span class="text-caption">{{ getVisibleNum(allAvailable.length) }} of {{ allAvailable.length }} ({{ getHiddenNum(allAvailable) }} hidden)</span>
        <q-btn-group flat stretch>
          <q-btn size="sm" unelevated title="Show more" :disabled="limit >= allAvailable.length" icon="mdi-eye" @click="limit += 100" />
          <q-btn size="sm" unelevated title="Show fewer" :disabled="limit === 100" icon="mdi-eye-off" @click="limit -= 100" />
          <q-btn size="sm" unelevated title="Select all" :disabled="!allAvailable.length" icon="mdi-checkbox-multiple-marked-outline" @click="itemSelectAll(alias)" />
          <!-- <q-btn size="sm" unelevated title="Select all" :disabled="allAvailable.length === 0" icon="mdi-minus-box" @click="itemSelectAll(allAvailable)" /> -->
        </q-btn-group>
      </q-toolbar>

      <q-scroll-area style="height: 600px; max-width: 100%;">
        <q-chip
          v-for="item in getVisible(allAvailable)"
          :key="item" :disabled="loading" :label="item"
          class="text-caption text-weight-medium"
          clickable color="blue-grey-1" square
          @click="itemSelect({item, alias})"
        >
          <q-tooltip :delay="1000" content-class="bg-primary shadow-2" :offset="[10, 10]">Click to add.</q-tooltip>
        </q-chip>
      </q-scroll-area>
    </template>
  </q-splitter>
</template>

<script>
import { sync }         from 'vuex-pathify'
import { pBtn, pInput } from '@/static/props'
import _                from 'lodash'

export default {
  name: `m.picklist`,

  props: {
    alias:         { type: String,   default: ``         },
    title:         { type: String,   default: ``         },
    allAvailable:  { type: Array,    default: () => []   },
    allDefaults:   { type: Array,    default: () => []   },
    allSaved:      { type: Array,    default: () => []   },
    itemSelect:    { type: Function, default: () => null },
    itemSelectAll: { type: Function, default: () => null },
    itemRemove:    { type: Function, default: () => null },
    itemRemoveAll: { type: Function, default: () => null },
    saveItems:     { type: Function, default: () => null },
    // limit:         { type: Number, default: 100 }
  },

  data: () => ({
    pBtn,
    pInput,
    limit:    100,
    loading:  false,
    splitter: 50,
  }),

  methods: {
    getVisible (list) {
      return list.slice(0, this.limit)
    },
    getHiddenNum (list) {
      return list.length - this.getVisible(list).length
    },
    getVisibleNum (availableNum) {
      return availableNum < this.limit ? availableNum : this.limit
    }
  }
}
</script>

<style>
.q-splitter > .q-splitter__panel {
  height: 100% !important;
}
</style>
