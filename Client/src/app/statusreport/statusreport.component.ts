import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { UpdateStatusService } from '../services/updatestatus.service';
import { UpdatestatustableService } from '../services/updatestatustable.service';
import { ActionService } from '../services/action.service';
import { Router } from '@angular/router';
import { FilterService } from '../services/filter.service';
import $ from 'jquery';


@Component({
  selector: 'app-statusreport',
  templateUrl: './statusreport.component.html',
  styleUrls: ['./statusreport.component.css'],
})
export class StatusreportComponent implements OnInit {

  private feedbacks: any = [];
  // private popup: boolean=true;  
  // private dataFormUpload: any={date:"",project_id:"",OU_id:"",BU_id:"",DU_id:"",score:""};
  // private emailUploadDetected:boolean=true;
  private project: boolean = true;  //To show the hidded headers and rows
  private scoreString: any = "Total Score";
  private loading: boolean = false;
  private tableLoading: boolean = true;
  @Input() statusType: any;
  private projAttributes: any;
  private level: any = "Organization Unit";
  private subLevel1: any = "Types";
  private subLevel2: any = "SubTypes";
  private attention: number = 0;
  private toggle: string = "up";
  private default:boolean=true;
  private notDefault:boolean=false;
  private commAdvice: any = ["Will plan for the team member to attend training session specifically for Client communication and Emails", "Anticipate customer questions and be prepared before meetings"]; //, "Use HTML to send clean, attractively branded emails", "Message content should always clearly state the purpose and parameters of the topic addressed.", "Set customer expectation properly"

  private deliAdvice: any = ["Improve induction process. Come up with domain specific test, post induction.", "Come up with Developer guide, which will help people during bug fixing."]
  //Other Advices
  // "Guide will have details about how to approach different problems, where to search for help, what scenarios to consider for unit testing etc.",
  // "Try and bridge the knowledge gap between senior and junior engineers by revising the induction plan.",
  // "Through regular 1-1 try to assess potential factors which can cause attritions.",
  // "RCA work should be re-instantiated.",
  // "Having few (2) members dedicatedly working on catching up with backlog and then individual squad member should be responsible for adding test cases for all new issues.",
  // "Work with customer POC to get recent customer CWCs.",
  // "Prioritize work in RCA based on customer priority, top 3 defect prone modules.",
  // "Have performance testing on CWC, add more testing on overall testing.",
  // "Code review guideline prepared and shared with reviewers.",
  // "Add automated unit test cases to improve coverage."
  private expertAdvice: any = ["Identify skill matrix of the project and map the competency of the resource, identify gaps and train people on gaps.", "Plan on training squad members on individual modules, work on creating bandwidth for them for the same."];

  //"Involve the new members in the team on RCA exercise to gain product knowledge."

  private projMjmtAdvice: any = ["Sprint planning in advance to save time.", "Manage the workplan and monitor the schedule and budget."];

  // "Ensure that the sponsor approves scope-change requests.",
  // "Guard against scope creep.",
  // "Identify risks up front."

  private watsonAdvice: Map<String, any[]> = new Map<String, any[]>();
  private advices: any = [];
  private filter: any = "quarter";

  constructor(private _adminService: AdminService, private _updateTable: UpdatestatustableService, private _actionService: ActionService, private _filterService: FilterService) {
    this._updateTable.listen().subscribe((updateData: any) => {
      console.log(JSON.stringify(updateData));
      // this.emailUploadDetected=false;
      // this.dataFormUpload.date = updateData.DATE;
      // this.dataFormUpload.project_id = updateData.project;
      // this.dataFormUpload.OU_id = updateData.OU;
      // this.dataFormUpload.BU_id = updateData.BU;
      // this.dataFormUpload.DU_id = updateData.DU;
      // this.dataFormUpload.score = updateData.score;
      this.getStatus(updateData);
    })
    this._filterService.listen().subscribe((filter: any) => {

      this.filter = filter;
      console.log(this.statusType);
      if (this.statusType == undefined) {
        this.ngOnInit();
      }
      else {
        this.getStatus(this.statusType);
      }
    })
  }

