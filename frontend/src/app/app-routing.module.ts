import type { Routes } from "@angular/router"

// Components
import { LoginComponent } from "./components/login/login.component"

// Admin Components
import { AdminDashboardComponent } from "./components/admin-dashboard/admin-dashboard.component"
import { UserManagementComponent } from "./components/user-management/user-management.component"
import { CreateUserComponent } from "./components/create-user/create-user.component"

// Enseignant Components
import { EnseignantDashboardComponent } from "./components/enseignant-dashboard/enseignant-dashboard.component"

// Etudiant Components
import { EtudiantDashboardComponent } from "./components/etudiant-dashboard/etudiant-dashboard.component"

// Shared Components
import { TutorialsListComponent } from "./components/tutorials-list/tutorials-list.component"
import { TutorialDetailsComponent } from "./components/tutorial-details/tutorial-details.component"
import { AddTutorialComponent } from "./components/add-tutorial/add-tutorial.component"

// Guards
import { AuthGuard } from "./guards/auth-guard"
import { RoleGuard } from "./guards/role-guard"

export const routes: Routes = [
  // Route par défaut
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },

  // Route de connexion (accessible à tous)
  {
    path: "login",
    component: LoginComponent,
  },

  // 👑 ROUTES ADMIN
  {
    path: "admin",
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["admin"] },
  },
  {
    path: "admin/users",
    component: UserManagementComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["admin"] },
  },
  {
    path: "admin/create-user",
    component: CreateUserComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["admin"] },
  },

  // 👨‍🏫 ROUTES ENSEIGNANT
  {
    path: "enseignant",
    component: EnseignantDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["admin", "enseignant"] },
  },

  // 👨‍🎓 ROUTES ETUDIANT
  {
    path: "etudiant",
    component: EtudiantDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["admin", "enseignant", "etudiant"] },
  },

  // 📚 ROUTES TUTORIELS (selon permissions)
  {
    path: "tutorials",
    component: TutorialsListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["admin", "enseignant", "etudiant"] },
  },
  {
    path: "tutorials/:id",
    component: TutorialDetailsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["admin", "enseignant"] }, // Seuls admin et enseignant peuvent éditer
  },
  {
    path: "add",
    component: AddTutorialComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ["admin", "enseignant"] }, // Seuls admin et enseignant peuvent créer
  },

  // Route wildcard (doit être en dernier)
  {
    path: "**",
    redirectTo: "/login",
  },
]
