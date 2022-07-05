import libVal from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';

// ENEL customization

export default function RequiredStartDate(context) {
    var binding = context.binding;
    if (libVal.evalIsEmpty(binding.RequiredStartDate)) {
        return context.localizeText('no_required_start_date');
    }

    //let odataDate = new OffsetODataDate(context,binding.RequiredStartDate);
    let odataDate = new ODataDate(binding.RequiredStartDate, 0, 0);
    return context.formatDate(odataDate.date());
}