  ngOnInit() {

    this.attention = 0;
    this.watsonAdvice.set("communication", this.commAdvice);
    this.watsonAdvice.set("deliverables", this.deliAdvice);
    this.watsonAdvice.set("expertise", this.expertAdvice);
    this.watsonAdvice.set("projectmanagement", this.projMjmtAdvice);

    this._adminService.getStatusData(this.filter).subscribe(res => {
      // this.feedbacks = res.rows;
      // console.log(JSON.stringify(res));
      res.rows.forEach(element => {
        // var myDate = element.doc.date; // dd-mm-yyyy
        // var chunks = myDate.split('-'); , date: element.doc.date
        // element.doc.date = chunks[1] + '-' + chunks[0] + '-' + chunks[2]; // mm-dd-yyyy

        var types: any = [];
        var subTypes: any = [];

        if (element.doc.entity.quality.score) {
          types.push("Quality")
          if (element.doc.entity.quality.deliverables)
            subTypes.push("Deliverables")
          if (element.doc.entity.quality.documentation)
            subTypes.push("Documentation")
        }
        if (element.doc.entity.people.score) {
          types.push("People")
          if (element.doc.entity.people.expertise)
            subTypes.push("Expertise")
          if (element.doc.entity.people.knowledge)
            subTypes.push("Knowledge")
          if (element.doc.entity.people.communication)
            subTypes.push("Communication")
          if (element.doc.entity.people.commitment)
            subTypes.push("Commitment")
        }
        if (element.doc.entity.governance.score) {
          types.push("Governance")
          if (element.doc.entity.governance.risk_management)
            subTypes.push("Risk Management")
          if (element.doc.entity.governance.project_management)
            subTypes.push("Project Management")

        }

        var typeString = "-";
        var subTypeString = "-";

        if (types.length != 0) {
          typeString = types.join();
          if (subTypes != 0)
            subTypeString = subTypes.join();
        }

        if (element.doc.entity.score <= 5) {
          this.attention += 1;
        }
        // var tempArr = element.doc.project_id.split("_");
        // var projName=tempArr[0]+"_"+tempArr[2];
        this.feedbacks.push({ id: element.doc.project_id, project_name: element.doc.project_name, level: element.doc.OU_id, sublevel1: typeString, sublevel2: subTypeString, score: element.doc.entity.score, entity: element.doc.entity });
      });

      // this.sortDate();
    }, err => console.log(err));

    // console.log("Feedback :"+JSON.stringify(this.feedbacks))
  }


  sortDate() {
    this.feedbacks.sort(function (a, b) {
      // console.log("before dates" + a.doc.date + " & " + b.doc.date);
      a = new Date(a.date);
      b = new Date(b.date);
      // console.log("after dates" + a + " & " + b);
      return b - a;
    });
    // console.log("after sort:");
    // console.log(this.feedbacks);

    this.feedbacks.forEach(element => {
      var myDate = element.date; // mm-dd-yyyy
      var chunks = myDate.split('-');
      element.date = chunks[1] + '-' + chunks[0] + '-' + chunks[2]; // dd-mm-yyyy
    });
  }

