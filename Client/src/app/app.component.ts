import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AdminformComponent } from './adminform/adminform.component';
import { } from 'jquery';
import { } from 'bootstrap';
import "../../src/assets/js/bootstrap.min.js";
import { EntityserviceService } from './entityservice.service';
import { FormControl } from '@angular/forms';
import { MdDialog } from '@angular/material';
// import { SwitchofFormbuttonService } from './services/switchof-formbutton.service'

// @Component({
//   selector: 'donut-popup',
//   template: `
//   <md-dialog-content>
//   <div style="width:540px"><app-doughnut></app-doughnut></div>
// </md-dialog-content>
// <md-dialog-actions>
//   <button md-button md-dialog-close tabindex="-1">Close</button>
// </md-dialog-actions>
// `,
// })

// export class DonutPopup{

//   constructor(){}
// }

// @Component({
//   selector: 'entity-popup',
//   template: `
//   <md-dialog-content>
//     <div style="width:540px"><app-bargraph></app-bargraph></div>
//   </md-dialog-content>
//   <md-dialog-actions>
//     <button md-button md-dialog-close tabindex="-1">Close</button>
//   </md-dialog-actions>`,
// })

// export class EntityPopup{

//   constructor(){
//   //   this._appToBarService.listen().subscribe((type: any=[]) => {
//   //     console.log(type);
//   // })
//   }
// }


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [' @import "http://rubix410.sketchpixy.com/css/main-blessed2.css"; @import "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"; '],
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  // private entities = ["People", "Quality", "Service"];

  private barType :any;
  private donutVar = "Donut";
  // private disableBtn :boolean=false;
  // private formButtom :boolean=true;
  // control = new FormControl(this.entities[1]);

  constructor(private route: Router, private _entityService: EntityserviceService,public dialog: MdDialog) {

    // this.formButtom=true; ,private _switchof: SwitchofFormbuttonService   
    // this._switchof.listen().subscribe((switchof: boolean) => {
    //   this.formButtom=switchof;
    //   })
    
  }

  // openDialog(chartType){
  //   if(chartType=="Donut")
  //   {
  //     this.dialog.open(DonutPopup);
  //   }
  //   else
  //   {
  //     chartType = this.barType+"Popup"
  //     console.log(chartType);
  //     this.dialog.open(EntityPopup);
  //   }
  // }

  title = 'app';
  ngOnInit() {
    // this.route.navigate(['/adminform']);
    this._entityService.listen().subscribe((type: any) => {
      console.log(type);
      this.barType=type;
  })
  
  }
  

  
  // @Output() onFilter: EventEmitter<any> = new EventEmitter();


  // onChange(entity): void {
  //   console.log(entity + "call");
  //   this._entityService.filter(entity);
  // }

}

