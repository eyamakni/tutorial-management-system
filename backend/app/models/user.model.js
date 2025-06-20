module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM('admin', 'enseignant', 'etudiant'), // 🔄 MODIFIÉ : Rôles spécifiques
      allowNull: false, // 🔄 MODIFIÉ : Obligatoire, pas de valeur par défaut
    },
    isActive: { // 🆕 NOUVEAU : Pour activer/désactiver les comptes
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdBy: { // 🆕 NOUVEAU : Qui a créé ce compte
      type: Sequelize.INTEGER,
      allowNull: true,
    }
  })

  return User
}