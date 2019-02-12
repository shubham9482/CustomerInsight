import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  
})
export class LoginComponent implements OnInit {


  private loading:boolean=false;
  private model: any = {};

  constructor(private router: Router,private authenticationService: AuthenticationService,private alertService: AlertService) { }

  ngOnInit() {
    this.authenticationService.logout();
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
        .subscribe(
            data => {
                this.router.navigate(["/home"]);
            },
            error => {
                this.alertService.error(JSON.stringify(error));
                console.log(JSON.stringify(error));
                // this.router.navigate(["/"]);
                this.loading = false;
            });
}
}
