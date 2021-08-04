<template>
  <q-btn label="Log out" v-bind="pBtn" :dense="false" @click="$util.helpers.logout" />
</template>

<script>
import { pBtn } from '@/static/props'

export default {
  name: `a.button.logout`,

  data: () => ({
    pBtn
  }),
}
</script>
