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
                let codingGroupCtrlSpecifier = codingGroupControl.getTargetSpecifier();

                let equipmentControl = formCellContainer.getControl('EquipmentLstPkr');
                let equipmentCtrlSpecifier = equipmentControl.getTargetSpecifier();
                equipmentControl.setValue('');

                if (funcLocControlValue && common.getListPickerValue(funcLocControlValue) !== '') {
                    common.setEditable(equipmentControl, true);
                    equipmentCtrlSpecifier.setQueryOptions("$filter=FuncLocIdIntern eq '" + common.getListPickerValue(funcLocControlValue) + "'&$orderby=EquipId");

                    let cat = '';
                    let decision = true;
                    if (decision) {
                        context.getPageProxy().binding.HeaderFunctionLocation = common.getListPickerValue(funcLocControlValue);
                        notifLib.getFlocCatalog(context)
                            .then(function (_CatalogProfile) {
                                context.getPageProxy().binding._CatalogProfile = _CatalogProfile;
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
                            })
                    } else {
                        //Set Coding Group
                        if (false) {
                            context.getPageProxy().binding.HeaderFunctionLocation = common.getListPickerValue(funcLocControlValue);
                            let prom = notifLib.getCodingGroupQuery(context);
                            prom.then(function (codingGroupQuery) {
                                codingGroupCtrlSpecifier.setQueryOptions(codingGroupQuery);
                                codingGroupControl.setTargetSpecifier(codingGroupCtrlSpecifier);
                            })
                        } else {
                            let cat = libCom.getAppParam(context, 'CATALOGTYPE', 'ZCatTypeCoding');
                            let _CatalogProfile = context.getValue()[0].DisplayValue.StatusText; //context.getValue()[0].DisplayValue = "USW-USB3 - Aurora (FL00000W)"
                            //let regExp = /\(([^)]+)\)/;
                            //_CatalogProfile = regExp.exec(_CatalogProfile);
                            //_CatalogProfile = _CatalogProfile[1];
                            codingGroupCtrlSpecifier.setQueryOptions("$filter=Catalog eq '" + cat + "' and CatalogProfile eq '" + _CatalogProfile + "'&$orderby=Catalog,CatalogProfile,CodeGroup");
                            codingGroupControl.setTargetSpecifier(codingGroupCtrlSpecifier);
                        }
                        //Set Damage
                        if (false) {
                            let damageGrpControl = formCellContainer.getControl('DamageGroupLstPkr');
                            if (damageGrpControl) {
                                let damageGrpCtrlSpecifier = damageGrpControl.getTargetSpecifier();
                                prom = notifLib.NotificationDamNCausQuery(context, 'CatTypeDefects');
                                prom.then(function (damageGrpQuery) {
                                    damageGrpCtrlSpecifier.setQueryOptions(damageGrpQuery);
                                    damageGrpControl.setTargetSpecifier(damageGrpCtrlSpecifier);
                                })
                            }
                        } else {
                            let damageGrpControl = formCellContainer.getControl('DamageGroupLstPkr');
                            damageGrpControl.setValue('');
                            if (damageGrpControl) {
                                let cat = libCom.getAppParam(context, 'CATALOGTYPE', 'CatTypeDefects');
                                let _CatalogProfile = context.getValue()[0].DisplayValue.StatusText; //context.getValue()[0].DisplayValue = "USW-USB3 - Aurora (FL00000W)"
                                //let regExp = /\(([^)]+)\)/;
                                //_CatalogProfile = regExp.exec(_CatalogProfile);
                                //_CatalogProfile = _CatalogProfile[1];
                                let damageGrpCtrlSpecifier = damageGrpControl.getTargetSpecifier();
                                damageGrpCtrlSpecifier.setQueryOptions("$filter=Catalog eq '" + cat + "' and CatalogProfile eq '" + _CatalogProfile + "'&$orderby=Catalog,CatalogProfile,CodeGroup");
                                damageGrpControl.setTargetSpecifier(damageGrpCtrlSpecifier);
                            }
                        }
                        //Set Cause
                        if (false) {
                            let causeGrpControl = formCellContainer.getControl('CauseGroupLstPkr');
                            if (causeGrpControl) {
                                let causeGrpCtrlSpecifier = causeGrpControl.getTargetSpecifier();
                                prom = notifLib.NotificationDamNCausQuery(context, 'CatTypeCauses');
                                prom.then(function (causeGrpQuery) {
                                    causeGrpCtrlSpecifier.setQueryOptions(causeGrpQuery);
                                    causeGrpControl.setTargetSpecifier(causeGrpCtrlSpecifier);
                                })
                            }
                        } else {
                            let causeGrpControl = formCellContainer.getControl('CauseGroupLstPkr');
                            causeGrpControl.setValue('');
                            if (causeGrpControl) {
                                let cat = libCom.getAppParam(context, 'CATALOGTYPE', 'CatTypeCauses');
                                let _CatalogProfile = context.getValue()[0].DisplayValue.StatusText; //context.getValue()[0].DisplayValue = "USW-USB3 - Aurora (FL00000W)"
                                //let regExp = /\(([^)]+)\)/;
                                //_CatalogProfile = regExp.exec(_CatalogProfile);
                                //_CatalogProfile = _CatalogProfile[1];
                                let causeGrpCtrlSpecifier = causeGrpControl.getTargetSpecifier();
                                causeGrpCtrlSpecifier.setQueryOptions("$filter=Catalog eq '" + cat + "' and CatalogProfile eq '" + _CatalogProfile + "'&$orderby=Catalog,CatalogProfile,CodeGroup");
                                causeGrpControl.setTargetSpecifier(causeGrpCtrlSpecifier);
                            }
                        }
                    }
                } else {
                    equipmentCtrlSpecifier.setQueryOptions('');
                }
                equipmentControl.setTargetSpecifier(equipmentCtrlSpecifier);
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