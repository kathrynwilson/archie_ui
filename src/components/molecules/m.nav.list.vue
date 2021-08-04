<template>
  <q-list>
    <template v-for="route in routes">
      <!-- Links with subpages -->
      <q-expansion-item
        v-if="route.children"
        :key="route.index"
        :icon="route.meta.icon"
        :label="route.meta.title"
        group
      >
        <q-item
          v-for="child in route.children"
          :key="child.index"
          :inset-level="1"
          :to="{ name: child.path }"
          clickable
        >
          <q-item-section>
            {{ child.meta.title }}
          </q-item-section>
        </q-item>
      </q-expansion-item>

      <!-- Links without subpages -->
      <q-item
        v-else
        :key="route.index"
        :to="route.path"
        clickable
      >
        <q-item-section avatar>
          <q-icon :name="route.meta.icon" />
        </q-item-section>
        <q-item-section>
          {{ route.meta.title }}
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script>
export default {
  name: `m.nav.list`,

  computed: {
    routes () {
      // TODO: Make this a getter in its respective Vuex module
      return this.$router.options.routes.filter(route => route.meta.isNav === true)
    }
  }
}
</script>
