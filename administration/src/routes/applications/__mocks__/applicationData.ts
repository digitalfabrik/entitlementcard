import { JsonField } from '../../../components/JsonFieldView'
import { ApplicationStatus } from '../../../generated/graphql'
import type { Application } from '../types/types'
import { verificationsAwaiting } from './verificationData'

const cardTypeBlue: JsonField<'String'> = {
  name: 'cardType',
  type: 'String',
  value: 'Blaue Ehrenamtskarte',
}

const cardTypeGold: JsonField<'String'> = {
  name: 'cardType',
  type: 'String',
  value: 'Goldene Ehrenamtskarte',
}

const addressData: JsonField<'Array'> = {
  name: 'address',
  type: 'Array',
  value: [
    {
      name: 'street',
      type: 'String',
      value: 'Musterstraße',
    },
    {
      name: 'houseNumber',
      type: 'String',
      value: '22',
    },
    {
      name: 'addressSupplement',
      type: 'String',
      value: 'EG links',
    },
    {
      name: 'postalCode',
      type: 'String',
      value: '86152',
    },
    {
      name: 'location',
      type: 'String',
      value: 'Augsburg',
    },
    {
      name: 'country',
      type: 'String',
      value: 'Deutschland',
    },
  ],
}
const personalData: JsonField<'Array'> = {
  name: 'personalData',
  type: 'Array',
  value: [
    {
      name: 'forenames',
      type: 'String',
      value: 'John',
    },
    {
      name: 'surname',
      type: 'String',
      value: 'Doe',
    },
    { ...addressData },
    {
      name: 'dateOfBirth',
      type: 'Date',
      value: '2000-02-04',
    },
    {
      name: 'telephone',
      type: 'String',
      value: '01722222222',
    },
    {
      name: 'emailAddress',
      type: 'String',
      value: 'john.doe@gmail.com',
    },
  ],
}
const applicationDetailsBlue: JsonField<'Array'> = {
  name: 'applicationDetails',
  type: 'Array',
  value: [
    { ...cardTypeBlue },
    {
      name: 'applicationType',
      type: 'String',
      value: 'Erstantrag',
    },
    {
      name: 'wantsDigitalCard',
      type: 'Boolean',
      value: true,
    },
    {
      name: 'wantsPhysicalCard',
      type: 'Boolean',
      value: false,
    },
    {
      name: 'blueCardWorkAtOrganizationsEntitlement',
      type: 'Array',
      value: [
        {
          name: 'workAtOrganization',
          type: 'Array',
          value: [
            {
              name: 'organization',
              type: 'Array',
              value: [
                {
                  name: 'name',
                  type: 'String',
                  value: 'TuerAnTuer',
                },
                {
                  name: 'address',
                  type: 'Array',
                  value: [
                    {
                      name: 'street',
                      type: 'String',
                      value: 'Wertachstraße',
                    },
                    {
                      name: 'houseNumber',
                      type: 'String',
                      value: '22',
                    },
                    {
                      name: 'postalCode',
                      type: 'String',
                      value: '86153',
                    },
                    {
                      name: 'location',
                      type: 'String',
                      value: 'Augsburg',
                    },
                    {
                      name: 'country',
                      type: 'String',
                      value: 'Deutschland',
                    },
                  ],
                },
                {
                  name: 'category',
                  type: 'TranslatableString',
                  value: 'sports',
                },
                {
                  name: 'organizationContact',
                  type: 'Array',
                  value: [
                    {
                      name: 'name',
                      type: 'String',
                      value: 'TuerAnTuer',
                    },
                    {
                      name: 'telephone',
                      type: 'String',
                      value: '0172222222',
                    },
                    {
                      name: 'email',
                      type: 'String',
                      value: 'tuerantuer@gmail.com',
                    },
                    {
                      name: 'hasGivenPermission',
                      type: 'Boolean',
                      value: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'responsibility',
              type: 'String',
              value: 'TuerAnTuer',
            },
            {
              name: 'amountOfWork',
              type: 'Number',
              value: 5.0,
            },
            {
              name: 'workSinceDate',
              type: 'Date',
              value: '2000-02-02',
            },
            {
              name: 'payment',
              type: 'Boolean',
              value: false,
            },
            {
              name: 'isAlreadyVerified',
              type: 'Boolean',
              value: false,
            },
          ],
        },
      ],
    },
    {
      name: 'hasAcceptedPrivacyPolicy',
      type: 'Boolean',
      value: true,
    },
    {
      name: 'hasAcceptedEmailUsage',
      type: 'Boolean',
      value: false,
    },
    {
      name: 'givenInformationIsCorrectAndComplete',
      type: 'Boolean',
      value: true,
    },
  ],
}

const applicationDetailsGold: JsonField<'Array'> = {
  name: 'applicationDetails',
  type: 'Array',
  value: [
    { ...cardTypeGold },
    {
      name: 'applicationType',
      type: 'String',
      value: 'Erstantrag',
    },
    {
      name: 'wantsDigitalCard',
      type: 'Boolean',
      value: true,
    },
    {
      name: 'wantsPhysicalCard',
      type: 'Boolean',
      value: false,
    },
    {
      name: 'blueCardWorkAtOrganizationsEntitlement',
      type: 'Array',
      value: [
        {
          name: 'workAtOrganization',
          type: 'Array',
          value: [
            {
              name: 'organization',
              type: 'Array',
              value: [
                {
                  name: 'name',
                  type: 'String',
                  value: 'TuerAnTuer',
                },
                {
                  name: 'address',
                  type: 'Array',
                  value: [
                    {
                      name: 'street',
                      type: 'String',
                      value: 'Wertachstraße',
                    },
                    {
                      name: 'houseNumber',
                      type: 'String',
                      value: '22',
                    },
                    {
                      name: 'postalCode',
                      type: 'String',
                      value: '86153',
                    },
                    {
                      name: 'location',
                      type: 'String',
                      value: 'Augsburg',
                    },
                    {
                      name: 'country',
                      type: 'String',
                      value: 'Deutschland',
                    },
                  ],
                },
                {
                  name: 'category',
                  type: 'TranslatableString',
                  value: 'sports',
                },
                {
                  name: 'organizationContact',
                  type: 'Array',
                  value: [
                    {
                      name: 'name',
                      type: 'String',
                      value: 'TuerAnTuer',
                    },
                    {
                      name: 'telephone',
                      type: 'String',
                      value: '0172222222',
                    },
                    {
                      name: 'email',
                      type: 'String',
                      value: 'tuerantuer@gmail.com',
                    },
                    {
                      name: 'hasGivenPermission',
                      type: 'Boolean',
                      value: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'responsibility',
              type: 'String',
              value: 'TuerAnTuer',
            },
            {
              name: 'amountOfWork',
              type: 'Number',
              value: 5.0,
            },
            {
              name: 'workSinceDate',
              type: 'Date',
              value: '2000-02-02',
            },
            {
              name: 'payment',
              type: 'Boolean',
              value: false,
            },
            {
              name: 'isAlreadyVerified',
              type: 'Boolean',
              value: false,
            },
          ],
        },
      ],
    },
    {
      name: 'hasAcceptedPrivacyPolicy',
      type: 'Boolean',
      value: true,
    },
    {
      name: 'hasAcceptedEmailUsage',
      type: 'Boolean',
      value: false,
    },
    {
      name: 'givenInformationIsCorrectAndComplete',
      type: 'Boolean',
      value: true,
    },
  ],
}

export const mockApplicationBlue: Application = {
  id: 1,
  createdDate: '2025-05-21 07:57:12.782520',
  note: null,
  status: ApplicationStatus.Approved,
  statusResolvedDate: '2024-12-12',
  verifications: verificationsAwaiting,
  jsonValue: {
    name: 'application',
    type: 'Array',
    value: [{ ...personalData }, { ...applicationDetailsBlue }],
  },
}

export const mockApplicationGold: Application = {
  id: 1,
  createdDate: '2025-05-21 07:57:12.782520',
  note: null,
  status: ApplicationStatus.Approved,
  statusResolvedDate: '2024-12-12',
  verifications: verificationsAwaiting,
  jsonValue: {
    name: 'application',
    type: 'Array',
    value: [{ ...personalData }, { ...applicationDetailsGold }],
  },
}

export const mockApplicationWithoutAddress: Application = {
  id: 1,
  createdDate: '2025-05-21 07:57:12.782520',
  note: null,
  status: ApplicationStatus.Approved,
  statusResolvedDate: '2024-12-12',
  verifications: verificationsAwaiting,
  jsonValue: {
    name: 'application',
    type: 'Array',
    value: [
      {
        name: 'personalData',
        type: 'Array',
        value: [
          {
            name: 'forenames',
            type: 'String',
            value: 'John',
          },
          {
            name: 'surname',
            type: 'String',
            value: 'Doe',
          },
          {
            name: 'dateOfBirth',
            type: 'Date',
            value: '2000-02-04',
          },
          {
            name: 'telephone',
            type: 'String',
            value: '01722222222',
          },
          {
            name: 'emailAddress',
            type: 'String',
            value: 'john.doe@gmail.com',
          },
        ],
      },
      { ...applicationDetailsBlue },
    ],
  },
}

export const mockApplicationWithoutPersonalData: Application = {
  id: 1,
  createdDate: '2025-05-21 07:57:12.782520',
  note: null,
  status: ApplicationStatus.Approved,
  statusResolvedDate: '2024-12-12',
  verifications: verificationsAwaiting,
  jsonValue: {
    name: 'application',
    type: 'Array',
    value: [{ ...applicationDetailsBlue }],
  },
}

export const mockApplicationWithoutApplicationDetails: Application = {
  id: 1,
  createdDate: '2025-05-21 07:57:12.782520',
  note: null,
  status: ApplicationStatus.Approved,
  statusResolvedDate: '2024-12-12',
  verifications: verificationsAwaiting,
  jsonValue: {
    name: 'application',
    type: 'Array',
    value: [{ ...personalData }],
  },
}
