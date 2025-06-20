import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutorial } from '../models/tutorial.model';
import { AuthService } from './auth.service'; // 🆕 NOUVEAU : Import AuthService

const baseUrl = 'http://localhost:8080/api/tutorials';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  constructor(
    private http: HttpClient,
    private authService: AuthService // 🆕 NOUVEAU : Injection AuthService
  ) { }

  // 🔄 MODIFIÉ : Ajout des headers d'authentification
  getAll(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(baseUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  get(id: any): Observable<Tutorial> {
    return this.http.get(`${baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  findByTitle(title: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}?title=${title}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}