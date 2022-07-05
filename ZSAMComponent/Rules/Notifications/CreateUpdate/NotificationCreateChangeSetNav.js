import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import lamCopy from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateLAMCopy'

export default function NotificationCreateChangeSetNav(context, bindingParams) {
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');

    let contextBinding = context.binding;

    if (context.constructor.name === 'SectionedTableProxy') {
        contextBinding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], "$select=PriorityType&$filter=NotifType eq '" + libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType') + "'").then(function (data) {
        let binding = { 'NotifPriority': {} };
        if (data.length > 0) // Ensure notification create doesn't bomb out if no default is set
            binding.PriorityType = data.getItem(0).PriorityType;
        if (bindingParams) {
            Object.assign(binding, bindingParams);
        }
        if (contextBinding && contextBinding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
            binding.HeaderFunctionLocation = contextBinding.FuncLocIdIntern;
        } else if (contextBinding && contextBinding['@odata.type'] === '#sap_mobile.MyEquipment') {
            binding.HeaderEquipment = contextBinding.EquipId;
            binding.HeaderFunctionLocation = contextBinding.FuncLocIdIntern;
        } else if (contextBinding && contextBinding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            binding.HeaderFunctionLocation = contextBinding.HeaderFunctionLocation;
        }

        let flocQuery = "$filter=FuncLocIdIntern eq  '" + binding.HeaderFunctionLocation + "' and length(CatalogProfile) gt 0";
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', ['CatalogProfile'], flocQuery)
            .then(function (results) {
                if (results.length > 0) {
                    binding._CatalogProfile = results.getItem(0).CatalogProfile;
                } else {
                    binding._CatalogProfile = '';
                }
                if (context.setActionBinding)
                    context.setActionBinding(binding);
                else
                    context.getPageProxy().setActionBinding(binding);
                libCommon.setStateVariable(context, 'LocalId', ''); //Reset before starting create
                libCommon.setStateVariable(context, 'lastLocalItemNumber', '');
                return context.executeAction('/SAPAssetManager/Actions/Notifications/ChangeSet/NotificationCreateChangeset.action').then(() => {
                    return lamCopy(context);
                });
            });
    });
}