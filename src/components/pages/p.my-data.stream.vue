<template>
  <div>
    <q-card>
      <q-card-section>
        <h5>CSV Importer</h5>
        <p>Provide a name for the data and select a csv file to upload</p>
        <q-form>
          <q-input
            v-model="name"
            v-bind="props"
            name="cvs-name"
            placeholder="Name"
            type="text"
          />
          <input ref="file" type="file" @change="handleFileUpload">
        </q-form>
      </q-card-section>
      <q-card-actions>
        <a
          :class="isImporting ? 'submitting' : 'clickable'"
          style="color: #e91b22;"
          @click="handleSubmit"
        >
          {{ isImporting ? 'Uploading' : 'Upload' }}
        </a>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { gql }        from 'apollo-boost'
import { sync, call } from 'vuex-pathify'
import { pInput }     from '@/static/props'
import utf8           from 'utf8'
import base64         from 'base-64'
import fp             from 'lodash/fp'
import * as mutations from '@/plugins/apollo/mutations'

export default {
  name: `p-my-data-stream`,

  data: () => ({
    file:  ``,
    name:  ``,
    props: pInput,
  }),

  computed: {
    ...sync(`session/active@*`),
  },

  mounted () {
    this.name = this.fileName || ``
  },

  methods: {
    setIsImporting: call(`session/active/setIsImporting`),
    clearFileName:  call(`session/active/clearFileName`),
    handleFileUpload () {
      this.file = this.$refs.file.files[0] // eslint-disable-line
    },
    handleSubmit () {
      if (!this.file) return alert(`file required`)
      if (!this.name) return alert(`name required`)
      const _vm = this
      _vm.setIsImporting(true)
      try {
        const reader = new FileReader()
        reader.readAsText(_vm.file)
        reader.onerror = console.log // eslint-disable-line
        return reader.onload = function () { // eslint-disable-line
          const data = fp.pipe(
            utf8.encode,
            base64.encode
          )(reader.result)
          // TODO: find out why this is called twice and fix it
          _vm.$apollo.mutate({
            mutation:  mutations.IMPORTCSV,
            variables: {
              name: _vm.name,
              data,
            }
          })
            .then(r => {
              try {
                _vm.done(r.errors[0], r)
              } catch (e) {
                _vm.clearFileName()
                _vm.name = ``
                _vm.done(null, r)
              }
              // _vm.$router.push({ path: `/myData/imported` })
            })
            .catch(e => {
              log(e)
              _vm.done(e)
            })
        }
      } catch (e) {
        _vm.name = ``
        _vm.file = ``
        _vm.setIsImporting(false)
        return alert(`error occured. please try again`)
      }
    },
    done (err, response) {
      this.setIsImporting(false)
      if (err) {
        log(err)
        alert(`error occured while importing file`)
        // try {
        //   alert(fp.last(err.message.split(`:`)) || err)
        // } catch (e) {
        //   log(e)
        // }
      } else {
        try {
          alert(`${response.data.csvImport.rowCount} records imported`)
          // const { nInserted, nUpserted, nModified } = response.data.csvImport.result
          // const message = `${nInserted || nUpserted} ${getRecordsWord(nInserted || nUpserted)} imported. `
          // if (nModified) {
          //   alert(message.concat(`${nModified} ${getRecordsWord(nModified)} updated`))
          // } else {
          //   alert(message)
          // }
        } catch (e) {
          log(e)
          alert(`file successfully imported!`)
        }
      }
    }
  }
}

function getRecordsWord (recordsNum) {
  if (recordsNum === 1) return `record`
  return `records`
}
</script>

<style scoped>
  .submitting {
    opacity: 1;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 0 }
    50% { opacity: 1 }
  }
</style>
