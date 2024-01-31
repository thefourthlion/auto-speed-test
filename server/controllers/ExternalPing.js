const ExternalPing = require("../models/ExternalPing");
exports.createExternalPing = async (req, res) => {
    const page = req.query.page || 0; const limit = req.query.limit || 25; try {
        let newExternalPing = new ExternalPing({ link: req.body.link, name: req.body.name, timestamp: req.body.timestamp, });
        await newExternalPing.save();
        res.send(newExternalPing);
    } catch (err) { console.log(err); }
};
exports.readExternalPing = async (req, res) => {
    try {
        ExternalPing.find({}, (err, result) => {
            if (err) { res.json({ app: err }); }
            res.send(result);
        }).sort().skip(page * limit).limit(limit);
    } catch (err) { console.log(err); }
};
exports.readExternalPingFromID = async (req, res) => {
    try {
        await ExternalPing.findById({ _id: req.params.id }, {}, (err, result) => {
            if (err) { res.json({ app: err }); }
            res.send(result);
        });
    } catch (err) { console.log(err); }
};
exports.updateExternalPing = async (req, res) => {
    try {
        await ExternalPing.findByIdAndUpdate(req.params.id, { link: req.body.link, name: req.body.name, timestamp: req.body.timestamp, }, (err, result) => {
            if (err) { res.json({ app: err }); }
            res.send(result);
        });
    } catch (err) { console.log(err); }
};
exports.deleteExternalPing = async (req, res) => {
    try {
        if ((await ExternalPing.findById(req.params.id)) === null) { res.json({ app: "post not found" }); } else {
            await ExternalPing.findByIdAndRemove(req.params.id).exec();
            res.json({ app: "post deleted" });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};