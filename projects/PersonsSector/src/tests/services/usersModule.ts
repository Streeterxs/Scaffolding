import { User, IUser } from "../../modules/user/UserModel";
import { permissions } from "../../modules/user/UserPermissions.enum";
import { testsLogger } from "../testsLogger";

const log = testsLogger.extend('userModule');

export type userInput = {
    username: string;
    email: string;
    password: string;
};

export const adminUser = async ({username, email, password}: userInput) => {

    const userAdmin = new User({username, email, password, permission: permissions.admnistrator});
    await userAdmin.save();

    return userAdmin;
};

export const managerUser = async ({username, email, password}: userInput) => {

    const userAdmin = new User({username, email, password, permission: permissions.manager});
    await userAdmin.save();

    return userAdmin;
};

export const commonUser = async ({username, email, password}: userInput) => {

    const userAdmin = new User({username, email, password, permission: permissions.common});
    await userAdmin.save();

    return userAdmin;
};

export const visitorUser = async ({username, email, password}: userInput) => {

    const userAdmin = new User({username, email, password, permission: permissions.visitor});
    await userAdmin.save();

    return userAdmin;
};

class UsersModule {

    private _admin: IUser;
    private _manager: IUser;
    private _common: IUser;
    private _visitor: IUser;

    private static _instance: UsersModule;

    private _isFetching = {
        admin: false,
        manager: false,
        common: false,
        visitor: false
    };

    constructor() {};

    static get instance() {

        if (!this._instance) {
            this._instance = new UsersModule();
        }
        return this._instance;
    };

    async getAdmin() {

        if (!this._admin && !this._isFetching.admin) {

            this._isFetching.admin = true;
            this._admin = await adminUser({
                username: 'admin',
                email: 'admin@mail.com',
                password: '123'
            });
            this._isFetching.admin = false;
        }

        return this._admin;
    }

    async getManager() {

        if (!this._manager && !this._isFetching.manager) {

            this._isFetching.manager = true;
            this._manager = await managerUser({
                username: 'manager',
                email: 'manager@mail.com',
                password: '123'
            });
            this._isFetching.manager = false;
        }

        return this._manager;
    }

    async getCommon() {

        if (!this._common && !this._isFetching.common) {

            this._isFetching.common = true;
            this._common = await commonUser({
                username: 'common',
                email: 'common@mail.com',
                password: '123'
            });
            this._isFetching.common = false;
        }

        return this._common;
    }

    async getVisitor() {

        if (!this._visitor && !this._isFetching.visitor) {

            this._isFetching.visitor = true;
            this._visitor = await visitorUser({
                username: 'visitor',
                email: 'visitor@mail.com',
                password: '123'
            });
            this._isFetching.visitor = false;
        }

        return this._visitor;
    }

    reset() {

        this._admin = undefined;
        this._manager = undefined;
        this._common = undefined;
        this._visitor = undefined;
    }
};

export default UsersModule.instance;
