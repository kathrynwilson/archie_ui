<template>
  <q-header elevated reveal class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="mdi-menu" @click="drawer = !drawer" />

      <q-toolbar-title>
        <q-btn flat label="Archimedes" :to="{ name: `dashboard` }" />
      </q-toolbar-title>

      <q-space />

      <logout />
    </q-toolbar>
  </q-header>
</template>

<script>
import { sync } from 'vuex-pathify'
import logout   from '@/components/atoms/a.button.logout'

export default {
  name: `o-app-drawer`,

  components: { logout },

  computed: {
    drawer: sync(`display/layout/drawer`)
  }
}
</script>
