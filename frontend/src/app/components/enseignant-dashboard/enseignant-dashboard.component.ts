import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TutorialService } from '../../services/tutorial.service';
import { AuthService } from '../../services/auth.service';
import type { Tutorial } from '../../models/tutorial.model';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-enseignant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './enseignant-dashboard.component.html',
  styleUrls: ['./enseignant-dashboard.component.css']
})
export class EnseignantDashboardComponent implements OnInit {
  tutorials: Tutorial[] = [];
  currentUser: User | null = null;
  stats = {
    totalTutorials: 0,
    publishedTutorials: 0,
    draftTutorials: 0
  };
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
    this.tutorialService.getAll().subscribe({
      next: (tutorials) => {
        this.tutorials = tutorials;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tutoriels:', error);
        this.isLoading = false;
      }
    });
  }

  private calculateStats(): void {
    this.stats.totalTutorials = this.tutorials.length;
    this.stats.publishedTutorials = this.tutorials.filter(t => t.published).length;
    this.stats.draftTutorials = this.tutorials.filter(t => !t.published).length;
  }

  deleteTutorial(tutorial: Tutorial): void {
    if (tutorial.id && confirm(`Êtes-vous sûr de vouloir supprimer "${tutorial.title}" ?`)) {
      this.tutorialService.delete(tutorial.id).subscribe({
        next: () => {
          this.loadTutorials();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  togglePublishStatus(tutorial: Tutorial): void {
    if (tutorial.id) {
      const updatedTutorial = { ...tutorial, published: !tutorial.published };
      this.tutorialService.update(tutorial.id, updatedTutorial).subscribe({
        next: () => {
          this.loadTutorials();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
        }
      });
    }
  }
}