  getStatus(view) {

    this.scoreString = "Total Score";
    this.project = true;
    this.feedbacks = [];
    this.attention = 0;
    // this.emailUploadDetected=true;              
    if (view.type == "OU") {

      this.level = "Business Unit";
      this.subLevel1 = "Types";
      this.subLevel2 = "SubTypes";

      this._adminService.getStatusForOu(view.id, this.filter).subscribe(res => {
        // console.log(res);
        res.rows.forEach(element => {
          // var myDate = element.doc.date; // dd-mm-yyyy
          // var chunks = myDate.split('-');
          // element.doc.date = chunks[1] + '-' + chunks[0] + '-' + chunks[2]; // mm-dd-yyyy


          var types: any = [];
          var subTypes: any = [];

          if (element.doc.entity.quality.score) {
            types.push("Quality")
            if (element.doc.entity.quality.deliverables)
              subTypes.push("Deliverables")
            if (element.doc.entity.quality.documentation)
              subTypes.push("Documentation")
          }
          if (element.doc.entity.people.score) {
            types.push("People")
            if (element.doc.entity.people.expertise)
              subTypes.push("Expertise")
            if (element.doc.entity.people.knowledge)
              subTypes.push("Knowledge")
            if (element.doc.entity.people.communication)
              subTypes.push("Communication")
            if (element.doc.entity.people.commitment)
              subTypes.push("Commitment")
          }
          if (element.doc.entity.governance.score) {
            types.push("Governance")
            if (element.doc.entity.governance.risk_management)
              subTypes.push("Risk Management")
            if (element.doc.entity.governance.project_management)
              subTypes.push("Project Management")

          }

          var typeString = "-";
          var subTypeString = "-";

          if (types.length != 0) {
            typeString = types.join();
            if (subTypes != 0)
              subTypeString = subTypes.join();
          }


          if (element.doc.entity.score <= 5) {
            this.attention += 1;
          }
          this.feedbacks.push({ id: element.doc.project_id, project_name: element.doc.project_name, level: element.doc.BU_id, sublevel1: typeString, sublevel2: subTypeString, score: element.doc.entity.score, entity: element.doc.entity });
        });
      }, err => console.log(err));
    }
    else if (view.type == "BU") {

      this.level = "Delivery Unit";
      this.subLevel1 = "Types";
      this.subLevel2 = "SubTypes";

      this._adminService.getStatusForBu(view.id, this.filter).subscribe(res => {
        res.rows.forEach(element => {
          // var myDate = element.doc.date; // dd-mm-yyyy
          // var chunks = myDate.split('-');
          // element.doc.date = chunks[1] + '-' + chunks[0] + '-' + chunks[2]; // mm-dd-yyyy

          var types: any = [];
          var subTypes: any = [];


          if (element.doc.entity.quality.score) {
            types.push("Quality")
            if (element.doc.entity.quality.deliverables)
              subTypes.push("Deliverables")
            if (element.doc.entity.quality.documentation)
              subTypes.push("Documentation")
          }
          if (element.doc.entity.people.score) {
            types.push("People")
            if (element.doc.entity.people.expertise)
              subTypes.push("Expertise")
            if (element.doc.entity.people.knowledge)
              subTypes.push("Knowledge")
            if (element.doc.entity.people.communication)
              subTypes.push("Communication")
            if (element.doc.entity.people.commitment)
              subTypes.push("Commitment")
          }
          if (element.doc.entity.governance.score) {
            types.push("Governance")
            if (element.doc.entity.governance.risk_management)
              subTypes.push("Risk Management")
            if (element.doc.entity.governance.project_management)
              subTypes.push("Project Management")

          }

          var typeString = "-";
          var subTypeString = "-";

          if (types.length != 0) {
            typeString = types.join();
            if (subTypes != 0)
              subTypeString = subTypes.join();
          }



          if (element.doc.entity.score <= 5) {
            this.attention += 1;
          }
          this.feedbacks.push({ id: element.doc.project_id, project_name: element.doc.project_name, level: element.doc.DU_id, sublevel1: typeString, sublevel2: subTypeString, score: element.doc.entity.score, entity: element.doc.entity });
        });

      }, err => console.log(err));
    }
    else if (view.type == "DU") {
      this.project = false;
      this.scoreString = "Score";
      this.level = "Organization Unit";
      this.subLevel1 = "Business Unit";
      this.subLevel2 = "Delivery Unit";

      this._adminService.getStatusForDu(view.id).subscribe(res => {
        res.rows.forEach(element => {

          var types: any = [];
          var subTypes: any = [];


          if (element.doc.entity.quality.score) {
            types.push("Quality")
            if (element.doc.entity.quality.deliverables)
              subTypes.push("Deliverables")
            if (element.doc.entity.quality.documentation)
              subTypes.push("Documentation")
          }
          if (element.doc.entity.people.score) {
            types.push("People")
            if (element.doc.entity.people.expertise)
              subTypes.push("Expertise")
            if (element.doc.entity.people.knowledge)
              subTypes.push("Knowledge")
            if (element.doc.entity.people.communication)
              subTypes.push("Communication")
            if (element.doc.entity.people.commitment)
              subTypes.push("Commitment")
          }
          if (element.doc.entity.governance.score) {
            types.push("Governance")
            if (element.doc.entity.governance.risk_management)
              subTypes.push("Risk Management")
            if (element.doc.entity.governance.project_management)
              subTypes.push("Project Management")

          }

          var typeString = "-";
          var subTypeString = "-";

          if (types.length != 0) {
            typeString = types.join();
            if (subTypes != 0)
              subTypeString = subTypes.join();
          }

          if (element.doc.entity.score <= 5) {
            this.attention += 1;
          }

          this.feedbacks.push({date:element.doc.date, id: element.doc.project_id, project_name: element.doc.project_name, level: element.doc.OU_id, sublevel1: element.doc.BU_id, sublevel2: element.doc.DU_id, score: element.doc.entity.score, entity: element.doc.entity, types: typeString, subTypes: subTypeString });
        });
        this.sortDate();
      }, err => console.log(err));
    }
    else if (view.type == "OUstatus") {
      this.level = "Organization Unit";
      this.subLevel1 = "Types";
      this.subLevel2 = "SubTypes";

      this._adminService.getStatusData(this.filter).subscribe(res => {
        res.rows.forEach(element => {

          var types: any = [];
          var subTypes: any = [];

          if (element.doc.entity.quality.score) {
            types.push("Quality")
            if (element.doc.entity.quality.deliverables)
              subTypes.push("Deliverables")
            if (element.doc.entity.quality.documentation)
              subTypes.push("Documentation")
          }
          if (element.doc.entity.people.score) {
            types.push("People")
            if (element.doc.entity.people.expertise)
              subTypes.push("Expertise")
            if (element.doc.entity.people.knowledge)
              subTypes.push("Knowledge")
            if (element.doc.entity.people.communication)
              subTypes.push("Communication")
            if (element.doc.entity.people.commitment)
              subTypes.push("Commitment")
          }
          if (element.doc.entity.governance.score) {
            types.push("Governance")
            if (element.doc.entity.governance.risk_management)
              subTypes.push("Risk Management")
            if (element.doc.entity.governance.project_management)
              subTypes.push("Project Management")

          }

          var typeString = "-";
          var subTypeString = "-";

          if (types.length != 0) {
            typeString = types.join();
            if (subTypes != 0)
              subTypeString = subTypes.join();
          }


          if (element.doc.entity.score <= 5) {
            this.attention += 1;
          }

          this.feedbacks.push({ id: element.doc.project_id, project_name: element.doc.project_name, level: element.doc.OU_id, sublevel1: typeString, sublevel2: subTypeString, score: element.doc.entity.score, entity: element.doc.entity });
        });

      }, err => console.log(err));
    }
  }

