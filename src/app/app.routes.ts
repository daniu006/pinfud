import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () => import('./presentation/splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'welcome',
    loadComponent: () => import('./presentation/welcome/welcome.page').then(m => m.WelcomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./presentation/auth/login/login.page').then(m => m.loginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./presentation/auth/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./presentation/home/home.page').then(m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'dish',
    loadComponent: () => import('./presentation/dish/dish.page').then(m => m.DishPage),
    canActivate: [authGuard]
  },
  {
    path: 'upload',
    loadComponent: () => import('./presentation/upload/upload.page').then(m => m.UploadPage),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./presentation/profile/profile.page').then(m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'search',
    loadComponent: () => import('./presentation/search/search.page').then(m => m.SearchPage),
    canActivate: [authGuard]
  },

  {
    path: 'costa',
    loadComponent: () => import('./presentation/regions/costa/costa.page').then(m => m.CostaPage),
    canActivate: [authGuard]
  },
  {
    path: 'sierra',
    loadComponent: () => import('./presentation/regions/sierra/sierra.page').then(m => m.SierraPage),
    canActivate: [authGuard]
  },
  {
    path: 'oriente',
    loadComponent: () => import('./presentation/regions/oriente/oriente.page').then(m => m.OrientePage),
    canActivate: [authGuard]
  },
  {
    path: 'galapagos',
    loadComponent: () => import('./presentation/regions/galapagos/galapagos.page').then(m => m.GalapagosPage),
    canActivate: [authGuard]
  },
];
