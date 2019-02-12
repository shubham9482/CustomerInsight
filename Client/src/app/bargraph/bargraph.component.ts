import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service'
// import { ApptoBarService } from '../services/appto-bar.service'
import * as d3Format from "d3-format";
import { EntityserviceService } from '../entityservice.service';
import * as d3 from 'angular2-nvd3/node_modules/d3';
import * as _ from "lodash";
import { MdDialog } from '@angular/material';
import { UpdatecurrentviewService } from '../services/updatecurrentview.service';
import { FilterService } from '../services/filter.service';

@Component({
    selector: 'app-bargraph',
    templateUrl: './bargraph.component.html',
    styleUrls: ['./bargraph.component.css']
})
export class BargraphComponent implements OnInit {

    private data: any;
    private selectedEntity: any;
    private disableBtn: any;
    private chartType:any;
    private filter="quarter";
    private hideSelect:boolean=false;
    private options = {
        chart: {
            type: 'discreteBarChart',
            height: 200,
            groupSpacing: 0.5,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 70
            },
            tooltip: {
                hideDelay:0           
            },
            x: function (d) { return d.type; },
            y: function (d) { return d.score; },
            showValues: true,
            valueFormat: function (d) {
                return d3Format.format(',.1f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: "",
            },
            yAxis: {
                axisLabel: 'Score(Average)'
            },
            yDomain: [0, 10],
            discretebar: {}
        }
    };

    constructor(public dialog: MdDialog,private _adminService: AdminService, private _entityService: EntityserviceService,private _updateView: UpdatecurrentviewService,private _filterService: FilterService) {

        this._entityService.listen().subscribe((m: any) => {
            console.log(this.filter);
            // this.changeData(m);
            if (m == "entities") {
                this.ngOnInit();
                // this._adminService.getAllEntities().subscribe(res => {
                //     console.log(res);
                //     this.data = res;
                //     console.log(this.data);
                //     this.drawBarGraph();
                // }, err => console.log(err));
            }
        })

        this._updateView.listen().subscribe((updateData: any=[]) => {
            
              this.ngOnInit();
            })
        // console.log("Yes coming from here" + entityOption.data.type);

    }

    ngOnInit() {
        this._adminService.getAllEntities(this.filter).subscribe(res => {
            console.log(res);
            res.forEach(element => {
                element.type = _.capitalize(element.type);
            });
            this.data = res;
            console.log(this.data);
            this.drawBarGraph();
        }, err => console.log(err));
        this._entityService.filter("Entity");
        this.chartType = "entities";
        // this._appToBarService.filter(this.data);
    }


    private changeData(entity) {

        this.hideSelect=true;
        const objVar = this;
        console.log("Okay here" + entity);
        if (entity == "People") {
            this._adminService.getPeopleData(this.filter).subscribe(res => {
                console.log(res);
                res.forEach(element => {
                    element.type = _.capitalize(element.type);
                });
                this.data = this.barChartData(res);
                this.options.chart.xAxis.axisLabel = "Feedback SubType (People)"
                this.options.chart.discretebar = {
                    dispatch: {
                        elementClick: function (e) {

                        }
                    }

                };
                //this.drawBarGraph();
            }, err => console.log(err));

        }
        else if (entity == "Quality") {
            this._adminService.getQualityData(this.filter).subscribe(res => {
                res.forEach(element => {
                    element.type = _.capitalize(element.type);
                });
                this.data = this.barChartData(res);
                this.options.chart.xAxis.axisLabel = "Feedback SubType (Quality)"
                this.options.chart.discretebar = {
                    dispatch: {
                        elementClick: function (e) {

                        }
                    }

                };
                //this.drawBarGraph();
            }, err => console.log(err));
        }
        else if (entity == "Governance") {
            this._adminService.getGovernanceData(this.filter).subscribe(res => {
                res.forEach(element => {
                    element.type = _.startCase(element.type);
                });
                this.data = this.barChartData(res);
                this.options.chart.xAxis.axisLabel = "Feedback SubType (Governance)"
                this.options.chart.discretebar = {
                    dispatch: {
                        elementClick: function (e) {

                        }
                    }

                };
                //this.drawBarGraph();
            }, err => console.log(err));
        }
        // objVar.disableBtn=true;
        setTimeout(function () {
            objVar.disableBtn = true;
        }, 1000);
    }

    private drawBarGraph() {

        this.options.chart.xAxis.axisLabel = "Feedback Type"
        this.options.chart.discretebar = {
            dispatch: {
                elementClick: (e) => {
                    this.changeData(e.data.type);
                }
            }

        };
        this.data = this.barChartData(this.data);
    }
    private barChartData(temp) {

        return [
            {
                key: "Cumulative Return",
                values: temp
            }
        ];
    }

    goBack() {

        this.hideSelect=false;
        const objVar = this;
        // objVar.disableBtn =false;
        objVar._entityService.filter("entities");
        setTimeout(function () {
            objVar.disableBtn = false;
        }, 1000);
    }


    onFilter(filterOn)
    {
        console.log(filterOn);
        this._filterService.filter(filterOn);
        this.ngOnInit();
    }

    // openDialog(chartType) {
        
    //     const objVar = this;
    //     if(objVar.chartType=="entities")
    //     {
    //         console.log(chartType);

    //         objVar.dialog.open(BargraphComponent);
    //     }
    // }

}
