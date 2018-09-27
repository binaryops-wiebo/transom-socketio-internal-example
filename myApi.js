module.exports = {
	note: "This is a simple example TransomJS app that uses Server Functions and the SocketIO Internal plugin.",
	name: "SocketIO-Internal Example App",
	transom: {},
	definition: {
		scaffold: {
			redirectRoutes: {
				path: '/',
				target: '/html/sample.html'
			},
			staticRoutes: {
				path: '/html/.*',
				folder: "public-assets"
			}
		},
		functions: {
			hello: {
				methods: ["GET"],
				function: function (server, req, res, next) {
					//do stuff
					const msgClient = server.registry.get('transomMessageClient');
					msgClient.emitToEveryone('mySampleChannel', 'Hello everyone!');

					res.send("Hello world!");
					next();
				}
			},
			timesten: {
				methods: ["GET"],
				function: function (server, req, res, next) {
					if (req.params["val"]) {
						const v = Number.parseFloat(req.params["val"]);
						res.send({
							val: v,
							timesten: (v * 10)
						});

						const msgClient = server.registry.get('transomMessageClient');

						// Send to all connected users.
						msgClient.emitToEveryone('mySampleChannel', 'Hello everyone, ' + req.locals.user.username + ' called timesten with value ' + v);

						// Send to an array of named users.
						msgClient.emitToUsers([req.locals.user], 'mySampleChannel', `Hey, ${req.locals.user.username}, What is ${v} * 10? I'll give you the answer in 5 seconds.`);

						// Send to an array of named users after a short pause.
						setTimeout(function () {
							msgClient.emitToUsers([req.locals.user], 'mySampleChannel', `${v} * 10 = ${(v*10)} Did you get it right?`);
						}, 5000);
					}
					next();
				},
				acl: {
					groups: ["sysadmin", "examplegroup"]
				}
			}
		}
	}
};