import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'cardapio',
    loadComponent: () => import('./cardapio/cardapio').then((m) => m.Cardapio),
  },
  {
    path: 'empresa-login',
    loadComponent: () =>
      import('./empresa-login/empresa-login').then((m) => m.EmpresaLogin),
  },
    {
    path: 'admin',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
  },
  {
    path: 'admin/estoque',
    loadComponent: () =>
      import('./admin-inventory/admin-inventory').then(m => m.AdminInventory),
  },
  {
    path: 'admin/pedidos',
    loadComponent: () =>
      import('./admin-orders/admin-orders').then(m => m.AdminOrders),
  },
  {
    path: 'admin/produtos',
    loadComponent: () =>
      import('./admin-products/admin-products').then(m => m.AdminProducts),
  },
  {
    path: 'admin/clientes',
    loadComponent: () =>
    import('./client_Area/client-area').then(m => m.AdminCustomers),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'finalizar-pedido',
    loadComponent: () =>
      import('./finalizar-pedido/finalizar-pedido').then((m) => m.FinalizarPedido),
  },
  {
    path: 'cliente/perfil',
    loadComponent: () =>
      import('./cliente-perfil/cliente-perfil').then((m) => m.ClientePerfil),
  },
  {
    path: 'motoboy',
    loadComponent: () => import('./motoboy/motoboy').then((m) => m.Motoboy),
  },
  {
    path: 'cozinha',
    loadComponent: () => import('./cozinha/cozinha').then((m) => m.Cozinha),
  },
  {
    path: 'acompanhar-pedido',
    loadComponent: () =>
      import('./acompanhar-pedido/acompanhar-pedido').then((m) => m.AcompanharPedido),
  },
  {
    path: 'acompanhar-pedido/:id',
    loadComponent: () =>
      import('./acompanhar-pedido/acompanhar-pedido').then((m) => m.AcompanharPedido),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
