import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet, RouterModule, Router } from "@angular/router"
import  { AuthService } from "./services/auth.service"
import type { User } from "./models/user.model"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class App implements OnInit {
  title = "Tutorial Management System"
  currentUser: User | null = null
  isLoggedIn = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté au démarrage
    this.currentUser = this.authService.getCurrentUser()
    this.isLoggedIn = !!this.currentUser

    // S'abonner aux changements d'état d'authentification
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
      this.isLoggedIn = !!user
    })
  }

  logout(): void {
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      this.authService.logout()
      this.router.navigate(["/login"])
    }
  }

  // Méthodes pour vérifier les rôles
  isAdmin(): boolean {
    return this.currentUser?.role === "admin"
  }

  isEnseignant(): boolean {
    return this.currentUser?.role === "enseignant"
  }

  isEtudiant(): boolean {
    return this.currentUser?.role === "etudiant"
  }

  // Navigation selon le rôle
  goToDashboard(): void {
    if (this.isAdmin()) {
      this.router.navigate(["/admin"])
    } else if (this.isEnseignant()) {
      this.router.navigate(["/enseignant"])
    } else if (this.isEtudiant()) {
      this.router.navigate(["/etudiant"])
    }
  }

  // Vérifier si l'utilisateur peut accéder aux tutoriels
  canAccessTutorials(): boolean {
    return this.isAdmin() || this.isEnseignant()
  }

  // Vérifier si l'utilisateur peut créer des tutoriels
  canCreateTutorials(): boolean {
    return this.isAdmin() || this.isEnseignant()
  }
}
