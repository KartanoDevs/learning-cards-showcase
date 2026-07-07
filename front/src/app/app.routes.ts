import { Routes } from '@angular/router';
import { ListGroupsPage } from './pages/list-groups/list-groups.page';
import { ListCardsComponent } from './pages/list-cards/list-cards.page';
import { AdminViewComponent } from './components/admin/admin-view.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-groups',
    pathMatch: 'full'
  },

  {
    path: 'list-groups',
    component: ListGroupsPage
  },

  {
    path: 'list-cards/:id',
    component: ListCardsComponent
  },

    {
    path: 'admin',
    component: AdminViewComponent
  },

  {
    path: '**',
    redirectTo: 'list-groups'
  }

];
