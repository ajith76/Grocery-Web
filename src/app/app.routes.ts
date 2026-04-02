import { Routes } from '@angular/router';
import { LoginScreen } from './login/login-screen/login-screen';
import { DashoardScreen } from './dashboard/dashoard-screen/dashoard-screen';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginScreen },
  { path: 'register', component: LoginScreen },
  { path: 'dashboard', component: DashoardScreen },
  { path: '**', redirectTo: 'login' }
];
