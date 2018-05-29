var express = require('express');
var router = express.Router();
var db = require("../sql/db_manage.js");

var multer = require('multer');


var dt = new Date();
var randomVal;


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      randomVal = Math.floor((Math.random() * 1000) + 1);
      cb(null, dt.getMonth() + dt.getDate() + dt.getDay() + "-" + dt.getHours() + dt.getMinutes() + "-" + randomVal + (".jpg"));
    }
});
var upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Eman' });
});

router.get('/home', function(req, res, next) {
  res.render('home', {});
});

router.get('/addapost', function(req, res, next){
  res.render('addpost', {message : ""});
});

router.post('/addPost', upload.single('uImg'), function(req, res, next){
	try{	
		var name = req.body.uName;
		var nick = req.body.uNick;
		var desc = req.body.uMessage;
		var img = req.body.uImg;
		console.log("randomVal: " + randomVal);
		var imgin = dt.getMonth() + dt.getDate() + dt.getDay() + "-" + dt.getHours() + dt.getMinutes() + "-" + randomVal + (".jpg");

		console.log (name);
		console.log (imgin);

		let sql = `INSERT INTO post (name, nick, description, image) VALUES(?,?,?,?)`;

		db.run(sql, [name, nick, desc, imgin], function(err){
			if (err){
				return console.log("Insert Post Error: " + err.message);
			}
			console.log(name + ` added Successfully with rowid ${this.lastID}`);
			var message = imgin + " created successfully.";
			res.render('addpost', { message: message});
		});
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
	
});


router.get('/viewallposts', function(req, res, next){
	try{

		console.log("Getting all posts")
		sql = `SELECT * from post`
		db.all(sql, function(err, rows){
			if(err){
				return console.log("Getting posts Error" + err.message)
			}
			console.log("Got all posts");
			if (rows.length == 0){
				requests = null;
			}
			else {
				requests = rows;
			}
			res.render('viewalloffers', {requests: requests});
		});
	}
	catch(ex){
		console.log("Internal Error: " + ex);
		return next(ex);
	}
});

module.exports = router;
