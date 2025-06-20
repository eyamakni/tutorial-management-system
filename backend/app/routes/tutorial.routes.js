module.exports = (app) => {
  const tutorials = require("../controllers/tutorial.controller.js")
  const auth = require("../controllers/auth.controller.js")

  var router = require("express").Router()

  // 🆕 NOUVEAU : Toutes les routes nécessitent une authentification
  router.use(auth.verifyToken)

  // 🔄 MODIFIÉ : Routes pour enseignants et admins (création, modification, suppression)
  router.post("/", auth.verifyRole(['admin', 'enseignant']), tutorials.create)
  router.put("/:id", auth.verifyRole(['admin', 'enseignant']), tutorials.update)
  router.delete("/:id", auth.verifyRole(['admin', 'enseignant']), tutorials.delete)
  router.delete("/", auth.verifyRole(['admin', 'enseignant']), tutorials.deleteAll)

  // Routes de lecture pour tous les utilisateurs connectés
  router.get("/", tutorials.findAll)
  router.get("/published", tutorials.findAllPublished)
  router.get("/:id", tutorials.findOne)

  app.use("/api/tutorials", router)
}