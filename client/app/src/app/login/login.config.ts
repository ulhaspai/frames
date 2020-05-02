/**
 * The configuration for your backend Auth0 application
 */
import { localAuth0Config } from "./temp.auth0.config";

export const authConfig = {
    domain: localAuth0Config.domain,
    client_id: localAuth0Config.client_id,
    redirect_uri: "http://localhost:4200/dashboard",
    returnTo: "http://localhost:4200/login"
}

