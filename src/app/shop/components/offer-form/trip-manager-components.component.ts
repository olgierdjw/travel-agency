import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Trip} from "../../models/trip";

@Component({
  selector: 'app-offer-form',
  templateUrl: './trip-manager-components.component.html',
  styleUrls: ['./trip-manager-components.component.css']
})
export class AddTripComponent {
  @Output() addNewItem = new EventEmitter<any>();
  @Input() doneText = "Create";
  @Input() defaultData: Trip | null = null;
  icons: string[] = ['emirates', 'japan', 'israel']

  handleSubmit(form: NgForm) {
    this.addNewItem.emit(form.value)
    form.resetForm();
  }
}
