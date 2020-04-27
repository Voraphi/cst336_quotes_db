var express = require("express");
var mysql = require("mysql");
var app = express();
app.use(express.static("public")); //folder for images, css, js
app.set("view engine", "ejs");

// const request = require('request');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'voraphi',
    password: 'SchoolVor3',
    database: 'quotes_db'
});

connection.connect();

//routes
app.get("/", function(req, res){
    res.render("home");
});

app.get("/name", function(req, res) {
    res.render("name");
});

app.get("/author", function(req, res){
    var firstName = req.query.firstname;
    var lastName = req.query.lastname;
    var stmt = 
    'select * from l9_author where firstName=\'' + firstName + '\' and lastName=\'' + lastName + '\';'
    connection.query(stmt, function(error, results) {
        if(error) throw error;
        if(results) {
            // console.log(results);
            res.redirect("author/" + results[0].authorId);
        }
    });
    
});

app.get("/author/:authorId", function(req, res){
    var stmt = 
    'select *, quote from l9_author, l9_quotes where l9_author.authorId=' + req.params.authorId + ' and l9_author.authorId = l9_quotes.authorId;'
    console.log(stmt);
    connection.query(stmt, function(error, results) {
        if(error) throw error;
        if(results) {
            console.log(results);
            res.render("quotesByName", {author : results[0], quotes : results });
        }
    });
    
});

app.get("/category", function(req, res) {
   var stmt = "select category from l9_quotes;";
   connection.query(stmt, function(error, results) {
       if (error) throw error;
       if (results) {
           console.log(stmt, results);
           var s = new Set();
           results.forEach(function(c) {
               s.add(c.category);
           });
           res.render("category", {list : s});
       }
   })
});

app.get("/categorysearch", function(req, res) {
    var category = req.query.category;
    console.log(category, "oeijfgioengiiughwe;liugs;oighlewiughwiu");
    res.redirect("category/" + category);
});

app.get("/category/:word", function(req, res) {
   var stmt = 'select * from l9_author, l9_quotes where l9_quotes.category=\'' + req.params.word + '\' and l9_author.authorId = l9_quotes.authorId;'
   connection.query(stmt, function(error, results) {
       if (error) throw error;
       if (results) {
           console.log(stmt, results, results[0]);
           res.render("quotesByCategory", {quotes : results, category : req.params.word});
       }
   })
});

app.get("/sex", function(req, res) {
    res.render("sex");
});

app.get("/sexSearch", function(req, res) {
    var sex = req.query.sex;
    res.redirect("sexResults/" + sex);
});

app.get("/sexResults/:sex", function(req, res) {
    var sex = "null";
    if(req.params.sex == 'M') {
        sex = "Male";
    }
    else {
        sex = "Female";
    }
    var stmt = 'select * from l9_author, l9_quotes where l9_author.authorId=l9_quotes.authorId and l9_author.sex=\'' + req.params.sex + '\';';
    connection.query(stmt, function(error, results) {
       if(error) throw error;
       if (results) {
            res.render("quotesBySex", { quotes : results, sex : sex });
       }
    });
});

app.get("/keyword", function(req, res) {
    res.render("keyword");
});

app.get("/keywordSearch", function(req, res) {
    var keyword = req.query.keyword.trim();
    res.redirect("keywordResults/" + keyword);
});

app.get("/keywordResults/:word", function(req, res) {
   var stmt = 'select * from l9_quotes, l9_author where l9_quotes.quote like \'%' + req.params.word + '%\' and l9_author.authorId=l9_quotes.authorId;';
   connection.query(stmt, function(error, results) {
       if (error) throw error;
       if (results) {
           res.render("quotesByKeyword", { quotes : results, keyword : req.params.word });
       }
   })
});




app.get("*", function(req, res){
    res.render("error");
});


//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
});