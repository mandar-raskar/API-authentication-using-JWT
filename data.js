var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url ="mongodb://localhost:27017/Resource";

MongoClient.connect(url,function(err,db) {
    if (err)
        throw err;
    console.log("connected");
    router.post('/rdata', function (req, res) {
        var Resource_id = req.body.Resource_id;
        var Resourceskills_id = req.body.Resourceskills_id;
        var dbo = db.db("Resource");
        var data = {
            Resource_id : Resource_id,
            Resourceskills_id : Resourceskills_id
        }
        dbo.collection("Resource_data").insertOne(data, function (err, result) {
            if (err) throw err;
            //console.log(result);
            res.json({err: false, result: result});


        })

    });
    // router.get('/', function (req, res) {
    //
    //     console.log('hii');
    //     var dbo = db.db("Resource");
    //     db.collection("Resource_data").aggregate([{$lookup:{from:"",localField:"user_id",foreignField:"emp_id",as:"data"}}]).pretty()
    // });
});