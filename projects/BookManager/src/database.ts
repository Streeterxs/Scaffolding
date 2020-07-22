import mongoose from 'mongoose';
import config from './config';

export const connectToDb = () => {

    return new Promise((resolve, reject) => {

        mongoose.Promise = global.Promise;

        mongoose.connection
            .on('error', error => reject(error))
            .on('close', () => console.log('Database closed'))
            .once('open', () => resolve());

        mongoose.connect(config.db_url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
    });
};
