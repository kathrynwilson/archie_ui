<template>
  <q-card class="mx-auto" flat>
    <div>
      <q-table
        :columns="headers"
        :data="files"
        dense
        title="Uploaded Files"
        :pagination.sync="filePagination"
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
            <q-td>
              <q-icon name="mdi-delete" class="clickable" title="delete" alt="delete file" @click="deleteItem(props.row)" />
            </q-td>
            <!--<q-td>
              <q-icon name="mdi-file-upload-outline" class="clickable" @click="reupload(props.row)" />
            </q-td>-->
            <q-td>
              <q-icon name="mdi-file-download" class="clickable" title="download" alt="download csv" @click="download(props.row)" />
            </q-td>
          </q-tr>
        </template>
        <!--{{ format(new Date(Number(item.createdAt)), `yyyy-MM-dd`) }}-->
      </q-table>
    </div>

    <!--<q-card-actions>
      <q-btn text>Upload File</q-btn>
    </q-card-actions>-->
  </q-card>
</template>

<script>
import { call } from 'vuex-pathify'
import actions  from '@/plugins/util/auth'
import queries  from '@/plugins/apollo/queries'

export default {
  name: `p-my-data-imported`,

  data () {
    return {
      files:          [],
      filePagination: {
        rowsPerPage: 10,
      },
      filesUploaded: null,
      headers:       [
        { label: `Name`, align: `left`, name: `name`, field: `name`, divider: true },
        { label: `FileName`, align: `left`, name: `fileName`, field: `fileName`, divider: true },
        { label: `Records`, name: `rowCount`, field: `rowCount`, align: `center`, divider: true },
        { label: `Matched`, name: `matchedRowCount`, field: `matchedRowCount`, align: `center`, divider: true },
        { label: `Upload Date`, name: `createdAt`, field: `createdAt`, align: `end`, divider: true },
      ]
    }
  },

  computed: {},

  mounted () {
    this.$apollo.queries.files.refetch()
  },

  methods: {
    storeFileName: call(`session/active/storeFileName`),
    deleteItem (item) {
      const index = this.files.indexOf(item)
      const id = this.files[index]._id
      // confirm(`Are you sure you want to delete "${item.name}" and all associated data?`) && this.doubleConfirm(item, index, id) // eslint-disable-line
      const name = prompt(`Deleting "${item.name}" will delete ${item.rowCount} records with the following properties: ${item.properties.join(`, `)}. \n\r Type the name of this item to confirm deletion`) // eslint-disable-line
      if (name) {
        if (name.toLowerCase() === item.name.toLowerCase()) this.deleteFile(index, id)
      }
    },
    deleteFile (index, id) {
      actions.deleteFile(id)
        .then(r => {
          if (!r.errors) this.files.splice(index, 1)
        })
        .catch(e => {
          log(e)
          alert(`error occured while deleting file`)
        })
    },
    download (item) {
      this.$apollo.query({
        query:     queries.qGetFile,
        variables: {
          id: item._id
        }
      })
        .then(r => {
          window.location.href = `data:application/csv;base64,${r.data.results.base64Code}`
        })
        .catch(log)
    },
    // getDownloadLink (item) {
    //   return `data:application/csv;base64,${item.base64Code}`
    // },
    // reupload (item) {
    //   this.$router.push({ path: `/my-data/stream` })
    //   this.storeFileName(item.name)
    // },
  },

  apollo: {
    files: {
      query () {
        return queries.qGetUploads
      },
      update: data => data.uploadsGet
    }
  }
}
</script>
