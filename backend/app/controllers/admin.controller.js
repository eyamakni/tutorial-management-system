const User = require("../models/user.model")
const bcrypt = require("bcryptjs")

// Créer un utilisateur (Enseignant ou Étudiant)
exports.createUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: "Accès refusé. Seuls les administrateurs peuvent créer des utilisateurs." })
    }

    if (!req.body.username || !req.body.email || !req.body.password || !req.body.role) {
      return res.status(400).send({ message: "Username, email, password et role sont OBLIGATOIRES !" })
    }

    if (!['enseignant', 'etudiant'].includes(req.body.role)) {
      return res.status(400).send({ message: "Le rôle doit être exactement 'enseignant' ou 'etudiant'" })
    }

    const existingUser = await User.findOne({ email: req.body.email })

    if (existingUser) {
      return res.status(400).send({ message: "Cet email est déjà utilisé !" })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      createdBy: req.user._id,
      isActive: true
    }

    const newUser = await User.create(userData)

    res.status(201).send({
      message: `${req.body.role} créé avec succès !`,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive
      }
    })

  } catch (error) {
    res.status(500).send({ message: error.message || "Erreur lors de la création de l'utilisateur." })
  }
}

// Lister tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: "Accès refusé." })
    }

    const users = await User.find({}, 'username email role isActive createdAt').sort({ createdAt: -1 })

    res.status(200).send(users)
  } catch (error) {
    res.status(500).send({ message: error.message || "Erreur lors de la récupération des utilisateurs." })
  }
}

// Activer/désactiver un utilisateur
exports.toggleUserStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: "Accès refusé." })
    }

    const userId = req.params.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé." })
    }

    if (user.role === 'admin') {
      return res.status(400).send({ message: "Impossible de modifier le statut d'un administrateur." })
    }

    user.isActive = !user.isActive
    await user.save()

    res.status(200).send({
      message: `Utilisateur ${user.isActive ? 'activé' : 'désactivé'} avec succès.`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    })

  } catch (error) {
    res.status(500).send({ message: error.message || "Erreur lors de la modification du statut." })
  }
}

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: "Accès refusé." })
    }

    const userId = req.params.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé." })
    }

    if (user.role === 'admin') {
      return res.status(400).send({ message: "Impossible de supprimer un administrateur." })
    }

    await user.remove()

    res.status(200).send({ message: "Utilisateur supprimé avec succès." })

  } catch (error) {
    res.status(500).send({ message: error.message || "Erreur lors de la suppression." })
  }
}

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: "Accès refusé." })
    }

    const userId = req.params.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé." })
    }

    if (user.role === 'admin') {
      return res.status(400).send({ message: "Impossible de modifier un administrateur." })
    }

    const updateData = {}

    if (req.body.username) updateData.username = req.body.username
    if (req.body.email) updateData.email = req.body.email
    if (req.body.role && ['enseignant', 'etudiant'].includes(req.body.role)) {
      updateData.role = req.body.role
    }
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10)
    }

    Object.assign(user, updateData)
    await user.save()

    res.status(200).send({
      message: "Utilisateur modifié avec succès.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    })

  } catch (error) {
    res.status(500).send({ message: error.message || "Erreur lors de la modification." })
  }
}
