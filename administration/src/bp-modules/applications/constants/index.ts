export enum ApplicationStatus {
  fullyVerified,
  fullyRejected,
  withdrawed,
  ambiguous,
}

export type ApplicationStatusBarItemType = {
  title: string
  status?: ApplicationStatus
}

export const barItems: ApplicationStatusBarItemType[] = [
  {
    title: 'Alle Anträge',
    status: undefined,
  },
  {
    title: 'Akzeptiert',
    status: ApplicationStatus.fullyVerified,
  },
  {
    title: 'Abgelehnt',
    status: ApplicationStatus.fullyRejected,
  },
  {
    title: 'Zurückgezogen',
    status: ApplicationStatus.withdrawed,
  },
  {
    title: 'Offen',
    status: ApplicationStatus.ambiguous,
  },
]
