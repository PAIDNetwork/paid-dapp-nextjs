import Nda from './nda.html';
import AdvisorAgreemt from './advisor-agreement.html';
import Ciia from './ciia.html';
import ConsultingAgreement from './consulting-agreement.html';
import ReferalAgreement from './referral-agreement.html';
import Saft from './saft.html';

enum contractsTemplates {
  TemplateNda = 'nda',
  TemplateAdvisorAgreement = 'advisor',
  TemplateCiia = 'ciia',
  TemplateConsultingAgreement = 'consulting',
  TemplateReferalAgreement = 'referral',
  TemplateSaft = 'saft',
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
      counterPartyWallet: {
        title: 'Wallet address:',
        type: 'string',
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
            // purchaseOption: {
            //   type: 'string',
            //   title: 'Purchase Option',
            //   enum: ['A Nonstatutory Option', 'A Right'],
            // },
            // termsConditions: {
            //   type: 'string',
            //   title: 'Terms and Conditions',
            //   enum: ['Options', 'Restricted stock purchase awards'],
            // },
            // stockPlanName: {
            //   title: 'Stock Plan name',
            //   type: 'string',
            // },
            // stockPlanNameValue: {
            //   type: 'string',
            //   title: 'Stock Plan Name Value',
            //   enum: ['Stock option', 'Restricted stock purchase'],
            // },
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
            state: {
              title: 'State name ',
              type: 'string',
            },
          },
          required: [
            'state',
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
      };
      break;

    case contractsTemplates.TemplateCiia:
      title = 'CONFIDENTIAL INFORMATION AND INVENTION ASSIGNMENT AGREEMENT';
      contractTemplate = Ciia;
      dataName = 'ciiaAgreementData';
      jsonSchemas = [
        {
          type: 'object',
          title: 'Ciia',
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
        },
        serviceRenderChecked: {
          'ui:widget': 'checkbox',
        },
        serviceRate: {
          'ui:emptyValue': '0',
        },
        servicePayable: {
          'ui:emptyValue': '',
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
        },
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
