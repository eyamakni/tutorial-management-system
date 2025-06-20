import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RoleGuard } from './role-guard';
import { AuthService } from '../services/auth.service';
import type { User } from '../models/user.model';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    // 🔄 CORRIGÉ : Création des spies pour les services
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Mock de ActivatedRouteSnapshot
    route = new ActivatedRouteSnapshot();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should allow access when user has required role (admin)', () => {
      // Arrange
      const mockUser: User = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      };
      route.data = { roles: ['admin'] };
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      const result = guard.canActivate(route);

      // Assert
      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should allow access when user has one of multiple required roles', () => {
      // Arrange
      const mockUser: User = {
        id: 2,
        username: 'teacher',
        email: 'teacher@example.com',
        role: 'enseignant'
      };
      route.data = { roles: ['admin', 'enseignant'] };
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      const result = guard.canActivate(route);

      // Assert
      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should deny access and redirect when user does not have required role', () => {
      // Arrange
      const mockUser: User = {
        id: 3,
        username: 'student',
        email: 'student@example.com',
        role: 'etudiant'
      };
      route.data = { roles: ['admin'] };
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      const result = guard.canActivate(route);

      // Assert
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/etudiant']);
    });

    it('should deny access and redirect to login when user is not authenticated', () => {
      // Arrange
      route.data = { roles: ['admin'] };
      authService.getCurrentUser.and.returnValue(null);

      // Act
      const result = guard.canActivate(route);

      // Assert
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should allow access when no roles are specified', () => {
      // Arrange
      const mockUser: User = {
        id: 4,
        username: 'anyuser',
        email: 'any@example.com',
        role: 'etudiant'
      };
      route.data = {}; // Pas de rôles requis
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      const result = guard.canActivate(route);

      // Assert
      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should allow access when roles array is empty', () => {
      // Arrange
      const mockUser: User = {
        id: 5,
        username: 'anyuser2',
        email: 'any2@example.com',
        role: 'etudiant'
      };
      route.data = { roles: [] }; // Tableau de rôles vide
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      const result = guard.canActivate(route);

      // Assert
      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('redirectByRole', () => {
    it('should redirect admin to admin dashboard', () => {
      // Arrange
      const mockUser: User = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      };
      route.data = { roles: ['enseignant'] }; // Admin n'a pas le rôle requis
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      guard.canActivate(route);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/admin']);
    });

    it('should redirect enseignant to enseignant dashboard', () => {
      // Arrange
      const mockUser: User = {
        id: 2,
        username: 'teacher',
        email: 'teacher@example.com',
        role: 'enseignant'
      };
      route.data = { roles: ['admin'] }; // Enseignant n'a pas le rôle requis
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      guard.canActivate(route);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/enseignant']);
    });

    it('should redirect etudiant to etudiant dashboard', () => {
      // Arrange
      const mockUser: User = {
        id: 3,
        username: 'student',
        email: 'student@example.com',
        role: 'etudiant'
      };
      route.data = { roles: ['admin'] }; // Étudiant n'a pas le rôle requis
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      guard.canActivate(route);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/etudiant']);
    });

    it('should redirect to login for unknown role', () => {
      // Arrange
      const mockUser: User = {
        id: 4,
        username: 'unknown',
        email: 'unknown@example.com',
        role: 'unknown' as any // Rôle invalide
      };
      route.data = { roles: ['admin'] };
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      guard.canActivate(route);

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('edge cases', () => {
    it('should handle user without role property', () => {
      // Arrange
      const mockUser: User = {
        id: 5,
        username: 'norole',
        email: 'norole@example.com'
        // Pas de propriété role
      };
      route.data = { roles: ['admin'] };
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      const result = guard.canActivate(route);

      // Assert
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle undefined route data', () => {
      // Arrange
      const mockUser: User = {
        id: 6,
        username: 'user',
        email: 'user@example.com',
        role: 'etudiant'
      };
      route.data = undefined as any;
      authService.getCurrentUser.and.returnValue(mockUser);

      // Act
      const result = guard.canActivate(route);

      // Assert
      expect(result).toBe(true); // Devrait permettre l'accès si pas de restriction
    });
  });
});