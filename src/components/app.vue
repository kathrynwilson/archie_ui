<template>
  <q-layout view="hHh LpR fFf">
    <navbar />
    <drawer />
    <contents />
  </q-layout>
</template>

<script>
import drawer   from '@/components/organisms/o.app.drawer'
import contents from '@/components/organisms/o.app.contents'
import navbar   from '@/components/organisms/o.app.navbar'

export default {
  name: `app`,

  components: {
    drawer,
    contents,
    navbar
  }
}
</script>

<style>
@import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-lists/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-querybuilder/styles/material.css";

.q-layout {
  background: -webkit-linear-gradient(116deg, hsla(210, 16.67%, 95.29%, 1) 0%, hsla(210, 16.67%, 95.29%, 0) 90%),
    -webkit-linear-gradient(247deg, hsla(210, 16.67%, 95.29%, 1) 50%, hsla(210, 16.67%, 95.29%, 0) 46%);
  background: linear-gradient(334deg, hsla(210, 16.67%, 95.29%, 1) 0%, hsla(210, 16.67%, 95.29%, 0) 90%),
    linear-gradient(203deg, hsla(210, 16.67%, 95.29%, 1) 50%, hsla(210, 16.67%, 95.29%, 0) 46%);
  background-attachment: fixed;
}
.clickable {
  cursor: pointer !important;
}
</style>
