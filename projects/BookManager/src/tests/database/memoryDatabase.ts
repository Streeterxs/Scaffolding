import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { testsLogger } from '../testsLogger';

const log = testsLogger.extend('mutationsRequests');

export const databaseTestModule = () => {

    const mongod = new MongoMemoryServer();

    /**
     * Connect to the in-memory database.
     */
    const connect = async () => {
        const uri = await mongod.getConnectionString();

        const mongooseOpts = {
            useNewUrlParser: true,
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000
        };

        await mongoose.connect(uri, mongooseOpts);
    }

    /**
     * Drop database, close the connection and stop mongod.
     */
    const closeDatabase = async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongod.stop();
    }

    /**
     * Remove all the data for all db collections.
     */
    const clearDatabase = async () => {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            if (key) {

                const collection = collections[key];
                await collection.deleteMany({});
            }
        }
    }

    return {
        connect,
        closeDatabase,
        clearDatabase
    };
};
