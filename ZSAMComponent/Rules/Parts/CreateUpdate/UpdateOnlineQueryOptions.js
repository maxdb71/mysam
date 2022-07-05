import libEval from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import { getFlocMaintPlant } from "../../../../ZSAMComponent/Rules/Parts/CreateUpdate/PlantLstPkrQueryOption";

export default function UpdateOnlineQueryOptions(context) {
    //Store
    // Get values from controls
    if (context.binding.comingFromMaterial) {
        context.binding.comingFromMaterial = false;
        return;
    }
    context.binding.comingFromMaterial = false;
    /*let plant = '';
    try {
        plant = context.getPageProxy().evaluateTargetPath('#Control:PlantLstPkr/#SelectedValue');
    } catch (exc) {
        plant = context.getPageProxy().binding.flocMaintPlant;
    }
    */

    let flocMaintPlant = context.getPageProxy().binding.flocMaintPlant;
    /*
        try {
        await getFlocMaintPlant(context)
            .then(flocMaintPlant => {
                flocMaintPlant = flocMaintPlant;
            })
    } catch (err) 
    {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(), `UpdateOnlineQueryOptions error: ${err}`);
    }
    */


    let slocValues = [];
    try {
        slocValues = context.getPageProxy().evaluateTargetPath('#Control:StorageLocationLstPkr/#value');
    } catch (exc) {
        // slocValues.push({ ReturnValue: context.binding.myStore });
    }

    let onlineSwitchValue = context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch').getValue();

    // Get target specifier
    let materialListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialLstPkr');
    materialListPicker.setValue('');

    let materialLstPkrSpecifier = materialListPicker.getTargetSpecifier();
    let materialLstPkrQueryOptions = '$orderby=MaterialNum&$expand=Material,MaterialPlant';

    let newFilterOpts = [`Plant eq '${flocMaintPlant}'`];
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

    materialLstPkrQueryOptions += '&$filter=' + newFilterOpts.join(' and ');
    if (onlineSwitchValue) {
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:MaterialNum}}',
            'Subhead': '{{#Property:Material/#Property:Description}} ',
            'Footnote': '{{#Property:StorageLocationDesc}} - {{#Property:Plant}}',
            'StatusText': '{{#Property:UnrestrictedQuantity}}, {{#Property:Material/BaseUOM}}',
        });
    } else {
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:MaterialNum}}',
            'Subhead': '{{#Property:Material/#Property:Description}} ',
            'Footnote': '{{#Property:StorageLocationDesc}} - {{#Property:Plant}}',
            'StatusText': '{{#Property:UnrestrictedQuantity}}, {{#Property:Material/BaseUOM}}',
        });
    }
    materialLstPkrSpecifier.setEntitySet('MaterialSLocs');
    materialLstPkrSpecifier.setReturnValue('{@odata.readLink}');
    materialLstPkrSpecifier.setQueryOptions(materialLstPkrQueryOptions);
    if (onlineSwitchValue) {
        materialLstPkrSpecifier.setService('/SAPAssetManager/Services/OnlineAssetManager.service');
    } else {
        materialLstPkrSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    }
    materialListPicker.setTargetSpecifier(materialLstPkrSpecifier, false);

    let batchCtrlPkr = context.getPageProxy().evaluateTargetPath('#Control:ValuationTypeLstPkr');
    batchCtrlPkr.setValue('');

    let uomCtrlPkr = context.getPageProxy().evaluateTargetPath('#Control:MaterialUOMLstPkr');
    uomCtrlPkr.setValue('');
}
