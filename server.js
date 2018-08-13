const express = require('express');
const bp = require('body-parser');
const morgan = require('morgan');

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bp.urlencoded({extended : true}));
app.use(bp.json());
app.use(morgan('common'));
app.use(express.static('public'))


class db {
    constructor()
    {
        this.items = [];
        this.addItem("Task 1", "7/9/2018", "do work");
        this.addItem("Task 2", "8/9/2018", "get paid");
        this.addItem("Task 3", "9/9/2018", "buy stuff");
    };

    get length()
    {
        return this.items.length;
    };

    get all()
    {
        return this.items
    };

    addItem(name, date, desc)
    {
        let newItem = {
            name: name,
            date: date,
            desc: desc
        };
        this.items.push(newItem);
        return true;
    };

}

const database = new db();


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
    res.render(__dirname + '/listtasks.html', {db: database.all})
});



app.post('/data', function (req, res)
{
    console.log()
    console.log(req.body.name);
    let success = database.addItem(req.body.name, req.body.date, req.body.desc);
    res.json({success : success, redirect: "/list"});
});




app.listen(8080);