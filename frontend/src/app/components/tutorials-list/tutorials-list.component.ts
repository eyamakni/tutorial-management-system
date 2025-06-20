import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import type { Tutorial } from "../../models/tutorial.model"
import { TutorialService } from "../../services/tutorial.service"
import { AuthService } from "../../services/auth.service" // 🆕 NOUVEAU

@Component({
  selector: "app-tutorials-list",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./tutorials-list.component.html",
  styleUrls: ["./tutorials-list.component.css"],
})
export class TutorialsListComponent implements OnInit {
  tutorials?: Tutorial[]
  currentTutorial: Tutorial = {}
  currentIndex = -1
  title = ""
  
  // 🆕 NOUVEAU : Vérification des permissions
  canEdit = false
  canDelete = false

  constructor(
    private tutorialService: TutorialService,
    private authService: AuthService // 🆕 NOUVEAU
  ) {}

  ngOnInit(): void {
    this.retrieveTutorials()
    this.checkPermissions() // 🆕 NOUVEAU
  }

  // 🆕 NOUVEAU : Vérifier les permissions selon le rôle
  private checkPermissions(): void {
    const user = this.authService.getCurrentUser()
    this.canEdit = user?.role === 'admin' || user?.role === 'enseignant'
    this.canDelete = user?.role === 'admin' || user?.role === 'enseignant'
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll().subscribe({
      next: (data) => {
        this.tutorials = data
        console.log(data)
      },
      error: (e) => console.error(e),
    })
  }

  refreshList(): void {
    this.retrieveTutorials()
    this.currentTutorial = {}
    this.currentIndex = -1
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial
    this.currentIndex = index
  }

  removeAllTutorials(): void {
    // 🔄 MODIFIÉ : Vérification des permissions
    if (!this.canDelete) {
      alert('Vous n\'avez pas les permissions pour supprimer les tutoriels')
      return
    }

    this.tutorialService.deleteAll().subscribe({
      next: (res) => {
        console.log(res)
        this.refreshList()
      },
      error: (e) => console.error(e),
    })
  }

  searchTitle(): void {
    this.currentTutorial = {}
    this.currentIndex = -1

    this.tutorialService.findByTitle(this.title).subscribe({
      next: (data) => {
        this.tutorials = data
        console.log(data)
      },
      error: (e) => console.error(e),
    })
  }
}