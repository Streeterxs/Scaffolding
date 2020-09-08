import { searchCredentialsByIdentifier, bucketRate, visitor } from "../middlewares";
import { Credentials } from "../modules/credentials/credentialsModel";
import { log as routesLogger } from "./routes";
import config from "../config";
import Router from "koa-router";

const log = routesLogger.extend('visitor');


export const visitorRouteMount = (path: string, router: Router<any, {}>) => {

    router.all(
        path,
        ...visitorRouteMiddleware()
    );
};

export const visitorRouteMiddleware = () => [

    async (context, next) => {

        try {

            log('context.request.body: ', context.request.body);
            if (!context.request.body.identifier) {

                throw new Error("Empty body visitor");
            }

            context.state.identifier = context.request.body.identifier;

            await next();
        } catch (err) {

            log('error: ', err);
            context.body = {
                error_message: 'No identifier in the body'
            }
        }
    },
    searchCredentialsByIdentifier(),
    bucketRate(),
    visitor(config.services.personssector.baseurl, config.services.personssector.routes[2]),

    async (context, next) => {

        const {email: username} = context.state.visitor;

        const headers = {...context.headers};
        delete headers['content-type'];

        const response = await fetch(`${config.services.personssector.baseurl}/${config.services.personssector.routes[0] /* example */}`, {
            headers: {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: `Basic ${Buffer.from(`${config.credentials.clientId}:${config.credentials.clientSecret}`).toString('base64')}`},
            body: `grant_type=password&username=${username}&password=${config.visitorsPassword}`,
            method: 'POST'
        });

        const token = await response.json();
        context.state.token = token;
        context.body = {
            accessToken: token.access_token,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            expiresIn: token.expires_in
        };
        await next();
    },

    async (context, next) => {

        const identifier = context.state.identifier;
        const { access_token, refresh_token, refreshTokenExpiresAt, accessTokenExpiresAt } = context.state.token;

        if (!context.state.credentials) {

            const newVisitor = new Credentials({
                identifier,
                accessToken: access_token,
                refreshToken: refresh_token,
                accessTokenExpiresAt,
                refreshTokenExpiresAt
            });

            await newVisitor.save();
            await next();
        } else {

            const findedVisitorCredentials = await Credentials.findOne({identifier});
            findedVisitorCredentials.accessToken = access_token;
            findedVisitorCredentials.refreshToken = refresh_token;
            findedVisitorCredentials.accessTokenExpiresAt = accessTokenExpiresAt;
            findedVisitorCredentials.refreshTokenExpiresAt = refreshTokenExpiresAt;

            await findedVisitorCredentials.save();
            await next();
        }

    }
];
