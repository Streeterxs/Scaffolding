import koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import { GraphQLError } from 'graphql';
import graphqlHttp from 'koa-graphql';

import { appLogger } from './appLogger';
import Schema from './schema';

const log = appLogger.extend('entry');

const router = new Router();
const app = new koa();

app.use(logger());

export const graphqlSettings = async (req: any) => {

    return {
        graphql: true,
        schema: Schema,
        formatError: (error: GraphQLError) => {
            return {
                message: error.message,
                locations: error.locations,
                stack: error.stack
            }
        }
    }
};

export const graphqlServer = graphqlHttp(graphqlSettings);

router.all('/graphql', graphqlServer);

app.use(router.routes()).use(router.allowedMethods());

export default app;
