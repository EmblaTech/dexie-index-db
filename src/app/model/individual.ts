export interface Individual {
    id: number;
    firstName: string;
    middleName?: string | '';
    lastName?: string | '';
    displayName?: string | '';
    email?: string | '';  
    phone?: string | '';  
    gender?: string | '';
    address?: string | '';
    birthPlace?: string | ''; 
    isAlive?: boolean | false; 
    eventIds? : number[];
    multiMediaIds?: number[];
  }