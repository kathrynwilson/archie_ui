<template>
  <q-drawer
    v-if="isLoggedIn"
    v-model="drawer"
    show-if-above
    content-class="bg-blue-grey-1"
    side="left"
    :width="240"
  >
    <!-- <q-scroll-area class="fit"> -->
    <list-nav />
    <!-- </q-scroll-area> -->
  </q-drawer>
</template>

<script>
import { sync } from 'vuex-pathify'
import listNav  from '@/components/molecules/m.nav.list'

export default {
  name: `o-app-drawer`,

  components: {
    listNav,
  },

  computed: {
    drawer:     sync(`display/layout/drawer`),
    isLoggedIn: sync(`session/active/status@isLoggedIn`)
  }
}
</script>
