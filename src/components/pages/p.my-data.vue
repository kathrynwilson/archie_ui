<template>
  <m-nav-tabs :paths="paths" />
</template>

<script>
import mNavTabs from '@/components/molecules/m.nav.tabs'

export default {
  name: `p-my-data`,

  components: {
    mNavTabs
  },

  data: () => ({
    paths: [
      { path: `/my-data/stream`,    label: `Import/Export` },
      { path: `/my-data/imported`,  label: `My Imports`    },
      { path: `/my-data/purchased`, label: `My Purchases`  }
    ]
  })
}
</script>
