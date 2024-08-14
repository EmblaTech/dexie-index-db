export enum EventType {
    BIRTH = 'birth' ,
    BAPTISM = 'baptism' ,
    WEDDING = 'wedding' ,
    DEATH = 'death',
    OTHER = 'other' 
}
export interface Event {    
    id: number;
    name?: string;
    type: EventType;
    date?: Date;
    multiMediaIds?: number[];
}