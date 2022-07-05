import { getFlocMaintPlant } from "../../../../ZSAMComponent/Rules/Parts/CreateUpdate/PlantLstPkrQueryOption";

export default function StorageLocationQueryOption(context) {
    try {
        return getFlocMaintPlant(context)
            .then(flocMaintPlant => {
                return "$orderby=StorageLocation&$filter=Plant eq " + "'" + flocMaintPlant + "'";
            })
    } catch (err) {
        return '$orderby=StorageLocation';
    }
}
