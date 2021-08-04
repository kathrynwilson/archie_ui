import { gql }                                            from 'apollo-boost'
import { userFields, userPrimitives, organizationFields } from '@/plugins/apollo/fragments'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        ${userFields}
      }
    }
  }
`

export const CREATEUSER = gql`
  mutation createUser ($user: CreateUserInput!, $orgId: String) {
    userCreate (data: $user, orgId: $orgId) {
      ${userPrimitives}
    }
  }
`

export const CREATEGROUP = gql`
  mutation createGroup ($name: String!, $description: String) {
    groupCreate (name: $name, description: $description) {
      _id 
      name 
      description
    }
  }
`

export const CREATEORGANIZATION = gql`
  mutation createOrganization ($name: String! $email: String $phone: String $contactName: String) {
    organizationCreate (name: $name email: $email phone: $phone contactName: $contactName)
  }
`

export const UPDATEORGANIZATION = gql`
  mutation updateOrganization ($where: WhereUniqueInput! $name: String! $email: String $phone: String $contactName: String) {
    organizationUpdate (where: $where name: $name email: $email phone: $phone contactName: $contactName) {
      ${organizationFields}
    }
  }
`

export const UPDATEGROUP = gql`
  mutation updateGroup ($where: WhereUniqueInput! $data: GroupInput!) {
    groupUpdate (where: $where data: $data) {
      _id name description organizationId
    }
  }
`

export const UPDATEUSER = gql`
  mutation updateUser ($user: UpdateUserInput!, $where: UserWhereUniqueInput!) {
    userUpdate (where: $where, data: $user) {
      ${userFields}
    }
  }
`

export const VERIFYUSER = gql`
  mutation verifyUser ($user: UpdateUserInput!, $where: UserWhereUniqueInput!) {
    userUpdate (where: $where, data: $user) {
      ${userPrimitives}
    }
  }
`

export const SETPASSWORD = gql`
  mutation setPassword ($user: UpdateUserInput!, $where: UserWhereUniqueInput!) {
    setPassword (where: $where, data: $user) {
      ${userPrimitives}
    }
  }
`

export const DELETEUSER = gql`
  mutation deleteUser ($where: UserWhereUniqueInput!) {
    userDelete (where: $where) {
      ${userPrimitives}
    }
  }
`
export const DELETEGROUP = gql`
  mutation deleteUser ($id: String!) {
    deletedId: groupDelete (id: $id) 
  }
`
export const DELETEORG = gql`
  mutation deleteOrg ($id: String!) {
    deletedId: organizationDelete (_id: $id) 
  }
`
export const IMPORTCSV = gql`
  mutation importCSV ($name: String!, $data: String!) {
    csvImport (name: $name, data: $data) 
  }
`

export const DELETEFILE = gql`
  mutation deleteUser ($id: String!) {
    deletedId: fileDelete (id: $id) 
  }
`

export const EMAIL = gql`
  mutation email ($email: String! $message: String! $subject: String) {
    email (email: $email message: $message subject: $subject)
  }
`

const mutations = {
  CREATEGROUP,
  CREATEORGANIZATION,
  CREATEUSER,
  DELETEFILE,
  DELETEGROUP,
  DELETEORG,
  DELETEUSER,
  EMAIL,
  IMPORTCSV,
  LOGIN,
  SETPASSWORD,
  UPDATEGROUP,
  UPDATEORGANIZATION,
  UPDATEUSER,
  VERIFYUSER
}

export default mutations
