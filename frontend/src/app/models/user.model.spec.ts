// 🔧 CORRECTION: S'assurer que le modèle User a des types corrects
export interface User {
  id?: number
  username?: string
  email?: string
  password?: string
  role?: "admin" | "enseignant" | "etudiant" // 🔧 Union type au lieu de string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  createdBy?: number
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: "admin" | "enseignant" | "etudiant" // 🔧 Union type
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: User
  accessToken: string
}

export interface ApiResponse {
  message: string
  user?: User
}
