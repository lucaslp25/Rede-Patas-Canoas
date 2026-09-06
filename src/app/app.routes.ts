import { Routes } from '@angular/router';

// Feed, Mapa e Sobre são abas (renderizam dentro do dock de navegação).
// Cadastro e Detalhe são páginas "empurradas" (sem o dock, com botão voltar).
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      {
        path: 'feed',
        loadComponent: () => import('./feed/feed.page').then(m => m.FeedPage),
      },
      {
        path: 'mapa',
        loadComponent: () => import('./mapa/mapa.page').then(m => m.MapaPage),
      },
      {
        path: 'sobre',
        loadComponent: () => import('./sobre/sobre.page').then(m => m.SobrePage),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];
