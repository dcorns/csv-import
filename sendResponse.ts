/**
 * sendResponse
 * Created by dcorns on 1/21/21
 * Copyright © 2021 Dale Corns
 */
import {Response} from './app-types';

import {ServerResponse} from 'http';
const sendResponse = (res: ServerResponse, resData: Response) => {
    res.writeHead(resData.code, resData.headers);
    res.end(resData.message);
};

export default sendResponse;

