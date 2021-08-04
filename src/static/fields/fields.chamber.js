const fChamber = {
  label:     `Chamber`,
  operation: `wpaiChamberGet`,
  key:       `rnc_regid`,
  fields:    [
    { label: `ChamberYes`,               field: `ChamberYes`               },
    { label: `ChamberNo`,                field: `ChamberNo`                },
    { label: `FreeEnterpriseYes`,        field: `FreeEnterpriseYes`        },
    { label: `FreeEnterpriseNo`,         field: `FreeEnterpriseNo`         },
    { label: `RBallot`,                  field: `RBallot`                  },
    { label: `DBallot`,                  field: `DBallot`                  },
    { label: `Turnout`,                  field: `Turnout`                  },
    { label: `NetR`,                     field: `NetR`                     },
    { label: `NetC`,                     field: `NetC`                     },
    { label: `LikelyR`,                  field: `LikelyR`                  },
    { label: `LeanR`,                    field: `LeanR`                    },
    { label: `LeanD`,                    field: `LeanD`                    },
    { label: `LikelyD`,                  field: `LikelyD`                  },
    { label: `RTurnout_Targets`,         field: `RTurnout_Targets`         },
    { label: `DTurnout_Targets`,         field: `DTurnout_Targets`         },
    { label: `ChamberSupp`,              field: `ChamberSupp`              },
    { label: `ChamberBroad`,             field: `ChamberBroad`             },
    { label: `ChamberMobilization`,      field: `ChamberMobilization`      },
    { label: `ChamberPersuasion`,        field: `ChamberPersuasion`        },
    { label: `ChamberMobilizationBroad`, field: `ChamberMobilizationBroad` },
    { label: `ChamberPersuasionBroad`,   field: `ChamberPersuasionBroad`   },
    { label: `NetF`,                     field: `NetF`                     }]
}

export default {
  fChamber
}
