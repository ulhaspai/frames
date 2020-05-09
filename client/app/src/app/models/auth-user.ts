/**
 * An Auth0 user object
 *
 * @author Ulhas Pai
 */
export class Auth0User {
    token: string
    nickname: string
    name: string
    picture: string
    updatedAt: string
    email: string
    emailVerified: boolean
    iss: string

    // this is the auth0 userId
    sub: string
    aud: string
    iat: number
    exp: number
    nonce: string
}
