import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router" // 🆕 NOUVEAU : Import Router
import { TutorialService } from "../../services/tutorial.service"
import { AuthService } from "../../services/auth.service" // 🆕 NOUVEAU : Import AuthService

@Component({
  selector: "app-add-tutorial",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./add-tutorial.component.html",
  styleUrls: ["./add-tutorial.component.css"],
})
export class AddTutorialComponent {
  title = ""
  description = ""
  published = false
  submitted = false

  constructor(
    private tutorialService: TutorialService,
    private authService: AuthService, // 🆕 NOUVEAU
    private router: Router // 🆕 NOUVEAU
  ) {}

  saveTutorial(): void {
    const data = {
      title: this.title,
      description: this.description,
      published: this.published,
    }

    this.tutorialService.create(data).subscribe({
      next: (res) => {
        console.log(res)
        this.submitted = true
      },
      error: (e) => {
        console.error(e)
        // 🆕 NOUVEAU : Gestion d'erreur d'authentification
        if (e.status === 401 || e.status === 403) {
          alert('Vous n\'avez pas les permissions pour créer un tutoriel')
          this.redirectByRole()
        }
      },
    })
  }

  newTutorial(): void {
    this.submitted = false
    this.title = ""
    this.description = ""
    this.published = false
  }

  // 🆕 NOUVEAU : Redirection selon le rôle
  private redirectByRole(): void {
    const user = this.authService.getCurrentUser()
    if (user) {
      switch (user.role) {
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
}