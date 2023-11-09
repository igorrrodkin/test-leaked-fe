export default {
  SAPLANS: {
    data: [{
      keys: ['planType'],
      type: 'dropdown',
      label: 'Plan Type',
      infotip: '',
      isRequired: true,
      placeholder: '',
      defaultSelected: 2,
    }, {
      type: 'text',
      label: 'Plan Number',
      infotip: 'Provides image of a Plan including measurements, angles and bearings, where available.',
      isRequired: true,
      placeholder: '45754',
    }],
    sortOrder: 2,
  },
  'INT-VICONS': {
    Individual: {
      infotip: 'Use this search to browse title references associated to an owner name. A list of names matching your search criteria will be returned. Searching with a middle name will narrow your search results.',
      data: [{
        type: 'text',
        label: 'First Name',
        infotip: '',
        isRequired: false,
        placeholder: 'Jon',
      }, {
        type: 'text', label: 'Last Name', infotip: '', isRequired: true, placeholder: 'Smith',
      }],
      mask: '{{First Name}} {{Last Name}}',
    },
    Organisation: {
      infotip: 'Use this search to browse title references associated to an owner name. A list of names matching your search criteria will be returned. Searching without company suffixes (PTY LTD) will widen search results.',
      data: [{
        type: 'text',
        label: 'Organisation Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Acme Property',
      }],
    },
    sortOrder: 1,
  },
  DNRQPTIT: {
    data: [{
      type: 'text',
      label: 'Title Reference',
      infotip: '',
      isRequired: true,
      placeholder: '12067050',
    }],
  },
  'INT-QLDTRS': {
    data: [{
      type: 'text',
      label: 'Title Reference',
      infotip: '',
      isRequired: true,
      placeholder: '12067050',
    }],
    sortOrder: 1,
  },
  LANDIGP: {
    data: [{
      type: 'text',
      label: 'Plan Number',
      infotip: 'Search for a property using the Plan Number. Any of these formats will be accepted:\n - PS123456\n - PS1234A\n - PS1234/D2\n - PS1234/S3',
      isRequired: true,
      placeholder: 'RP123456',
    }],
    sortOrder: 2,
  },
  LANDIGI: {
    data: [{
      type: 'text',
      label: 'Instrument',
      infotip: 'Obtain an imaged copy of instruments documented on a title.',
      isRequired: true,
      placeholder: 'AA123456',
    }],
    sortOrder: 3,
  },
  LANDIGH: {
    data: [{
      type: 'text',
      label: 'Volume/Folio',
      infotip: 'Obtain summary information about plans and instruments recorded against the title since it became electronic. An imaged copy of the title will also be provided if available.',
      isRequired: true,
      placeholder: '8555/407',
    }],
    sortOrder: 5,
  },
  DNRIPLAN: {
    data: [{
      type: 'text',
      label: 'Plan Number',
      infotip: 'Search for a property using Plan Number. e.g. any of these formats will be accepted:\n - RP601844\n - CPFY2594\n - FY2594',
      isRequired: true,
      placeholder: 'RP601844',
    }],
    sortOrder: 2,
  },
  SATITLEPLUS: {
    Address: {
      data: [{
        type: 'text',
        label: 'Level',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text', label: 'Lot', infotip: '', isRequired: false, placeholder: '',
      }, {
        type: 'text',
        label: 'Unit Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Name',
        infotip: '',
        isRequired: true,
        placeholder: '',
      }, {
        type: 'text', label: 'Suburb/Locality', infotip: '', isRequired: false, placeholder: '',
      }],
    },
    'Plan/Parcel': {
      data: [{
        type: 'text',
        label: 'Parcel',
        infotip: '',
        isRequired: false,
        placeholder: '2',
      }, {
        keys: ['planType'],
        type: 'dropdown',
        label: 'Plan Type',
        infotip: '',
        isRequired: true,
        placeholder: '',
        defaultSelected: 1,
      }, {
        type: 'text', label: 'Plan Number', infotip: '', isRequired: true, placeholder: '45754',
      }],
    },
    'Volume/Folio': {
      data: [{
        keys: ['register'],
        type: 'dropdown',
        label: 'Register',
        infotip: '',
        isRequired: true,
        placeholder: '',
        defaultSelected: 0,
      }, {
        type: 'text', label: 'Volume/Folio', infotip: '', isRequired: true, placeholder: '5359/705',
      }],
      mask: '{{Register}}{{Volume/Folio}}',
    },
    sortOrder: 9,
  },
  NTNS: {
    'Owner (Individual)': {
      data: [{
        type: 'text',
        label: 'Given Names',
        infotip: '',
        isRequired: true,
        placeholder: 'Jon',
      }, {
        type: 'text', label: 'Surname', infotip: '', isRequired: true, placeholder: 'Smith',
      }],
    },
    'Owner (Organisation)': {
      data: [{
        type: 'text',
        label: 'Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Acme Property',
      }],
    },
    sortOrder: 2,
  },
  NTHNS: {
    'Owner (Individual)': {
      data: [{
        type: 'text',
        label: 'Given Names',
        infotip: '',
        isRequired: true,
        placeholder: 'Jon',
      }, {
        type: 'text', label: 'Surname', infotip: '', isRequired: true, placeholder: 'Smith',
      }],
    },
    'Owner (Organisation)': {
      data: [{
        type: 'text',
        label: 'Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Acme Property',
      }],
    },
    sortOrder: 3,
  },
  NTPLAN: {
    data: [{
      type: 'text',
      label: 'Plan Number',
      infotip: 'If you do not have a Plan Number, please purchase a Title first to obtain the plan number and then order the Plan.',
      isRequired: true,
      placeholder: 'U2001/047',
    }],
    sortOrder: 1,
  },
  SATITLEDTLS: {
    Address: {
      data: [{
        type: 'text',
        label: 'Level',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text', label: 'Lot', infotip: '', isRequired: false, placeholder: '',
      }, {
        type: 'text',
        label: 'Unit Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Name',
        infotip: '',
        isRequired: true,
        placeholder: '',
      }, {
        type: 'text', label: 'Suburb/Locality', infotip: '', isRequired: false, placeholder: '',
      }],
    },
    'Plan/Parcel': {
      data: [{
        type: 'text',
        label: 'Parcel',
        infotip: '',
        isRequired: false,
        placeholder: '2',
      }, {
        keys: ['planParcelSearchPlanType'],
        type: 'dropdown',
        label: 'Plan Type',
        infotip: '',
        isRequired: true,
        placeholder: '',
        defaultSelected: 0,
      }, {
        type: 'text', label: 'Plan Number', infotip: '', isRequired: true, placeholder: '45754',
      }],
    },
    'Volume/Folio': {
      data: [{
        keys: ['register'],
        type: 'dropdown',
        label: 'Register',
        infotip: '',
        isRequired: true,
        placeholder: '2146/36',
        defaultSelected: 0,
      }, {
        type: 'text', label: 'Volume/Folio', infotip: '', isRequired: true, placeholder: '5359/705',
      }],
      mask: '{{Register}}{{Volume/Folio}}',
    },
    sortOrder: 6,
  },
  SADEALING: {
    data: [{
      type: 'text',
      label: 'Dealing Number',
      infotip: '',
      isRequired: true,
      placeholder: '11224817',
    }],
    sortOrder: 1,
  },
  SAHISD: {
    Address: {
      data: [{
        type: 'text',
        label: 'Level',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text', label: 'Lot', infotip: '', isRequired: false, placeholder: '',
      }, {
        type: 'text',
        label: 'Unit Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Name',
        infotip: '',
        isRequired: true,
        placeholder: '',
      }, {
        type: 'text', label: 'Suburb/Locality', infotip: '', isRequired: false, placeholder: '',
      }],
    },
    'Plan/Parcel': {
      data: [{
        type: 'text',
        label: 'Parcel',
        infotip: '',
        isRequired: false,
        placeholder: '2',
      }, {
        keys: ['planParcelSearchPlanType'],
        type: 'dropdown',
        label: 'Plan Type',
        infotip: '',
        isRequired: true,
        placeholder: '',
        defaultSelected: 0,
      }, {
        type: 'text', label: 'Plan Number', infotip: '', isRequired: true, placeholder: '45754',
      }],
    },
    'Volume/Folio': {
      data: [{
        keys: ['register'],
        type: 'dropdown',
        label: 'Register',
        infotip: '',
        isRequired: true,
        placeholder: '',
        defaultSelected: 0,
      }, {
        type: 'text', label: 'Volume/Folio', infotip: '', isRequired: true, placeholder: '5359/705',
      }],
      mask: '{{Register}}{{Volume/Folio}}',
    },
    sortOrder: 5,
  },
  SADEALDETAIL: {
    data: [{
      type: 'text',
      label: 'Dealing Number',
      infotip: '',
      isRequired: true,
      placeholder: '11224817',
    }],
    sortOrder: 3,
  },
  SACHECK: {
    Address: {
      data: [{
        type: 'text',
        label: 'Level',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text', label: 'Lot', infotip: '', isRequired: false, placeholder: '',
      }, {
        type: 'text',
        label: 'Unit Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Name',
        infotip: '',
        isRequired: true,
        placeholder: '',
      }, {
        type: 'text', label: 'Suburb/Locality', infotip: '', isRequired: false, placeholder: '',
      }],
    },
    'Plan/Parcel': {
      data: [{
        type: 'text',
        label: 'Parcel',
        infotip: '',
        isRequired: false,
        placeholder: '2',
      }, {
        keys: ['planParcelSearchPlanType'],
        type: 'dropdown',
        label: 'Plan Type',
        infotip: '',
        isRequired: true,
        placeholder: '',
        defaultSelected: 0,
      }, {
        type: 'text', label: 'Plan Number', infotip: '', isRequired: true, placeholder: '45754',
      }],
    },
    'Volume/Folio': {
      data: [{
        keys: ['register'],
        type: 'dropdown',
        label: 'Register',
        infotip: '',
        isRequired: true,
        placeholder: '',
        defaultSelected: 0,
      }, {
        type: 'text', label: 'Volume/Folio', infotip: '', isRequired: true, placeholder: '',
      }],
      mask: '{{Register}}{{Volume/Folio}}',
    },
    sortOrder: 7,
  },
  TASPKG3: {
    Address: {
      data: [{
        type: 'text',
        label: 'Unit Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Name',
        infotip: '',
        isRequired: true,
        placeholder: '',
      }, {
        type: 'text', label: 'Suburb/Locality', infotip: '', isRequired: true, placeholder: '',
      }],
    },
    'Volume/Folio': {
      data: [{
        type: 'text',
        label: 'Volume/Folio',
        infotip: '',
        isRequired: true,
        placeholder: '2146/36',
      }],
    },
    sortOrder: 3,
  },
  SALPADDR: {
    'Parcel/Plan': {
      data: [{
        type: 'text',
        label: 'Parcel',
        infotip: '',
        isRequired: true,
        placeholder: '2',
      }, {
        type: 'text', label: 'Plan Number', infotip: '', isRequired: true, placeholder: '45754',
      }],
    },
    'Volume/Folio': {
      data: [{
        type: 'text',
        label: 'Volume/Folio',
        infotip: '',
        isRequired: true,
        placeholder: '2146/36',
      }],
    },
    sortOrder: 7,
  },
  TASSE: {
    data: [{
      type: 'text',
      label: 'Volume/Folio',
      infotip: '',
      isRequired: true,
      placeholder: '2146/36',
    }],
    sortOrder: 7,
  },
  TASPKG2: {
    Address: {
      data: [{
        type: 'text',
        label: 'Unit Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Name',
        infotip: '',
        isRequired: true,
        placeholder: '',
      }, {
        type: 'text', label: 'Suburb/Locality', infotip: '', isRequired: true, placeholder: '',
      }],
    },
    'Volume/Folio': {
      data: [{
        type: 'text',
        label: 'Volume/Folio',
        infotip: '',
        isRequired: true,
        placeholder: '2146/36',
      }],
    },
    sortOrder: 2,
  },
  TASPKG1: {
    Address: {
      data: [{
        type: 'text',
        label: 'Unit Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Number',
        infotip: '',
        isRequired: false,
        placeholder: '',
      }, {
        type: 'text',
        label: 'Street Name',
        infotip: '',
        isRequired: true,
        placeholder: '',
      }, {
        type: 'text', label: 'Suburb/Locality', infotip: '', isRequired: true, placeholder: '',
      }],
    },
    'Volume/Folio': {
      data: [{
        type: 'text',
        label: 'Volume/Folio',
        infotip: '',
        isRequired: true,
        placeholder: '2146/36',
      }],
    },
    sortOrder: 1,
  },
  TASON: {
    'Owner (Individual)': {
      data: [{
        type: 'text',
        label: 'Given Names',
        infotip: '',
        isRequired: true,
        placeholder: 'Jon',
      }, {
        type: 'text', label: 'Surname', infotip: '', isRequired: true, placeholder: 'Smith',
      }],
    },
    'Owner (Organisation)': {
      data: [{
        type: 'text',
        label: 'Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Acme Property',
      }],
    },
    sortOrder: 6,
  },
  TASHT: {
    data: [{
      type: 'text',
      label: 'Volume/Folio',
      infotip: '',
      isRequired: true,
      placeholder: '2146/36',
    }],
    sortOrder: 8,
  },
  TASFP: {
    data: [{
      type: 'text',
      label: 'Volume/Folio',
      infotip: '',
      isRequired: true,
      placeholder: '2146/36',
    }],
    sortOrder: 4,
  },
  ACTHS: {
    Parcel: {
      data: [{
        keys: ['district'],
        type: 'dropdown',
        label: 'District',
        infotip: '',
        isRequired: true,
        placeholder: 'Please select',
      }, {
        type: 'text',
        label: 'Section',
        infotip: '',
        isRequired: true,
        placeholder: '156',
        descriptionPrefix: 'Section ',
      }, {
        type: 'text',
        label: 'Block',
        infotip: '',
        isRequired: true,
        placeholder: '16',
        descriptionPrefix: 'Block  ',
      }, {
        type: 'text',
        label: 'Unit',
        infotip: '',
        isRequired: false,
        placeholder: '2',
        descriptionPrefix: 'Unit ',
      }],
    },
    'Volume/Folio': {
      data: [{
        type: 'text',
        label: 'Volume/Folio',
        infotip: '',
        isRequired: true,
        placeholder: '2146/36',
      }],
    },
    sortOrder: 3,
  },
  TASDOCS: {
    data: [{
      type: 'text',
      label: 'Dealing Number',
      infotip: '',
      isRequired: true,
      placeholder: 'L247660',
    }],
    sortOrder: 5,
  },
  WAPLANL: {
    data: [{
      type: 'text',
      label: 'Number',
      infotip: 'Survey Types: Diagram (D), Plan/Deposited Plan (P), Strata/Survey Strata (S)',
      isRequired: true,
      placeholder: 'D123456 or P123456 or S123456',
    }],
    sortOrder: 1,
  },
  WACSL: {
    'Title Reference': {
      data: [{
        type: 'text',
        label: 'Title Reference',
        infotip: '',
        isRequired: true,
        placeholder: '2100/341',
      }],
    },
    Address: {
      data: [{
        type: 'text',
        label: 'Street Number',
        infotip: '',
        isRequired: false,
        placeholder: '16',
      }, {
        type: 'text',
        label: 'Street Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Wicks',
      }, {
        type: 'text',
        label: 'Suburb',
        infotip: '',
        isRequired: true,
        placeholder: 'Morley',
      }],
    },
    'Owner (Individual)': {
      data: [{
        type: 'text',
        label: 'First Name',
        infotip: '',
        isRequired: false,
        placeholder: 'Jon',
      }, {
        type: 'text',
        label: 'Last Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Smith',
      }],
    },
    'Owner (Organisation)': {
      data: [{
        type: 'text',
        label: 'Company Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Acme Property',
      }],
    },
    sortOrder: 3,
  },
  WADOCSL: {
    data: [{
      type: 'text',
      label: 'Document Number',
      infotip: 'Obtain copies of imaged documents. Document Type is only required for \'Year Documents\' (greater than 1875 or equal to Year 1969). For all other Documents eg. D123456 the Document Type is not required.',
      isRequired: true,
      placeholder: 'G001970',
    }],
    sortOrder: 2,
  },
  LANSPI: {
    data: [{
      type: 'text',
      label: 'SPI',
      infotip: 'Search for a property based on the Standard Parcel Identifier. Accepted formats include:\n - 2~5\\PP3102A\n - 48\\PS514567\n - S6\\PS636376\n - AK\\PS519349',
      isRequired: true,
      placeholder: '12LP123456',
    }],
    sortOrder: 7,
  },
  LANPRPDET: {
    'Owner (Individual)': {
      data: [{
        type: 'text',
        label: 'First Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Jon',
      }, {
        type: 'text', label: 'Last Name', infotip: '', isRequired: true, placeholder: 'Smith',
      }],
    },
    'Owner (Organisation)': {
      data: [{
        type: 'text',
        label: 'Organisation Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Acme Property',
      }],
    },
    sortOrder: 8,
  },
  ACTON: {
    'Owner (Individual)': {
      data: [{
        type: 'text',
        label: 'Given Names',
        infotip: '',
        isRequired: true,
        placeholder: 'Jon',
      }, {
        type: 'text', label: 'Surname', infotip: '', isRequired: true, placeholder: 'Smith',
      }],
    },
    'Owner (Organisation)': {
      data: [{
        type: 'text',
        label: 'Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Acme Property',
      }],
    },
    sortOrder: 2,
  },
  LANCPN: {
    data: [{
      keys: ['municipality'],
      type: 'dropdown',
      label: 'Municipality',
      infotip: '',
      isRequired: true,
      placeholder: 'Please select',
    }, {
      type: 'text',
      label: 'Council Number',
      infotip: '',
      isRequired: true,
      placeholder: '12345',
    }],
    sortOrder: 9,
  },
  LANAPPLIC: {
    data: [{
      type: 'text',
      label: 'Application Index',
      infotip: 'This reference can be found on copies of crown plans and charts. Acceptable formats are:\n - AP123\n - AP123456A\n - 1234',
      isRequired: true,
      placeholder: 'AP123456E',
    }],
    sortOrder: 10,
  },
  LANDIGC: {
    data: [{
      type: 'text',
      label: 'Volume/Folio',
      infotip: 'Obtain the details of a cancelled folio, as well as an imaged copy of the paper title if available. NOTE: If a current reference is entered, a current title will be returned.',
      isRequired: true,
      placeholder: '8555/407',
    }],
    sortOrder: 6,
  },
  RL: {
    data: [{
      type: 'text',
      label: 'Plan Number',
      infotip: 'Obtain a list of lots on a plan and their status.',
      isRequired: true,
      placeholder: 'DP or SP',
    }],
    sortOrder: 7,
  },
  RH: {
    data: [{
      type: 'text',
      label: 'Title Reference',
      infotip: 'Obtain summary information about the plans and dealings recorded against the title since it became electronic.',
      isRequired: true,
      placeholder: '1863/1000001',
    }],
    sortOrder: 4,
  },
  RD: {
    data: [{
      type: 'text',
      label: 'Title Reference',
      infotip: 'Perform a search identifying the party to whom the Certificate of Title was delivered.',
      isRequired: true,
      placeholder: '1863/1000001',
    }],
    sortOrder: 5,
  },
  RC: {
    data: [{
      type: 'text',
      label: 'Title Reference',
      infotip: 'Obtain a copy of a cancelled electronic title. If the title has not been cancelled, the LRS will return a current title. To obtain a list of prior dealing activities on a current title, please use the Historical Title search.',
      isRequired: true,
      placeholder: '1863/1000001',
    }],
    sortOrder: 6,
  },
  DNRIDEAL: {
    data: [{
      type: 'text',
      label: 'Dealing Number',
      infotip: 'Obtain imaged copies of dealing documents. Any of these formats will be accepted:\n- 700000001\n- C704184B (Pre-ATS dealings)',
      isRequired: true,
      placeholder: '900061773',
    }],
    sortOrder: 3,
  },
  LPIPLANINQ: {
    data: [{
      type: 'text',
      label: 'Plan Number',
      infotip: '',
      isRequired: true,
      placeholder: 'DP or SP',
    }],
    sortOrder: 8,
  },
  LPIE88B: {
    data: [{
      type: 'text',
      label: 'Plan Number',
      infotip: 'Obtain a copy of a document lodged with the deposited plan which enables the creation and release of easements or the creation of restrictions and positive covenants etc. upon the registration of the plan.',
      isRequired: true,
      placeholder: 'DP or SP',
    }],
    sortOrder: 3,
  },
  LPIEP: {
    data: [{
      type: 'text',
      label: 'Plan Number',
      infotip: 'Obtain imaged copies of a plan. Plans that have not yet been imaged by the LRS will be charged at a higher cost.\ne.g. SP4567, DP1234, CP123-1234.',
      isRequired: true,
      placeholder: 'CP, DP or SP',
    }],
    sortOrder: 1,
  },
  LPIED: {
    data: [{
      type: 'text',
      label: 'Dealing Number',
      infotip: 'Obtain imaged copies of dealing documents. Dealings that have not yet been imaged by the LRS will be charged at a higher cost.',
      isRequired: true,
      placeholder: 'AA866815',
    }],
    sortOrder: 2,
  },
  DNRLPADDR: {
    data: [{
      type: 'text',
      label: 'Lot/Plan Number',
      infotip: 'Search for the address of a property using a Lot/Plan Number. e.g. any of these formats will be accepted:\n- 8/RP601844\n- 8RP601844\n- 6/CPFY2594\n- 6/FY2594',
      isRequired: true,
      placeholder: '8/RP601844',
    }],
    sortOrder: 4,
  },
  DNRHTIT: {
    data: [{
      type: 'text',
      label: 'Reference Number',
      infotip: '',
      isRequired: true,
      placeholder: '12067050',
    }],
    sortOrder: 6,
  },
  RPTNATOWN: {
    'Owner (Individual)': {
      data: [{
        type: 'text',
        label: 'First Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Jon',
      }, {
        type: 'text',
        label: 'Last Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Smith',
      }, {
        keys: ['reason'],
        type: 'dropdown',
        label: 'Reason',
        infotip: '',
        isRequired: true,
        placeholder: 'Please Choose...',
      }],
      mask: '{{First Name}} {{Last Name}}',
    },
    'Owner (Organisation)': {
      data: [{
        type: 'text',
        label: 'Organisation Name',
        infotip: '',
        isRequired: true,
        placeholder: 'e.g Acme Property',
      }, {
        keys: ['reason'],
        type: 'dropdown',
        label: 'Reason',
        infotip: '',
        isRequired: true,
        placeholder: 'Please Choose...',
      }],
      mask: '{{Organisation Name}}',
    },
  },
  LPIOP: {
    'Owner/Lessee (Individual)': {
      data: [{
        type: 'text',
        label: 'First Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Jon',
      }, {
        type: 'text',
        label: 'Last Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Smith',
      }, {
        keys: ['reason'],
        type: 'dropdown',
        label: 'Reason',
        infotip: '',
        isRequired: true,
        placeholder: 'Please Choose...',
      }, {
        type: 'checkbox',
        label: 'Include historical information on previous ownerships or leases held',
        value: true,
      }],
      mask: '{{First Name}} {{Last Name}}',
    },
    'Owner/Lessee (Organisation)': {
      data: [{
        type: 'text',
        label: 'Company Name',
        infotip: '',
        isRequired: true,
        placeholder: 'Acme Property',
      }, {
        keys: ['reason'],
        type: 'dropdown',
        label: 'Reason',
        infotip: '',
        isRequired: true,
        placeholder: 'Please Choose...',
      }, {
        type: 'checkbox',
        label: 'Include historical information on previous ownerships or leases held',
        value: true,
      }],
      mask: '{{Company Name}}',
    },
    sortOrder: 1,
  },
  DNRDEAL: {
    data: [{
      type: 'text',
      label: 'Dealing Number',
      infotip: 'Obtain a QLD dealing search statement. The following format will be accepted:\n- 700000001',
      isRequired: true,
      placeholder: '900061773',
    }],
    sortOrder: 5,
  },
  ACTDP: {
    data: [{
      type: 'text',
      label: 'Plan Number',
      infotip: 'If you do not have a Plan Number, please purchase a Title first to obtain the plan number and then order the Plan.',
      isRequired: true,
      placeholder: '123456',
    }],
    sortOrder: 1,
  },
};
