export const fDistricts = {
  operation: `dtDistrictsGet`,
  fields:    [
    { label: `Congressional District`, value: `CongressionalDistrict` },
    { label: `Legislative District`,   value: `LegislativeDistrict`   },
    { label: `Senate District`,        value: `SenateDistrict`        }]
}


export const fPerson = {
  operation: ``,
  fields:    [
    { label: `First Name`,     value: `FirstName`,    exact: false },
    { label: `Middle Name`,    value: `MiddleName`,   exact: false },
    { label: `Last Name`,      value: `LastName`,     exact: true  },
    { label: `State Voter ID`, value: `StateVoterID`, exact: false },
    { label: `Reg. ID`,        value: `DT_RegID`,     exact: false }]
}
