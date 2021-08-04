<template>
  <m-nav-tabs :paths="paths" />
</template>

<script>
import mNavTabs from '@/components/molecules/m.nav.tabs'

export default {
  name: `p-self-service`,

  components: {
    mNavTabs
  },

  data: () => ({
    paths: [
      { path: `/self-service/audience`, label: `Find Audience` }
    ]
  })
}
</script>
