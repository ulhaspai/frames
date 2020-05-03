/**
 * JSON Web Key. This is used to validate a user using their certificates and RS256 algorithm
 *
 * @author: Ulhas Pai
 */
export interface Jwk {
    alg: string;
    kty: string;
    use: string;
    n: string;
    e: string;
    kid: string;
    x5t: string;
    x5c: Array<string>;
}

/**
 * A signing key, this object is produced using a Jwk
 * The kid param is used to match and select a publicKey for the input user's JWT
 *
 * @author: Ulhas Pai
 */
export interface SigningKey {
    kid: string
    nbf: string
    publicKey: string
}
