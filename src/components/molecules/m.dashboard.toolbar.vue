<template>
  <q-toolbar class="q-px-sm">
    <q-toolbar-title>Dashboard</q-toolbar-title>

    <q-btn v-model="isLocked" flat round :icon="icon.icon" :color="icon.color" :offset="[10, 10]" @click="updateDashboardIsLocked">
      <q-tooltip anchor="center left" self="center right" transition-show="fade" transition-hide="fade">
        {{ icon.label }}
      </q-tooltip>
    </q-btn>
  </q-toolbar>
</template>

<script>
// TODO: Turn this component into a template
import { call, sync } from 'vuex-pathify'

export default {
  name: `m-dashboard-toolbar`,

  computed: {
    isLocked: sync(`display/layout/dashboardIsLocked`),
    icon () {
      return this.isLocked
        ? { label: `The dashboard is currently locked.`, color: `primary`, icon: `mdi-lock` }
        : { label: `The dashboard is currently unlocked.`, color: `inherit`, icon: `mdi-lock-open` }
    },
    tooltip () {
      return `<span>The dashboard is <strong>${this.isLocked ? `lock` : `unlock`}ed</strong>.</span>`
    }
  },

  methods: {
    updateDashboardIsLocked: call(`display/layout/updateDashboardIsLocked`)
  }
}
</script>

<style>
.q-tooltip {
  font-weight: 500
}
</style>
