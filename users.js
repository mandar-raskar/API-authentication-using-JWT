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
    router.get('/rskills', ensureToken, function (req, res) {
        console.log('hii');
        var dbo = db.db("Resource");
        dbo.collection("Resource_skills").find({}).toArray(
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
        router.post('/rskills', function (req, res) {
            var Resource_skills = req.body.Resource_skills;
            var dbo = db.db("Resource");
            var data = {
                Resource_skills: Resource_skills
            }
            dbo.collection("Resource_skills").insertOne(data, function (err, result) {
                if (err) throw err;
                //console.log(result);

                res.json({err: false, result: result, data: data});


            })

        });

        router.get('/Resource_Skills', ensureToken, function (req, res) {
            db.collection("Resource_skills").aggregate([{
                $lookup: {
                    from: "Resource_Details",
                    localField: "Resource_skills",
                    foreignField: "Resource_Skills",
                    as: "Rskillset"
                }
            }], function (err, result) {
                result.map(item => {
                    item.Rcount = item.Rskillset.length
                });
                //  res.send({result :{"rdata":result,"rlength":result.employeeList.length}})
                // jwt.verify(req.token, 'secret_key', function (err, data) {
                //     if (err) {
                //         res.sendStatus(403);
                //     } else {
                //         res.json({err: false, result: result, data: data});
                //     }
                //
                // })
                jwt.verify(req.token, 'secret_key', function (err, data) {
                    if (err) {
                        res.sendStatus(403);
                    } else {
                        res.json({err: false, result: result, data: data});
                    }
                })

            });

            router.post('/Resource_skills/data', function (req, res) {
                console.log('hii');
                // var Location = req.params.Location;
                // var details = req.body.Resource_Skills


                var dbo = db.db("Resource");
                dbo.collection("Resource_Details").find({$or: [{Resource_Skills: {$in: req.body.Resource_Skills}}, {Location: {$in: req.body.Location}}, {Resource_Name: {$in: req.body.Resource_Name}}, {Catagory: {$in: req.body.Catagory}}]}).toArray(
                    function (err, result) {
                        if (err) throw err;

                        res.json({err: false, result: result});


                        console.log(result.length);
                        //  console.log(result.Resource_Name);

                    });


            });


        });
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
