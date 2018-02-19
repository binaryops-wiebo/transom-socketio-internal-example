## Transom SocketIO Example

This example builds on the [secured function example](https://github.com/binaryops-wiebo/transom-functions-secured-example). Here
we add the [transom-socketio-internal](https://github.com/transomjs/transom-socketio-internal) plugin to the API. The server side 
function implementation still multiplies and responds with the result, but now it also initiates an async message to connected sockets. Try it out with multiple browser sessions!

## Usage
Clone the repo and run `npm install`.
Update scripts section of the package.json file, to use the connect string to your mongoDb instance. You can get a free sandbox database at [mLab](https://www.mlab.com) or [download MongoDb here](https://www.mongodb.com/download-center#community) 

## Running the example
Run `npm start`. This will initialize the users and groups collection in the database. The default Administrator account is created with `password` as the password.
Since logging in required a POST request, a simple HTML file is included to login, using the transom-scaffold plugin. Browse to [http://localhost:7070/html/sample.html](http://localhost:7070/html/sample.html) to access the page. All the client side code is located in `puclic-assets/html`

The administrator credentials are defaulted. Go ahead and click the 'Call Function' button before and after logging in.

Also note that the [hello world](http://localhost:7070/api/v1/fx/hello) is still available as the anonymous user.  
