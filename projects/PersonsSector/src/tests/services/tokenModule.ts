import request from 'supertest';

import { IUser } from "../../modules/user/UserModel"
import { testsLogger } from "../testsLogger";
import userModule from './usersModule';
import clientModule  from './clientSing';
import { app } from '../..';

const log = testsLogger.extend('tokenModule');

const tokenPasswordRequestFn = async ({grant_type, username, password}) => {

    const clientAwaited = await clientModule.getClient();
    log('tokenPasswordRequestFn called');
    return request(app.callback()).post('/token').set({
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientAwaited.clientId}:${(clientAwaited.clientSecret)}`).toString('base64')}`
    }).send(`grant_type=${grant_type}&username=${username}&password=${password}`);
};

type userToken = {
    user: IUser
    token: {
        access_token: string;
        refresh_Token: string;
        expires_in: number;
        token_type: string
    }
};
class TokenModule {
    private _adminToken: userToken;
    private _managerToken: userToken;
    private _commonToken: userToken;
    private _visitorToken: userToken;

    private static _instance: TokenModule;

    private _isFetching = {
        adminToken: false,
        managerToken: false,
        commonToken: false,
        visitorToken: false
    };

    constructor() {};

    static get instance() {

        if (!this._instance) {

            this._instance = new TokenModule();
        }

        return this._instance;
    }

    async getAdminToken() {

        if (!this._adminToken && !this._isFetching.adminToken) {

            log('getAdminToken !adminToken');
            this._isFetching.adminToken = true;
            const tempUser = await userModule.getAdmin();
            const tempToken = (await tokenPasswordRequestFn({grant_type: 'password', username: tempUser.email, password: '123'})).body;

            this._adminToken = {user: tempUser, token: tempToken};
            this._isFetching.adminToken = false;
        }

        log('getAdminToken adminToken.token: ', this._adminToken.token);
        return this._adminToken;
    };

    async getManagerToken() {

        if (!this._managerToken && !this._isFetching.managerToken) {

            log('getManagerToken !managerToken');
            this._isFetching.managerToken = true;
            const tempUser = await userModule.getManager();
            const tempToken = (await tokenPasswordRequestFn({grant_type: 'password', username: tempUser.email, password: '123'})).body;

            this._managerToken = {user: tempUser, token: tempToken};
            this._isFetching.managerToken = false;
        }

        log('getManagerToken managerToken.token: ', this._managerToken.token);
        return this._managerToken;
    };

    async getCommonToken() {

        if (!this._commonToken && !this._isFetching.commonToken) {

            log('getCommonToken !commonToken');
            this._isFetching.commonToken = true;
            const tempUser = await userModule.getCommon();
            const tempToken = (await tokenPasswordRequestFn({grant_type: 'password', username: tempUser.email, password: '123'})).body;

            this._commonToken = {user: tempUser, token: tempToken};
            this._isFetching.commonToken = false;
        }

        log('getCommonToken commonToken.token: ', this._commonToken.token);
        return this._commonToken;
    };

    async getVisitorToken() {

        if (!this._visitorToken && !this._isFetching.visitorToken) {

            log('getVisitorToken !visitorToken');
            this._isFetching.visitorToken = true;
            const tempUser = await userModule.getVisitor();
            const tempToken = (await tokenPasswordRequestFn({grant_type: 'password', username: tempUser.email, password: '123'})).body;

            this._visitorToken = {user: tempUser, token: tempToken};
            this._isFetching.visitorToken = false;
        }

        log('getVisitorToken visitorToken.token: ', this._visitorToken.token);
        return this._visitorToken;
    };

    reset () {

        this._adminToken = undefined;
        this._managerToken = undefined;
        this._commonToken = undefined;
        this._visitorToken = undefined;
        userModule.reset();
    }
};

export default TokenModule.instance;
