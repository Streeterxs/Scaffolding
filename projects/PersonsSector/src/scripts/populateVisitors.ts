import config from '../config';

import { User } from '../modules/user/UserModel';
import { permissions } from '../modules/user/UserPermissions.enum';
import { appLogger } from '../appLogger';
import { connectToDb } from '../database';

const log = appLogger.extend('scripts:populateVisitors');

log('test');
(async () => {

    await connectToDb();

    const visitorArray = require('./data/visitors.json');

    log('visitorArray.length: ', visitorArray.length);

    for (let index = 0; index < visitorArray.length; index++) {

        const visitor = visitorArray[index];
        const findedVisitor = await User.findOne({username: `${visitor.username}${index}`});

        log('findedVisitor: ', findedVisitor);

        if (!findedVisitor) {

            const newVisitor = new User({
                username: `${visitor.username}${index}`,
                email: `${index}${visitor.email}`,
                password: `${config.visitorsPassword}`,
                permission: permissions.visitor
            });

            log('newVisitor: ', newVisitor);

            const savedVisitor = await newVisitor.save((error, user) => {
                log('error: ', error);
                log('user: ', user);
            });

            log('savedVisitor: ', await savedVisitor);
        }
    }

    process.exit(0);
})();