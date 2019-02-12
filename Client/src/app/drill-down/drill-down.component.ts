import { } from 'jquery';
import { } from 'bootstrap';
import "../../../src/assets/js/bootstrap.min.js";
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LinechartComponent } from '../linechart/linechart.component';
import { UpdateStatusService } from '../services/updatestatus.service';
import { UpdatecurrentviewService } from '../services/updatecurrentview.service';
import { UpdatestatustableService } from '../services/updatestatustable.service';
import { AdminformComponent } from '../adminform/adminform.component';
import { MdDialog } from '@angular/material';
import { FilterService } from '../services/filter.service';



// import { SwitchofFormbuttonService } from '../services/switchof-formbutton.service'

@Component({
  selector: 'app-drill-down',
  templateUrl: './drill-down.component.html',
  styleUrls: ['./drill-down.component.css']
  
})
export class DrillDownComponent implements OnInit {

  // private currType: string = "Not_Changed";
  private home: boolean = true;
  private viewStack: any = [];
  private level: string = "OU Score"
  private levelFbString: string = "OU vs Feedback"
  private disableBtn: boolean = false;
  private disableBtnHome: boolean = true;  
  private disableBtnDu: boolean = false; 
  private disableBtnForFb:boolean=false; 
  private inProject: boolean = false;
  private notInProject: boolean = true;
  private obj: any
  private objBar: any;
  private objDu: any;
  private objStatus: any;
  private filter="quarter";
  private navigation:any;
  // private activateNavigation:boolean=false;

  constructor(private _updateStatus: UpdateStatusService,private _updateView: UpdatecurrentviewService,private _updateTable: UpdatestatustableService,public dialog: MdDialog,private _filterService: FilterService) {
    
    this._updateStatus.listen().subscribe((updateData: any=[]) => {
      console.log(JSON.stringify(updateData));

      console.log(this.viewStack);
      if(this.viewStack.length==0)
      {
        console.log("Current View OU ");
        this._updateTable.filter({ "type": "OUstatus", id: updateData.OU });                
        this._updateView.filter("OUpi"); //refresh OU
      }
      else if(updateData.OU==this.viewStack[this.viewStack.length-1].id) 
      {
        console.log("Current View BU for: "+updateData.OU);
        // var tempVar= this.viewStack[this.viewStack.length-1];
        this._updateTable.filter({ "type": "OU", id: updateData.OU });        
        this._updateView.filter({type:"OU",id:updateData.OU}); //refresh BU
      }
      else if(updateData.BU==this.viewStack[this.viewStack.length-1].id)
      {
        // console.log("Current View DU for: "+updateData.BU);
        this._updateTable.filter({ "type": "BU", id: updateData.BU });        
        // var tempVar= this.viewStack[this.viewStack.length-1];
        this._updateView.filter({type:"BU",id:updateData.BU}); //refresh DU
      }
      else if(updateData.DU==this.viewStack[this.viewStack.length-1].id)
      {
        // console.log("Current View Project for: "+updateData.DU);
        this._updateTable.filter({ "type": "DU", id: updateData.DU });        
        this.objDu=updateData.DU; //refresh Project
      }
  })
  }

  ngOnInit() {
    // this._switchof.filter(false); private _switchof: SwitchofFormbuttonService
    this.level = "OU Score";
    this.levelFbString = "OU vs Feedback";
  }

