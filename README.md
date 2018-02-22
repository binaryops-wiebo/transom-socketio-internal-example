## Socket.IO
### Secured TransomJS SocketIO example

In this example we create a TransomJS server and use the [transom-server-functions](https://transomjs.github.io/docs/transom-server-functions/) plugin to create an endpoint for a your custom function. The function is secured using the [transom-mongoose-localuser](https://transomjs.github.io/docs/transom-mongoose-localuser/) plugin. We will host a little html page to facilitate the login using the [transom-scaffold](https://transomjs.github.io/docs/transom-scaffold/) plugin.
This example demonstrates how your own custom code can send asynchronous  messages to connected users using the [SocketIO plugin](https://transomjs.github.io/docs/transom-socketio-internal/). Your custom code runs in the context of the TransomJS server, and has access to the entire server context includind the message client provided by the socketIO plugin. In this example we just use the default administrator user to authenticate and connect to the SocketIO server.

### Run the example
Clone the `transom-socketio-internal-example` repository and install the dependencies with npm. 
```bash
$ git clone git@github.com:binaryops-wiebo/transom-socketio-internal-example.git
$ cd transom-socketio-internal-example
$ npm install
```

You'll need to have access to MongoDb for this example. If you don't already have it running locally, you can [download](https://www.mongodb.com/download-center#community) and install it, or get a free sandbox database at [mLab](https://www.mlab.com) among others. Update the `package.json` file `scripts` section to use the connect string to your mongoDb instance.

Use `npm start` to run the api server. The server will start on the localhost, on port 7070 and the login page will be available at http://localhost:7070/html/sample.html 
```bash
$ npm start
```
 
### Details
The first time you run the example, it will create a new database and initialize the users and groups collections. The default Administrator account is created with `password` as the password. These credentials are provided for you in the login form on the sample page. Upon a successful login, the connection to the SocketIO server is establised:

``` javascript
 // ./public-assets/html/sample.js

 /** 
 * Connecting to the socket server is a two step process.
 * first you need to request a socket token using an authenticated REST API call.
 * The token that is returned needs to be provided to the Socket server as a query argument.
 * It is a one-time use token that expires quickly.  
*/
function getSocketTokenAndConnect(){

    function setAuthToken(xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
    }

    $.ajax({
        url: "/api/v1/user/sockettoken",
        type: "GET",
        beforeSend: setAuthToken,
        success: function(data) {
            $('#lastResponse').text(JSON.stringify(data, undefined, 2));
            $('#login-row').hide();
            connectSocket(data.token);                        
        },
        error: function(err){
            console.log(err);
            $('#lastResponse').text(JSON.stringify(err.responseJSON));
        }
    });
}

/**
 * 
 * @param {string} token The token that needs to supplied to the socket server on the query parameters
 *  
 */
function connectSocket(token){
    socket.io.opts.query = {
        token: token
    };
    socket.connect();
    $('#multiplyfx-row').show();
}
```

On the server side, we start the TransomJS REST API server as well as the SocketIO server.
``` javascript
// ./index.js

// ****************************************************************************
// Start the Transom server...
// ****************************************************************************
var restifyApp = server.listen(7070, function () {
    console.log('%s listening at %s', server.name, server.url);
});

// ****************************************************************************
// Start the Socket.IO server...
// ****************************************************************************
transomSocketIOInternal.initializeWithServer(restifyApp);
```

The `myApi.js` file contains the implementation and details of the server function. We're still just multiplying by ten, like we did in the [secured functions example](https://transomjs.github.io/docs/secured-function-example/). However, this time the implementation of the function uses the passed in server reference to gain access to the message client and emits some fun messages to connected users.

``` Javascript
// myApi.js
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
  }
}
```

### See Also
We've included a [Postman](https://www.getpostman.com/postman) collection. It is a useful way to experiment with the API. Try calling the `timesten` function from Postman while logged in on the sample page, and see the power of Async messaging!