import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import type { LoginRequest } from "../../models/user.model"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: "",
    password: "",
  }

  isLoading = false
  errorMessage = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = "Email et mot de passe sont requis"
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log("Connexion réussie:", response)
        // 🔄 MODIFIÉ : Redirection selon le rôle
        this.redirectByRole(response.user.role!)
      },
      error: (error) => {
        console.error("Erreur de connexion:", error)
        this.errorMessage = error.error?.message || "Erreur de connexion"
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      },
    })
  }

  //  NOUVEAU : Redirection selon le rôle
  private redirectByRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin'])
        break
      case 'enseignant':
        this.router.navigate(['/enseignant'])
        break
      case 'etudiant':
        this.router.navigate(['/etudiant'])
        break
      default:
        this.router.navigate(['/login'])
    }
  }
}