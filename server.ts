/**
 * server
 * Created by dcorns on 1/21/21
 * Copyright © 2021 Dale Corns
 */
import * as http from 'http';
import {MongoMemoryServer} from 'mongodb-memory-server';
import sendResponse from "./sendResponse";
import validateRequest from './validateRequest';
import processData from './processData';
import * as csvConfig from './csv-config.json';

let dbURI = '';
const startMongo = async () => {
    const mongo = new MongoMemoryServer({
        instance: {
            dbName: 'providerData',
            port: 27017
        }
    });
    dbURI = await mongo.getUri();
    console.dir(mongo.getInstanceInfo());
    return dbURI;
}

const server = http.createServer( (req: http.IncomingMessage, res: http.ServerResponse) => {
    const providerNames = Object.keys(csvConfig);
    const validationData = validateRequest(req, providerNames);
    if (validationData.code === 200) {
        validationData.headers = {'Content-Type': 'text/plain'};
        if (req.method === 'POST') {
            processData(req, csvConfig[req.url], dbURI, res);

        } else {
            validationData.message = 'Use Post Method';
            sendResponse(res, validationData);
        }
    } else {
        sendResponse(res, validationData);
    }
});

const start = async (): Promise<void> => {
    await startMongo();
    server.listen(3000);
}

start()
    .catch(() => {

    });
