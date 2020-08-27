import app from './app';
import serverless from 'serverless-http';

const serverlessHandler = serverless(app);
export const serverlessHandlerFn = async (event: AWSLambda.APIGatewayProxyEvent, context: AWSLambda.Context) => {

    const result = await serverlessHandler(event, context);
    return result;
};
