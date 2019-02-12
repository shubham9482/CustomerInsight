import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AdminformComponent } from '../adminform/adminform.component';


// import { SwitchofFormbuttonService } from '../services/switchof-formbutton.service'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MdDialog) { }

  ngOnInit() {
    // this._switchof.filter(true); private _switchof: SwitchofFormbuttonService
  }

  loadForm() {
    console.log("im in console.");
    this.dialog.open(AdminformComponent);
  }
}
