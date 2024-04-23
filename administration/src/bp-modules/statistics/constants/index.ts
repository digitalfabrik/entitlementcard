import { subYears } from 'date-fns'

import PlainDate from '../../../util/PlainDate'

export const defaultStartDate = PlainDate.fromLocalDate(subYears(new Date(), 1)).toString()
export const defaultEndDate = PlainDate.fromLocalDate(new Date()).toString()
