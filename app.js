/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var shortid = require('shortid');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multer = require('multer'); // only for multipart/form-data formats

//--------------------------------------
// Let's go
//--------------------------------------

// create app
var app = express();
// get ready for uploads 
var upload = multer({
	dest: './uploads/'
});

// setup app environment
app.set('port', process.env.PORT || 3000); //sets port approperate to environment (3000 for localhost)
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// for development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

// cloudant.db.list(function(err, allDbs) {
// 	console.log('All my databases: %s', allDbs.join(', '))
// });

// make connection to tickets databases
var db;
connectToCloudant('ibptickets');

//--------------------------------------
// Utilities
//--------------------------------------
function connectToCloudant(dbName) {
	var cloudant;
	var dbCredentials = {
		dbName: dbName
	};

	console.log('Connecting to database: ' + dbName)
	if(process.env.VCAP_SERVICES) {
		// Bluemix environment
		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
		for(var vcapService in vcapServices){
			if(vcapService.match(/cloudant/i)){
				dbCredentials.host = vcapServices[vcapService][0].credentials.host;
				dbCredentials.port = vcapServices[vcapService][0].credentials.port;
				dbCredentials.user = vcapServices[vcapService][0].credentials.username;
				dbCredentials.password = vcapServices[vcapService][0].credentials.password;
				dbCredentials.url = vcapServices[vcapService][0].credentials.url;
				
				// Initialize cloudant library with my account. 
				cloudant = require('cloudant')(dbCredentials.url);
				
				// check if DB exists if not create
				cloudant.db.create(dbCredentials.dbName, function (err, res) {
					if (err) { console.log('could not create db ', err); }
				});
				// use existing data base
				db = cloudant.db.use(dbCredentials.dbName);
				break;
			}
		}
		if(db==null){
			console.warn('Could not find Cloudant credentials in VCAP_SERVICES environment variable - data will be unavailable to the UI');
		}
	} else{
		// localhost environment
		dbCredentials.host = "a94ae631-6468-428f-bef9-ab07fe0fdbc9-bluemix.cloudant.com";
		dbCredentials.port = 443;
		dbCredentials.url = "https://a94ae631-6468-428f-bef9-ab07fe0fdbc9-bluemix:15e7ca4b1b69f3457e080450e03fcd82f7c1ced9597c441a670f510036514add@a94ae631-6468-428f-bef9-ab07fe0fdbc9-bluemix.cloudant.com";
		cloudant = require('cloudant')(dbCredentials.url);
		
		// check if DB exists if not create
		cloudant.db.get(dbCredentials.dbName, function(err, res) {
			if (!err) {
				// connect to database
				db = cloudant.db.use(dbCredentials.dbName);
				if (db!=null){
					console.log('Connected!');
					console.log('Database info: ' + res);
				}else{
					console.log('Not connected.');
				}
			} else {
				console.log('[DB]: ' + err);
				console.log('Creating new database: ' + dbCredentials.dbName);
				cloudant.db.create(dbCredentials.dbName, function (err, res) {
					if (!err) { 
						console.log(res);
						// connect to database
						db = cloudant.db.use(dbCredentials.dbName);
						if (connection!=null){
							console.log('Connected!');
							console.log('Database info: ' + res);
						}else{
							console.log('Not connected.');
						}
					} else {
						console.log('[DB]: ', err);
					}
				});
			}
		}); // end of db connection
	}
};

function createResponseData(id, rev, name, ticketData, attachments) {
	var responseData = {
		_id : id,
		_rev : rev,
		name : name,
		data : ticketData,
		attachments : []
	};

	attachments.forEach (function(item, index) {
		var attachmentData = {
			content_type : item.type,
			key : item.key,
			url : '/api/tickets/attach?id=' + id + '&key=' + item.key
		};
		responseData.attachements.push(attachmentData);
	});
	
	return responseData;
};

/*********************************
CORS
*********************************/
// app.all("*/watsonplatform/*", function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
//     return next();
// });

/*********************************
Watson Retrieve and Rank service
*********************************/
var watson  = require('watson-developer-cloud');
var retrieve_and_rank = watson.retrieve_and_rank({
  username: '27e15910-c8bf-4b46-a757-bbb8c0d23947',
  password: 'WedqteFdY0K2',
  version: 'v1'
});

var params = {
  cluster_id: "sc2e0320c3_b465_42b8_853f_e7eb68a50877",
  collection_name: "IBP_collection"
};

//  Use a querystring parser to encode output.
var qs = require('qs');

// Get a Solr client for indexing and searching documents.
// See https://github.com/watson-developer-cloud/node-sdk/blob/master/services/retrieve_and_rank/v1.js
var solrClient = retrieve_and_rank.createSolrClient(params);

var ranker_id = '1ba90fx17-rank-114';

app.get('/api/watson/answers/:question', function(req, res) {
	var question = req.params.question;
	var query     = qs.stringify({q: question, ranker_id: ranker_id, fl: 'id,answer,title'}); //fl: 'id,title'

	solrClient.get('select', query, function(err, searchResponse) {
  		if(err) {
    		console.log('Error searching for documents: ' + err);
  		} else {
      		// console.log(JSON.stringify(searchResponse.response.docs, null, 2));
			res.write(JSON.stringify(searchResponse.response.docs));
			res.end();
    	}
	});
});


