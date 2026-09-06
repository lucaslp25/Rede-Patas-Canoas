import { Routes } from '@angular/router';

// Feed, Mapa e Sobre são abas (tudo filhas do mesmo componente)
// Cadastro e Detalhe são páginas empilhadas
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', loadComponent: () => import('./feed/feed.page').then(m => m.FeedPage) },
      { path: 'mapa', loadComponent: () => import('./mapa/mapa.page').then(m => m.MapaPage) },
      { path: 'sobre', loadComponent: () => import('./sobre/sobre.page').then(m => m.SobrePage) },
    ],
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page').then(m => m.CadastroPage),
  },
  {
    path: 'detalhe',
    loadComponent: () => import('./detalhe/detalhe.page').then(m => m.DetalhePage),
  },
  { path: '**', redirectTo: '' },
];