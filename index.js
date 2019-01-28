const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mysql = require('mysql');

var port = process.env.PORT || 1993;
var app = express()

app.use(cors());
app.use(bodyparser.json())

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'kevin',
    password: 'database',
    database: 'moviebertasbih',
    port: 3306
})


// MENU UI MANAGE MOVIES=================================PAGE 1
// GET UNTUK UI DISPLAY
app.get('/movie', (req,res) => {
    var sql = 'select * from movie;';
    conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    })       
})

// MENU ADD MOVIE BARU===================================
app.post('/addmovie', (req,res) => {
    var newmovie = {
        nama : req.body.nama,
        tahun : parseInt(req.body.tahun),
        description : req.body.description
    }
    var sql = `insert into movie set ?;`
    conn.query(sql, newmovie, (err,result) => {
        if(err) throw err;
        
        var sql = `select * from movie;`
        conn.query(sql, (err,result1) => {
        if(err) throw err;
        res.send(result1)
        })
    })
})

// MENU EDIT MOVIE========================================
app.post('/editmovie/:id', (req,res) => {
    var id = req.params.id;
    var editmovie = {
        nama : req.body.nama,
        tahun : parseInt(req.body.tahun),
        description : req.body.description
    }
    var sql = `select * from movie where id=${id};`
    conn.query(sql, (err,result) => {
        if(err) throw err; 
        
        var sql = `update movie set 
        nama='${editmovie.nama}',
        tahun='${editmovie.tahun}',
        description='${editmovie.description}'
        where id=${id};`
        conn.query(sql, (err,result1) => {
            if(err) throw err;
            
            sql = `select * from movie;`
            conn.query(sql, (err,result2) => {
                if(err) throw err;
                res.send(result2);
            })
        })
    })  
})

// MENU DELETE MOVIE========================================
app.delete('/deletemovie/:id', (req,res) => {
    var id = req.params.id
    var sql = `select * from movie where id='${id}';`
    conn.query(sql, (err,result) => {
        if(err) throw err;
        sql = `delete from movie where id=${id};`
        conn.query(sql, (err,result1) => {
            if(err) throw err;
            sql = 'select * from movie;'
            conn.query(sql, (err,result2) => {
                if(err) throw err;
                res.send(result2)
            })
        })
    })
})


// MENU UI MANAGE CATEGORY=================================PAGE 2
// GET UNTUK UI DISPLAY
app.get('/categories', (req,res) => {
    var sql = 'select * from categories;';
    conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    })       
})

// MENU ADD CATEGORY========================================
app.post('/addcategories', (req,res) => {
    var newcategory = {
        nama : req.body.nama,
    }
    var sql = `insert into categories set ?;`
    conn.query(sql, newcategory, (err,result) => {
        if(err) throw err;
        
        var sql = `select * from categories;`
        conn.query(sql, (err,result1) => {
        if(err) throw err;
        res.send(result1)
        })
    })
})

// MENU EDIT CATEGORY========================================
app.post('/editcategories/:id', (req,res) => {
    var id = req.params.id
    var editcategory = {
        nama : req.body.nama
    }
    var sql = `select * from categories where id=${id};`
    conn.query(sql, (err,result) => {
        if(err) throw err;

        sql = `update categories set 
        nama='${editcategory.nama}' 
        where id=${id};`
        conn.query(sql, (err,result1) => {
            if(err) throw err;
            var sql = `select * from categories;`
            conn.query(sql, (err,result2) => {
            if(err) throw err;
            res.send(result2)
            })
        })
    })
})

// MENU DELETE CATEGORY======================================
app.delete('/deletecategories/:id', (req,res) => {
    var id = req.params.id
    var sql = `select * from categories where id='${id}';`
    conn.query(sql, (err,result) => {
        if(err) throw err;
        sql = `delete from categories where id=${id};`
        conn.query(sql, (err,result1) => {
            if(err) throw err;
            sql = 'select * from categories;'
            conn.query(sql, (err,result2) => {
                if(err) throw err;
                res.send(result2)
            })
        })
    })
})

// MENU MANAGE CONNECT MOVIE & CATEGORY========================PAGE 3
// GET UNTUK UI DISPLAY
app.get('/connectMC' , (req,res) => {
    var sql = `SELECT m.nama as namamovie, c.nama as namacategory 
    from movie m 
    join movcat mc 
    on m.id = mc.idmovie
    join categories c
    on mc.idmovie = c.id;`
    conn.query(sql, (err,result) => {
        if(err) throw err;
        res.send(result);
    })
})

// MENU ADD CONNECT MOVIE & CAGTEGORY==========================
app.post('/addconnectMC' , (req,res) => {
    var addnewconnect = {
        namamovie: req.body.namamovie,
        namacategory: req.body.namacategory
    }
    var sql = `select * from movie where nama='${addnewconnect.namamovie};`
    conn.query(sql, (err,result) => {
        if(err) throw err;
        var movie = result.id
        
        sql = `select * from categories where nama='${addnewconnect.namacategory};`
        conn.query(sql, (err,result1) => {
            if(err) throw err;
            var category = result1.id

            sql = `insert into movcat values(${movie},${category}) ;`
            conn.query(sql, (err,result2) => {
                if(err) throw err;

                sql = `SELECT m.nama as namamovie, c.nama as namacategory 
                from movie m 
                join movcat mc 
                on m.id = mc.idmovie
                join categories c
                on mc.idmovie = c.id;`
                conn.query(sql, (err,result3) => {
                    if(err) throw err;
                    res.send(result3);
                })
            })
        })
    })
})





app.listen(port, () => console.log('API aktif di port ' + port))