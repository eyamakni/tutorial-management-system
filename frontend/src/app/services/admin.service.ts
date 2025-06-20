import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import type { User, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

const ADMIN_API = 'http://localhost:8080/api/admin/';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Créer un utilisateur (enseignant ou étudiant)
  createUser(userData: CreateUserRequest): Observable<any> {
    return this.http.post(ADMIN_API + 'users', userData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Lister tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(ADMIN_API + 'users', {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Modifier un utilisateur
  updateUser(id: number, userData: UpdateUserRequest): Observable<any> {
    return this.http.put(`${ADMIN_API}users/${id}`, userData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Activer/désactiver un utilisateur
  toggleUserStatus(id: number): Observable<any> {
    return this.http.put(`${ADMIN_API}users/${id}/toggle`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${ADMIN_API}users/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}