import pkg from '../../package.json'

export const VERIFICATION_EMAIL_SUBJECT: string = `Account Verification Code for ${pkg.name}`
export const RESET_PASSWORD_EMAIL_SUBJECT: string = `Reset Account Password for ${pkg.name}`
export const REFRESH_TOKEN='refreshToken'
export const ACCESS_TOKEN='accessToken'

export const ACCESSTOKEN_EXPIRED_MSG='Access token expired.'