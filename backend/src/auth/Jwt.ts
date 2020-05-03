import { JwtPayload } from './JwtPayload'
import { JwtHeader } from 'jsonwebtoken'

/**
 * Interface representing a JWT token
 *
 * @author: Ulhas Pai
 */
export interface Jwt {
  header: JwtHeader
  payload: JwtPayload
}
