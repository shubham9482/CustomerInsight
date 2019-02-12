import { AdminformComponent } from './adminform/adminform.component';
import { AppComponent } from './app.component';
import { RouterModule,Routes} from '@angular/router'
import { NgModule } from '@angular/core';

const router:Routes=[
  { path:'adminform',component: AdminformComponent}
  

]

console.info(AdminformComponent);

@NgModule({
  imports: [
      RouterModule.forRoot(router)
    ],
exports:[
    RouterModule
]
})
export class AppRouterModule { }
export const routingComponents=[AdminformComponent]