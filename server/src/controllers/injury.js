const Injury = require("../models/injury");

exports.findAll = (req, res) => {
    Injury.find()
        .then(injuries => {
            res.send(injuries);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while retrieving the injuries."
        });
    });
};

exports.findOne = (req, res) => {
    Injury.find({_id: req.params.id})
        .then(injury => {
            if (!injury) {
                return res.status(400).send({
                    message: "Nu a fost gasit nici o leziune cu acest nume"
                });
            }
            res.send(injury);
        })
}

exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Continutul leziunii nu poate fi gol",
        })
    }

    const injury = new Injury({
        name: req.body.name,
        location: req.body.location,
        maneuvers: req.body.maneuvers
    })

    injury
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Ceva a decurs prost la crearea leziunii"
            })
        })
}

exports.delete = (req, res) => {
    Injury.findOneAndDelete({_id: req.params.id})
        .then(injury => {
            if (!injury) {
                return res.status(404).send({
                    message: "Nu a fost gasit nici o leziune cu acest id"
                })
            }
            res.send({message: "Leziunea a fost stearsa cu success!"})
        })
        .catch(err => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    message: "Leziunea cu acest id nu a fost gasita"
                })
            }
            return res.status(500).send({
                message: "Nu s-a putut sterge leziunea cu acest id"
            })
        })
}

exports.update = (req, res) => {
    Injury.findOneAndUpdate({ "_id": req.params.id }, { "$set": { "name": req.body.name, "maneuvers": req.body.maneuvers, "location": req.body.location } })
        .then(injury => {
            res.send(injury)
        })
        .catch(err => {
            res.status(500).send(err);
        });
}
