const db = require("../models")
const User = db.users
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Clé secrète pour JWT (à mettre dans un fichier .env en production)
const JWT_SECRET = "votre-cle-secrete-super-longue-et-complexe"

// 🚫 SUPPRIMÉ : exports.signup (Plus d'inscription publique)

// Connexion (MODIFIÉE pour vérifier isActive)
exports.signin = async (req, res) => {
  try {
    // Validation des données
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Email et password sont requis !",
      })
    }

    // Trouver l'utilisateur
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    })

    if (!user) {
      return res.status(404).send({
        message: "Utilisateur non trouvé !",
      })
    }

    // 🆕 NOUVEAU : Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).send({
        message: "Votre compte a été désactivé. Contactez l'administrateur.",
      })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Mot de passe incorrect !",
      })
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    res.status(200).send({
      message: "Connexion réussie !",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: token,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Erreur lors de la connexion.",
    })
  }
}

// Vérifier le token (middleware) - INCHANGÉ
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]

  if (!token) {
    return res.status(403).send({
      message: "Aucun token fourni !",
    })
  }

  // Le token vient généralement sous la forme "Bearer TOKEN"
  const bearerToken = token.startsWith("Bearer ") ? token.slice(7) : token

  jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Token invalide !",
      })
    }

    req.user = decoded // Ajouter les infos user à la requête
    next()
  })
}

// 🆕 NOUVEAU : Middleware pour vérifier les rôles
exports.verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({
        message: "Utilisateur non authentifié !",
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send({
        message: "Accès refusé. Rôle insuffisant.",
      })
    }

    next()
  }
}

// Obtenir le profil utilisateur - INCHANGÉ
exports.getProfile = (req, res) => {
  res.status(200).send({
    message: "Profil utilisateur",
    user: req.user, // Vient du middleware verifyToken
  })
}