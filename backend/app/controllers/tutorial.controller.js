const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Valider la requête
  if (!req.body.title) {
    res.status(400).send({
      message: "Le champ 'title' ne peut pas être vide !"
    });
    return;
  }

  // Créer un tutoriel
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  // Sauvegarder dans la base
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la création du tutoriel."
      });
    });
};

// Récupérer tous les tutoriels
exports.findAll = (req, res) => {
  const title = req.query.title;
  let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Tutorial.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la récupération des tutoriels."
      });
    });
};

// Récupérer un seul tutoriel avec un id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findByPk(id)
    .then(data => {
      if (data) res.send(data);
      else {
        res.status(404).send({
          message: `Tutoriel avec l'id=${id} non trouvé.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération du tutoriel avec l'id=" + id
      });
    });
};

// Mettre à jour un tutoriel par son id
exports.update = (req, res) => {
  const id = req.params.id;

  Tutorial.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Tutoriel mis à jour avec succès." });
      } else {
        res.send({ message: `Impossible de mettre à jour le tutoriel avec id=${id}.` });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour du tutoriel avec id=" + id
      });
    });
};

// Supprimer un tutoriel avec son id
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Tutoriel supprimé avec succès." });
      } else {
        res.send({ message: `Impossible de supprimer le tutoriel avec id=${id}.` });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la suppression du tutoriel avec id=" + id
      });
    });
};

// Supprimer tous les tutoriels
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} tutoriels ont été supprimés.` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la suppression de tous les tutoriels."
      });
    });
};

// Trouver tous les tutoriels publiés
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la récupération des tutoriels publiés."
      });
    });
};