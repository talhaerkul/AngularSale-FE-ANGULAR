import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { HomeComponent } from './ui/components/home/home.component';
import { UiLayoutComponent } from './ui/ui-layout/ui-layout.component';
import { AuthChildGuard, AuthGuard } from './guards/common/auth.guard';
import { ListComponent } from './ui/components/products/list/list.component';

const routes: Routes = [
  //
  {
    path: "admin", component: LayoutComponent, children: [
      { path: "", component: DashboardComponent },
      { path: "unauthorized", loadChildren: () => import("./admin/components/unauthorized/unauthorized.module").then(module => module.UnauthorizedModule) },
      { path: "customers", loadChildren: () => import("./admin/components/customers/customers.module").then(module => module.CustomersModule) },
      { path: "products", loadChildren: () => import("./admin/components/products/products.module").then(module => module.ProductsModule) },
      { path: "orders", loadChildren: () => import("./admin/components/orders/orders.module").then(module => module.OrdersModule) },
      { path: "auth", loadChildren: () => import("./admin/components/authorize-menu/authorize-menu.module").then(module => module.AuthorizeMenuModule) },
      { path: "users", loadChildren: () => import("./admin/components/user/user.module").then(module => module.UserModule) },
      { path: "role", loadChildren: () => import("./admin/components/role/role.module").then(module => module.RoleModule) }
    ], canActivate: [AuthGuard], canActivateChild: [AuthChildGuard]
  },
  {
    path: "", component: UiLayoutComponent, children: [
      { path: "", component: ListComponent },
      { path: "saler", loadChildren: () => import("./ui/components/saler/saler.module").then(module => module.SalerModule) },
      { path: "saler/showcase", loadChildren: () => import("./ui/components/saler/showcase/showcase.module").then(module => module.ShowcaseModule) },
      { path: "saler/showcase/:id", loadChildren: () => import("./ui/components/saler/showcase/showcase.module").then(module => module.ShowcaseModule) },
      { path: "saler/showcase/:id/:page", loadChildren: () => import("./ui/components/saler/showcase/showcase.module").then(module => module.ShowcaseModule) },
      { path: "saler/:name", loadChildren: () => import("./ui/components/saler/saler.module").then(module => module.SalerModule) },
      { path: "saler/:name/:page", loadChildren: () => import("./ui/components/saler/saler.module").then(module => module.SalerModule) },
      { path: "basket", loadChildren: () => import("./ui/components/baskets/baskets.module").then(module => module.BasketsModule) },
      { path: "orders", loadChildren: () => import("./ui/components/orders/orders.module").then(module => module.OrdersModule) },
      { path: "products", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule) },
      { path: "products/:page", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule) },
      { path: "products/brands/:brand", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule) },
      { path: "products/brands/:brand/:page", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule) },
      { path: "products/categories/:category", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule) },
      { path: "products/categories/:category/:page", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule) },
      { path: "products/details/:id", loadChildren: () => import("./ui/components/products/details/details.module").then(module => module.DetailsModule) },
      { path: "register", loadChildren: () => import("./ui/components/register/register.module").then(module => module.RegisterModule) },
      { path: "login", loadChildren: () => import("./ui/components/login/login.module").then(module => module.LoginModule) },
      { path: "reset-password/:userId/:resetToken", loadChildren: () => import("./ui/components/update-password/update-password.module").then(module => module.UpdatePasswordModule) },
      { path: "unauthorized", loadChildren: () => import("./admin/components/unauthorized/unauthorized.module").then(module => module.UnauthorizedModule) },

    ]
  }

  //
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
