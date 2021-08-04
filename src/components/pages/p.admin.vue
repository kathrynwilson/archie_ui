<template>
  <m-nav-tabs :paths="paths" />
</template>

<script>
import mNavTabs from '@/components/molecules/m.nav.tabs'

export default {
  name: `p-admin`,

  components: {
    mNavTabs
  },

  data: () => ({
    paths: [
      // { path: `/admin/api`,         label: `API`         },
      { path: `/admin/groups`,      label: `Groups`      },
      // { path: `/admin/permissions`, label: `Permissions` },
      { path: `/admin/settings`,    label: `Settings`    },
      { path: `/admin/users`,       label: `Users`       }
    ]
  })
}
</script>
