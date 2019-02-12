import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AdminService } from '../services/admin.service'
import { Http } from '@angular/http'
import { Router } from '@angular/router';
import "../javascripts/msg.reader.js";
import "../javascripts/jquery-3.2.1.min.js";
import "../javascripts/DataStream.js"
import { MdDialog } from '@angular/material';
import { UpdateStatusService } from '../services/updatestatus.service'
import { UpdatestatustableService } from '../services/updatestatustable.service';
import { UpdatecurrentviewService } from '../services/updatecurrentview.service';


declare var MSGReader: any; // check later
@Component({
  selector: 'app-adminform',
  templateUrl: './adminform.component.html',
  styleUrls: ['./adminform.component.css'],
  providers: [AdminService],
})
export class AdminformComponent implements OnInit {
  // new
  private allProjectData: any = [];
  private allProjectId: any = [];

  constructor(private _adminService: AdminService, 
    private elem: ElementRef, private router: Router,private _updateStatus: UpdateStatusService,private _updateTable: UpdatestatustableService,private _updateView: UpdatecurrentviewService) {

  }

  ngOnInit() {

    this._adminService.getProjectList().subscribe(res => {
      this.allProjectData = res;
      this.allProjectData.forEach(element => {
        this.allProjectId.push(element.id);
      });
    }, err => console.log(err));
    // console.log(this.allProjectName);
  }

  onSubmit(data): void {

    for(var i=0; i< this.allProjectData.length; i++){
      if(this.allProjectData[i].id === data.project){
        data.BU = this.allProjectData[i].BU;
        data.DU = this.allProjectData[i].DU;
        data.OU = this.allProjectData[i].OU;
        data.PROJECTCODE = this.allProjectData[i].id;
        data.PROJECTNAME = this.allProjectData[i].name;
        // console.log("Date from the upload email" + JSON.stringify(data));
        var myDateA = data.DATE; //yyyy-mm-dd
        var chunks = myDateA.split('-');
        data.DATE = chunks[2]+'-'+chunks[1]+'-'+chunks[0]; // dd-mm-yyyy
        break;
      }
    }


    // console.log(data);
    

    var text;
    let files = this.elem.nativeElement.querySelector('#selectFile').files;
    for (var file of files) {
      let selectedFile = file;
      var fileReader = new FileReader();
      if (selectedFile.name.indexOf('.msg') == -1) { // to read .txt files
        fileReader.readAsText(selectedFile);
        fileReader.onload = () => {
          text = fileReader.result;
          data.TEXT = text;
          // console.log(text);
          // console.log("in homeurl :"+this.router.url);
          this._adminService.analyze(data).subscribe(res => {
            // console.log(JSON.stringify(res));
            // data.score=parseFloat(((res.sentiment.document.score + 1)*5).toFixed(2));
            if(this.router.url=="/home")
            {
              // console.log("in homeurl in if block");
              this._updateTable.filter({ "type": "OUstatus", id: data.OU });
              this._updateView.filter("");              
            }
            else
            {
              this._updateStatus.filter(data);
            }
            
            // this._updateStatus.filter(data);     
          }, err => console.log(err));
          // var score = response.sentiment.document.score;
          
        }
      } else { // to read .msg files
        fileReader.onload = () => {
          var buffer = fileReader.result;
          var msgReader = new MSGReader(buffer);
          var fileData = msgReader.getFileData();
          text = fileData.body;
          // console.log("in homeurl :"+this.router.url);
          data.TEXT = text;
          this._adminService.analyze(data).subscribe(res => {
            // console.log(JSON.stringify(res));
            
            // data.score=parseFloat(((res.sentiment.document.score + 1)*5).toFixed(2));
            // let currentUrl = this.router.url;
            // console.log("Current Url: "+currentUrl);
            if(this.router.url=="/home")
            {
              // console.log("in homeurl");
              this._updateTable.filter({ "type": "OUstatus", id: data.OU });
              this._updateView.filter("");              
            }
            else
            {
              this._updateStatus.filter(data);
            }
              
          }, err => console.log(err));
             
          
        }
        fileReader.readAsArrayBuffer(selectedFile);
      }
    }
    // console.log("in homeurl :"+this.router.url);    
    console.log("Data from  admin form :"+JSON.stringify(data));
  }
}
