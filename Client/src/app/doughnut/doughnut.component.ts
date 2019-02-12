import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service'
import { MdDialog} from '@angular/material';
import { UpdatecurrentviewService } from '../services/updatecurrentview.service';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit {

  private data: any;
  private options: any;
  private tempData: any;
  private avgScore: any;
  private filter:any="quarter";

  constructor(private _adminService: AdminService,private _updateView: UpdatecurrentviewService,private _filterService: FilterService) { 
    this._updateView.listen().subscribe((updateData: any=[]) => {
    
      this.ngOnInit();
    })
    this._filterService.listen().subscribe((filter: any) => {

      this.filter=filter;
        this.ngOnInit();
      })
  }

  ngOnInit() {
    this._adminService.getDoughnutData(this.filter).subscribe(res => {
      console.log(res);
      this.tempData = res;
      console.log(this.data);
      this.drawDoughnut();
    }, err => console.log(err));
  }


  private drawDoughnut() {

    this.avgScore = this.tempData[0].avg;
    this.options = {
      chart: {
        type: 'pieChart',
        margin: {
          top: 20, right: 20, bottom: 20, left: 20
        },
        x: function (d) {
          return d.key;
        },
        y: function (d) {
          return d.y;
        },
        title:"Average Score:"+this.avgScore,
        showLabels: false,
        labelSunbeamLayout: true,
        donutLabelsOutside: false,
        donutRatio: 0.7,
        donut: true,
        height:200,
        width:300,
        tooltip:{
          valueFormatter:function(d,i){
            return d+"%";
          },
            hideDelay:0           
        },
        pie: { donutLabelsOutside: false },
        transitionDuration: 500,
        labelThreshold: 0.02,
        legend: {
          margin: {
            top: 5,
            right: 30,
            bottom: 0,
            left: 0
          },
          updateState:false
        }
      }
      
    };

    this.data = this.pieChartData();


  }
  private pieChartData() {

    return [
      {
        key: "Positive",
        y: parseFloat(((this.tempData[0].poscount)/(this.tempData[0].poscount+this.tempData[0].negcount)*100).toFixed(2))
      },
      {
        key: "Negative",
        y: parseFloat(((this.tempData[0].negcount)/(this.tempData[0].poscount+this.tempData[0].negcount)*100).toFixed(2))
      }
    ];
  }

}
