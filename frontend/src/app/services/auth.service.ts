import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { BehaviorSubject, type Observable } from "rxjs"
import { tap } from "rxjs/operators"
import type { User, AuthResponse, LoginRequest } from "../models/user.model"

const AUTH_API = "http://localhost:8080/api/auth/"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    const savedUser = this.getCurrentUser()
    if (savedUser) {
      this.currentUserSubject.next(savedUser)
    }
  }

  // 🚫 SUPPRIMÉ : register() - Plus d'inscription publique

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_API + "signin", credentials).pipe(
      tap((response) => {
        if (response.token) {
          this.setSession(response)
        }
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("current_user")
    this.currentUserSubject.next(null)
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  // 🆕 NOUVEAU : Vérifier le rôle de l'utilisateur
  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }

  // 🆕 NOUVEAU : Vérifier si admin
  isAdmin(): boolean {
    return this.hasRole('admin')
  }

  // 🆕 NOUVEAU : Vérifier si enseignant
  isEnseignant(): boolean {
    return this.hasRole('enseignant')
  }

  // 🆕 NOUVEAU : Vérifier si étudiant
  isEtudiant(): boolean {
    return this.hasRole('etudiant')
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("current_user")
    return userStr ? JSON.parse(userStr) : null
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token")
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken()
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : "",
    })
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem("auth_token", authResponse.token)
    localStorage.setItem("current_user", JSON.stringify(authResponse.user))
    this.currentUserSubject.next(authResponse.user)
  }
}