/*********************************
Route PUT endpoint
*********************************/
app.put('/api/upload/file', upload.single('file'), function(req, res) {
	console.log('[Server]: request data:'+ JSON.stringify(req.body));
	console.log('[Server]: request file:'+ JSON.stringify(req.file));
	res.status(303).send('Your file has been submited successfully.');
})

app.put('/api/new-ticket/submit', upload.single('file'), function(req, res) {
	console.log('[Server]: request data:'+ JSON.stringify(req.body));
	console.log('[Server]: request file:'+ JSON.stringify(req.file));
	var ticket = req.body;
	var date = new Date();
	// add property: id
	ticket.id = shortid.generate();
	// add property: status
	ticket.status = 'new';
	// add property: resolver
	ticket.resolver = '';
	// add property: severity
	ticket.severity = '';
	// add property: creationTime (miliseconds)
	ticket.creationTime = date.getTime(); 
	// add property: resolutionTime
	ticket.resolutionTime = null;
	// add property: lastupdate
	ticket.lastUpdate = null;
	// add property: answer (object)
	ticket.answer = {
		chat: [{
			name: "admin",
			timeStamp: date.getTime(),
			text: "not answered yet."
		}],
		newText : ''};
	
	// Push Ticket data to DB
	var docName = 'Ticket';
	var docDesc = 'This doc holds all data associated with IBP ticket.';
	db.insert({
		name: docName,
		value : docDesc,
		data : ticket
	},'', function(err, doc) {
		if (err) {
			console.log('[DB error]: ' + err);
		} else {
			console.log('[DB]: document inserted -> ' + JSON.stringify(doc));
			res.status(303).send('Your ticket has been submited successfully.'); //this is part of Post/Redirect/Get pattern
		}
	});// End document insert
});

/*********************************
Route POST endpoint
*********************************/

/*********************************
Route GET endpoint
*********************************/
// send main page
app.get('/main', function(req, res){
	res.send('index.html');
});

// search for single ticket
app.get('/api/get/ticket/:ticketID', function(req, res){
	var ticketID = req.params.ticketID;
	var isFound = false;
	var count = 0;
	// list all docs in db
	db.list(function(err, body){
		if (err) {
			console.log('[DB error] ' + err);
		} 
		else {
			var len = body.rows.length;
			console.log('[DB]: Success! Total of docs -> ' + len);
			if (len == 0) {
				res.send('No documents found.');
			} else {
				// Search in each document
				body.rows.forEach(function(document) {
					db.get(document.id, { revs_info: false }, function(err, ticket) { // here ticket refers to doc
						if (err) {
							console.log('[DB error]: ' + err);
						} else {
							count++;
							if ( ticket.data.id == ticketID ) {
								res.json(ticket);
								//isFound = true;
							}
						}
					}); //end db get
				}); // end db forEach
			}
		}
	}); // end db list
});

app.get('/api/fetch/tickets', function(req, res){
	
	var docList = []; 
	var count = 0;
	// Query all documents from DB
	console.log('[DB]: listing all documents...');
	db.list(function(err, body){
		if (err) {
			console.log('[DB error] ' + err);
		} 
		else {
			var len = body.rows.length;
			console.log('[DB]: Success! Total of docs -> ' + len);
			if (len == 0) {
				res.send('No tickets found.');
			} else {
				// Fetch data of all Tickets
				body.rows.forEach(function(document) {
					db.get(document.id, { revs_info: false }, function(err, doc) {
						if (err) {
							console.log('[DB error]: ' + err);
						} else {

							if (doc['_attachments']) {

								var attachments = [];
								for(var attribute in doc['_attachments']){
								
									if(doc['_attachments'][attribute] && doc['_attachments'][attribute]['content_type']) {
										attachments.push({"key": attribute, "type": doc['_attachments'][attribute]['content_type']});
									}
									console.log(attribute+": "+JSON.stringify(doc['_attachments'][attribute]));
								}
							
								var responseData = createResponseData(
									doc._id,
									doc._rev,
									doc.name,
									doc.data,
									attachments);
							} else {
								var responseData = createResponseData(
									doc._id,
									doc._rev,
									doc.name,
									doc.data,
									[]);
							}

							docList.push(responseData);
							count++;
							if (count >= len) {
								res.write(JSON.stringify(docList));
								console.log('[Server]: ending response...');
								res.end();
							}	
						}// end else
					});// end db.get
				});// end forEach
			}// end else
		}// end else
	});// end db.list
});// end app.get

app.put('/api/update/ticket', function(req, res){
	console.log('[Server]: managing update request with data:'+ JSON.stringify(req.body));
	var ticket = req.body;
	var lastMessage = ticket.data.answer.chat.length;
	var timeStamp = new Date();
	
	ticket.data.answer.chat[lastMessage-1].timeStamp = timeStamp.getTime();
	ticket.data.lastUpdate = timeStamp.getTime();
	db.insert(ticket, function(err, doc) {
		if (err) {
			console.log('[DB error]: ' + err);
		} else {
			console.log('[DB]: document updated -> ' + JSON.stringify(doc));
			res.json({docRev:doc.rev, timeStamp: timeStamp.getTime()});
		}
	});// End document update
});

app.listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express app listening on port ' + app.get('port'));
});

