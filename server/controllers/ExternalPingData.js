const ExternalPingData = require("../models/ExternalPingData");
 exports.createExternalPingData = async (req, res) => 
 { 
    const page = req.query.page || 0; 
    const limit = req.query.limit || 25; 
    try { 
        let newExternalPingData = new ExternalPingData({ link: req.body.link, ping: req.body.ping, timestamp: req.body.timestamp, }); 
        await newExternalPingData.save(); res.send(newExternalPingData); 
    } 
    catch (err) { 
        console.log(err); } };
         exports.readExternalPingData = async (req, res) => { try { ExternalPingData.find({}, (err, result) => { if (err) { res.json({ app: err }); } res.send(result); }).sort().skip(page * limit).limit(limit); } catch (err) { console.log(err); } }; exports.readExternalPingDataFromID = async (req, res) => { try { await ExternalPingData.findById({ _id: req.params.id }, {}, (err, result) => { if (err) { res.json({ app: err }); } res.send(result); }); } catch (err) { console.log(err); } }; exports.updateExternalPingData = async (req, res) => { try { await ExternalPingData.findByIdAndUpdate(req.params.id, { link: req.body.link, ping: req.body.ping, timestamp: req.body.timestamp, }, (err, result) => { if (err) { res.json({ app: err }); } res.send(result); }); } catch (err) { console.log(err); } }; exports.deleteExternalPingData = async (req, res) => { try { if ((await ExternalPingData.findById(req.params.id)) === null) { res.json({ app: "post not found" }); } else { await ExternalPingData.findByIdAndRemove(req.params.id).exec(); res.json({ app: "post deleted" }); } } catch (err) { console.log(err); res.send(err); } };