export const fPersonDetails = {
  text:   `Person Data`,
  value:  `exploreGet`,
  key:    `DT_RegID`,
  sort:   false,
  fields: [
    { label: `First`,         field: `FirstName`             },
    { label: `Middle`,        field: `MiddleName`            },
    { label: `Last`,          field: `LastName`              },
    { label: `City`,          field: `MailingAddressCity`    },
    { label: `Zip`,           field: `MailingAddressZip5`    },
    { label: `Sen. District`, field: `SenateDistrict`        },
    { label: `Leg. District`, field: `LegislativeDistrict`   },
    { label: `Con. District`, field: `CongressionalDistrict` },
  ]
}

export default {
  fPersonDetails
}
