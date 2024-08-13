import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Individual } from '../model/individual';

@Injectable({
providedIn: 'root'
})
export class IndexDBService {
    db: Dexie
    schema = {
        individial: '++id, firstName, lastName, email'
      }
    constructor(){
        this.db = new Dexie('FamilyTreeDB');
        this.db.version(1).stores(this.schema)
    }

    getDB(): Dexie {
        return this.db;
    }

    getIndividualStore(): Dexie.Table<Individual, number>{
         return this.getDB().table('individial') as Dexie.Table<Individual, number>
    }
}

