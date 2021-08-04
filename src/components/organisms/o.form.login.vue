<template>
  <q-page class="row flex-center">
    <q-card style="width: 100%; max-width: 700px;">
      <q-card-section horizontal>
        <q-card-section class="col-6 q-pa-lg q-gutter-y-md">
          <div class="text-h5">Welcome</div>
          <div class="text-caption text-grey">Log in to your Archimedes portal</div>

          <form class="q-gutter-y-md" @submit.prevent.stop="submit" @reset.prevent.stop="onReset">
            <q-input v-model="username" v-bind="props" type="text" placeholder="Email">
              <template #prepend>
                <q-icon name="mdi-account" />
              </template>
            </q-input>
            <q-input v-model="password" v-bind="props" type="password" placeholder="Password">
              <template #prepend>
                <q-icon name="mdi-lock" />
              </template>
            </q-input>

            <q-btn label="Log in" type="submit" color="primary" class="float-right" unelevated />
          </form>
        </q-card-section>

        <q-separator vertical />

        <q-card-section class="col-6 q-pa-lg" style="max-width: 12rem; margin: auto;">
          <q-img src="/logo.icon.png" />
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { call }   from 'vuex-pathify'
import { pInput } from '@/static/props'

export default {
  name: `o-form-login`,

  data: () => ({
    username: ``,
    password: ``,
    props:    pInput
  }),

  methods: {
    login: call(`session/active/login`),
    submit (event) {
      const { username, password } = this
      if (username && password) {
        this.login({ username, password })
      }
    }
  }
}
</script>
