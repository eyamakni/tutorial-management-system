module.exports = (app) => {
  const admin = require("../controllers/admin.controller.js")
  const auth = require("../controllers/auth.controller.js")

  var router = require("express").Router()

  // Toutes les routes admin nécessitent une authentification et le rôle admin
  router.use(auth.verifyToken)
  router.use(auth.verifyRole(['admin']))

  // Créer un utilisateur (enseignant ou étudiant)
  router.post("/users", admin.createUser)

  // Lister tous les utilisateurs
  router.get("/users", admin.getAllUsers)

  // Modifier un utilisateur
  router.put("/users/:id", admin.updateUser)

  // Activer/désactiver un utilisateur
  router.put("/users/:id/toggle", admin.toggleUserStatus)

  // Supprimer un utilisateur
  router.delete("/users/:id", admin.deleteUser)

  app.use("/api/admin", router)
}