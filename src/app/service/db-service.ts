import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Individual } from '../model/domain/individual';
import { Family } from '../model/domain/family';
import { MultiMedia } from '../model/domain/multimedia';
import { Place } from '../model/domain/place';

@Injectable({
providedIn: 'root'
})
export class IndexDBService {
    db: Dexie
    schema = {
        individual: '++id, firstName, lastName, email, *familyIds',
        family: '++id, husbandId, wifeId, *childrenIds',
        event: '++id, type, date',
        multimedia: '++id, type, date',
        place: '++id, type, date'
      }
    constructor(){
        this.db = new Dexie('FamilyTreeDB');
        this.db.version(1).stores(this.schema)
    }

    getDB(): Dexie {
        return this.db;
    }

    getIndividualStore(): Dexie.Table<Individual, number>{
         return this.getDB().table('individual') as Dexie.Table<Individual, number>
    }

    getFamilyStore(): Dexie.Table<Family, number>{
        return this.getDB().table('family') as Dexie.Table<Family, number>
    }

    getEventStore(): Dexie.Table<Event, number>{
        return this.getDB().table('event') as Dexie.Table<Event, number>
    }

    getMultiMediaStore(): Dexie.Table<MultiMedia, number>{
        return this.getDB().table('multimedia') as Dexie.Table<MultiMedia, number>
    }

    getPlaceStore(): Dexie.Table<Place, number>{
        return this.getDB().table('place') as Dexie.Table<Place, number>
    }
}

