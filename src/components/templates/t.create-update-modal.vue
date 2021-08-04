<template>
  <q-card style="width: 400px">
    <q-toolbar class="bg-primary text-white" style="min-height: 40px">{{ title }}</q-toolbar>

    <form @submit.prevent="actionFunc(obj)">
      <q-card-section>
        <template v-for="input in inputs">
          <q-input
            v-if="!input.type || input.type === `text`"
            :key="input.model"
            v-model="obj[input.model]"
            :label="input.label"
            :rules="input.required ? [val => !!val || `Field is required`] : []"
            v-bind="pInput"
            :mask="input.mask"
          />
          <!-- TODO: Fix display if user is in multiple groups currently returns [object Object] -->
          <q-select
            v-if="input.type === `dropdown`"
            :key="input.model"
            v-model="obj[input.model]"
            :label="input.label"
            :multiple="input.multiple"
            :options="input.items"
            v-bind="pSelect"
          />

          <q-checkbox
            v-if="input.type === `checkbox`"
            :key="input.model"
            v-model="obj[input.model]"
            :label="input.label"
            @input="input.changeFunc"
          />
        </template>
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pa-md">
        <q-btn v-bind="pBtn" label="Cancel" type="button" @click="close" />
        <q-space />
        <q-btn v-bind="pBtn" color="primary" type="submit" :label="buttonText" />
      </q-card-actions>
    </form>
  </q-card>
</template>

<script>
import { pBtn, pInput, pSelect } from '@/static/props'


export default {
  name: `t.create-update-modal`,

  props: {
    buttonText: { type: String,   default: `Submit`   },
    close:      { type: Function, default: () => null },
    create:     { type: Function, default: null       },
    oldObj:     { type: Object,   default: () => {}   },
    title:      { type: String,   default: ``         },
    update:     { type: Function, default: null       },
    inputs:     {
      type:    Array,
      default: () => [{
        label:        `Empty Label`,
        model:        `emptyModel`,
        defaultValue: ``,
        multiple:     false,
        required:     false,
        mask:         `(###) ### - ####`
      }]
    },
  },

  data: () => ({
    pBtn,
    pInput,
    pSelect,
    obj: {},
  }),

  mounted () {
    if (this.create) {
      this.inputs.forEach(input => {
        if (input.defaultValue != null) {
          this.obj[input.model] = input.defaultValue
        }
      })
    } else if (this.update) {
      this.obj = { ...this.oldObj }
    }
  },

  methods: {
    actionFunc (obj) {
      if (this.create) {
        this.create(obj)
      } else if (this.update) {
        this.update(obj)
      }
    }
  }
}
</script>
