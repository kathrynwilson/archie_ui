export const userFields = `
  _id
  userName
  fullName
  email
  phone
  status
  orgId
  groups { _id name }
  organization {
    _id
    name
    ownedProperties {
      wpaiNationalFlags
      dtVoterFile
    }
  }
  settings
`

export const userPrimitives = `
  _id
  userName
  fullName
  email
  phone
  status
  orgId
`

export const organizationFields = `
  _id
  name
  contactName
  ownedProperties {
    wpaiNationalFlags
    dtVoterFile
  }
  phone
  email
`

export default {
  userFields,
  userPrimitives,
  organizationFields,
}
