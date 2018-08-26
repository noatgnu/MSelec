import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MsReformatComponent} from "./components/ms-reformat/ms-reformat.component";

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
  {
    path: 'msreformat',
    component: MsReformatComponent
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
