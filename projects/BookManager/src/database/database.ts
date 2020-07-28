import mongoose from 'mongoose';
import config from '../config';

export const connectToDb = (): Promise<mongoose.Connection> => {

    return new Promise((resolve, reject) => {

        mongoose.Promise = global.Promise;

        mongoose.connection
            .on('error', error => reject(error))
            .on('close', () => console.log('Database closed'))
            .once('open', () => resolve(mongoose.connections[0]));

        mongoose.connect(config.db_url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
    });
};
