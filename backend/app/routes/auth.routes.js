module.exports = (app) => {
  const auth = require("../controllers/auth.controller.js")

  var router = require("express").Router()

  // 🚫 SUPPRIMÉ : router.post("/signup", auth.signup)
  
  // Connexion (inchangée)
  router.post("/signin", auth.signin)

  // Profil utilisateur (protégé)
  router.get("/profile", auth.verifyToken, auth.getProfile)

  app.use("/api/auth", router)
}