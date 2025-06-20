import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import  { AdminService } from "../../services/admin.service"
import  { AuthService } from "../../services/auth.service"
import type { User } from "../../models/user.model"

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = []
  stats = {
    totalUsers: 0,
    enseignants: 0,
    etudiants: 0,
    activeUsers: 0,
  }
  currentUser: User | null = null

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    this.loadUsers()
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
        this.calculateStats()

        // Log pour debug
        console.log("👥 Utilisateurs chargés:", users)
        users.forEach((user) => {
          console.log(`- ${user.username}: ${user.role}`)
        })
      },
      error: (error) => {
        console.error("Erreur lors du chargement des utilisateurs:", error)
      },
    })
  }

  private calculateStats(): void {
    this.stats.totalUsers = this.users.length
    this.stats.enseignants = this.users.filter((u) => u.role === "enseignant").length
    this.stats.etudiants = this.users.filter((u) => u.role === "etudiant").length
    this.stats.activeUsers = this.users.filter((u) => u.isActive).length
  }

  // 🔧 CORRECTION: Gérer les valeurs undefined
  getBadgeClass(role: string | undefined): string {
    if (!role) return "bg-secondary"

    switch (role) {
      case "admin":
        return "bg-danger" // Rouge pour admin
      case "enseignant":
        return "bg-success" // Vert pour enseignant
      case "etudiant":
        return "bg-info" // Bleu pour étudiant
      default:
        return "bg-secondary"
    }
  }

  getRoleDisplay(role: string | undefined): string {
    if (!role) return "❓ Inconnu"

    switch (role) {
      case "admin":
        return "👑 Administrateur"
      case "enseignant":
        return "👨‍🏫 Enseignant"
      case "etudiant":
        return "👨‍🎓 Étudiant"
      default:
        return "❓ Inconnu"
    }
  }

  toggleUserStatus(user: User): void {
    if (user.id) {
      this.adminService.toggleUserStatus(user.id).subscribe({
        next: () => {
          this.loadUsers() // Recharger la liste
        },
        error: (error) => {
          console.error("Erreur lors du changement de statut:", error)
        },
      })
    }
  }

  deleteUser(user: User): void {
    if (user.id && confirm(`Êtes-vous sûr de vouloir supprimer ${user.username} ?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers() // Recharger la liste
        },
        error: (error) => {
          console.error("Erreur lors de la suppression:", error)
        },
      })
    }
  }
}
