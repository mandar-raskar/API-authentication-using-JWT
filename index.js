var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Resource";
const jwt = require('jsonwebtoken');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });


// });

MongoClient.connect(url, function (err, db) {
    if (err)
        throw err;
    console.log("connected");
    // var dbo = db.db("Resource");
    //
    // dbo.collection('Resource_skills').aggregate([
    //     {
    //         $lookup:
    //             {
    //                 from: 'Rdatails',
    //                 localField: '_id',
    //                 foreignField: '_id',
    //                 as: 'data'
    //             }
    //     }
    // ]).toArray(function (err, res) {
    //     if (err) throw err;
    //     console.log(JSON.stringify(res));
    //
    //     router.get('/', function (req, res) {
    //
    //         console.log('hii');
    //         var dbo = db.db("Resource");
    //         dbo.collection("Resource_Details").find({}).toArray(
    //             function (err, result) {
    //                 if (err) throw err;
    //                 //console.log(result);
    //                 res.json({err: false, result: result});
    //
    //
    //             });
    //     });
    //     router.get('/rdetails', function (req, res) {
    //
    //         console.log('hii');
    //         var dbo = db.db("Resource");
    //         db.collection("Resource_data").aggregate(
    //             [
    //                 {
    //                     $lookup:
    //                         {
    //                             from: "Rdatails",
    //                             localField: "_id",
    //                             foreignField: "_d",
    //                             as: "data"
    //                         }
    //                 }]).pretty()
    //     });
    router.get('/rdetails', ensureToken, function (req, res) {
        console.log('hii');
        var dbo = db.db("Resource");
        dbo.collection("Resource_Details").find({}).toArray(
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


        router.post('/rdetails', function (req, res) {
            var Resource_Name = req.body.Resource_Name;
            var Resource_Experiance = req.body.Resource_Experiance;
            var Resource_Skills = req.body.Resource_Skills;
            var Location = req.body.Location;
            var Catagory = req.body.Catagory;
            var Started_Date = req.body.Started_Date;
            var Ended_date = req.body.Ended_Date;


            var dbo = db.db("Resource");
            var data = {
                Resource_Name: Resource_Name,
                Resource_Experiance: Resource_Experiance,
                Resource_Skills: Resource_Skills,
                Location: Location,
                Catagory: Catagory,
                Started_Date: Started_Date,
                Ended_date: Ended_date
            }
            dbo.collection("Resource_Details").insertOne(data, function (err, result) {
                    if (err) throw err;

                    res.json({err: false, result: result, data: data});

                }
            )

        })

        // router.get('/:Resource_Skills', function (req, res) {
        //     console.log('hii');
        //     var Resource_Skills = req.params.Resource_Skills;
        //
        //     var dbo = db.db("Resource");
        //     dbo.collection("Resource_Details").find({Resource_Skills : Resource_Skills}).toArray(
        //         function (err, result) {
        //             if (err) throw err;
        //             res.json({err: false, result: {"Rskill":Resource_Skills, "Rlength":result.length, "Rnames":result.Resource_Name}});
        //             console.log(result.length);
        //         })
        //
        // });
        // // //
        // router.post('/Resource_location/data', function (req, res) {
        //     console.log('hii');
        //    // var Location = req.params.Location;
        //     var details = req.body.Location
        //
        //
        //
        //     var dbo = db.db("Resource");
        //     dbo.collection("Resource_Details").find({ Location : { $in: details}}).toArray(
        //         function (err, result) {
        //             if (err) throw err;
        //             res.json({
        //                 err: false,
        //                 result: result
        //             });
        //             console.log(result.length);
        //             //  console.log(result.Resource_Name);
        //
        //         });


        // });


    });
})
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
