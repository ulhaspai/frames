import { Jwk, SigningKey } from "./Jwk";
import Axios, { AxiosResponse } from "axios";
import { JwtPayload } from "./JwtPayload";
import { Jwt } from "./Jwt";
import { verify } from "jsonwebtoken";
import { JwtClient } from "./JwtClient";

/**
 * JWKS URL used for verifying the JWT token signature
 * To get this URL go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
 */
const JWKS_URL = process.env.JWKS_URL

// cached signing keys from the JWKS_URL
let SIGNING_KEYS: Array<SigningKey> = null

/**
 * JWK client that provides a way to verify a auth header using the RS256 algorithm
 * and Auth0's Json Web Key (JWK)
 * <pre>
 * Usage:
 *     const jwkClient = new JwkClient()
 *     await client.verifyToken(authorizationToken)
 * </pre>
 *
 * @author: Ulhas Pai
 */
export class JwkClient {

    /**
     * This should be implemented similarly to how it was implemented for the exercise for the lesson 5
     * For RS256, see auth0 documentation provided here: https://auth0.com/blog/navigating-rs256-and-jwks/
     *
     * @param authHeader the auth header from the request
     */
    static async verifyToken(authHeader: string): Promise<JwtPayload> {
        // Extract the JWT from the request's authorization header.
        const token = JwtClient.getToken(authHeader)

        // Decode the JWT and grab the kid property from the header.
        const jwt: Jwt = JwtClient.decodeToken(token) as Jwt

        // If JWT token cannot be decoded fully, then throw an error
        if (!jwt || !jwt.header || !jwt.payload) {
            throw new Error ("Invalid JWT token")
        }
        // Find the signing key in the filtered JWKS with a matching kid property.
        const kid = jwt.header.kid

        // Retrieve the JWKS and filter for potential signing keys.
        const signingKey = await JwkClient.getSigningKey(kid)

        // Ensure the JWT contains the expected audience, issuer, expiration, etc.
        verify(token, signingKey.publicKey, { algorithms : ["RS256"] })

        // if verify does not throw an error, then the user is authenticated
        return Promise.resolve(jwt.payload)
    }

    /**
     * for an input kid, fetches the corresponding signing key
     *
     * @param kid the input kid from the jwt header
     */
    private static async getSigningKey(kid) : Promise<SigningKey> {
        if (!SIGNING_KEYS) {
            SIGNING_KEYS = await JwkClient.getSigningKeys()
        }
        const signingKey: SigningKey = SIGNING_KEYS.find(key => key.kid === kid)
        if (!signingKey) {
            throw new Error(`Unable to find a signing key that matches '${kid}'`)
        }
        return Promise.resolve(signingKey)
    }

    /**
     * fetch the json web keys and converts all the valid keys to a signing key object
     */
    private static async getSigningKeys() : Promise<Array<SigningKey>> {
        return JwkClient.getJwks().then(
            (jwks) => {
                if (!jwks || !jwks.length) {
                    throw new Error('The JWKS endpoint did not contain any keys')
                }
                const signingKeys = jwks
                    .filter(jwk => jwk.use === 'sig'                            // JWK property `use` determines the JWK is for signing
                        && jwk.kty === 'RSA'                                    // We are only supporting RSA (RS256)
                        && jwk.kid                                              // The `kid` must be present to be useful for later
                        && ((jwk.x5c && jwk.x5c.length) || (jwk.n && jwk.e))    // Has useful public keys
                    ).map(jwk => {
                        return {
                            kid: jwk.kid,
                            nbf: undefined,
                            publicKey: JwkClient.certToPEM(jwk.x5c[0])    // Using the x5c property build a certificate to be used to verify the JWT signature
                        }
                    })

                // If at least one signing key doesn't exist we have a problem... Kaboom.
                if (!signingKeys.length) {
                    throw new Error('The JWKS endpoint did not contain any signing keys')
                }

                // Returns all of the available signing keys.
                return signingKeys
            },
            reason => reason
        )
    }

    /**
     * fetches all the json web keys from the configured jwksUrl
     */
    private static async getJwks() : Promise<Array<Jwk>> {
        return Axios.get(JWKS_URL).then(
            (k: AxiosResponse) => k.data.keys as Array<Jwk>,
            reason => reason
        )
    }

    /**
     * builds a certificate from the x5c in a Json Web Key
     *
     * @param x5c x5c value from the Json web key
     */
    private static certToPEM(x5c: string): string {
        x5c = x5c.match(/.{1,64}/g).join('\n')
        return `-----BEGIN CERTIFICATE-----\n${x5c}\n-----END CERTIFICATE-----\n`
    }

}
