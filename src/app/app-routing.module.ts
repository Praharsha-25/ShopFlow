import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOwnerComponent } from './create-owner/create-owner.component';
import { LoggedinComponent } from './loggedin/loggedin.component';
import { HistoryComponent } from './history/history.component';
import { PiechartComponent } from './piechart/piechart.component';
import { StockComponent } from './stock/stock.component';

const routes: Routes = [
  {
    path:'create-owner', component:CreateOwnerComponent
  },
  {
    path:'loggedin/:ownerId', component:LoggedinComponent
  },
  {
    path:'',redirectTo:'create-owner',pathMatch:'full'
  },
  {
    path: 'history/:ownerId', component: HistoryComponent
  },
  {
    path: 'piechart/:ownerId', component: PiechartComponent
  },
  {
    path: 'stock/:ownerId', component: StockComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
