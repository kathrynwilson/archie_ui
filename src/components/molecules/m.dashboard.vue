<template>
  <q-page>
    <toolbar />
    <grid />
  </q-page>
</template>

<script>
import grid    from '@/components/organisms/o.layout.grid'
import toolbar from '@/components/molecules/m.dashboard.toolbar'

export default {
  name: `user-dashboard`,

  components: { grid, toolbar }
}
</script>
