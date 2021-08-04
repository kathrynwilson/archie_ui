<template>
  <div>
    <toolbar />
    <grid />
  </div>
</template>

<script>
import grid    from '@/components/organisms/o.layout.grid'
import toolbar from '@/components/molecules/m.dashboard.toolbar'

export default {
  name: `p-dashboard`,

  components: {
    grid, toolbar
  }
}
</script>
