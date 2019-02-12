import { Component, OnInit,Input } from '@angular/core';
import { AdminService } from '../services/admin.service'
import * as d3Time from "d3-time-format";

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit {

  private options:any;
  private data:any;
  private tempData:any;
  // private parseTime = d3Time.timeFormat("%d-%m-%Y");
  @Input() du:any;
  constructor(private _adminService: AdminService) { 

  }

  ngOnInit() {

    this._adminService.getProjectForDu(this.du).subscribe(res => {
      console.log(res);            
      // res.forEach(element => {
      //   element.feedbacks.forEach(innerElement => {
      //     // console.log("this is date:"+innerElement.date);
      //     var date=innerElement.date.split('-')[0];
      //     var month=innerElement.date.split('-')[1];
      //     var year=innerElement.date.split('-')[2];
      //     // console.log(this.parseTime(new Date(year,month-1,date)));
          
      //     innerElement.date=new Date(year,month-1,date);
      //     // console.log(innerElement.date+" month: "+innerElement.date.getMonth()+" day: "+innerElement.date.getDate()+" year: "+innerElement.date.getFullYear())
         
      //   });

      // });
      
      this.tempData = res;
      this.createLineGraph(this.du);      
    }, err => console.log(err));
  }
  
  createLineGraph(du)
  {
    console.log("In Line COmp: "+du);
    
    this.options={
      "chart": {
        "type": "lineChart",
        "height": 200,
        "margin": {
          "top": 20,
          "right": 20,
          "bottom": 40,
          "left": 55
        },
        "useInteractiveGuideline": true,
        "x":function (d){ console.log("In line x:"+JSON.stringify(d));
        return d.month; },
        "y":function (d){ return d.score; },
        "dispatch": {},
        "xAxis": {
          "axisLabel": "Month"
        },
        "yAxis": {
          "axisLabel": "Score",
          "axisLabelDistance": -10
        },
        forceY: [0, 10],
        xTickFormat:function(d){
          var months= ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          console.log("In line tick x:"+d);
          return months[parseInt(d)];
        }
      }
    };
    
    this.data=this.getData(du);

    console.log("Linechart data: "+JSON.stringify(this.data));

  }

  getData(du){

    console.log("IN get data");
    var tempArr:any=[];
    this.tempData.forEach(element => {
      var obj = {values:element.feedbacks,key:element.name};
      console.log("Obj:"+obj);
      tempArr.push(obj);
      console.log(tempArr);
    });

    return tempArr;
  }

  @Input()
  set objDu(objDu: any) {
    if (this.du === objDu) {
      return;
    }
    this.du = objDu;
    this.ngOnInit()
  }

  get obj(): any {

    return this.du;
  }

}
