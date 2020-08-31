import Koa from 'koa';
import logger from 'koa-logger';
import cors from 'kcors';
import bodyparser from 'koa-bodyparser';
import { GraphQLError } from 'graphql';
import graphqlHttp from 'koa-graphql';

import { appLogger } from './appLogger';
import Schema from './schema';
import router from './routes';

const log = appLogger.extend('entry');
const app = new Koa();

app.use(logger());
app.use(cors());
app.use(bodyparser());

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

export const appRouter = router(graphqlServer);

app.use(appRouter.routes()).use(appRouter.allowedMethods());

export default app;
