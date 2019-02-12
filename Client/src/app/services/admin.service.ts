
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable()
export class AdminService {

  private _masterDataUrl = "/server/insights/metadata/admin";
  private _analyzeUrl = "/server/insights/analyze"
  private _data = "/server/admin/data";
  private _line = "/server/insights/data/project";
  private _pi = "/server/insights/data/ou";
  private _doughnut = "/server/insights/data/total"; 
  private _people = "/server/insights/data/comp/people";
  private _quality = "/server/insights/data/comp/quality";
  private _governance = "/server/insights/data/comp/governance";
  private _stackedBar = "/server/insights/data/bar/ou/all";
  private _allEntities = "/server/insights/data/comp/score";
  private _allBuOnOUId = "/server/insights/data/bu"; // +:filter
  private _allDuOnBUId = "/server/insights/data/du"; // +:filter 
  private _allFeedbackOnBU = "/server/insights/data/bar/bu"; //+:filter
  private _allFeedbackOnDU = "/server/insights/data/bar/du"; //+:filter
  private _subFeedbackOnOu = "/server/insights/data/bar/ou";
  private _subFeedbackOnBu = "/server/insights/data/bar/bu";
  private _subFeedbackOnDu = "/server/insights/data/bar/du";
  private _statusData = "/server/insights/data/table/ou/all ";
  private _projectList = "/server/insights/projectList";
  private _projectForDu = "/server/insights/data/project"
  private _statusDataForOu  = "/server/insights/data/table/bu";  
  private _statusDataForBu  = "/server/insights/data/table/du";
  private _statusDataForDu  = "/server/insights/data/table/project";    
  private _projectAttribute  = "/server/insights/projectAttribute";
  // /insights/data/table/:level/:pre/:duration
  
  
  

  constructor(private _http: Http) {
  }

  getMasterData() {
    //  let headers=new Headers({ 'Content-Type':'application/json'});
    // headers.append('Access-Control-Allow-Origin', '*');
    // let options=new RequestOptions({headers: headers});
    return this._http.get(this._masterDataUrl,this.jwt())
      .map((response: Response) => response.json());
  }

  analyze(data: any) {
    console.log('in service');
    console.log(data);
    var req = data;
    return this._http.post(this._analyzeUrl, req,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  uploadFile(formData: any) {
    console.log(formData);
    let headers = new Headers({ 'Content-Type': 'multipart/form-data' });  // form msg upload
    let _uploadUrl: string = "/admin/upload";
    return this._http.post(_uploadUrl, formData,this.jwt()).
      map(res => console.log(res));
  }

  getData(type) {
    return this._http.get(this._data + "/" + type,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }
  getLineData() {
    return this._http.get(this._line,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }
  getPiData(filter) {
    return this._http.get(this._pi+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getDoughnutData(filter) {
    return this._http.get(this._doughnut+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getPeopleData(filter) {
    return this._http.get(this._people+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getGovernanceData(filter) {
    return this._http.get(this._governance+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getQualityData(filter) {
    return this._http.get(this._quality+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }


  getAllEntities(filter) {
    return this._http.get(this._allEntities+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getAllEntitiesForOu(filter) {
    return this._http.get(this._stackedBar+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getAllBuForOu(id,filter) {

    return this._http.get(this._allBuOnOUId + "/"+id+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getAllDuForBu(id,filter) {

    return this._http.get(this._allDuOnBUId + "/" + id+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getFeedbackForBu(id,filter) {

    return this._http.get(this._allFeedbackOnBU + "/" + id+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getFeedbackForDu(id,filter) {

    return this._http.get(this._allFeedbackOnDU + "/" + id+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getSubFeedbackForOu(id, type,filter) {

    return this._http.get(this._subFeedbackOnOu + "/" + id + "/" + type+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getSubFeedbackForBu(id, type,filter) {

    return this._http.get(this._subFeedbackOnBu + "/" + id + "/" + type+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getSubFeedbackForDu(id, type,filter) {

    return this._http.get(this._subFeedbackOnDu + "/" + id + "/" + type+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }


  getStatusData(filter) {
    return this._http.get(this._statusData+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getProjectList() {
    return this._http.get(this._projectList,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getProjectForDu(duName) {
    return this._http.get(this._projectForDu+"/"+duName,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }


  getStatusForOu(ouName,filter) {
    return this._http.get(this._statusDataForOu+"/"+ouName+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getStatusForBu(buName,filter) {
    return this._http.get(this._statusDataForBu+"/"+buName+"/"+filter,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getStatusForDu(duName) {
    return this._http.get(this._statusDataForDu+"/"+duName+"/quarter",this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  getProjectAttributes(projId) {
    return this._http.get(this._projectAttribute+"/"+projId,this.jwt())
      .map((response: Response) => response.json(), (err: Response) => console.log(err));
  }

  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
        let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
        return new RequestOptions({ headers: headers });
    }
}
}
