import Nda from './nda.html';
import AdvisorAgreemt from './advisor-agreement.html';
import Ciia from './ciia.html';
import ConsultingAgreement from './consulting-agreement.html';
import ReferalAgreement from './referral-agreement.html';
import Saft from './saft.html';

enum contractsTemplates {
  TemplateNda = '001',
  TemplateCiia = '002',
  TemplateConsultingAgreement = '003',
  TemplateReferalAgreement = '004',
  TemplateSaft = '005',
  TemplateAdvisorAgreement = '006',
}

interface contractTemplate {
  title: string;
  // interpolationFields: Object;
  template: string;
  dataName: string;
  jsonSchemas: any;
  uiSchema: Object;
}

const getContractTemplate = (contractName: String): contractTemplate => {
  let contractTemplate;
  let title;
  let dataName = '';
  let jsonSchemas: any = [];
  let uiSchema: Object = {};
  const sharedProperties = {
    party: {
      partyName: {
        title: 'Name:',
        type: 'string',
      },
      partyAddress: {
        title: 'Address:',
        type: 'string',
      },
      partyEmail: {
        title: 'Email:',
        type: 'string',
        pattern: '[^@\\s]+@[^@\\s]+\\.[^@\\s]+',
      },
      partyWallet: {
        title: 'Wallet address:',
        type: 'string',
        custom: 'address',
        readOnly: true,
      },
    },
    couterparty: {
      counterPartyName: {
        title: 'Name:',
        type: 'string',
      },
      counterPartyAddress: {
        title: 'Address:',
        type: 'string',
      },
      counterPartyEmail: {
        title: 'Email:',
        type: 'string',
        pattern: '[^@\\s]+@[^@\\s]+\\.[^@\\s]+',
      },
      counterPartyDid: {
        title: 'DID:',
        type: 'string',
      },
      counterPartyWallet: {
        title: 'Wallet address:',
        type: 'string',
        custom: 'address',
      },
    },
    wallet: {
    },
    required: [
      'partyName',
      'partyAddress',
      'partyEmail',
      'partyWallet',
      'counterPartyName',
      'counterPartyEmail',
      'counterPartyAddress',
      'counterPartyWallet',
    ],
    uiSchema: {
      partyName: {
        'ui:placeholder': 'Your Name',
      },
      partyEmail: {
        'ui:placeholder': 'Your Email',
      },
      partyAddress: {
        'ui:placeholder': 'Your Address',
      },
      counterPartyName: {
        'ui:placeholder': 'Counter Party Name',
      },
      counterPartyEmail: {
        'ui:placeholder': 'Counter Party Email',
      },
      counterPartyAddress: {
        'ui:placeholder': 'Counter Party Address',
      },
      counterPartyWallet: {
        'ui:placeholder': 'Counter Party Wallet',
      },
    },
  };

  switch (contractName) {
    case contractsTemplates.TemplateNda:
      title = 'MUTUAL NONDISCLOSURE AGREEMENT';
      contractTemplate = Nda;
      dataName = 'ndaAgreementData';
      jsonSchemas = [
        {
          type: 'object',
          title: 'Date when Agreement will become effective',
          properties: {
            date: {
              title: 'Date',
              type: 'string',
              format: 'date',
            },
          },
          required: [
            'date',
          ],
        },
        {
          type: 'object',
          title: 'My information (the "Company")',
          properties: {
            ...sharedProperties.party,
          },
          required: sharedProperties.required,
        },
        {
          type: 'object',
          title: 'Counterparty information (the “Counterparty”)',
          properties: {
            ...sharedProperties.couterparty,
          },
          required: sharedProperties.required,
        },
      ];
      uiSchema = {
        ...sharedProperties.uiSchema,
      };
      break;

    case contractsTemplates.TemplateAdvisorAgreement:
      title = 'ADVISOR AGREEMENT';
      contractTemplate = AdvisorAgreemt;
      dataName = 'advisorAgreementData';
      jsonSchemas = [
        {
          type: 'object',
          title: 'My information (the "Company")',
          properties: {
            date: {
              title: 'Date',
              type: 'string',
              format: 'date',
            },
            companyName: {
              title: 'Company Name:',
              type: 'string',
              default: '[COMPANY NAME]',
            },
            typeCompany: {
              title: 'Type of company:',
              type: 'string',
              default: '[TYPE OF COMPANY]',
            },
            ...sharedProperties.party,
          },
          required: sharedProperties.required,
        },
        {
          type: 'object',
          title: 'Advisor information ("Advisor")',
          properties: {
            ...sharedProperties.couterparty,
          },
          required: sharedProperties.required,
        },
        {
          type: 'object',
          title: 'Vesting information',
          properties: {
            percentageVest: {
              title: 'Percentage',
              type: 'number',
            },
            anniversaryMonth: {
              title: 'Anniversary month',
              type: 'number',
            },
            typeOfTriggerAcceleration: {
              type: 'string',
              title: 'Trigger acceleration type',
              enum: [
                'Single Trigger Acceleration...',
                'Double Trigger Acceleration...',
              ],
            },
            numberOfShares: {
              title: 'Price per share type',
              type: 'number',
            },
            acceptionOption: {
              type: 'string',
              title: 'Accepting option',
              enum: ['An Option', 'A Right'],
            },
            purchaseOption: {
              type: 'string',
              title: 'Purchase Option',
              enum: ['A Nonstatutory Option', 'A Right'],
            },
            termsConditions: {
              type: 'string',
              title: 'Terms and Conditions',
              enum: ['Options', 'Restricted stock purchase awards'],
            },
            stockPlanName: {
              title: 'Stock Plan name',
              type: 'string',
            },
            stockPlanNameValue: {
              type: 'string',
              title: 'Stock Plan Name Value',
              enum: ['Stock option', 'Restricted stock purchase'],
            },
          },
          required: [
            'percentageVest',
            'anniversaryMonth',
            'typeOfTriggerAcceleration',
            'numberOfShares',
            'acceptionOption',
          ],
        },
        {
          type: 'object',
          title: 'Terms and Termination information',
          properties: {
            // vestingCommencement: {
            //   title: 'Vesting Commencement %',
            //   type: 'number',
            // },
            numberOfYears: {
              title: 'Number of years',
              type: 'number',
            },
          },
          required: [
            'numberOfYears',
          ],
        },
        {
          type: 'object',
          title: 'Governing Law',
          properties: {
            // typeOfPrice: {
            //   type: 'string',
            //   title: 'Terms and Conditions',
            //   enum: ['Exersice', 'Purchase'],
            // },
            stateOfAdvisor: {
              title: 'State name ',
              type: 'string',
              default: '[STATE]',
            },
          },
          required: [
            'stateOfAdvisor',
            'companyName',
            'typeCompany',
          ],
        },
      ];
      uiSchema = {
        purchaseOption: {
          'ui:widget': 'radio',
        },
        termsConditions: {
          'ui:widget': 'radio',
        },
        stockPlanNameValue: {
          'ui:widget': 'radio',
        },
        typeOfTriggerAcceleration: {
          'ui:widget': 'radio',
        },
        typeOfPrice: {
          'ui:widget': 'radio',
        },
        acceptionOption: {
          'ui:widget': 'radio',
        },
        companyName: {
          'ui:placeholder': 'Company name',
        },
        typeCompany: {
          'ui:placeholder': 'Type of company',
        },
        percentageVest: {
          'ui:placeholder': 'Percentage',
        },
        anniversaryMonth: {
          'ui:placeholder': 'Anniversary month',
        },
        numberOfShares: {
          'ui:placeholder': 'Price per share type',
        },
        numberOfYears: {
          'ui:placeholder': 'Number of years',
        },
        stateOfAdvisor: {
          'ui:placeholder': 'State name',
        },
        ...sharedProperties.uiSchema,
      };
      break;

    case contractsTemplates.TemplateCiia:
      title = 'CONFIDENTIAL INFORMATION AND INVENTION ASSIGNMENT AGREEMENT';
      contractTemplate = Ciia;
      dataName = 'ciiaAgreementData';
      jsonSchemas = [
        {
          type: 'object',
          title: 'Advisor Agreement',
          properties: {
            ...sharedProperties.party,
          },
          required: sharedProperties.required,
        },
        {
          type: 'object',
          properties: {
            ...sharedProperties.couterparty,
          },
          required: sharedProperties.required,
        },
        {
          type: 'object',
          properties: {
            effectiveDate: {
              title: 'Effective Date',
              type: 'string',
              format: 'date',
            },
            companyState: {
              title: 'Company State',
              type: 'string',
            },
            stateConsultant: {
              title: 'State',
              type: 'string',
            },
            typeOfCompanyConsultant: {
              title: 'Type of company',
              type: 'string',
            },
            title: {
              title: 'Title',
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            datea: {
              title: 'Date',
              type: 'string',
              format: 'date',
            },
            idNumberBriefDesc: {
              title: 'Identifying # or Brief Desc.',
              type: 'string',
            },
            stateCompany: {
              title: 'State',
              type: 'string',
            },
            typeOfComapny: {
              title: 'Type of Company',
              type: 'string',
            },
            listCompAgreements: {
              title:
              'List of companies and/or agreements excluded under section 10(b)',
              type: 'string',
              format: 'textarea',
            },
          },
        },
      ];
      uiSchema = {
        ...sharedProperties.uiSchema,
      };
      break;

    case contractsTemplates.TemplateConsultingAgreement:
      title = 'CONSULTING AGREEMENT';
      contractTemplate = ConsultingAgreement;
      dataName = 'consultingAgreementData';
      jsonSchemas = [
        {
          type: 'object',
          title: 'My information (the “Company”)',
          properties: {
            ...sharedProperties.party,
          },
          required: sharedProperties.required,
        },
        {
          type: 'object',
          title: 'Advisor information (“Consultant”)',
          properties: {
            ...sharedProperties.couterparty,
          },
          required: sharedProperties.required,
        },
        {
          type: 'object',
          title: 'Governing Law',
          properties: {
            state: {
              title: 'State name',
              type: 'string',
            },
            // typeOfCompany: {
            //   title: 'Type of Company',
            //   type: 'string',
            // },
          },
          required: [
            'state',
          ],
        },
        {
          type: 'object',
          Title: 'Consulting services',
          properties: {
            descriptionConsulting: {
              title: 'Description',
              type: 'string',
            },
            // consultantChecked: {
            //   title: 'Consultan Shall',
            //   type: 'boolean',
            //   default: false,
            // },
            // companyWillChecked: {
            //   title: 'The Company will recommend',
            //   type: 'boolean',
            // },
            // otherChecked: {
            //   title: 'Other',
            //   type: 'boolean',
            //   default: '',
            // },
          },
          required: [
            'descriptionConsulting',
          ],
          // dependencies: {
          //   consultantChecked: {
          //     oneOf: [
          //       {
          //         properties: {
          //           consultantChecked: {
          //             enum: [true],
          //           },
          //           consultantExecutionAmount: {
          //             type: 'number',
          //             title: 'Consultant Execution Amount',
          //           },
          //           consultantCompletionAmount: {
          //             type: 'number',
          //             title: 'Consultant Completion Amount',
          //           },
          //         },
          //       },
          //     ],
          //   },
          //   companyWillChecked: {
          //     oneOf: [
          //       {
          //         properties: {
          //           companyWillChecked: {
          //             enum: [true],
          //           },
          //           companyShares: {
          //             type: 'string',
          //             title: 'Company Shares',
          //           },
          //           companyFollows: {
          //             type: 'string',
          //             title: 'Follows',
          //           },
          //         },
          //       },
          //     ],
          //   },
          //   otherChecked: {
          //     oneOf: [
          //       {
          //         properties: {
          //           otherChecked: {
          //             enum: [true],
          //           },
          //           other: {
          //             type: 'string',
          //           },
          //         },
          //       },
          //     ],
          //   },
          // },
        },
        {
          type: 'object',
          title: 'Compensation for services rendered',
          properties: {
            serviceRate: {
              type: 'number',
              title: 'Rate per hour ($)',
            },
            servicePayable: {
              type: 'string',
              title: 'Payment terms',
            },
            serviceAmountLimit: {
              type: 'number',
              title: 'Company’s total liability',
            },
          },
          required: [
            'serviceRenderChecked',
            'serviceRate',
            'servicePayable',
            'serviceAmountLimit',
          ],
        },
        // {
        //   type: 'object',
        //   title: 'Hourly rate compensation',
        //   properties: {
        //     ...sharedProperties.party,
        //   },
        //   required: sharedProperties.required,
        // },
        {
          type: 'object',
          title: 'Fixed wage compensation',
          properties: {
            consultantExecutionAmount: {
              type: 'number',
              title: 'Upon execution amount ($)',
            },
            consultantCompletionAmount: {
              type: 'number',
              title: 'Upon completion amount ($)',
            },
          },
          required: [
            'consultantExecutionAmount',
            'consultantCompletionAmount',
          ],
        },
        {
          type: 'object',
          title: 'Option to purchase shares',
          properties: {
            sharesAmount: {
              title: 'Shares amount',
              type: 'number',
            },
            vestingInformation: {
              title: 'Vesting and exercise information',
              type: 'string',
            },
          },
          required: [
            'sharesAmount',
            'vestingInformation',
          ],
        },
        {
          type: 'object',
          title: 'Other compensation options',
          properties: {
            other: {
              title: 'Description',
              type: 'string',
            },
          },
          required: ['other'],
        },
      ];
      uiSchema = {
        'ui:widget': 'checkbox',
        'ui:order': [
          'partyName',
          'partyAddress',
          'partyEmail',
          'partyWallet',
          'counterPartyName',
          'counterPartyAddress',
          'counterPartyEmail',
          'counterPartyDid',
          'counterPartyWallet',
          'sendWallet',
          'ReceiveWallet',
          'state',
          'typeOfCompany',
          'descriptionConsulting',
          'serviceRenderChecked',
          'serviceRate',
          'servicePayable',
          'serviceAmountLimit',
          'consultantChecked',
          'consultantExecutionAmount',
          'consultantCompletionAmount',
          'companyWillChecked',
          'companyShares',
          'companyFollows',
          'sharesAmount',
          'vestingInformation',
          'otherChecked',
          'other',
        ],
        descriptionConsulting: {
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 9,
          },
          'ui:placeholder': 'Description',
        },
        serviceRenderChecked: {
          'ui:widget': 'checkbox',
        },
        serviceRate: {
          'ui:emptyValue': '0',
        },
        servicePayable: {
          'ui:emptyValue': '',
          'ui:placeholder': 'Payment terms',
        },
        serviceAmountLimit: {
          'ui:emptyValue': '0',
        },
        consultantChecked: {
          'ui:widget': 'checkbox',
        },
        companyFollows: {
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 9,
          },
        },
        other: {
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 9,
          },
          'ui:placeholder': 'Description',
        },
        consultantExecutionAmount: {
          'ui:placeholder': 'Upon execution amount ($)',
        },
        consultantCompletionAmount: {
          'ui:placeholder': 'Upon completion amount ($)*',
        },
        state: {
          'ui:placeholder': 'State name',
        },
        sharesAmount: {
          'ui:placeholder': 'Shares amount',
        },
        vestingInformation: {
          'ui:placeholder': 'Vesting and exercise information',
        },
        ...sharedProperties.uiSchema,
      };
      break;

    case contractsTemplates.TemplateReferalAgreement:
      title = 'SALES COMMISSION AGREEMENT';
      contractTemplate = ReferalAgreement;
      dataName = 'referralAgreementData';
      jsonSchemas = [
        {
          type: 'object',
          title: 'Date when Agreement will become effective',
          properties: {
            commisionDate: {
              title: 'Date',
              type: 'string',
              format: 'date',
            },
          },
          required: ['commisionDate'],
        },
        {
          type: 'object',
          title: 'My information (the “Company)',
          properties: {
            ...sharedProperties.party,
          },
          required: sharedProperties.required,
        },
        {
          type: 'object',
          title: 'Advisor information (“Provider”)',
          properties: {
            ...sharedProperties.couterparty,
            // typeOfCompany: {
            //   title: 'Type of company',
            //   type: 'string',
            // },
          },
          required: sharedProperties.required,
        },
        {
          type: 'object',
          title: 'Agreement Termination',
          properties: {
            terminationDate: {
              title: 'Termination date',
              type: 'string',
              format: 'date',
              ui: 'emptyValue',
            },
            // county: {
            //   title: 'County',
            //   type: 'string',
            // },
          },
          required: ['terminationDate'],
        },
        {
          type: 'object',
          title: 'Commission',
          properties: {
            commision: {
              title: 'Commission percent',
              type: 'number',
            },
            commisionterminationDate: {
              title: 'Commission termination date',
              type: 'string',
              format: 'date',
              ui: 'emptyValue',
            },
          },
        },
        {
          type: 'object',
          title: 'Governing Law',
          properties: {
            stateOfCompany: {
              title: 'State name',
              type: 'string',
            },
          },
          required: ['stateOfCompany'],
        },
      ];
      uiSchema = {
        terminationDate: {
          'ui:emptyValue': '',
        },
        commisionDate: {
          'ui:emptyValue': '',
        },
        commisionterminationDate: {
          'ui:emptyValue': '',
        },
        commision: {
          'ui:placeholder': 'Commission percent',
        },
        stateOfCompany: {
          'ui:placeholder': 'State name',
        },
        ...sharedProperties.uiSchema,
      };
      break;

    case contractsTemplates.TemplateSaft:
      title = 'SIMPLE AGREEMENT FOR FUTURE TOKENS';
      contractTemplate = Saft;
      dataName = 'saftAgreementData';
      jsonSchemas = [
        {
          type: 'object',
          title: 'My information ("the Company")',
          properties: {
            typeOfCompany: {
              title: 'Company name',
              type: 'string',
            },
            jurisdiction: {
              title: 'Jurisdiction',
              type: 'string',
            },
            ...sharedProperties.party,
          },
          required: ['typeOfCompany', ...sharedProperties.required],
        },
        {
          type: 'object',
          title: 'Advisor information ("the Purchaser")',
          properties: {
            ...sharedProperties.couterparty,
          },
          required: sharedProperties.required,
        },
        {
          type: 'object',
          title: 'Purchase amount',
          properties: {
            purchaseAmount: {
              title: 'Purchase amount (US $)',
              type: 'number',
            },
            tokenAmount: {
              title: 'Token amount',
              type: 'number',
            },
          },
          required: ['purchaseAmount', 'tokenAmount'],
        },
        {
          type: 'object',
          Title: 'Discount rate',
          properties: {
            discountRate: {
              title: 'Rate (%)',
              type: 'number',
            },
          },
          required: ['discountRate'],
        },
        {
          type: 'object',
          title: 'Applicable Exchange rate',
          properties: {
            website: {
              title: 'Website',
              type: 'string',
            },
          },
          required: ['website'],
        },
        {
          type: 'object',
          title: 'Payment options',
          properties: {
            paymentOption: {
              title: 'Payment Options',
              type: 'string',
              enum: ['dollar', 'eth', 'btc'],
              enumNames: ['U.S. Dollars', 'Ethereum', 'Bitcoin'],
              default: 'dollar',
            },
          },
          dependencies: {
            paymentOption: {
              oneOf: [
                {
                  properties: {
                    paymentOption: {
                      enum: ['dollar'],
                    },
                    bankName: {
                      title: 'Bank Name',
                      type: 'string',
                    },
                    address: {
                      title: 'Address',
                      type: 'string',
                    },
                    aba: {
                      title: 'ABA#',
                      type: 'string',
                    },
                    payeeAccount: {
                      title: 'Payee Account #',
                      type: 'string',
                    },
                    payeeAccountName: {
                      title: 'Payee Account Name',
                      type: 'string',
                    },
                  },
                },
                {
                  properties: {
                    paymentOption: {
                      enum: ['eth'],
                    },
                    ethereum: {
                      title: 'Ethereum address',
                      type: 'string',
                    },
                  },
                },
                {
                  properties: {
                    paymentOption: {
                      enum: ['btc'],
                    },
                    bitcoin: {
                      title: 'Bitcoin address',
                      type: 'string',
                    },
                  },
                },
              ],
            },
          },
          required: [
            'paymentOption',
            'bankName',
            'address',
            'aba',
            'payeeAccount',
            'payeeAccountName',
            'ethereum',
            'bitcoin',
          ],
        },
      ];
      uiSchema = {
        typeOfCompany: {
          'ui:placeholder': 'Company name',
        },
        jurisdiction: {
          'ui:placeholder': 'Jurisdiction',
        },
        purchaseAmount: {
          'ui:placeholder': 'Purchase amount (US $)',
        },
        tokenAmount: {
          'ui:placeholder': 'Token amount',
        },
        discountRate: {
          'ui:placeholder': 'Rate (%)',
        },
        website: {
          'ui:placeholder': 'Website',
        },
        bankName: {
          'ui:placeholder': 'Bank Name',
        },
        address: {
          'ui:placeholder': 'address',
        },
        aba: {
          'ui:placeholder': 'ABA#',
        },
        payeeAccount: {
          'ui:placeholder': 'Payee Account#',
        },
        payeeAccountName: {
          'ui:placeholder': 'Payee Account Name',
        },
        ethereum: {
          'ui:placeholder': 'Ethereum address',
        },
        bitcoin: {
          'ui:placeholder': 'Bitcoin address',
        },
        ...sharedProperties.uiSchema,
      };
      break;

    default:
      throw new Error('No template Found');
  }
  return {
    title,
    // interpolationFields: findElementsInterpolation(contractTemplate),
    template: contractTemplate,
    dataName,
    jsonSchemas,
    uiSchema,
  };
};

export default getContractTemplate;
