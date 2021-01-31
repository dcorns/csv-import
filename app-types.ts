/**
 * app-types
 * Created by dcorns on 1/22/21
 * Copyright © 2021 Dale Corns
 */
import {OutgoingHttpHeaders} from 'http';

export type Response = {
    message: string
        code: number
    headers?: OutgoingHttpHeaders
}

export type ProviderConfig = {
    rootName: string
    header: string
    validColumns: Array<number>
    totalColumns: number
}
