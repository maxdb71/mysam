import libEval from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import { getFlocMaintPlant } from "../../../../ZSAMComponent/Rules/Parts/CreateUpdate/PlantLstPkrQueryOption";

export default function MaterialLstPkrQueryOptions(context) {

    try {
        // Get values from controls
        let plant = context.getPageProxy().evaluateTargetPath('#Control:PlantLstPkr/#SelectedValue');
        let slocValues = context.getPageProxy().evaluateTargetPath('#Control:StorageLocationLstPkr/#Value');
        let materialNumber = context.getPageProxy().evaluateTargetPath('#Control:MaterialNumber').getValue();
        let materialDescription = context.getPageProxy().evaluateTargetPath('#Control:MaterialDescription').getValue();
        let onlineSwitchValue = context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch').getValue();

        if (context.binding['@odata.type'] === '#sap_mobile.BOMItem') {
            materialNumber = context.binding.Component;
        }

        if (libEval.evalIsEmpty(materialNumber)) {
            materialNumber = context.getPageProxy().binding.MaterialNum;
        }

        let materialLstPkrQueryOptions = context.dataQueryBuilder();

        materialLstPkrQueryOptions.expand('Material,MaterialPlant');

        let newFilterOpts = [`Plant eq '${plant}'`];
        if (slocValues.length > 0) {
            let slocValuesQuery = [];
            for (let i in slocValues) {
                if (!libEval.evalIsEmpty(slocValues[i])) {
                    slocValuesQuery.push(`StorageLocation eq '${slocValues[i].ReturnValue}'`);
                }
            }
            if (slocValuesQuery.length > 0) {
                newFilterOpts.push(`(${slocValuesQuery.join(' or ')})`);
            }
        }

        if (materialNumber) {
            newFilterOpts.push(`MaterialNum eq '${materialNumber}'`);
        }

        if (materialDescription && !(context.binding['@odata.type'] === '#sap_mobile.BOMItem')) {
            newFilterOpts.push(`substringof('${materialDescription}', MaterialDesc)`);
        }
        materialLstPkrQueryOptions.filter(newFilterOpts.join(' and '));

        if (context.searchString) {
            if (onlineSwitchValue) {
                let searchString = context.searchString;
                let filters = [
                    `substringof('${searchString.toLowerCase()}', MaterialDesc)`,
                ];
                materialLstPkrQueryOptions.filter().and(`${filters.join(' or ')}`);
            } else {
                let searchString = context.searchString;
                let filters = [
                    `substringof('${searchString.toLowerCase()}', tolower(Material/Description))`,
                    `substringof('${searchString.toLowerCase()}', tolower(Material/MaterialNum))`,
                ];
                materialLstPkrQueryOptions.filter().and(`${filters.join(' or ')}`);
            }
        }

        return materialLstPkrQueryOptions;

    } catch (exc) {
        // If page is first loaded, attempts to get controls will fail 
        try {
            return getFlocMaintPlant(context)
                .then(flocMaintPlant => {
                    let queryOptions = '';
                    let storageLoc = context.getPageProxy().binding.StorageLocation;
                    if (flocMaintPlant && storageLoc) {
                        queryOptions = `$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=Plant eq '${flocMaintPlant}' and StorageLocation eq '${storageLoc}'`;
                    } else if (flocMaintPlant) {
                        queryOptions = `$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=Plant eq '${flocMaintPlant}'`;
                    } else {
                        queryOptions = '$orderby=MaterialNum&$expand=Material,MaterialPlant';
                    }
                    return queryOptions;
                })
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), `PartLibrary.partCreateUpdateOnChange(PlantLstPkr) error: ${err}`);
        }
    }
}