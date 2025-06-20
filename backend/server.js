const express = require("express")
const cors = require("cors")

const app = express()

var corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require("./app/models")

// 🆕 NOUVEAU : Créer un admin par défaut au démarrage
const createDefaultAdmin = async () => {
  try {
    const bcrypt = require("bcryptjs")
    
    // Vérifier si un admin existe déjà
    const adminExists = await db.users.findOne({
      where: { role: 'admin' }
    })

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await db.users.create({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        createdBy: null // Premier admin créé automatiquement
      })
      
      console.log("\n" + "=".repeat(50))
      console.log("✅ ADMINISTRATEUR PAR DÉFAUT CRÉÉ")
      console.log("=".repeat(50))
      console.log("📧 Email: admin@example.com")
      console.log("🔑 Mot de passe: admin123")
      console.log("⚠️  CHANGEZ CE MOT DE PASSE EN PRODUCTION!")
      console.log("=".repeat(50) + "\n")
    } else {
      console.log("ℹ️  Un administrateur existe déjà dans la base.")
    }
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error.message)
  }
}

// 🔧 SYNCHRONISATION DE LA BASE DE DONNÉES
db.sequelize
  .sync()
  .then(() => {
    console.log("✅ Base de données synchronisée (tables recréées).")
    console.log("📋 Tables créées: users, tutorials")
    return createDefaultAdmin()
  })
  .catch((err) => {
    console.error("❌ Échec de la synchronisation de la base:", err.message)
    process.exit(1) // Arrêter le serveur en cas d'erreur critique
  })

// 🌐 ROUTES
app.get("/", (req, res) => {
  res.json({ 
    message: "🎓 Bienvenue dans le système de gestion des tutoriels.",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth",
      tutorials: "/api/tutorials", 
      admin: "/api/admin"
    }
  })
})

// Chargement des routes
try {
  require("./app/routes/tutorial.routes")(app)
  require("./app/routes/auth.routes")(app)
  require("./app/routes/admin.routes")(app)
  console.log("✅ Routes chargées avec succès.")
} catch (error) {
  console.error("❌ Erreur lors du chargement des routes:", error.message)
  process.exit(1)
}

// 🚀 DÉMARRAGE DU SERVEUR
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log("\n" + "🚀".repeat(20))
  console.log(`🚀 SERVEUR DÉMARRÉ SUR LE PORT ${PORT}`)
  console.log(`🌐 API disponible sur: http://localhost:${PORT}`)
  console.log(`📚 Documentation: http://localhost:${PORT}`)
  console.log("🚀".repeat(20) + "\n")
})

// 🛡️ GESTION DES ERREURS GLOBALES
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', reason)
  process.exit(1)
})