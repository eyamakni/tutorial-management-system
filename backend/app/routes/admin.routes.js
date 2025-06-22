module.exports = (app) => {
  const admin = require("../controllers/admin.controller.js")
  const auth = require("../controllers/auth.controller.js")

  var router = require("express").Router()

  router.use(auth.verifyToken)
  router.use(auth.verifyRole(['admin']))

  router.post("/users", admin.createUser)
  router.get("/users", admin.getAllUsers)
  router.put("/users/:id", admin.updateUser)
  router.put("/users/:id/toggle", admin.toggleUserStatus)
  router.delete("/users/:id", admin.deleteUser)

  app.use("/api/admin", router)
}
