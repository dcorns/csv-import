/**
 * storeInDb
 * Created by dcorns on 1/31/21
 * Copyright © 2021 Dale Corns
 */
import {MongoClient} from 'mongodb';

const storeInDb = (docs, uri, databaseName, providerName, cb) => {
    const client = new MongoClient(uri);

    async function run() {
        try {
            const options = { ordered: true };
            await client.connect();
            const database = client.db(databaseName);
            const collection = database.collection(providerName);
            const result = await collection.insertMany(docs, options);
            console.log(`Documents added: ${result.insertedCount}`);
            const cursor = collection.find();
            const cursorCount = await cursor.count();
            console.log(`Total Documents: ${cursorCount}`);
        } finally {
            await client.close();
            cb();
        }
    }

    run().catch(console.dir);

}
export default storeInDb