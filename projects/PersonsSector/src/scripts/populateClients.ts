import { OAuthClient } from "../modules/user/UserModel";
import { clients } from '../config';
import { appLogger } from "../appLogger";
import { connectToDb } from "../database";

const log = appLogger.extend('scripts:populateClients');

(async () => {

    await connectToDb();

    for (const client of clients) {

        log('client: ', client);

        const oAuthClientFinded = await OAuthClient.findOne({clientId: client.id, clientSecret: client.secret});

        if (!oAuthClientFinded) {

            const oAuthClient = new OAuthClient({
                clientId: client.id,
                clientSecret: client.secret,
                grants: [
                    'password',
                    'refresh_token',
                    'client_credentials',
                    'authorization_code'
                ]
            });

            const clientCreated = await oAuthClient.save({});

            log('clientCreated: ', clientCreated);
        } else {

            log('client already created');
        }

    }

    process.exit(0);

})();