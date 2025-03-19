import React, { ReactElement } from 'react'

import { CardInfo } from '../generated/card_pb'
import { CodeType, GraphQlExceptionCode } from '../generated/graphql'
import i18next from '../i18n'
import { base64ToUint8Array } from '../util/base64'
import InvalidLink from './templates/InvalidLink'
import InvalidPasswordResetLink from './templates/InvalidPasswordResetLink'
import PasswordResetKeyExpired from './templates/PasswordResetKeyExpired'

type GraphQLErrorMessage = {
  title: string
  description?: string | ReactElement<{ extensions: Record<string, unknown> }>
}

type ErrorExtensions = {
  code?: GraphQlExceptionCode
  maxSize?: number
  encodedCardInfoBase64?: string
  codeType?: CodeType
  [key: string]: unknown
}

const graphQlErrorMap = (extensions?: ErrorExtensions): GraphQLErrorMessage => {
  const defaultError = { title: i18next.t('errors:unknown') }

  if (!extensions || extensions.code === undefined) {
    return defaultError
  }
  switch (extensions.code) {
    case GraphQlExceptionCode.EmailAlreadyExists:
      return {
        title: i18next.t('errors:mailAddressAlreadyUsed'),
      }
    case GraphQlExceptionCode.FreinetAgencyNotFound:
      return {
        title: i18next.t('errors:freinetAgencyNotFound'),
      }
    case GraphQlExceptionCode.InvalidLink:
      return {
        title: i18next.t('errors:invalidLink'),
        description: <InvalidLink />,
      }
    case GraphQlExceptionCode.InvalidCardHash:
      return {
        title: i18next.t('errors:invalidFormat'),
      }
    case GraphQlExceptionCode.InvalidCodeType:
      return {
        title: i18next.t('errors:invalidCodeType'),
      }
    case GraphQlExceptionCode.InvalidCredentials:
      return {
        title: i18next.t('errors:invalidCredentials'),
      }
    case GraphQlExceptionCode.InvalidFileType:
      return {
        title: i18next.t('errors:invalidFileType'),
      }
    case GraphQlExceptionCode.InvalidInput:
      return {
        title: i18next.t('errors:invalidInput'),
      }
    case GraphQlExceptionCode.InvalidFileSize:
      return {
        title: i18next.t('errors:invalidFileSize'),
      }
    case GraphQlExceptionCode.InvalidDataPolicySize:
      return {
        title: i18next.t('errors:invalidDataPolicySize', { maxSize: extensions.maxSize }),
      }
    case GraphQlExceptionCode.InvalidJson:
      return {
        title: i18next.t('errors:invalidJson'),
      }
    case GraphQlExceptionCode.InvalidNoteSize:
      return {
        title: i18next.t('errors:invalidNoteSize', { maxSize: extensions.maxSize }),
      }
    case GraphQlExceptionCode.InvalidPassword:
      return {
        title: i18next.t('errors:invalidPassword'),
      }
    case GraphQlExceptionCode.InvalidPasswordResetLink:
      return {
        title: i18next.t('errors:invalidPasswordResetLink'),
        description: <InvalidPasswordResetLink />,
      }
    case GraphQlExceptionCode.InvalidQrCodeSize: {
      const cardInfo = CardInfo.fromBinary(base64ToUint8Array(extensions.encodedCardInfoBase64!))
      const codeTypeText =
        extensions.codeType === CodeType.Dynamic
          ? i18next.t('errors:invalidQrCodeSize:dynamicType')
          : i18next.t('errors:invalidQrCodeSize:staticType')
      return {
        title: i18next.t('errors:invalidQrCodeSize:title', { codeType: codeTypeText, fullName: cardInfo.fullName }),
      }
    }
    case GraphQlExceptionCode.InvalidRole:
      return {
        title: i18next.t('errors:invalidRole'),
      }
    case GraphQlExceptionCode.UserEntitlementNotFound:
      return {
        title: i18next.t('errors:entitlementNotFound'),
      }
    case GraphQlExceptionCode.UserEntitlementExpired:
      return {
        title: i18next.t('errors:entitlementExpired'),
      }
    case GraphQlExceptionCode.MailNotSent:
      return {
        title: i18next.t('errors:mailNotSend', { recipient: extensions.recipient }),
      }
    case GraphQlExceptionCode.PasswordResetKeyExpired:
      return {
        title: i18next.t('errors:passwordResetKeyExpired'),
        description: <PasswordResetKeyExpired />,
      }
    case GraphQlExceptionCode.RegionNotFound:
      return {
        title: i18next.t('errors:regionNotFound'),
      }
    case GraphQlExceptionCode.RegionNotActivatedForApplication:
      return {
        title: i18next.t('errors:regionNotActivatedForApplication'),
      }
    case GraphQlExceptionCode.RegionNotActivatedCardConfirmationMail:
      return {
        title: i18next.t('errors:regionNotActivatedForConfirmationMail'),
      }
    default:
      return {
        title: defaultError.title,
      }
  }
}

export default graphQlErrorMap
