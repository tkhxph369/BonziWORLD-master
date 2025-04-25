// ========================================================================
// Server init
// ========================================================================

// Filesystem reading functions
const fs = require('fs-extra');
const path = require('path');

// Load settings
try {
	stats = fs.lstatSync('settings.json');
} catch (e) {
	// If settings do not yet exist
	if (e.code == "ENOENT") {
		try {
			fs.copySync(
				'settings.example.json',
				'settings.json'
			);
			console.log("Created new settings file.");
		} catch(e) {
			console.log(e);
			throw "Could not create new settings file.";
		}
	// Else, there was a misc error (permissions?)
	} else {
		console.log(e);
		throw "Could not read 'settings.json'.";
	}
}

// Load settings into memory
const settings = require("./settings.json");

// Setup basic express server
var express = require('express');
var app = express();

// Serve static files from the src/www directory
const staticPath = path.join(__dirname, '../src/www');
if (settings.express.serveStatic) {
	console.log('Serving static files from:', staticPath);
	app.use(express.static(staticPath));
}

// Add a route for the root path
app.get('/', (req, res) => {
	res.sendFile(path.join(staticPath, 'index.html'));
});

var server = require('http').createServer(app);

// Init socket.io
var io = require('socket.io')(server);
var port = process.env.PORT || settings.port;

exports.io = io;

// Init sanitize-html
var sanitize = require('sanitize-html');

// Init winston loggers (hi there)
const Log = require('./log.js');
Log.init();
const log = Log.log;

// Load ban list
const Ban = require('./ban.js');
Ban.init();

// Start actually listening
server.listen(port, function () {
	console.log(
		" Welcome to BonziWORLD!\n",
		"Time to meme!\n",
		"----------------------\n",
		"Server listening at port " + port
	);
});

// ========================================================================
// Banning functions
// ========================================================================

// ========================================================================
// Helper functions
// ========================================================================

const Utils = require("./utils.js")

// ========================================================================
// The Beef(TM)
// ========================================================================

const Meat = require("./meat.js");
Meat.beat();

// Console commands
const Console = require('./console.js');
Console.listen();