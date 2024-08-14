enum PlaceType {
    BIRTH_PLACE = 1 ,
    ADDRESS = 2 ,
    BURIAL = 3,
    OTHER = 9
}
export interface Place {    
    id: number;
    name: string;
    type: PlaceType;
    date?: Date;
    multiMediaIds?: number[];
}