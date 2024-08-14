import { Injectable } from "@angular/core";
import Dexie from "dexie";
import { IndexDBService } from "./db-service";
import { FamilyDetail } from "../model/dto/family-dto";
import { Family } from "../model/domain/family";
import { Individual } from "../model/domain/individual";

@Injectable({
    providedIn: 'root'
  })
export class FamilyService {    
    familyTbl: Dexie.Table;
    individualTbl : Dexie.Table;

    constructor(private dbService: IndexDBService) { 
        this.individualTbl = this.dbService.getIndividualStore();
        this.familyTbl = this.dbService.getFamilyStore();
    }

    async getFamilyDetail(individualId: number, familyId: number) : Promise<FamilyDetail>{
        const family = this.familyTbl.get(familyId) as Family
        let familyDetail = {} as FamilyDetail
        let member, spouce, father, mother = {} as Individual
        let children: Individual[] =[]
        let parentFamily = {} as Family
        const memberId = family.husbandId == individualId ? family.husbandId : family.wifeId as Number
        const spouceId = family.husbandId == individualId ? family.wifeId : family.husbandId as Number
        member = this.individualTbl.get(memberId)
        spouce = this.individualTbl.get(spouceId)
        if(family.childrenIds){
            //children =  this.individualTbl.bulkGet(family.childrenIds) 
            familyDetail.children = children
        }
        //Get family where member was child
        //parentFamily = this.familyTbl.where('childrenIds').anyOf([memberId])
        //father = this.individualTbl.get(parentFamily.husbandId)
        //mother = this.individualTbl.get(parentFamily.wifeId)
        familyDetail.father = father
        familyDetail.mother = mother
        return familyDetail
        
    }
}