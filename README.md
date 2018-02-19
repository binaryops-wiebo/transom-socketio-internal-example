## Transom SocketIO Example

<<<<<<< HEAD
This example builds on the [secured function example](https://github.com/binaryops-wiebo/transom-functions-secured-example). Here
we add the [transom-socketio-internal](https://github.com/transomjs/transom-socketio-internal) plugin to the API. The server side 
function implementation still multiplies and responds with the result, but now it also initiates an async message to connected sockets. Try it out with multiple browser sessions!
=======
This example is very similar to the [secured example](https://github.com/binaryops-wiebo/transom-functions-secured-example). now we use a secured api call to retrieve a login token for the integrated Socket.IO server, and receive some async messages using the socket.io client!
>>>>>>> 9d7bad63cdc8d88681f86e67e7b665d9145f7e9f

## Usage
Clone the repo and run `npm install`.
Update scripts section of the package.json file, to use the connect string to your mongoDb instance. You can get a free sandbox database at [mLab](https://www.mlab.com) or [download MongoDb here](https://www.mongodb.com/download-center#community) 

## Running the example
Run `npm start`. This will initialize the users and groups collection in the database. The default Administrator account is created with `password` as the password.
<<<<<<< HEAD
Since logging in required a POST request, a simple HTML file is included to login, using the transom-scaffold plugin. Browse to [http://localhost:7070/html/sample.html](http://localhost:7070/html/sample.html) to access the page. All the client side code is located in `puclic-assets/html`
=======
Since logging in requires a POST request, a simple HTML file is included to login, using the transom-scaffold plugin. Browse to [http://localhost:7070/html/sample.html](http://localhost:7070/html/sample.html) to access the page.
Have a look at the sample.js file under `public-assets` as well as the `myApi.js` file for the implementation of the server side function that emits messages over websockets.
>>>>>>> 9d7bad63cdc8d88681f86e67e7b665d9145f7e9f

The administrator credentials are defaulted. Play around with the multiply function, try it with multiple browser sessions at the same time!  
