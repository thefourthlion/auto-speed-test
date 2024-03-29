const InternalSpeeds = require("../models/InternalSpeeds");
exports.createInternalSpeeds = async (req, res) => {
    const page = req.query.page || 0;
    const limit = req.query.limit || 25;
    try {
        let newInternalSpeeds = new InternalSpeeds({
            Ip: req.body.Ip,
            name: req.body.name,
            download: req.body.download,
            upload: req.body.upload,
            ping: req.body.ping,
            group: req.body.group,
            package: req.body.package,
            timestamp: req.body.timestamp,
        });
        await newInternalSpeeds.save();
        res.send(newInternalSpeeds);
    } catch (err) {
        console.log(err);
    }
};
exports.readInternalSpeeds = async (req, res) => {
    try {
        InternalSpeeds.find({}, (err, result) => {
            if (err) {
                res.json({ app: err });
            }
            res.send(result);
        })
            .sort()
            .skip(page * limit)
            .limit(limit);
    } catch (err) {
        console.log(err);
    }
};
exports.readInternalSpeedsFromID = async (req, res) => {
    try {
        await InternalSpeeds.findById({ _id: req.params.id }, {}, (err, result) => {
            if (err) {
                res.json({ app: err });
            }
            res.send(result);
        });
    } catch (err) {
        console.log(err);
    }
};

exports.readInternalSpeedsFromName = async (req, res) => {
    try {
      await InternalSpeeds.find({ name: req.params.name }, {}, (err, result) => {
        if (err) {
          res.json({ app: err });
        }
        res.send(result);
      });
    } catch (err) {
      console.log(err);
    }
  };

exports.updateInternalSpeeds = async (req, res) => {
    try {
        await InternalSpeeds.findByIdAndUpdate(
            req.params.id,
            {
                Ip: req.body.Ip,
                name: req.body.name,
                download: req.body.download,
                upload: req.body.upload,
                ping: req.body.ping,
                group: req.body.group,
                package: req.body.package,
                timestamp: req.body.timestamp,
            },
            (err, result) => {
                if (err) {
                    res.json({ app: err });
                }
                res.send(result);
            }
        );
    } catch (err) {
        console.log(err);
    }
};
exports.deleteInternalSpeeds = async (req, res) => {
    try {
        if ((await InternalSpeeds.findById(req.params.id)) === null) {
            res.json({ app: "post not found" });
        } else {
            await InternalSpeeds.findByIdAndRemove(req.params.id).exec();
            res.json({ app: "post deleted" });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};
