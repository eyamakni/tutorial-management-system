const Tutorial = require("../models/tutorial.model")

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ message: "Le champ 'title' ne peut pas être vide !" })
  }

  try {
    const tutorial = new Tutorial({
      title: req.body.title,
      description: req.body.description,
      published: req.body.published || false
    })

    const savedTutorial = await tutorial.save()
    res.send(savedTutorial)
  } catch (err) {
    res.status(500).send({ message: err.message || "Erreur lors de la création du tutoriel." })
  }
}

// Récupérer tous les tutoriels (option recherche par titre)
exports.findAll = async (req, res) => {
  try {
    const title = req.query.title
    let condition = {}

    if (title) {
      // Recherche insensible à la casse
      condition.title = { $regex: new RegExp(title), $options: "i" }
    }

    const tutorials = await Tutorial.find(condition)
    res.send(tutorials)
  } catch (err) {
    res.status(500).send({ message: err.message || "Erreur lors de la récupération des tutoriels." })
  }
}

// Récupérer un tutoriel par id
exports.findOne = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id)

    if (!tutorial) {
      return res.status(404).send({ message: `Tutoriel avec l'id=${req.params.id} non trouvé.` })
    }

    res.send(tutorial)
  } catch (err) {
    res.status(500).send({ message: "Erreur lors de la récupération du tutoriel avec l'id=" + req.params.id })
  }
}

// Mettre à jour un tutoriel
exports.update = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id)

    if (!tutorial) {
      return res.status(404).send({ message: `Tutoriel avec l'id=${req.params.id} non trouvé.` })
    }

    Object.assign(tutorial, req.body)
    await tutorial.save()

    res.send({ message: "Tutoriel mis à jour avec succès." })
  } catch (err) {
    res.status(500).send({ message: "Erreur lors de la mise à jour du tutoriel avec id=" + req.params.id })
  }
}

// Supprimer un tutoriel
exports.delete = async (req, res) => {
  try {
    const result = await Tutorial.deleteOne({ _id: req.params.id })

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: `Impossible de supprimer le tutoriel avec id=${req.params.id}.` })
    }

    res.send({ message: "Tutoriel supprimé avec succès." })
  } catch (err) {
    res.status(500).send({ message: "Erreur lors de la suppression du tutoriel avec id=" + req.params.id })
  }
}

// Supprimer tous les tutoriels
exports.deleteAll = async (req, res) => {
  try {
    const result = await Tutorial.deleteMany({})
    res.send({ message: `${result.deletedCount} tutoriels ont été supprimés.` })
  } catch (err) {
    res.status(500).send({ message: err.message || "Erreur lors de la suppression de tous les tutoriels." })
  }
}

// Trouver tous les tutoriels publiés
exports.findAllPublished = async (req, res) => {
  try {
    const tutorials = await Tutorial.find({ published: true })
    res.send(tutorials)
  } catch (err) {
    res.status(500).send({ message: err.message || "Erreur lors de la récupération des tutoriels publiés." })
  }
}
