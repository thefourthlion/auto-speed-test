const InternalPing = require("../models/InternalPing");
exports.createInternalPing = async (req, res) => {
    const page = req.query.page || 0; const limit = req.query.limit || 25; try {
        let newInternalPing = new InternalPing({ link: req.body.link, name: req.body.name, timestamp: req.body.timestamp, });
        await newInternalPing.save();
        res.send(newInternalPing);
    } catch (err) { console.log(err); }
};
exports.readInternalPing = async (req, res) => {
    try {
        InternalPing.find({}, (err, result) => {
            if (err) { res.json({ app: err }); }
            res.send(result);
        }).sort().skip(page * limit).limit(limit);
    } catch (err) { console.log(err); }
};
exports.readInternalPingFromID = async (req, res) => {
    try {
        await InternalPing.findById({ _id: req.params.id }, {}, (err, result) => {
            if (err) { res.json({ app: err }); }
            res.send(result);
        });
    } catch (err) { console.log(err); }
};
exports.updateInternalPing = async (req, res) => {
    try {
        await InternalPing.findByIdAndUpdate(req.params.id, { link: req.body.link, name: req.body.name, timestamp: req.body.timestamp, }, (err, result) => {
            if (err) { res.json({ app: err }); }
            res.send(result);
        });
    } catch (err) { console.log(err); }
};
exports.deleteInternalPing = async (req, res) => {
    try {
        if ((await InternalPing.findById(req.params.id)) === null) { res.json({ app: "post not found" }); } else {
            await InternalPing.findByIdAndRemove(req.params.id).exec();
            res.json({ app: "post deleted" });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};