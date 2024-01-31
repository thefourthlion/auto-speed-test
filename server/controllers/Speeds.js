const Speeds = require("../models/Speeds");
exports.createSpeeds = async (req, res) => {
  try {
    let newSpeeds = new Speeds({
      Ip: req.body.Ip,
      name: req.body.name,
      download: req.body.download,
      upload: req.body.upload,
      ping: req.body.ping,
      timestamp: req.body.timestamp,
    });
    await newSpeeds.save();
    res.send(newSpeeds);
  } catch (err) {
    console.log(err);
  }
};
exports.readSpeeds = async (req, res) => {
  const page = req.query.page || 0;
  const limit = req.query.limit || 25;
  try {
    Speeds.find({}, (err, result) => {
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
exports.readSpeedsFromID = async (req, res) => {
  try {
    await Speeds.findById({ _id: req.params.id }, {}, (err, result) => {
      if (err) {
        res.json({ app: err });
      }
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
};
exports.updateSpeeds = async (req, res) => {
  try {
    await Speeds.findByIdAndUpdate(
      req.params.id, {
      Ip: req.body.Ip,
      name: req.body.name,
      download: req.body.download,
      upload: req.body.upload,
      ping: req.body.ping,
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
exports.deleteSpeeds = async (req, res) => {
  try {
    if ((await Speeds.findById(req.params.id)) === null) {
      res.json({ app: "post not found" });
    } else {
      await Speeds.findByIdAndRemove(req.params.id).exec();
      res.json({ app: "post deleted" });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};