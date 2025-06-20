import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import  { AdminService } from "../../services/admin.service"
import type { User } from "../../models/user.model"

@Component({
  selector: "app-user-management",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"],
})
export class UserManagementComponent implements OnInit {
  users: User[] = []
  filteredUsers: User[] = []
  searchTerm = ""
  selectedRole = "all"
  isLoading = false

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.isLoading = true
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
        this.filteredUsers = users
        this.isLoading = false

        // Log pour debug
        console.log("👥 Utilisateurs chargés dans user-management:", users)
      },
      error: (error) => {
        console.error("Erreur lors du chargement:", error)
        this.isLoading = false
      },
    })
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

  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) => {
      const matchesSearch =
        user.username?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
      const matchesRole = this.selectedRole === "all" || user.role === this.selectedRole

      return matchesSearch && matchesRole
    })
  }

  toggleUserStatus(user: User): void {
    if (user.id) {
      this.adminService.toggleUserStatus(user.id).subscribe({
        next: () => {
          this.loadUsers()
        },
        error: (error) => {
          console.error("Erreur:", error)
        },
      })
    }
  }

  deleteUser(user: User): void {
    if (user.id && confirm(`Êtes-vous sûr de vouloir supprimer ${user.username} ?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers()
        },
        error: (error) => {
          console.error("Erreur:", error)
        },
      })
    }
  }
}
