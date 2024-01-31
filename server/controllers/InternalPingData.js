const InternalPingData = require("../models/InternalPingData");
exports.createInternalPingData = async (req, res) => {
    const page = req.query.page || 0; const limit = req.query.limit || 25; try {
        let newInternalPingData = new InternalPingData({ link: req.body.link, ping: req.body.ping, timestamp: req.body.timestamp, });
        await newInternalPingData.save();
        res.send(newInternalPingData);
    } catch (err) { console.log(err); }
};
exports.readInternalPingData = async (req, res) => {
    try {
        InternalPingData.find({}, (err, result) => {
            if (err) { res.json({ app: err }); }
            res.send(result);
        }).sort().skip(page * limit).limit(limit);
    } catch (err) { console.log(err); }
};
exports.readInternalPingDataFromID = async (req, res) => {
    try {
        await InternalPingData.findById({ _id: req.params.id }, {}, (err, result) => {
            if (err) { res.json({ app: err }); }
            res.send(result);
        });
    } catch (err) { console.log(err); }
};
exports.updateInternalPingData = async (req, res) => {
    try {
        await InternalPingData.findByIdAndUpdate(req.params.id, { link: req.body.link, ping: req.body.ping, timestamp: req.body.timestamp, }, (err, result) => {
            if (err) { res.json({ app: err }); }
            res.send(result);
        });
    } catch (err) { console.log(err); }
};
exports.deleteInternalPingData = async (req, res) => {
    try {
        if ((await InternalPingData.findById(req.params.id)) === null) { res.json({ app: "post not found" }); } else {
            await InternalPingData.findByIdAndRemove(req.params.id).exec();
            res.json({ app: "post deleted" });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};