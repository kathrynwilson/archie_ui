<template>
  <q-page padding style="padding-top: 72px">
    <q-page-sticky expand position="top" style="z-index: 1">
      <q-tabs narrow-indicator class="bg-blue-grey-1" style="width: 100%">
        <q-route-tab
          v-for="path in paths"
          :key="path.index"
          :label="path.label"
          :to="path.path"
          exact
        />
      </q-tabs>
    </q-page-sticky>

    <router-view class="bg-transparent" />
  </q-page>
</template>

<script>
import contents from '@/components/organisms/o.app.contents'

export default {
  name: `m-nav-tabs`,

  components: {
    contents
  },

  props: {
    paths: { type: Array, default: () => [] }
  }
}
</script>
