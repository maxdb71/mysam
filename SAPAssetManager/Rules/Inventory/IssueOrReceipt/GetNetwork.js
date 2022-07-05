export default function GetNetwork(context) {
    let type;
    
    if (context.binding) { 
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.Network;
        } else if (type === 'ReservationItem') {
            return context.binding.ReservationHeader_Nav.Network;
        }
    }
    return '';
}
