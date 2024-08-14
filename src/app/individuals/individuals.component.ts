import { Component } from '@angular/core';
import { IndividualService } from '../service/individual-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Individual } from '../model/domain/individual';

@Component({
  selector: 'app-individuals',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './individuals.component.html',
  styleUrl: './individuals.component.css'
})
export class IndividualsComponent {  
  individuals: Individual[] = [];
  selectedIndividual?: Individual;
  searchKey = ''
  searchOutputText = ''
  outputText = ''
  constructor(private individualService: IndividualService){
    this.init()
  }

  async init(): Promise<void> {
    if(this.individuals.length == 0){ //Initialize only if no data available
      this.individualService.addBulk(); 
    }
    this.loadIndividuals()
  }

  async loadIndividuals(): Promise<void> {
    this.individuals = await this.individualService.getAll();
    this.outputText = "Displaying 10 individuals of " + await this.individualService.count()
  }

  onSelect(individual: Individual): void {
    this.selectedIndividual = individual;
  }

  async delete(id: number) {
    await this.individualService.delete(id);
    this.loadIndividuals();
  }

 async onSubmit() {
   await this.individualService.update(this.selectedIndividual)
 }

  async search(): Promise<void>  {
    var start = new Date().getTime();
    if(isNaN(Number(this.searchKey))){
      this.individuals = await this.individualService.searchByName(this.searchKey);
    }
    else{
      this.individuals = await this.individualService.searchById(Number(this.searchKey));
    }   
    var end = new Date().getTime();
    var count = await this.individualService.count()
    this.searchOutputText = "Results were retrieved from a total of " + count + " individuals in just "+ (end - start) +"ms." 
  }
}
