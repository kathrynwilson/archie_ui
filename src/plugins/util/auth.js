import * as fp          from 'lodash/fp'
import * as mutations   from '@/plugins/apollo/mutations'
import queries          from '@/plugins/apollo/queries'
import { apolloClient } from '@/plugins/apollo'
import { uiUrl }        from '@/config'

const login = (username, password) => apolloClient.mutate({
  mutation:  mutations.LOGIN,
  variables: {
    username,
    password
  }
})

const createUser = (u, orgId) => {
  const user = fp.dissoc(`__typename`, u)
  return apolloClient.mutate({
    mutation:  mutations.CREATEUSER,
    variables: { user, orgId }
  })
}

const createGroup = g => {
  const grp = fp.dissoc(`__typename`, g)
  return apolloClient.mutate({
    mutation:  mutations.CREATEGROUP,
    variables: grp
  })
}

const updateUser = (u, w) => {
  const where = w || { _id: u._id }
  const user = fp.dissoc(`__typename`, u)
  return apolloClient.mutate({
    mutation:  mutations.UPDATEUSER,
    variables: { user, where }
  })
}

const getUsers = orgId => apolloClient.query({
  query:     queries.qGetUsers,
  variables: { orgId }
})

const getGroups = orgId => apolloClient.query({
  query: queries.qGetGroups
})

const inviteUser = user => {
  const url = `${uiUrl}/register?code=${user.inviteCode}`
  const message = `${user.fullName}, you have been added to <a href="${uiUrl}">Archimedes</a>.
  Follow the link to verify your email and set your password. <a href="${url}">${url}</a>`
  const subject = `Archimedes`
  return apolloClient.mutate({
    mutation:  mutations.EMAIL,
    variables: { email: user.email, message, subject }
  })
}

const logout = () => localStorage.removeItem(`user`)

const deleteUser = user => apolloClient.mutate({
  mutation:  mutations.DELETEUSER,
  variables: { where: { _id: user._id } }
})

const deleteGroup = grp => apolloClient.mutate({
  mutation:  mutations.DELETEGROUP,
  variables: { id: grp._id }
})

const deleteOrg = id => apolloClient.mutate({
  mutation:  mutations.DELETEORG,
  variables: { id }
})

const verifyUser = (u, w) => {
  const where = w || { _id: u._id }
  const user = fp.dissoc(`__typename`, u)
  return apolloClient.mutate({
    mutation:  mutations.VERIFYUSER,
    variables: { user, where }
  })
}

const setPassword = (u, w) => {
  const where = w || { _id: u._id }
  const user = fp.dissoc(`__typename`, u)
  return apolloClient.mutate({
    mutation:  mutations.SETPASSWORD,
    variables: { user, where }
  })
}

const importCSV = (name, data) => apolloClient.mutate({
  mutation:  mutations.IMPORTCSV,
  variables: { name, data }
})

const createOrganization = org => apolloClient.mutate({
  mutation:  mutations.CREATEORGANIZATION,
  variables: org
})

const updateOrganization = org => apolloClient.mutate({
  mutation:  mutations.UPDATEORGANIZATION,
  variables: { where: { _id: org._id }, ...org }
})

const updateGroup = grp => apolloClient.mutate({
  mutation:  mutations.UPDATEGROUP,
  variables: { where: { _id: grp._id }, data: grp }
})

const getUploads = () => apolloClient.query({
  query: queries.qGetUploads
})

const deleteFile = id => apolloClient.mutate({
  mutation:  mutations.DELETEFILE,
  variables: { id }
})

export default {
  createGroup,
  createOrganization,
  createUser,
  deleteFile,
  deleteGroup,
  deleteOrg,
  deleteUser,
  getGroups,
  getUploads,
  getUsers,
  importCSV,
  inviteUser,
  login,
  logout,
  setPassword,
  updateGroup,
  updateOrganization,
  updateUser,
  verifyUser
}
