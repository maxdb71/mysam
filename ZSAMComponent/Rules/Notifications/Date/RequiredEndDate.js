import libVal from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';

// ENEL customization

export default function RequiredEndDate(context) {
    var binding = context.binding;
    if (libVal.evalIsEmpty(binding.RequiredEndDate)) {
        return context.localizeText('no_required_end_date');
    }

    //let odataDate = new OffsetODataDate(context,binding.RequiredEndDate);
    let odataDate = new ODataDate(binding.RequiredEndDate, 0, 0);

    return context.formatDate(odataDate.date());
}
