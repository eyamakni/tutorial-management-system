const User = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const JWT_SECRET = "votre-cle-secrete-super-longue-et-complexe"

// Connexion (signin)
exports.signin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Email et password sont requis !" })
    }

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé !" })
    }

    if (!user.isActive) {
      return res.status(401).send({ message: "Votre compte a été désactivé. Contactez l'administrateur." })
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Mot de passe incorrect !" })
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    )

    res.status(200).send({
      message: "Connexion réussie !",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (error) {
    res.status(500).send({ message: error.message || "Erreur lors de la connexion." })
  }
}

// Middleware pour vérifier le token
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]

  if (!token) {
    return res.status(403).send({ message: "Aucun token fourni !" })
  }

  const bearerToken = token.startsWith("Bearer ") ? token.slice(7) : token

  jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token invalide !" })
    }

    req.user = decoded
    next()
  })
}

// Middleware pour vérifier les rôles
exports.verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ message: "Utilisateur non authentifié !" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: "Accès refusé. Rôle insuffisant." })
    }

    next()
  }
}

// Obtenir profil utilisateur
exports.getProfile = (req, res) => {
  res.status(200).send({
    message: "Profil utilisateur",
    user: req.user
  })
}
