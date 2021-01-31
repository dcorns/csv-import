/**
 * validateRequest
 * Created by dcorns on 1/22/21
 * Copyright © 2021 Dale Corns
 */
import {IncomingMessage} from 'http';
import {Response} from './app-types';
import * as csvConfig from './csv-config.json';

const validateRequest = (req: IncomingMessage, providerNames:Array<string>):Response => {

    const method = req.method;
    if (!providerNames.includes(req.url)) {
        return {
            message:'Invalid Provider',
            code:400};
    }
    if(!(method === 'POST' || method === 'GET' || method === 'HEAD')){
        return {
            message: 'Method Not Allowed',
            code: 405
        }
    }
    return {
        message: 'Success',
        code: 200
    }
}
export default validateRequest