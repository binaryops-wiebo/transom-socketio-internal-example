# transom-functions-secured-example

This example is very similar to the [secured example](https://github.com/binaryops-wiebo/transom-functions-secured-example). now we use a secured api call to retrieve a login token for the integrated Socket.IO server, and receive some async messages using the socket.io client!

## Usage
Clone the repo and run `npm install`.
Update scripts section of the package.json file, to use the connect string to your mongoDb instance. You can get a free sandbox database at [mLab](https://www.mlab.com) 

## Running the example
Run `npm start`. This will initialize the users and groups collection in the database. The default Administrator account is created with `password` as the password.
Since logging in requires a POST request, a simple HTML file is included to login, using the transom-scaffold plugin. Browse to [http://localhost:7070/html/sample.html](http://localhost:7070/html/sample.html) to access the page.
Have a look at the sample.js file under `public-assets` as well as the `myApi.js` file for the implementation of the server side function that emits messages over websockets.

The administrator credentials are defaulted. Play around with the multiply function, try it with multiple browser sessions at the same time!  
