const getDateFromUTC = (dateString: string): Date => new Date(`${dateString}Z`)
export default getDateFromUTC
