export interface User {
  id?: number
  username?: string
  email?: string
  role?: 'admin' | 'enseignant' | 'etudiant' // 🔄 MODIFIÉ : Rôles spécifiques
  isActive?: boolean // 🆕 NOUVEAU : Statut actif
  createdBy?: number // 🆕 NOUVEAU : Créé par qui
  createdAt?: string // 🆕 NOUVEAU : Date création
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

// 🚫 SUPPRIMÉ : RegisterRequest (plus d'inscription publique)

// 🆕 NOUVEAU : Interface pour création d'utilisateur par admin
export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: 'enseignant' | 'etudiant'
}

// 🆕 NOUVEAU : Interface pour mise à jour utilisateur
export interface UpdateUserRequest {
  username?: string
  email?: string
  password?: string
  role?: 'enseignant' | 'etudiant'
}