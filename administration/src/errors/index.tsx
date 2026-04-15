/* eslint-disable @typescript-eslint/no-use-before-define */
import { fromBinary } from '@bufbuild/protobuf'
import React, { ReactElement } from 'react'
import { CombinedError } from 'urql'

import { CardInfoSchema } from '../card_pb'
import { base64ToUint8Array } from '../cards/base64'
import { CodeType, GraphQlExceptionCode } from '../graphql'
import i18next from '../translations/i18n'
import InvalidLink from './templates/InvalidLink'
import InvalidPasswordResetLink from './templates/InvalidPasswordResetLink'
import PasswordResetKeyExpired from './templates/PasswordResetKeyExpired'

export const messageFromGraphQlError = (
  error: CombinedError,
): {
  title: string
  description?: string | ReactElement
  retryable?: boolean
} => {
  const allCodesEqual = error.graphQLErrors.every(
    (value, index, array) => value.extensions!.code === array[0].extensions!.code,
  )

  return error.graphQLErrors.length < 1 || (error.graphQLErrors.length > 1 && !allCodesEqual)
    ? defaultErrorMap(error)
    : graphQlErrorMap(error.graphQLErrors[0].extensions)
}

export const defaultErrorMap = (
  error: CombinedError,
): {
  title: string
  description?: string | ReactElement
  retryable?: boolean
} => {
  if (error.message.includes('400')) {
    return { title: i18next.t('errors:invalidRequestFormat') }
  }
  if (error.message.includes('401')) {
    return { title: i18next.t('errors:notAuthorized') }
  }
  if (error.message.includes('403')) {
    return { title: i18next.t('errors:notAuthorized') }
  }
  if (error.message.includes('404')) {
    return { title: i18next.t('errors:pageNotFound') }
  }
  if (error.message.includes('500')) {
    return { title: i18next.t('errors:internalError'), retryable: true }
  }
  if (error.message.includes('501')) {
    return { title: i18next.t('errors:functionNotAvailable'), retryable: true }
  }
  return { title: i18next.t('errors:serverNotAvailable'), retryable: true }
}

export const graphQlErrorMap = (extensions?: {
  code?: GraphQlExceptionCode
  maxSize?: number
  encodedCardInfoBase64?: string
  codeType?: CodeType
  [key: string]: unknown
}): {
  title: string
  description?: string | ReactElement<{ extensions: Record<string, unknown> }>
} => {
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
    case GraphQlExceptionCode.FreinetDataTransferNotPermitted:
      return {
        title: i18next.t('errors:freinetDataTransferNotPermitted'),
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
      const cardInfo = fromBinary(
        CardInfoSchema,
        base64ToUint8Array(extensions.encodedCardInfoBase64!),
      )
      const codeTypeText =
        extensions.codeType === CodeType.Dynamic
          ? i18next.t('errors:invalidQrCodeSize:dynamicType')
          : i18next.t('errors:invalidQrCodeSize:staticType')
      return {
        title: i18next.t('errors:invalidQrCodeSize:title', {
          codeType: codeTypeText,
          fullName: cardInfo.fullName,
        }),
      }
    }
    case GraphQlExceptionCode.InvalidRole:
      return {
        title: i18next.t('errors:invalidRole'),
      }
    case GraphQlExceptionCode.InvalidApplicationStatus:
      return {
        title: i18next.t('errors:invalidApplicationStatus'),
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
    case GraphQlExceptionCode.RegionNotUnique:
      return {
        title: i18next.t('errors:regionNotUnique'),
      }
    case GraphQlExceptionCode.StoreAlreadyExists:
      return {
        title: i18next.t('errors:storeAlreadyExists'),
      }
    case GraphQlExceptionCode.StoreNotFound:
      return {
        title: i18next.t('errors:storeNotFound'),
      }
    case GraphQlExceptionCode.InvalidApplicationConfirmationNoteSize:
      return {
        title: i18next.t('errors:invalidApplicationConfirmationNoteSize', {
          maxSize: extensions.maxSize,
        }),
      }
    case GraphQlExceptionCode.FreinetFoundMultiplePersons: {
      return {
        title: i18next.t('errors:freinetMultiplePersonError'),
      }
    }
    case GraphQlExceptionCode.ApplicationDataIncomplete: {
      return {
        title: i18next.t('errors:applicationDataIncompleteException'),
      }
    }
    case GraphQlExceptionCode.FreinetCardDataInvalid: {
      return {
        title: i18next.t('errors:freinetCardDataInvalid'),
      }
    }
    case GraphQlExceptionCode.FreinetPersonDataInvalid: {
      return {
        title: i18next.t('errors:freinetPersonDataInvalid'),
      }
    }
    case GraphQlExceptionCode.FreinetTransferFailed: {
      return {
        title: i18next.t('errors:freinetTransferFailed'),
      }
    }
    case GraphQlExceptionCode.NotImplemented: {
      return {
        title: i18next.t('errors:functionNotAvailable'),
      }
    }
    case GraphQlExceptionCode.ProjectNotFound: {
      return {
        title: i18next.t('errors:projectNotFound'),
      }
    }
    case GraphQlExceptionCode.Forbidden:
    case GraphQlExceptionCode.Unauthorized:
      return {
        title: i18next.t('errors:notAuthorized'),
      }
  }
}
