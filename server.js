const express = require('express');
const bp = require('body-parser');
const morgan = require('morgan');
const mongodb = require('mongodb');

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bp.urlencoded({extended : true}));
app.use(bp.json());
app.use(morgan('common'));
app.use(express.static('public'));



const MongoClient = mongodb.MongoClient;

const url = 'mongodb://localhost:27017/';

MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log('Err  ', err);
    } else {
        console.log("Connected successfully to server");
        db = client.db('todo');
        db.collection('tasks').insertMany([
            {
                name: "Task 1",
                date: new Date("9/7/2018"),
                handle: "Conner",
                status: "Complete",
                desc: "do work"
            },
            {
                name: "Task 2",
                date: new Date("9/8/2018"),
                handle: "Desmond",
                status: "InProgress",
                desc: "get paid"
            },
            {
                name: "Task 3",
                date: new Date("9/9/2018"),
                handle: "Miles",
                status: "InProgress",
                desc: "buy stuff"
            }
        ]);
    }
});





app.get('/', function (req, res)
{
    res.sendFile(__dirname + '/index.html')
});


app.get('/new', function (req, res)
{
    res.sendFile(__dirname + '/newtask.html')
});


app.get('/list', function (req, res)
{
    db.collection("tasks").find({}).toArray(function (err, result) {
        res.render(__dirname + '/listtasks.html', {db: result});
    });

});

app.get('/removeitem/:id', function (req, res) {
    console.log(req.params.id);
    db.collection("tasks").deleteOne({_id:new mongodb.ObjectID(req.params.id)}, function (err, obj) {
        console.log(obj.result);
        db.collection("tasks").find({}).toArray(function (err, result) {
            res.render(__dirname + '/listtasks.html', {db: result});
        });
    })
});


app.get('/change/:id', function (req, res) {
    let id = new mongodb.ObjectID(req.params.id)
    db.collection("tasks").findOne({_id:id}, function (err, result) {
        res.render(__dirname + '/changetask.html', {item: result});
    });

});

app.post('/changedata/:id', function (req, res)
{
    let id = new mongodb.ObjectID(req.params.id)

    db.collection("tasks").updateOne({_id: id}, { $set: {
            name: req.body.name,
            date: new Date(req.body.date),
            handle: req.body.handle,
            status: req.body.status,
            desc: req.body.desc } }, function (err, obj) {
        console.log(obj.result);
        db.collection("tasks").find({}).toArray(function (err, result) {
            res.render(__dirname + '/listtasks.html', {db: result});
        });
    })

});

app.post('/data', function (req, res)
{
    console.log(req.body);
    db.collection('tasks').insertOne({
                name: req.body.name,
                date: new Date(req.body.date),
                handle: req.body.handle,
                status: req.body.status,
                desc: req.body.desc
    },function (err, obj) {
        res.json({success : true, redirect: "/list"});
    });

});




app.listen(8080);