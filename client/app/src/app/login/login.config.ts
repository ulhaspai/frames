/**
 * The configuration for your backend Auth0 application
 */
export const authConfig = {
    domain: "AUTH_DOMAIN",
    client_id: "AUTH_APP_CLIENT_ID",
    redirect_uri: "http://localhost:4200/dashboard",
    returnTo: "http://localhost:4200/login"
}

