enum MultiMediaType {
    IMAGE = 1 ,
    VIDEO = 2,
    OTHER = 9
}
export interface MultiMedia {    
    id: number;
    name?: string;
    type: MultiMediaType;
    path?: string;
    date?: Date;
    caption?: string;
    isDefault?: boolean;
}