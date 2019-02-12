import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { AdminService } from '../services/admin.service'
import { MdDialog } from '@angular/material';
import * as d3Format from "d3-format";
import * as _ from "lodash";
import { FilterService } from '../services/filter.service';
import { UpdatecurrentviewService } from '../services/updatecurrentview.service';



@Component({
  selector: 'app-stackedbar',
  templateUrl: './stackedbar.component.html',
  styleUrls: ['./stackedbar.component.css']
})
export class StackedbarComponent implements OnInit {

  private data: any;
  private options: any;
  private filter="quarter";
  private fb:any="type";
  private typeVar1:any;
  private typeVar2:any;  
  @Input() currType: any;
  @Output() clickedOnFbType = new EventEmitter<boolean>();  
  private discreteBarChart: any = {
    chart: {
      type: "discreteBarChart",
      height: 200,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 70
      },
      tooltip: {
        hideDelay:0           
    },
      yAxis: {
        axisLabel: "Score(Average)",
      },
      showLabels: true,
      transitionDuration: 500,
      legend: {
        margin: {
          top: 5,
          right: 10,
          bottom: 0,
          left: 0
        },
        updateState: false,
      }
    }
  };

  private multiBarChartOptions: any = {
    chart: {
      type: "multiBarChart",
      height: 200,
      margin: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 70
      },
      tooltip: {
        hideDelay:0           
    },
      yAxis: {
        axisLabel: "Score(Average)",
      },
      showLabels: true,
      transitionDuration: 500,
      legend: {
        margin: {
          top: 3,
          right: 0,
          bottom: 60,
          left: 90
        },
        updateState: false,
      }
    }
  };
  // @Input() currType: string;

  constructor(private _adminService: AdminService,private _filterService: FilterService,private _updateView: UpdatecurrentviewService) { 

    this._filterService.listen().subscribe((filter: any) => {
      
            this.filter = filter;
            console.log(JSON.stringify(this.objBar)+" "+filter);
            console.log("Subtype "+this.typeVar1+this.typeVar2+" "+this.fb)
              
              if(this.fb=="type")
              {
                if(this.objBar==undefined)
                {
                  this.ngOnInit();
                }
                else
                {
                  if(this.objBar.type=="OU")
                  {
                    this.drawStackedbar();
                    this.getBu(this.objBar.id);
                  }
                  else if(this.objBar.type=="BU")
                  {
                    this.drawStackedbar();
                    this.getDu(this.objBar.id);
                  }
                  else if(this.objBar.type=="OUBar")
                  {
                    this.drawStackedbar();
                    this.getBar();
                  }
                  
                }
              }
              else if(this.fb=="subtype")
              {
                console.log("Subtype "+this.typeVar1+this.typeVar2)
                this.getSubType(this.typeVar1,this.typeVar2);
              }
            })

            this._updateView.listen().subscribe((view: any) => {
              if (view.type == "OU") {
                this.getBu(view.id);
              }
              else if (view.type == "BU") {
                this.getDu(view.id);
              }
              else if (view == "OUpi") {
                this.getBar();
              }
            })
  }

  ngOnInit() {
    this._adminService.getAllEntitiesForOu(this.filter).subscribe(res => {
      console.log(res);
      this.data = res;
      console.log(this.data);
      this.drawStackedbar();
    }, err => console.log(err));
  }

  // ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

  //   this.options=this.multiBarChartOptions;
  //   for (let propName in changes) {
  //     console.log("Changed to:" + changes[propName].currentValue);

  //     var trimmed = changes[propName].currentValue.split('_')[0];

  //     // console.log("Trimmed"+trimmed);
  //     if (trimmed == "OU") {
  //       console.log("Comes here for BU");
  //       this.drawStackedbar();
  //       this.getBu(changes[propName].currentValue);
  //     }
  //     else if (trimmed == "BU") {
  //       console.log("Comes here for Du");
  //       this.drawStackedbar();
  //       this.getDu(changes[propName].currentValue);
  //     }

  //   }

  // }

  private drawStackedbar() {

    this.multiBarChartOptions.chart.type = 'multiBarChart';
    this.multiBarChartOptions.chart.stacked = false;
    this.multiBarChartOptions.chart.yAxis = {
      axisLabel: "Score(Average)",
      axisLabelDistance: -15
    };
    this.multiBarChartOptions.chart.tooltip = {
      valueFormatter: function (d, i) {
        return d;
      }
    };
    this.multiBarChartOptions.chart.multibar = {
      dispatch: {

        elementClick: e => {

          this.options = this.discreteBarChart;
          var trimmed = e.data.x.split('_')[0];
          console.log(e);

          // console.log("Trimmed"+trimmed);
          this.typeVar1=e.data.x;
          this.typeVar2=e.data.key;
          if (trimmed == "OU") {
            console.log("Comes here");
            
            this.getSubType(e.data.x, e.data.key);
            this.clickedOnFbType.emit();
          }
          else if (trimmed == "BU") {
            console.log("Comes here for Du");
            this.getSubType(e.data.x, e.data.key);
            this.clickedOnFbType.emit();
          }
          else if (trimmed == "DU") {
            console.log("Comes here for Du");
            this.getSubType(e.data.x, e.data.key);
            this.clickedOnFbType.emit();
          }
          console.log(e);


        }
      },
      forceY: [0, 10]

    }
    this.multiBarChartOptions.chart.labelThreshold = 0.02;
    this.multiBarChartOptions.chart.showControls = false;
    this.options = this.multiBarChartOptions;
    console.log(this.options);
  }
  getBu(view) {
    this.fb="type";
    this._adminService.getFeedbackForBu(view,this.filter).subscribe(res => {
      this.data = res;
      console.log(this.data);
      this.drawStackedbar();
    }, err => console.log(err));
    // this.typeForStackedbar.emit(view);

  }
  getDu(view) {
    this.fb="type";
    this._adminService.getFeedbackForDu(view,this.filter).subscribe(res => {
      this.data = res;
      console.log(this.data);
      this.drawStackedbar();
    }, err => console.log(err));
  }
  getBar()
  {
    this.fb="type";
    this._adminService.getAllEntitiesForOu(this.filter).subscribe(res => {
      console.log(res);
      this.data = res;
      console.log(this.data);
      this.drawStackedbar();
    }, err => console.log(err));
  }
  // typeForStackedbar(view)
  // {
  //   console.log("In stacked"+view);
  //   this._adminService.getFeedbackForBu(view).subscribe(res => {
  //     console.log(res);
  //     this.data = res;
  //     console.log(this.data);
  //     this.drawStackedbar();
  //   }, err => console.log(err));
  // }

  getSubType(x, type) {

    this.fb="subtype";
    this.discreteBarChart.chart.type = 'discreteBarChart';
    this.discreteBarChart.chart.x = function (d) { return d.type; };
    this.discreteBarChart.chart.y = function (d) { return d.score; };
    this.discreteBarChart.chart.showValues = true;
    this.discreteBarChart.chart.valueFormat = function (d) {
      return d3Format.format(',.1f')(d);
    };
    this.discreteBarChart.chart.xAxis = {
      axisLabel: "Feedback SubType(" + type + ")" + ":" + x,
    };
    this.discreteBarChart.chart.yAxis = {
      axisLabel: "Score(Average)",
    };
    this.discreteBarChart.chart.yDomain = [1, 10];


    if (x.split('_')[0] == "OU") {
      this._adminService.getSubFeedbackForOu(x, type,this.filter).subscribe(res => {
        res.forEach(element => {
          element.type = _.startCase(element.type);
      });
        this.data = [
          {
            key: "",
            values: res
          }
        ];
        console.log(this.data);
      }, err => console.log(err));
    }
    else if (x.split('_')[0] == "BU") {
      
      this._adminService.getSubFeedbackForBu(x, type,this.filter).subscribe(res => {
        res.forEach(element => {
          element.type = _.startCase(element.type);
      });
        this.data = [
          {
            key: "",
            values: res
          }
        ];

        console.log(this.data);
      }, err => console.log(err));
    }
    else if (x.split('_')[0] == "DU") {
      this._adminService.getSubFeedbackForDu(x, type,this.filter).subscribe(res => {
        res.forEach(element => {
          element.type = _.startCase(element.type);
      });
        this.data = [
          {
            key: "",
            values: res
          }
        ];
        console.log(this.data);
      }, err => console.log(err));
    }
    this.options = this.discreteBarChart;
  }

  @Input()
  set objBar(objBar: any) {
    if (this.currType === objBar) {
      return;
    }
    this.currType = objBar;
    // console.log(this.currType.length)
    console.log(this.currType)

    
      if (this.currType.type == "OU") {
        console.log("Comes here for BU");
        this.drawStackedbar();
        this.getBu(this.currType.id);
      }
      else if (this.currType.type == "BU") {
        console.log("Comes here for Du");
        this.drawStackedbar();
        this.getDu(this.currType.id);
      }
      else if(this.currType.type == "OUBar"){
        console.log("Comes here for OU");
        this.drawStackedbar();
        this.getBar();
      }
   
    
  }
  get objBar(): any {
    
        return this.currType;
      }
  

  

}