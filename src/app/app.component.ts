import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndividualsComponent } from './individuals/individuals.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IndividualsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'index-db-dexie';
}
