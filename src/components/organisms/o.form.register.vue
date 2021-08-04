<template>
  <q-page>
    <h1>Register</h1>
    <font v-show="verified" color="green">
      Your email has been verified. You can now set your password.
    </font>
    <q-input
      v-model="password"
      v-bind="props"
      name="new-password"
      placeholder="New Password"
      type="password"
    />
    <q-input
      v-model="confirmPassword"
      v-bind="props"
      name="new-confirm-password"
      placeholder="Confirm New Password"
      type="password"
    />
    <q-btn @click="saveNewPassword">Set New Password</q-btn>
  </q-page>
</template>

<script>
import { pInput } from '@/static/props'
import queries    from '@/plugins/apollo/queries'
import actions    from '@/plugins/util/auth'

export default {
  name: `register`,

  data: () => ({
    confirmPassword: ``,
    oldPassword:     ``,
    password:        ``,
    props:           pInput,
    verified:        false,
  }),

  mounted () {
    this.verifyEmail()
  },

  methods: {
    saveNewPassword () {
      // TODO: Refactor with better error handling
      if (this.password !== this.confirmPassword) return alert(`passwords do not match`) // eslint-disable-line no-alert
      return actions.setPassword({ password: this.password }, { inviteCode: this.$route.query.code })
        .then(r => {
          if (!r.errors) this.$router.push(`/login`)
        })
        .catch(e => {
          log(e)
          alert(`error while setting password`) // eslint-disable-line no-alert
        })
    },
    // TODO: Refactor with better error handling
    verifyEmail () {
      actions.verifyUser({ status: `verified` }, { inviteCode: this.$route.query.code })
        .then(r => {
          if (!r.errors) this.verified = true
        })
        .catch(e => {
          log(e)
          alert(`error while verifying user`) // eslint-disable-line no-alert
        })
    }
  }
}
</script>
