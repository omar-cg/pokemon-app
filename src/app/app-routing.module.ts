import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileCreationComponent } from './Pages/profile-creation/profile-creation.component';

const routes: Routes = [
  {path: '', redirectTo: 'profile-creation', pathMatch: 'full'},
  {path: 'profile-creation', component: ProfileCreationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
