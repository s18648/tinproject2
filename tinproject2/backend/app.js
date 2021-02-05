const express = require('express');
const app = express();
const mysql = require('mysql');

//CAN CHANGE TO CREATEPOOL IF PROBLEMS
const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'musicfestival'
});

app.use(express.json());

const cors = require('cors');

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const {body, validationResult} = require('express-validator');

//////////Artist

app.get('/readArtists', (req,res) => {
    let sqlRead = "SELECT IdArtist, Nickname, Age FROM artist;"
    conn.query(sqlRead, (error, response) => {
        res.send(response);
    })
})

app.post('/insertArtist',
    body('age').notEmpty().withMessage('Error: empty age field').isInt({min: 18}).withMessage('Error: age inputted was less than 18'),
    body('nickname').notEmpty().withMessage('Error: empty nickname field').isLength({max: 20}).withMessage('Error: nickname inputted was more than 20 characters long'), 

    (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({errors: errors.array()});
    }


    let nickname = req.body.nickname;
    let age = req.body.age;

    let sqlInsert = "INSERT INTO artist (Nickname, Age) VALUES (?, ?);";

    conn.query(sqlInsert, [nickname, age], (error, response) => {
        res.send(response);
    })
})


app.put('/updateArtist',
body('Age').notEmpty().withMessage('Error: empty age field').isInt({min: 18}).withMessage('Error: age inputted was less than 18'),
    (req,res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.json({errors: errors.array()});
    }

    const age = req.body.Age;
    const id = req.body.id;

    //let sqlUpdate = "UPDATE artist SET Age = ? WHERE idartist = ?;";
    conn.query("UPDATE artist SET Age = ? WHERE IdArtist = ?;", [age, id], (error, response) => {
        if(error){
            console.log(error);
        }
    })
})

app.delete('/deleteArtist/:id', (req,res) => {
    const id = req.params.id;

    let sqlDelete = "DELETE FROM artist WHERE idArtist = ?";
    conn.query(sqlDelete, [id], (error, response) => {
        if(error){
            console.log(error);
        }
    })
})

//////////Festival

app.get('/readFestivals', (req,res) => {
    let sqlRead = "SELECT IdFestival, Name, StartDate, EndDate FROM festival;";
    conn.query(sqlRead, (error, response) => {
        res.send(response);
    })
})


app.put('/updateFestival',
    body('name').notEmpty().withMessage('Error: empty name field').isLength({max: 30}).withMessage('Error: name inputted was more than 30 characters long'), 
    (req,res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.json({errors: errors.array()});
    }

    const name = req.body.name;
    const id = req.body.id;

    let sqlUpdate = "UPDATE festival SET name = ? WHERE idfestival = ?;"
    conn.query(sqlUpdate, [name, id], (error, response) => {
        if(error){
            console.log(error);
        }
    })
})

app.post('/insertFestival',
    body('name').notEmpty().withMessage('Error: empty name field').isLength({max: 30}).withMessage('Error: name inputted was more than 30 characters long'), 
    body('startDate').notEmpty().withMessage('Error: start date cannot be empty').isDate().withMessage('Error: Must be date'),
    body('endDate').notEmpty().withMessage('Error: end date cannot be empty').isDate().withMessage('Error: Must be date'),
    (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({errors: errors.array()})
    }


    let name = req.body.name;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;


    let sqlInsert = "INSERT INTO Festival (Name, StartDate, EndDate) VALUES (?, ?, ?);";

    conn.query(sqlInsert, [name, startDate, endDate], (error, response) => {
        res.send(response);
    })
})


app.delete('/deleteFestival/:id', (req,res) => {
    const id = req.params.id;
    console.log("id given " + id);
    let sqlDelete = "DELETE FROM festival WHERE IdFestival = ?";
    conn.query(sqlDelete, [id], (error, response) => {
        if(error){
            console.log(error);
        }
    })
})

/////////Performance
app.get('/readPerformance', (req,res) => {
    let sqlRead = "SELECT idperformance, idartist, idfestival, performedsong from performance;";
    conn.query(sqlRead, (err, result) => {
        res.send(result);
    })
})



app.post('/insertPerformance',
    body('idartist').notEmpty().withMessage('Error: artist id cannot be empty').isInt({min: 1}).withMessage('Error: Artist id cannot be 0 or less'),
    body('idfestival').notEmpty().withMessage('Error: festival id cannot be empty').isInt({min: 1}).withMessage('Error: festival id cannot be 0 or less'),
    body('song').notEmpty().withMessage('Error: empty song field').isLength({max: 30}).withMessage('Error: song inputted was more than 30 characters long'), 
    (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({errors: errors.array()});
        }

    let idartist = req.body.idartist;
    let idfestival = req.body.idfestival;
    let song = req.body.song;


    let sqlInsert = "INSERT INTO Performance (IdArtist, IdFestival, PerformedSong) VALUES (?, ?, ?);";

    conn.query(sqlInsert, [idartist, idfestival, song], (error, response) => {
        res.send(response);
    })
})




app.put('/updatePerformance',
    body('song').notEmpty().withMessage('Error: empty name field').isLength({max: 30}).withMessage('Error: song inputted was more than 30 characters'), 
    (req,res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.json({errors: errors.array()});
    }

    const song = req.body.song;
    const id = req.body.id;

    let sqlUpdate = "UPDATE performance SET PerformedSong = ? WHERE IdPerformance = ?;"
    conn.query(sqlUpdate, [song, id], (error, response) => {
        if(error){
            console.log(error);
        }
    })
})

app.delete('/deletePerformance/:id', (req,res) => {
    const id = req.params.id;

    let sqlDelete = "DELETE FROM performance WHERE idperformance = ?";
    conn.query(sqlDelete, id, (error, response) => {
        if(error){
            console.log(error);
        }
    })
})


/////////Combinations
app.get('/readArtistSong', (req,res) => {
    let sqlRead = "SELECT a.Nickname, a.Age, p.PerformedSong FROM artist a INNER JOIN performance p ON a.IdArtist=p.IdArtist;";
    conn.query(sqlRead, (err, result) => {
        res.send(result);
    })
})

app.get('/readFestivalSong', (req,res) => {
    let sqlRead = "SELECT p.PerformedSong, f.Name, f.StartDate, f.EndDate FROM festival f INNER JOIN performance p ON f.IdFestival=p.IdFestival;";
    conn.query(sqlRead, (err, result) => {
        res.send(result);
    })
})

app.get('/readFullInformation', (req,res) => {
    let sqlRead = "Select a.IdArtist, a.Nickname, a.Age, f.IdFestival, f.Name, f.StartDate, f.EndDate, p.IdPerformance, p.PerformedSong FROM artist a INNER JOIN performance p ON a.IdArtist = p.IdArtist INNER JOIN festival f ON f.IdFestival = p.IdFestival;";
    conn.query(sqlRead, (err, result) => {
        res.send(result);
    })
})

app.get('/read')

app.listen(4001, () => {
    console.log(`Listening on port 5001`);
  });