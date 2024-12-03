import { ProjectConfig } from '../getProjectConfig'

export const getCsvHeaders = (projectConfig: ProjectConfig): string[] => [
  projectConfig.card.nameColumnName,
  projectConfig.card.expiryColumnName,
  ...(projectConfig.card.extensionColumnNames.filter(Boolean) as string[]),
]
