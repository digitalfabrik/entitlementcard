import { type Locator } from '@playwright/test'

/**
 * Fills a date picker of the administration with a date in the format dd.MM.yyyy.
 * The date pickers consist of one spin button per date section (day, month, year),
 * so the date is typed starting at the day section.
 */
export const fillDatePicker = async (datePicker: Locator, date: string): Promise<void> => {
  await datePicker.getByRole('spinbutton', { name: 'Tag' }).click()
  await datePicker.page().keyboard.type(date.replaceAll('.', ''))
}
