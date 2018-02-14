'use strict';

const Transom = require('@transomjs/transom-core');
const transomServerFunctions = require('@transomjs/transom-server-functions');
const transomMongoose = require('@transomjs/transom-mongoose');
const transomMongooseLocalUser = require('@transomjs/transom-mongoose-localuser');
const transomSocketIOInternal = require('@transomjs/transom-socketio-internal');
const transomScaffold = require('@transomjs/transom-scaffold');
const transomNonce = require('@transomjs/transom-mongoose-nonce');


const transom = new Transom();

// ****************************************************************************
// This sample app doesn't use any metadata from the API definition.
// ****************************************************************************
const myApi = require('./myApi');
console.log("Running " + myApi.name);

const mongoUri = process.env.connectstr

console.log('mongo connect string is ', mongoUri);

transom.configure(transomMongoose, {mongodbUri: mongoUri});
transom.configure(transomMongooseLocalUser,{});
transom.configure(transomServerFunctions,{});
transom.configure(transomNonce);
transom.configure(transomScaffold,{});
transom.configure(transomSocketIOInternal);

// Initialize my TransomJS API metadata.
transom.initialize(myApi).then(function(server){
	//const server = transom.initialize(myApi);

	server.get('/', function(req,res,next){
		res.send('Browse to http://localhost:7070/api/v1/fx/timesten?val=45');
	});


	// ****************************************************************************
	// Handle 404 errors when a route is undefined.
	// ****************************************************************************
	server.get('.*', function (req, res, next) {
		var err = new Error(req.url + " does not exist");
		err.status = 404;
		next(err);
	});

	// ****************************************************************************
	// Handle Errors within the app as our last middleware.
	// ****************************************************************************
	server.use(function (error, req, res, next) {
		console.error("Error handler", error);
		var data = {};
		data.error = error;
		res.statusCode = error.status || 501;
		res.send(data);
	});

	

	
	// ****************************************************************************
	// Start the Transom server...
	// ****************************************************************************
	var restifyApp = server.listen(7070, function () {
		console.log('%s listening at %s', server.name, server.url);
		console.log('browse to http://localhost:7070/html/sample.html');
	});

	// ****************************************************************************
	// Start the Socket.IO server...
	// ****************************************************************************
	transomSocketIOInternal.initializeWithServer(restifyApp);


})
.catch(function(err){
	 console.log('Unable to start the server, exiting');
	 process.exit(-1);
});

// ****************************************************************************
// Handle uncaught exceptions within your code.
// ****************************************************************************
process.on('uncaughtException', function (err) {
	console.error('Really bad Error!', err);
});

// ****************************************************************************
// Handle uncaught rejections within your code.
// ****************************************************************************
process.on('unhandledRejection', function (err) {
	console.error('unhandledRejection', err);
});