  @Input()
  set objStatus(objStatus: any) {
    if (this.statusType === objStatus) {
      return;
    }
    this.statusType = objStatus;
    console.log("In status report: " + JSON.stringify(this.statusType));

    this.getStatus(this.statusType);
  }

  get obj(): any {

    return this.statusType;
  }

  actionPopup(id) {

    this.default=true;
    this.notDefault=false;
    this.advices = [];
    this.loading = false;
    this.tableLoading = true;

    var projId = id;
    var entity;
    var score;

    for (var i = 0; i < this.feedbacks.length; i++) {
      if (this.feedbacks[i].id == projId) {
        // projId = this.feedbacks[i].project_id;
        entity = this.feedbacks[i].entity
        break;
      }
    }

    // console.log("Entity: " + JSON.stringify(entity) + "ID: " + projId);
    if (entity.quality.score && entity.quality.score <= 5) {
      console.log("Quality lesst than 5");
      if (entity.quality.deliverables && entity.quality.deliverables <= 5) {
        this.advices.push({ subType: "Deliverables", advicesArr: this.watsonAdvice.get("deliverables") });
        // this.watsonAdvice.get("deliverables").forEach(element => {
        //   this.advices.push(element);
        // });
      }

      if (entity.quality.documentation && entity.quality.documentation <= 5) {
        // this.advices.concat(this.watsonAdvice.get("documentation"));
      }
      console.log("Advices: " + this.advices);
    }
    if (entity.people.score && entity.people.score <= 5) {
      console.log("people lesst than 5");
      if (entity.people.expertise && entity.people.expertise <= 5) {
        this.advices.push({ subType: "Expertise", advicesArr: this.watsonAdvice.get("expertise") });
        // this.watsonAdvice.get("expertise").forEach(element => {
        //   this.advices.push(element);
        // });
      }
      if (entity.people.knowledge && entity.people.knowledge <= 5) {
        // this.advices.concat(this.watsonAdvice.get("knowledge"));
      }
      if (entity.people.communication && entity.people.communication <= 5) {
        this.advices.push({ subType: "Communication", advicesArr: this.watsonAdvice.get("communication") });
        // this.watsonAdvice.get("communication").forEach(element => {
        //   this.advices.push(element);
        // });
      }
      if (entity.people.commitment && entity.people.commitment <= 5) {
        // this.advices.concat(this.watsonAdvice.get("commitment"));
      }
      console.log("Advices: " + this.advices);
    }
    if (entity.governance.score && entity.governance.score <= 5) {
      if (entity.governance.risk_management && entity.governance.risk_management <= 5) {
        // this.advices.concat(this.watsonAdvice.get("riskmanagement"));
      }
      if (entity.governance.project_management && entity.governance.project_management <= 5) {
        this.advices.push({ subType: "Project Management", advicesArr: this.watsonAdvice.get("projectmanagement") });
        // this.watsonAdvice.get("projectmanagement").forEach(element => {
        //   this.advices.push(element);
        // });
      }

      console.log("Advices: " + this.advices);
    }

    console.log("Length: "+this.advices.length)
    if (this.advices.length == 0) {
      this.default=false;
      this.notDefault=true;
      this.advices.push("Guide will have details about how to approach different problems, where to search for help, what scenarios to consider for unit testing etc.")
      this.advices.push("Identify risks up front.")
      this.advices.push("Code review guideline prepared and shared with reviewers.")
      this.advices.push("Involve the new members in the team on RCA exercise to gain product knowledge.");
    }
    console.log("Advices: " + this.advices);
    this._adminService.getProjectAttributes(projId).subscribe(attr => {

      this.projAttributes = attr;
      this.loading = true;
      this.tableLoading = false;
      console.log(JSON.stringify(this.projAttributes))
    }, err => console.log(err));



    // this._actionService.filter(id);
  }

  sortFeedbacks() {
    if (this.toggle == "up") {
      this.feedbacks.sort(function (a, b) {
        // console.log("before dates" + a.doc.date + " & " + b.doc.date);

        a = a.score;
        b = b.score;
        // console.log("after dates" + a + " & " + b);
        return a - b;
      });
      this.toggle = "down"
    }
    else if (this.toggle == "down") {
      this.feedbacks.sort(function (a, b) {
        // console.log("before dates" + a.doc.date + " & " + b.doc.date);

        a = a.score;
        b = b.score;
        // console.log("after dates" + a + " & " + b);
        return b - a;
      });
      this.toggle = "up"
    }
    
  }

}
