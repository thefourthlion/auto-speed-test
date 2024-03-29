const Groups = require("../models/Groups");
exports.createGroups = async (req, res) => {
    const page = req.query.page || 0;
    const limit = req.query.limit || 25;
    try {
        let newGroups = new Groups({ name: req.body.name });
        await newGroups.save();
        res.send(newGroups);
    } catch (err) {
        console.log(err);
    }
};
exports.readGroups = async (req, res) => {
    try {
        Groups.find({}, (err, result) => {
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
exports.readGroupsFromID = async (req, res) => {
    try {
        await Groups.findById({ _id: req.params.id }, {}, (err, result) => {
            if (err) {
                res.json({ app: err });
            }
            res.send(result);
        });
    } catch (err) {
        console.log(err);
    }
};
exports.updateGroups = async (req, res) => {
    try {
        await Groups.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
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
exports.deleteGroups = async (req, res) => {
    try {
        if ((await Groups.findById(req.params.id)) === null) {
            res.json({ app: "post not found" });
        } else {
            await Groups.findByIdAndRemove(req.params.id).exec();
            res.json({ app: "post deleted" });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};
