import { Routes } from '@angular/router';

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
    loadComponent: () => import('./presentation/welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./presentation/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./presentation/auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./presentation/home/home.page').then( m => m.HomePage)
  },
    
  
  {
    path: 'dish',
    loadComponent: () => import('./presentation/dish/dish.page').then( m => m.DishPage)
  },
  {
    path: 'upload',
    loadComponent: () => import('./presentation/upload/upload.page').then( m => m.UploadPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./presentation/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'search',
    loadComponent: () => import('./presentation/search/search.page').then( m => m.SearchPage)
  },
];
