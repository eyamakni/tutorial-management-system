import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TutorialService } from '../../services/tutorial.service';
import { AuthService } from '../../services/auth.service';
import type { Tutorial } from '../../models/tutorial.model';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-etudiant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './etudiant-dashboard.component.html',
  styleUrls: ['./etudiant-dashboard.component.css']
})
export class EtudiantDashboardComponent implements OnInit {
  tutorials: Tutorial[] = [];
  filteredTutorials: Tutorial[] = [];
  currentUser: User | null = null;
  searchTitle = '';
  selectedTutorial: Tutorial | null = null;
  isLoading = false;

  constructor(
    private tutorialService: TutorialService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTutorials();
  }

  loadTutorials(): void {
    this.isLoading = true;
    // Charger tous les tutoriels (on filtrera côté client pour les publiés)
    this.tutorialService.getAll().subscribe({
      next: (tutorials) => {
        // Filtrer seulement les tutoriels publiés pour les étudiants
        this.tutorials = tutorials.filter(t => t.published);
        this.filteredTutorials = this.tutorials;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tutoriels:', error);
        this.isLoading = false;
      }
    });
  }

  searchTutorials(): void {
    if (this.searchTitle.trim()) {
      this.filteredTutorials = this.tutorials.filter(tutorial =>
        tutorial.title?.toLowerCase().includes(this.searchTitle.toLowerCase()) ||
        tutorial.description?.toLowerCase().includes(this.searchTitle.toLowerCase())
      );
    } else {
      this.filteredTutorials = this.tutorials;
    }
  }

  selectTutorial(tutorial: Tutorial): void {
    this.selectedTutorial = tutorial;
  }

  clearSelection(): void {
    this.selectedTutorial = null;
  }
}