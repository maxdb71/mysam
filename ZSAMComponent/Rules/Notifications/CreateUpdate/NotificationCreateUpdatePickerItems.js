import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import notifLib from '../../Notifications/NotificationLibrary';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function NotificationCreateUpdatePickerItems(context) {
    //"__DisplayValue": "{{#Property:FuncLocId}} - {{#Property:FuncLocDesc}} ({{#Property:CatalogProfile}})",

    let controlName = context.getName();
    // Based on the control we are on, return the right list items accordingly
    switch (controlName) {
        case 'FunctionalLocationLstPkr':
            {
                let formCellContainer = context.getPageProxy().getControl('FormCellContainer');
                let funcLocControlValue = context.getValue();
                let codingGroupControl = formCellContainer.getControl('CodingGroupLstPkr');
                codingGroupControl.setValue('');
                common.setEditable(codingGroupControl, false);
                let codingGroupCtrlSpecifier = codingGroupControl.getTargetSpecifier();

                let equipmentControl = formCellContainer.getControl('EquipmentLstPkr');
                if (!context.getPageProxy().binding.dontTouchEqui) {
                    equipmentControl.setValue('');
                    context.getPageProxy().binding.dontTouchEqui = false;
                }

                if (funcLocControlValue && common.getListPickerValue(funcLocControlValue) !== '') {
                    common.setEditable(equipmentControl, true);
                    let equipmentCtrlSpecifier = equipmentControl.getTargetSpecifier();
                    equipmentCtrlSpecifier.setQueryOptions("$filter=FuncLocIdIntern eq '" + common.getListPickerValue(funcLocControlValue) + "'&$orderby=EquipId");
                    equipmentControl.setTargetSpecifier(equipmentCtrlSpecifier);

                    let cat = '';
                    context.getPageProxy().binding.myHeaderFunctionLocation = common.getListPickerValue(funcLocControlValue);
                    return notifLib.getFlocCatalog(context)
                        .then(function (_CatalogProfile) {
                            context.getPageProxy().binding._CatalogProfile = _CatalogProfile;
                            common.setEditable(codingGroupControl, true);
                            try {
                                //Set Coding Group
                                cat = libCom.getAppParam(context, 'CATALOGTYPE', 'ZCatTypeCoding');
                                codingGroupCtrlSpecifier.setQueryOptions("$filter=Catalog eq '" + cat + "' and CatalogProfile eq '" + _CatalogProfile + "'&$orderby=CodeGroup");
                                codingGroupControl.setTargetSpecifier(codingGroupCtrlSpecifier);
                                //Set Damage
                                let damageGrpControl = formCellContainer.getControl('DamageGroupLstPkr');
                                let damageGrpCtrlSpecifier = damageGrpControl.getTargetSpecifier();
                                cat = libCom.getAppParam(context, 'CATALOGTYPE', 'CatTypeDefects');
                                damageGrpCtrlSpecifier.setQueryOptions("$filter=Catalog eq '" + cat + "' and CatalogProfile eq '" + _CatalogProfile + "'&$orderby=CodeGroup");
                                damageGrpControl.setTargetSpecifier(damageGrpCtrlSpecifier);
                                //Set Cause
                                let causeGrpControl = formCellContainer.getControl('CauseGroupLstPkr');
                                let causeGrpCtrlSpecifier = causeGrpControl.getTargetSpecifier();
                                causeGrpControl.setValue('');
                                cat = libCom.getAppParam(context, 'CATALOGTYPE', 'CatTypeCauses');
                                causeGrpCtrlSpecifier.setQueryOptions("$filter=Catalog eq '" + cat + "' and CatalogProfile eq '" + _CatalogProfile + "'&$orderby=CodeGroup");
                                causeGrpControl.setTargetSpecifier(causeGrpCtrlSpecifier);
                            } catch (err) {
                                //we are on a page w/o that control...
                                console.log(err);
                            }
                        })
                } else {
                    let equipmentCtrlSpecifier = equipmentControl.getTargetSpecifier();
                    equipmentCtrlSpecifier.setQueryOptions('');
                    equipmentControl.setTargetSpecifier(equipmentCtrlSpecifier);
                }
                break;
            }
        case 'EquipmentLstPkr':
            {
                let formCellContainer = context.getPageProxy().getControl('FormCellContainer');
                let funcLocControl = formCellContainer.getControl('FunctionalLocationLstPkr');
                let funcLocCtrlSpecifier = funcLocControl.getTargetSpecifier();
                let equipmentControlValue = context.getValue();

                if (equipmentControlValue && common.getListPickerValue(equipmentControlValue) !== '') {
                    context.getPageProxy().binding.HeaderEquipment = common.getListPickerValue(equipmentControlValue);
                    let prom = notifLib.getCodingGroupQuery(context);
                    prom.then(function (codingGroupQuery) {
                        codingGroupCtrlSpecifier.setQueryOptions(codingGroupQuery);
                        codingGroupControl.setTargetSpecifier(codingGroupCtrlSpecifier, true);
                    })

                }

                if (equipmentControlValue && common.getListPickerValue(equipmentControlValue) !== '') {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['FuncLocId', 'FuncLocIdIntern'], `$filter=EquipId eq '${common.getListPickerValue(equipmentControlValue)}'&$expand=FunctionalLocation&$orderby=EquipId`)
                        .then(results => {
                            if (results.length > 0 && results.getItem(0).FuncLocIdIntern) {
                                funcLocControl.setValue(results.getItem(0).FuncLocIdIntern, true);
                                context.getPageProxy().binding.dontTouchEqui = true;
                            }
                            funcLocControl.setTargetSpecifier(funcLocCtrlSpecifier);
                        });
                }
                break;
            }
        default:
            break;
    }
}