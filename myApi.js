module.exports = {
	note: "This is a very simple example NodeJS app that uses TransomJS and the Server Functions module.",
	name: "My Socket.IO-Internal Example App",
	transom: {},
	definition: {
		scaffold: {
			"public-assets": {
				static: true,
				//assetPath: 'public-assets',
				path:  /html\/?.*/
			}
			// static: [{
			// 	pathOnDisk: '/html',
			// 	uriPath: /html\/?.*/
			// },{
			// 	pathOnDisk: '/docs/pdf',
			// 	uriPath: /pdf\/?.*/
			// }]
		},
        functions: {
			hello:{
				"methods": ["GET"],
				"function": function(server, req, res, next) {
					//do stuff
					res.send("hello world");
					next();
					}
			},
			timesten: {
				methods: ["GET"],
				"function": function(server, req, res, next) {
					if (req.params["val"]){
						const v = Number.parseFloat(req.params["val"]);
						res.send({val: v, timesten: (v * 10)} );

						const msgClient = server.registry.get('transomMessageClient');
						msgClient.emitToEveryone( 'mySampleChannel', 'Hello everyone. ' + req.locals.user.username + ' called timesten with value ' + v);
						
						msgClient.emitToUsers([req.locals.user],'mySampleChannel','Hey, ' + req.locals.user.username + ', you\'ll get another message in 5 seconds.');

						setTimeout(function(){
							msgClient.emitToUsers([req.locals.user],'mySampleChannel','Here is the other message');
						}, 5000);

						next();
					}	
				},
				acl: {
					groups: ["sysadmin","examplegroup"]
				} 
			}
		}	
    }
};