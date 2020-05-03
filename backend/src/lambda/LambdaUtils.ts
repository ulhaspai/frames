import { APIGatewayProxyEvent } from "aws-lambda";
import { JwtClient } from "../auth/JwtClient";

/**
 * Utility class that provides common lambda functions
 *
 * @author: Ulhas Pai
 */
export class LambdaUtils {

    /**
     * Get a user id from an API Gateway event
     *
     * @param event
     * @return a user id from a JWT token
     */
    static getUserId(event: APIGatewayProxyEvent): string {
        const authorization = event.headers.Authorization
        return JwtClient.decodeAuthHeaderUserId(authorization)
    }
}
