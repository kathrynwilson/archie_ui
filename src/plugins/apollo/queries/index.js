import { gql }        from 'apollo-boost'
import { userFields } from '@/plugins/apollo/fragments'

const qGetBirthYearByReligion = gql`
  query qGetBirthYearByReligion {
    results: dtVoterFileGet(limit: 1000, offset: 1000) {
      birthYear: BirthYear
      name: ModeledReligion
      value: RegisteredParty
    }
  }
`

const qGetFlagsSummary = gql`
  query qGetFlagsSummary($args: SequelizeJSON) {
    results: wpaiNationalFlagsSummaryGet(where: $args) {
      state
      CongressionalDistrict
      LegislativeDistrict
      SenateDistrict
      RegistrationAddressZip5
      Total
      DisengagedR
      GOPDownshifters
      DemDownshifters
      PersuasionTargets
      MillennialPersuasion
      GOPGOTV
    }
  }
`

const qGetDTRecordSimple = gql`
  query qGetDTRecordSimple($args: SequelizeJSON) {
    results: dtVoterFileGet (limit: 100, where: $args) {
      FirstName
      MiddleName
      LastName
      Sex
      AgeRange
      CongressionalAgeRange
      MailingAddressCity
      State
      MailingAddressZip5
      CongressionalDistrict
      LegislativeDistrict
      SenateDistrict
      DT_RegID
    }
  }
`

const qGetDistrictsCon = gql`
  query qGetDistrictsCon($args: SequelizeJSON) {
    results: dtDistrictsGet (where: $args) {
      districts: CongressionalDistrict
    }
  }
`

const qGetDistrictsLeg = gql`
  query qGetDistrictsLeg($args: SequelizeJSON) {
    results: dtDistrictsGet (where: $args) {
      districts: LegislativeDistrict
    }
  }
`

const qGetDistrictsSen = gql`
  query qGetDistrictsSen($args: SequelizeJSON) {
    results: dtDistrictsGet (where: $args) {
      districts: SenateDistrict
    }
  }
`

const qGetUsers = gql`
  query qGetUsers($orgId: String!) {
    results: usersGet (where: { orgId: $orgId}) {
      ${userFields}
    }
  }
`

const qGetGroups = gql`
  query qGetGroups {
    results: groupsGet {
      _id
      name
      description
    }
  }
`

const qGetOrganizations = gql`
  query qGetOrganizations {
    results: organizationsGet {
      _id
      name
      contactName
      email
      phone
    }
  }
`

const qGetUploads = gql`
  query qGetUploads {
    uploadsGet {
      _id
      name
      fileName
      rowCount
      matchedRowCount
      createdAt
      properties
    }
  }
`

const qGetFlags = gql`
  query qGetFlags {
    results: wpaiNationalFlagsGet (where: $args) {
      Iss_Climate_Skeptic
    }
  }
`

// TODO: figure out how you can make base64Code a variable
const qGetFile = gql`
  query qGetFile ($id: String){
    results: fileGet (id: $id) {
      base64Code
    }
  }
`

const qVaultGet = gql`
  query qVaultGet ($query: Json $importedInfo: [String]) {
    vaultGet (query: $query importedInfo: $importedInfo)
  }
`

const queries = {
  qGetBirthYearByReligion,
  qGetDTRecordSimple,
  qGetDistrictsCon,
  qGetDistrictsLeg,
  qGetDistrictsSen,
  qGetFile,
  qGetFlags,
  qGetFlagsSummary,
  qGetGroups,
  qGetOrganizations,
  qGetUploads,
  qGetUsers,
  qVaultGet,
}

export default queries
