import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as Array<string>;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRoles && !requiredRoles.includes(currentUser.role!)) {
      // Rediriger selon le rôle
      this.redirectByRole(currentUser.role!);
      return false;
    }

    return true;
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'enseignant':
        this.router.navigate(['/enseignant']);
        break;
      case 'etudiant':
        this.router.navigate(['/etudiant']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}