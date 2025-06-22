module.exports = (app) => {
  const auth = require("../controllers/auth.controller.js")

  var router = require("express").Router()

  router.post("/signin", auth.signin)
  router.get("/profile", auth.verifyToken, auth.getProfile)

  app.use("/api/auth", router)
}
