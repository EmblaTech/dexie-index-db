export interface Family {
    id?: number;
    husbandId?: number;
    wifeId?: number;
    childrenIds?: number[];
    isDefault?: boolean;
    eventIds? : number[];
    multiMediaIds?: number[];
    places?: number[];
}