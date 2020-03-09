import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateSystemComponent } from './components/create-system/create-system.component';
import { EditComponent } from './pages/edit/edit.component';


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "create", component: CreateSystemComponent },
  { path: "edit/:id", component: EditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
