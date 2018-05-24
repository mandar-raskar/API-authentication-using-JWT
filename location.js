var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Resource";
const jwt = require('jsonwebtoken');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
MongoClient.connect(url, function (err, db) {
    if (err)
        throw err;
    console.log("connected");
    router.get('/locations', ensureToken, function (req, res) {
        console.log('hii');
        var dbo = db.db("Resource");
        dbo.collection("Locations").find({}).toArray(
            function (err, result) {
                if (err) throw err;
                jwt.verify(req.token, 'secret_key', function (err, data) {
                    if (err) {
                        res.sendStatus(403);
                    } else {
                        res.json({err: false, result: result, data: data});
                    }
                })

            });
        router.post('/locations', function (req, res) {
            var Locations = req.body.Locations;
            var dbo = db.db("Resource");
            var data = {
                Locations: Locations
            }
            dbo.collection("Locations").insertOne(data, function (err, result) {
                if (err) throw err;
                //console.log(result);

                res.json({err: false, result: result});
                //console.log(result[i].Locations);


            })

        });

        // router.post('/loc',function(req,res){
        //     var Locations = req.body.Locations;
        //     var dbo = db.db("Resource");
        //     var data = {
        //         Locations : Locations
        //     }
        //   ( dbo.collection("Locations").find({ Locations: { $in: [Locations] }},function(err,result){
        //         if (err) throw err;
        //       res.header("Access-Control-Allow-Origin", "*");
        //       console.log("Request data " +JSON.stringify(result));
        //         //console.log(result);
        //         //res.json({err: false, result: a});
        //
        //
        //
        //     }))
        //
        // });


        // router.get('/set/data', function (req, res) {
        //     db.collection("Locations").aggregate([{
        //         $lookup: {
        //             from: "Resource_Details",
        //             localField: "Locations",
        //             foreignField: "Location",
        //             as: "employeeList"
        //         }
        //     }], function (err, result) {
        //         result.map(item => { item.Location1 = item.employeeList })
        //         for(var i = 0; i < result.length; i++) {
        //             //  res.send({result :{"rdata":result,"rlength":result.employeeList.length}})
        //             res.send(result[i]._id);
        //         }
        //         // console.log(employeeList);
        //     })
        //
        // });

    });
});

router.post('/api/login', function (req, res) {

    // insert code here to actually authenticate, or fake it
    var user = {id: 3};

    // then return a token, secret key should be an env variable
    const token = jwt.sign({user: user.id}, 'secret_key');
    res.json({
        message: 'Authenticated! Use this token in the "Authorization" header',
        token: token
    });
});

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}


module.exports = router;