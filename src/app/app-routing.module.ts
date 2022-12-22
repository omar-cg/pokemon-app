import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './Pages/edit-profile/edit-profile.component';
import { HomeComponent } from './Pages/home/home.component';
import { ProfileCreationComponent } from './Pages/profile-creation/profile-creation.component';
import { ProfileDetailComponent } from './Pages/profile-detail/profile-detail.component';
import { ProfilesCreatedComponent } from './Pages/profiles-created/profiles-created.component';

const routes: Routes = [
  {path: '', redirectTo: 'inicio', pathMatch: 'full'},
  {path: 'creacion-perfil', component: ProfileCreationComponent},
  {path: 'inicio', component: HomeComponent},
  {path: 'perfiles-creados', component: ProfilesCreatedComponent},
  {path: 'detalle-perfil', component: ProfileDetailComponent},
  {path: 'edicion-perfil', component: EditProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
