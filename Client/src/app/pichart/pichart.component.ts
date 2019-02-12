import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AdminService } from '../services/admin.service'
import { MdDialog } from '@angular/material';
import { UpdatecurrentviewService } from '../services/updatecurrentview.service';
import { FilterService } from '../services/filter.service';


@Component({
  selector: 'app-pichart',
  templateUrl: './pichart.component.html',
  styleUrls: ['./pichart.component.css']
})
export class PichartComponent implements OnInit {

  private data: any;
  private tempData: any;
  private options: any;
  @Input() backTo: any;
  @Output() clickedView = new EventEmitter<boolean>();
  private filter="quarter";
  private currentView:any;
  // @Output() typeForStackedbar = new EventEmitter<boolean>();
  constructor(private _adminService: AdminService, private _updateView: UpdatecurrentviewService, private _filterService: FilterService) {

    this._updateView.listen().subscribe((view: any) => {
      if (view.type == "OU") {
        this.getBu(view.id);
      }
      else if (view.type == "BU") {
        this.getDu(view.id);
      }
      else if (view == "OUpi") {
        this.getPi();
      }
    })

    this._filterService.listen().subscribe((filter: any) => {

      this.filter = filter;
      console.log("Undefined backto: "+JSON.stringify(this.currentView));
      if(this.currentView==undefined)
      {
        this.ngOnInit();
      }
      else if(this.currentView!=undefined){
        var type=this.currentView.split("_");
        if(type[0]=="OU")
        this.getBu(this.currentView);
        if(type[0]=="BU")
        this.getDu(this.currentView);
      }
    })
  }

  ngOnInit() {
    // if(this.backTo)
    // {
    console.log("this.backto: " + this.backTo);
    this._adminService.getPiData(this.filter).subscribe(res => {
      console.log(res);
      this.tempData = res;
      this.drawPi();
    }, err => console.log(err));
    // }
  }

  // ngOnChanges(changes: { [propKey: string]: SimpleChange }) {


  //         console.log("Changed to:" + changes["backTo"].currentValue);

  //         if(changes["backTo"].currentValue!=undefined)
  //         {
  //           var trimmed = changes["backTo"].currentValue.split('_')[0];

  //                 // console.log("Trimmed"+trimmed);
  //                 if (trimmed == "OU") {
  //                   console.log("Comes here");
  //                   this.ngOnInit();
  //                   this.drawPi();

  //                 }
  //                 else if (trimmed == "BU") {
  //                   console.log("Comes here for Bu");
  //                   this.getBu(changes["basedOn"].currentValue);
  //                   this.drawPi();
  //                 }

  //         }
  //         // else if (trimmed=="DU") {
  //         //   console.log("Comes here for Du");
  //         // this.getProject(e.data.key);
  //         // }

  //     }

  private drawPi() {

    this.options = {
      chart: {
        type: 'pieChart',
        margin: {
          top: 20, right: 30, bottom: 0, left: 0
        },
        x: function (d) {
          return d.key;
        },
        y: function (d) {
          return d.y;
        },

        showLabels: false,
        labelSunbeamLayout: false,
        donutRatio: 0.7,
        donut: false,
        height: 200,
        width: 400,
        tooltip: {
          valueFormatter: function (d, i) {
            return d;
          },
          hideDelay: 0
        },
        pie: {
          dispatch: {

            elementClick: e => {

              var trimmed = e.data.key.split('_')[0];
              console.log(e);
              
              // console.log("Trimmed"+trimmed);
              if (trimmed == "OU") {
                this.currentView=e.data.key;
                console.log("Comes here");
                this.getBu(e.data.key);
                this.clickedView.emit(e.data.key);
              }
              else if (trimmed == "BU") {
                this.currentView=e.data.key;
                console.log("Comes here for Du");
                this.getDu(e.data.key);
                this.clickedView.emit(e.data.key);
              }
              else if (trimmed == "DU") {
                this.currentView=undefined;
                console.log("Comes here for Du");
                this.clickedView.emit(e.data.key);
              }

            }
          }
        },

        transitionDuration: 500,
        labelThreshold: 0.02,
        legend: {
          margin: {
            top: 5,
            right: 0,
            bottom: 0,
            left: 0
          },
          updateState: false,
          rightAlign: true
        },
      }

    };
    this.data = this.getData();
  }

  getData() {
    var arr: any = [];
    this.tempData.forEach(element => {
      if (element.hasOwnProperty('OU_id')) {
        var obj = { "key": element.OU_id, "y": element.score };
        arr.push(obj);
      }
      else if (element.hasOwnProperty('BU_id')) {
        var obj = { "key": element.BU_id, "y": element.score };
        arr.push(obj);
      }
      else if (element.hasOwnProperty('DU_id')) {
        var obj = { "key": element.DU_id, "y": element.score };
        arr.push(obj);
      }
    });
    return arr;
  }
  getBu(view) {
    this._adminService.getAllBuForOu(view,this.filter).subscribe(res => {
      console.log(res);
      this.tempData = res;
      console.log(this.data);
      this.drawPi();
    }, err => console.log(err));
    // this.typeForStackedbar.emit(view);


  }
  getDu(view) {
    this._adminService.getAllDuForBu(view,this.filter).subscribe(res => {
      console.log(res);
      this.tempData = res;
      console.log(this.data);
      this.drawPi();
    }, err => console.log(err));
  }

  getPi() {
    this._adminService.getPiData(this.filter).subscribe(res => {
      console.log(res);
      this.tempData = res;
      this.drawPi();
    }, err => console.log(err));
  }

  @Input()
  set obj(obj: any) {
    if (this.backTo === obj) {
      return;
    }
    this.backTo = obj;

    // console.log("this.backto: "+this.backTo);      
    // if(this.backTo.length != "notToChange")
    // {
    var backTotype = this.backTo.pop();
    var basedOn = this.backTo.pop();
    if (backTotype.type == "OU") {
      // this._adminService.getPiData().subscribe(res => {
      //   console.log(res);
      //   this.tempData = res;
      //   console.log(this.data);
      //   this.drawPi();
      // }, err => console.log(err));
      this.currentView=undefined;
      this.getPi();
    }
    else if (backTotype.type == "BU") {
      // this._adminService.getAllBuForOu(basedOn.id).subscribe(res => {
      //   console.log(res);
      //   this.tempData = res;
      //   console.log(this.data);
      //   this.drawPi();
      // }, err => console.log(err));
      this.currentView=basedOn.id
      this.getBu(basedOn.id);
    }
    else if (backTotype.type == "DU") {
      // this._adminService.getAllDuForBu(basedOn.id).subscribe(res => {
      //   console.log(res);
      //   this.tempData = res;
      //   console.log(this.data);
      //   this.drawPi();
      // }, err => console.log(err));
      this.currentView=basedOn.id;
      this.getDu(basedOn.id);
    }
    // }
  }

  get obj(): any {

    return this.backTo;
  }

}
