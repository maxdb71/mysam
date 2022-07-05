import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function PlantLstPkrQueryOption(context) {
    //mdb: derive Plant from FLoc Maintenance Plant
    try {
        return getFlocMaintPlant(context)
            .then(flocMaintPlant => {
                return "$filter=Plant eq " + "'" + flocMaintPlant + "'";
            })
    } catch (err) {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), `PartLibrary.partCreateUpdateOnChange(PlantLstPkr) error: ${err}`);
    }
}

export function getFlocMaintPlant(context) {
    if (context.getPageProxy().binding.flocMaintPlant) {
        return new Promise((resolve, reject) => {
            resolve(context.getPageProxy().binding.flocMaintPlant)
        })
    };
    let properties = 'FunctionalLocation/MaintPlant';
    let queryOptions = '$expand=FunctionalLocation';
    let entitySet = `MyWorkOrderHeaders(` + "'" + context.binding.OrderId + "')";
    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [properties], queryOptions)
        .then(result => {
            if (result && result.length > 0) {
                let item = result.getItem(0);
                if (item.FunctionalLocation.MaintPlant) {
                    context.getPageProxy().binding.flocMaintPlant = item.FunctionalLocation.MaintPlant;
                    return item.FunctionalLocation.MaintPlant;
                } else {
                    return '';
                }
            } else {
                return '';
            }
        }).catch(function () {
            return '';
        });
} 