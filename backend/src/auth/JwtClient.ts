import { decode } from "jsonwebtoken"
import { Jwt } from "./Jwt"

/**
 * JWT client class providing functionalities for a user's JWT object
 *
 * @author: Ulhas Pai
 */
export class JwtClient {

    /**
     * gets the token from the auth header
     *
     * @param authHeader the auth header containing the json web token
     */
    static getToken(authHeader: string): string {
        if (!authHeader) throw new Error('No authentication header')

        if (!authHeader.toLowerCase().startsWith('bearer '))
            throw new Error('Invalid authentication header')

        const split = authHeader.split(' ')
        return split[1]
    }

    /**
     * given a JWT token string, decodes the string
     *
     * @param token the encoded JWT token string
     */
    static decodeToken(token: string): Jwt {
        // Decode the JWT and grab the kid property from the header.
        return decode(token, {complete: true}) as Jwt
    }

    /**
     * given an authorization header, find the JWT token from the header and decodes the header
     * into a decoded {@link Jwt} object
     *
     * <pre>
     * e.g. authorization header
     *     Bearer sdibiwuevnkdjbvoernodvn
     * </pre>
     *
     * @param authHeader the authorization header to be decoded
     */
    static decodeAuthHeader(authHeader: string): Jwt {
        const token = JwtClient.getToken(authHeader)
        return this.decodeToken(token)
    }

    /**
     * given an authorization header, finds the JWT token from the header and decodes the header into a
     * decoded {@link Jwt} object and returns the userId for the user (sub) from the {@link Jwt} object
     *
     * <pre>
     * e.g. authorization header
     *     Bearer sdibiwuevnkdjbvoernodvn
     * </pre>
     *
     * @param authHeader the authorization header to be decoded
     */
    static decodeAuthHeaderUserId(authHeader: string): string {
        const jwt: Jwt = JwtClient.decodeAuthHeader(authHeader)
        return jwt.payload.sub
    }

    /**
     * given an authorization header, finds the JWT token from the header and decodes the header into a
     * decoded {@link Jwt} object and returns the email for the user (email) from the {@link Jwt} object
     *
     * <pre>
     * e.g. authorization header
     *     Bearer sdibiwuevnkdjbvoernodvn
     * </pre>
     *
     * @param authHeader the authorization header to be decoded
     */
    static decodeAuthHeaderUserEmail(authHeader: string): string {
        const jwt: Jwt = JwtClient.decodeAuthHeader(authHeader)
        return jwt.payload.email
    }

}
