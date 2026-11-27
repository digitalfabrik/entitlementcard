export type ApplicantName = { forenames: string; surname: string }

/** Name as shown in the list of applications */
export const displayName = ({ forenames, surname }: ApplicantName): string =>
  `${surname}, ${forenames}`

/**
 * Applicants of the applications in the dev data (backend/src/dev/sql/applications_e2e.sql), ordered by id.
 * The other applicants have different names, so the tests can tell them apart.
 */
export const devDataApplicants: ApplicantName[] = [
  { forenames: 'Lena', surname: 'Schmidt' },
  { forenames: 'Jonas', surname: 'Weber' },
  { forenames: 'Sophie', surname: 'Wagner' },
  { forenames: 'Lukas', surname: 'Becker' },
  { forenames: 'Marie', surname: 'Schulz' },
  { forenames: 'Felix', surname: 'Koch' },
  { forenames: 'Hannah', surname: 'Richter' },
  { forenames: 'Paul', surname: 'Klein' },
  { forenames: 'Emma', surname: 'Wolf' },
  { forenames: 'Leon', surname: 'Schröder' },
]

/** Contact person of the organization, who confirms the voluntary work */
export const contactPersonName = 'Petra Hoffmann'

/** Applicant of the applications filled in by 01_create_applications */
export const formApplicant: ApplicantName = { forenames: 'Julia', surname: 'Meyer' }

/** Applicant of the application rejected and deleted by 03_delete_applications */
export const deletedApplicant: ApplicantName = { forenames: 'Tobias', surname: 'Fischer' }
