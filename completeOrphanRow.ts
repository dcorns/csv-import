/**
 * completeOrphanRow
 * Created by dcorns on 1/26/21
 * Copyright © 2021 Dale Corns
 */
import {ProviderConfig} from './app-types';

const completeOrphanRow = (orphanRow: any, providerConfig: ProviderConfig, propertyNames: Array<string>, remainingRow: any) => {
    const orphanRowCopy = {...orphanRow};
    const orphanPropertyCount = Object.keys(orphanRowCopy).length;
    const remainingPropNames = propertyNames.length - orphanPropertyCount;
    let rowIndexDif = providerConfig.totalColumns - remainingRow.length + 1;
    const propNameIndexDif = propertyNames.length - remainingPropNames;
    const lastOrphanProperty = propertyNames[orphanPropertyCount - 1];
    if (lastOrphanProperty) {
        orphanRowCopy[lastOrphanProperty] = orphanRow[lastOrphanProperty] + remainingRow.shift();
    }
    else{
        rowIndexDif--;
    }


    for (let i = 0; i < remainingPropNames; i++) {
        if (propertyNames[i + propNameIndexDif]) {
            if (remainingRow[providerConfig.validColumns[i + propNameIndexDif] - rowIndexDif]) {
                orphanRowCopy[propertyNames[i + propNameIndexDif]] = remainingRow[providerConfig.validColumns[i + propNameIndexDif] - rowIndexDif];
            }
        } else {
            //end of valid properties
            break;
        }
    }
    return orphanRowCopy;
}
export default completeOrphanRow