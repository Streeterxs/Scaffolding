import { User } from "../modules/user/UserModel";
import { admin } from '../config';
import { connectToDb } from "../database";
import { permissions } from "../modules/user/UserPermissions.enum";

import { appLogger } from "../appLogger";

const log = appLogger.extend('scripts:createAdmin');

(async () => {

    await connectToDb();

    try {

        const userFinded = await User.findOne({email: admin.email});

        if (!userFinded) {

            const newUser = new User({
                email: admin.email,
                password: admin.password,
                permission: permissions.admnistrator
            });

            log('newUser: ', newUser);

            const userSaved = await newUser.save();

            log('userSaved: ', userSaved);
        } else {

            log('admin already created');
        }
    } catch(err) {
        log('error: ', err);
    }

    process.exit(0);

})();
