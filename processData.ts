/**
 * processData
 * Created by dcorns on 1/22/21
 * Copyright © 2021 Dale Corns
 */
import {Transform, TransformCallback} from 'stream';
import {createWriteStream} from 'fs';
import {IncomingMessage, ServerResponse} from 'http';
import {ProviderConfig} from './app-types';
import completeOrphanRow from './completeOrphanRow';
import sendResponse from './sendResponse';

// @ts-ignore
const processData = (req: IncomingMessage, providerConfig: ProviderConfig, dbURI: string, res: ServerResponse) => {
    console.log(dbURI);
    console.log(req.url);
    //todo Assumption: Overwrite existing file, file format json
    const filePath = `provider-files/${providerConfig.rootName}.json`;
    const fileStream = createWriteStream(filePath);
    let firstRead = true;
    const propertyNames = []
    let orphanRow = {};
    let useOrphanRow = false;
    let addTopRow = false;
    let topRow = {};
    let count = 0;
    let data;

    const setOrphanRow = (partialRow) => {
        orphanRow = {...partialRow};
        useOrphanRow = true;
    };

    const configStream = new Transform({
        transform(chunk: any, encoding: BufferEncoding, cb: TransformCallback) {
            let raw = chunk.toString();
            let documents = [];
            if (raw.includes(providerConfig.header)) {
                raw = raw.slice(raw.indexOf(providerConfig.header));
            }

            const rows = raw.split(/\r\n|\r|\n/g);

            if (firstRead) {
                const r = rows[0].split(',');
                providerConfig.validColumns.forEach((c) => {
                    propertyNames.push(r[c]);
                });
                rows.shift();
                firstRead = false;
            }
            if (useOrphanRow) {
                const remainingRow = rows.shift().split(',');
                topRow = completeOrphanRow(orphanRow, providerConfig, propertyNames, remainingRow);
                addTopRow = true;
                orphanRow = {};
                useOrphanRow = false;
            }

            documents = rows.map((r) => {
                const doc = {};
                const rArray = r.split(',');
                if (rArray[providerConfig.validColumns[0]]) {
                    doc[propertyNames[0]] = rArray[providerConfig.validColumns[0]];
                } else {
                    setOrphanRow(doc);
                    return;
                    ;
                }

                if (rArray[providerConfig.validColumns[1]]) {
                    doc[propertyNames[1]] = rArray[providerConfig.validColumns[1]];
                } else {
                    setOrphanRow(doc);
                    return;
                }

                if (propertyNames[2]) {
                    if (rArray[providerConfig.validColumns[2]]) {
                        doc[propertyNames[2]] = rArray[providerConfig.validColumns[2]];
                    } else {
                        setOrphanRow(doc);
                        return;
                    }
                } else {
                    //end of property list
                    return doc;
                }
                if (propertyNames[3]) {
                    if (rArray[providerConfig.validColumns[3]]) {
                        doc[propertyNames[3]] = rArray[providerConfig.validColumns[3]];
                    } else {
                        setOrphanRow(doc);
                        return;
                    }
                } else {
                    //end of property list
                    return doc;
                }
                if (propertyNames[4]) {
                    if (rArray[providerConfig.validColumns[4]]) {
                        doc[propertyNames[4]] = rArray[providerConfig.validColumns[4]];
                    } else {
                        setOrphanRow(doc);
                        return;
                    }
                } else {
                    //end of property list
                    return doc;
                }
                if (propertyNames[5]) {
                    if (rArray[providerConfig.validColumns[5]]) {
                        doc[propertyNames[5]] = rArray[providerConfig.validColumns[5]];
                    } else {
                        setOrphanRow(doc);
                        return;
                    }
                } else {
                    //end of property list
                    return doc;
                }
                if (propertyNames[6]) {
                    if (rArray[providerConfig.validColumns[6]]) {
                        doc[propertyNames[6]] = rArray[providerConfig.validColumns[6]];
                    } else {
                        setOrphanRow(doc);
                        return;
                    }
                } else {
                    //end of property list
                    return doc;
                }
                if (propertyNames[7]) {
                    if (rArray[providerConfig.validColumns[7]]) {
                        doc[propertyNames[7]] = rArray[providerConfig.validColumns[7]];
                    } else {
                        setOrphanRow(doc);
                        return;
                    }
                } else {
                    //end of property list
                    return doc;
                }
                if (propertyNames[8]) {
                    if (rArray[providerConfig.validColumns[8]]) {
                        doc[propertyNames[8]] = rArray[providerConfig.validColumns[8]];
                    } else {
                        setOrphanRow(doc);
                        return;
                    }
                } else {
                    //end of property list
                    return doc;
                }
                if (propertyNames[9]) {
                    if (rArray[providerConfig.validColumns[9]]) {
                        doc[propertyNames[9]] = rArray[providerConfig.validColumns[9]];
                    } else {
                        setOrphanRow(doc);
                        return;
                    }
                } else {
                    //end of property list
                    return doc;
                }
                return doc;
            });

            if (addTopRow) {
                documents.unshift(topRow);
                addTopRow = false;
            }
            if (useOrphanRow) {
                documents.length--;
            }
            if (documents[documents.length - 1] === undefined) {
                documents.length = documents.length - 1;
            }

            const rawResult = JSON.stringify(documents);
            const result = rawResult.slice(0, -1) + ','
            data = result;
            this.push(result);
            cb();

        },
        flush(cb: TransformCallback) {
            const result = data.slice(0, -1) + ']';
            this.push(result);
            cb();
        }
    });


    const documentStream = new Transform({
        transform(chunk: any, encoding: BufferEncoding, cb: TransformCallback) {
            let raw = chunk.toString();

            count++;
            if (count < 2) {

            }


            // if(count < 2){
            //
            //    //let x = raw.split(/\r\n|\r|\n/g);
            //    console.log(JSON.parse(raw));
            //     count++;
            // }

            cb();
        }
    });


    req.pipe(configStream)
        .pipe(fileStream)
        .on('error', (err) => {
            console.error(err);
            sendResponse(res, {
                headers: {'Content-Type': 'text/plain'},
                code: 500,
                message: 'Data Load Failed'
            });
        })
        .on('close', () => {
            sendResponse(res, {
                headers: {'Content-Type': 'text/plain'},
                code: 200,
                message: 'Success'
            });
        });

}
export default processData