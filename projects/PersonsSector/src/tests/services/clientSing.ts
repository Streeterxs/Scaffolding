import { OAuthClient, IOAuthClient } from "../../modules/user/UserModel"
import { testsLogger } from "../testsLogger";

const log = testsLogger.extend('clientCreator');

export type createClientInput = {
    clientId: string;
    clientSecret: string;
    grants: string[];
};
export const createClient = async ({clientId, clientSecret, grants}: createClientInput) => {

    log('create client!!');

    const createdClient = new OAuthClient({
        clientId,
        clientSecret,
        grants
    });

    await createdClient.save();

    return createdClient;
};

class ClientMod {
    private _client: IOAuthClient;

    private static _instance: ClientMod;

    private _isFetching = false;

    constructor() {};

    static get instance() {

        if (!this._instance) {
            this._instance = new ClientMod();
        }
        return this._instance;
    };

    async getClient () {

        if (!this._client || !this._isFetching) {

            this._isFetching = true;

            this._client = await createClient({
                clientId: 'test',
                clientSecret: '123',
                grants: [
                    'password',
                    'refresh_token',
                    'client_credentials'
                ]
            });
            this._isFetching = false;
        }

        return this._client;
    }
};

export default ClientMod.instance;