  clickedView(view) {

    this.disableBtnForFb=false;
    this.filter="quarter";
    const objVar = this;
    if (view != undefined) {
      this.disableBtn = true;
      this.disableBtnHome=false;
      // console.log("Event catched in parent" + view);
      // this.typeForStackedbar.emit(view);
      var viewType = view.split('_')[0];
      this.viewStack.push({ "type": viewType, id: view });
      this.objBar = { "type": viewType, id: view };
      this.objStatus={ "type": viewType, id: view };    
      if (viewType == "OU") {
        // console.log("Here to change string");
        this.level = "BU Score";
        this.levelFbString = "BU vs Feedback";
      }
      else if (viewType == "BU") {
        this.level = "DU Score";
        this.levelFbString = "DU vs Feedback";
        // this.objBar = { "type": viewType, id: view };
      }
      else if (viewType == "DU") {
        this.objDu = view;        
        this.notInProject = false;
        this.inProject = true;
        this.disableBtnDu=true; 
        this.disableBtn=false;        
        // console.log("GOing for project of : " + view);
        this.level = "Project Score : " + view;

      }
      // console.log("Viewstack " + JSON.stringify(this.viewStack))
      var stringToAttach;
      this.viewStack.forEach(element => {
        stringToAttach += " / "+element.id;
      });

      this.navigation = "OU "+stringToAttach;
      // this.activateNavigation=true;
      // console.log(this.objBar);

    }

  }

  clickedOnFbType()
  {
    this.disableBtnForFb=true;
  }

  goBack() {

    this.filter="quarter";    
    // console.log("IN goback: "+JSON.stringify(this.viewStack))        
    const objVar = this;
    this.disableBtnForFb=false;    
    var tempStack: any = objVar.viewStack.slice(-2);
    objVar.obj = tempStack;
    if (tempStack.length == 1) {
      //tempStack[0].type="OUBar";  //objVar.viewStack[objVar.viewStack.length - 1].id
      objVar.objBar = { "type": "OUBar", id: tempStack[0].id };
      objVar.objStatus = { "type": "OUstatus", id: tempStack[0].id };
      // objVar.objStatus = 
      // console.log(JSON.stringify(objVar.objBar));
      this.level = "OU Score";
      this.levelFbString = "OU vs Feedback"
    }
    else if (tempStack.length == 2) {

      objVar.objStatus = tempStack[0] //{ "type": tempStack[0].type, id: tempStack[0].id };
      objVar.objBar = tempStack[0];
      // console.log(JSON.stringify(objVar.objBar));
      this.level = "BU Score";
      this.levelFbString = "BU vs Feedback"
    }
    //console.log(objVar.obj+" Going back "+objVar.objBar);
    // console.log("current1" + JSON.stringify(objVar.obj));
    // console.log("current2" + JSON.stringify(objVar.objBar));
    objVar.viewStack.pop();
    // console.log(JSON.stringify(objVar.viewStack));
    if (objVar.viewStack.length === 0) {
      objVar.disableBtn = false;
      this.disableBtnHome=true;      
      // objVar.objBar="Not_Changed"
    }

  }

  goBackToDU() {

    this.filter="quarter";    
    this.disableBtn=true;    
    this.disableBtnDu=false;
    this.disableBtnForFb=false;
    this.disableBtnHome=false;    
    this.notInProject = true;    
    this.inProject = false;
    // console.log("n I p "+this.notInProject+" i p "+this.inProject);
    var tempStack: any = this.viewStack.slice(-2);
    // console.log("IN gobackto DU: "+JSON.stringify(tempStack));        
    this.obj = tempStack;
    this.objBar = tempStack[0];
    this.objStatus=tempStack[0];
    this.viewStack.pop();
    // console.log(JSON.stringify(this.objBar));
    this.level = "DU Score";
    this.levelFbString = "DU vs Feedback"

  }

  goBackToFeedBack()
  {
    // this.filter="quarter";
    // console.log("IN gobacktofb: "+JSON.stringify(this.viewStack))
    this.disableBtnForFb=false;
    var fb=this.viewStack[this.viewStack.length-1];
    if(this.viewStack.length==0)
    {
      this.objBar={ "type": "OUBar", id: "" }
    }
    else
    {
      // console.log("Here to go back to fb: "+JSON.stringify(fb));
      this.objBar={ "type": fb.type, id: fb.id };
    }
  }

  loadForm() {
    // console.log("im in console.");
    this.dialog.open(AdminformComponent);
  }

  onFilter(filterOn)
  {
      // console.log(filterOn);
      this._filterService.filter(filterOn);
      // this.ngOnInit();
  }
}
