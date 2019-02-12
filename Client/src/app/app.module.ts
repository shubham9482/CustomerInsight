import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng2-select'
import { AppComponent } from './app.component';
import { routingComponents, AppRouterModule } from './app.routermodule'
import { AdminService } from './services/admin.service';
import { UpdatestatustableService } from './services/updatestatustable.service';
import { UpdatecurrentviewService } from './services/updatecurrentview.service';
import { DoughnutComponent } from './doughnut/doughnut.component'
import { NvD3Module } from 'angular2-nvd3';
import { BargraphComponent } from './bargraph/bargraph.component';
import { EntityserviceService } from './entityservice.service';
import { MdDialogModule  } from '@angular/material';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {DonutPopup} from './app.component';
// import {EntityPopup} from './app.component';
import {AdminformComponent} from './adminform/adminform.component';
import {  ActionService} from './services/action.service';
import { UpdateStatusService } from './services/updatestatus.service'
import { SwitchofFormbuttonService } from './services/switchof-formbutton.service'
import { RouterModule, Routes } from '@angular/router';
import { DrillDownComponent } from './drill-down/drill-down.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { PichartComponent } from './pichart/pichart.component';
import { StackedbarComponent } from './stackedbar/stackedbar.component';
import { StatusreportComponent } from './statusreport/statusreport.component';
import { LinechartComponent } from './linechart/linechart.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { AlertService } from './services/alert.service';
import { FilterService } from './services/filter.service';


const appRoutes: Routes = [
  // { path: '', component: AppComponent },
  { path: 'details',      component: DrillDownComponent },
  { path: 'home',      component: HomeComponent },
  { path: '',      component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    DoughnutComponent,
    BargraphComponent,
    AdminformComponent,
    PageNotFoundComponent,
    DrillDownComponent,
    HomeComponent,
    PichartComponent,
    StackedbarComponent,
    StatusreportComponent,
    LinechartComponent,
    LoginComponent,
    
  ],
  entryComponents:[AdminformComponent,BargraphComponent],
  imports: [
    MdDialogModule,BrowserModule, ReactiveFormsModule, HttpModule, FormsModule, SelectModule, AppRouterModule,NvD3Module,BrowserAnimationsModule,RouterModule.forRoot(appRoutes)],
    providers: [FilterService,AlertService,AuthenticationService,AdminService,EntityserviceService,UpdateStatusService,SwitchofFormbuttonService,UpdatecurrentviewService,UpdatestatustableService,ActionService],
    bootstrap: [AppComponent],
})
export class AppModule { }