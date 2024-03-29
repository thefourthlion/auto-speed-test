const Packages = require("../models/Packages");
exports.createPackages = async (req, res) => {
    const page = req.query.page || 0;
    const limit = req.query.limit || 25;
    try {
        let newPackages = new Packages({
            download: req.body.download,
            upload: req.body.upload,
        });
        await newPackages.save();
        res.send(newPackages);
    } catch (err) {
        console.log(err);
    }
};
exports.readPackages = async (req, res) => {
    try {
        Packages.find({}, (err, result) => {
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
exports.readPackagesFromID = async (req, res) => {
    try {
        await Packages.findById({ _id: req.params.id }, {}, (err, result) => {
            if (err) {
                res.json({ app: err });
            }
            res.send(result);
        });
    } catch (err) {
        console.log(err);
    }
};
exports.updatePackages = async (req, res) => {
    try {
        await Packages.findByIdAndUpdate(
            req.params.id,
            { download: req.body.download, upload: req.body.upload },
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
exports.deletePackages = async (req, res) => {
    try {
        if ((await Packages.findById(req.params.id)) === null) {
            res.json({ app: "post not found" });
        } else {
            await Packages.findByIdAndRemove(req.params.id).exec();
            res.json({ app: "post deleted" });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};
