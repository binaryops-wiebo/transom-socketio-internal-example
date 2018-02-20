## Transom SocketIO Example

This example builds on principles covered in the [secured function example](https://github.com/binaryops-wiebo/transom-functions-secured-example), but here
we also add the [transom-socketio-internal](https://github.com/transomjs/transom-socketio-internal) plugin to the server. We still have our server side function implementation to multiply by 10 and respond with the result, but now it also initiates an async message to connected sockets. This nifty example works best if you're able to try it out with multiple browsers.

We've modified the login to create an authenticated session to the socket server as well, using a short-lived token provided by the [transom-mongoose-nonce](https://github.com/transomjs/transom-mongoose-nonce) plugin.

## Usage
Clone the repo and install the dependencies.
```bash
$ git clone git@github.com:binaryops-wiebo/transom-socketio-internal-example.git
$ npm install
```

Next, you'll have to update scripts section of the package.json file, to use the connect string to your MongoDb instance. If you don't already have a local MongoDB running, you can get a free sandbox database at [mLab](https://www.mlab.com) or download the [MongoDb Community Server](https://www.mongodb.com/download-center#community) and install it locally.

## Running the example
Run the example app with `npm start`. This will initialize the users and groups collections within the database. A default `Administrator` account is created with `password` as it's password.
Since logging in requires a POST request, an HTML file is included to login, using the [transom-scaffold](https://github.com/transomjs/transom-scaffold) plugin. Browse to [http://localhost:7070/](http://localhost:7070/) and you should be redirected to the Login page at `html/sample.html`.
Have a look at the `public-assets/sample.js` for the client side implementation and the `myApi.js` file for the  server side implementation of the function that emits messages over websockets.

The administrator credentials are provided by default in the HTML. Play around with the multiply function, and try it with multiple browser sessions at the same time to see how it's able to communicate real-time with independent clients.
