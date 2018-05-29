const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./sql/eman.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the qhelp database.");
});

db.serialize(function (){
	db.run(`CREATE TABLE IF NOT EXISTS post (
			post_id INTEGER UNIQUE NOT NULL PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			nick TEXT,
			description TEXT NOT NULL,
			image Text )`, [], function(err){

			if (err){
				return console.log(err.message);
			}

			console.log("Post table created successfully!");
	});
});

module.exports = db;