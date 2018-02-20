
/** 
 * The authentication token we receive from the login request. 
 */
var authToken = '';

/** 
 * Our socket client. We don't auto connect because we need to be authenticated first.
 */
var socket = io({autoConnect:false});

/** 
 * Login on the TransomJS API. You need to present your username and password
 * Using Basic Authentication. A successful login returns a token which needs to be
 * presented on subsequent authenticated requests as the Bearer token. 
*/
function doLogin(){
    const username = $('#username').val();
    const pwd = $('#password').val();

    var setLoginHeader = function(xhr){
        const authVal = 'Basic ' +  btoa(username + ':' + pwd);
        xhr.setRequestHeader('Authorization', authVal);

    }

    // Randomly pick a number between 1 and 100
    $('#valToMultiply').val(Math.round(Math.random()*100));

    authToken = ''; // Clear authToken

    $.ajax({
        url: "/api/v1/user/login",
        type: "POST",
        beforeSend: setLoginHeader,
        success: function(data) {
            // Keep track of the latest API response
            $('#lastResponse').text(JSON.stringify(data, undefined, 2));

            authToken = data.token;

            // Successfully logged in, now get a token for the socket server and connect.
            getSocketTokenAndConnect();
        },
        error: function(err){
            console.log(err);
            $('#lastResponse').text(JSON.stringify(err,2));
        }
    });
}

/**
 * We're listening to a pre-defined 'mySampleChannel'. 
 * Refer to 'myApi.js' to see how messages are emitted on this channel. 
 */
socket.on('mySampleChannel', function(data){
    // Add new messages to the top of the list
    $("#lastSocketMsg").prepend($("<li>").text(data));
});

/**
 * The Socket client is very resilient, if it needs to re-connect after a connection failure it will re-use
 * the now expired socket token. The server responds with an 'INVALID_TOKEN' error in this event. We'll need to 
 * get a new token and re-connect.
 */
socket.on('error', function(err) {
    if (err === 'INVALID_TOKEN') {
        socket.disconnect();
        getSocketTokenAndConnect();
    } else {
        console.log('Socket Error: ', err);
    }
});

/** 
 * Make the api call that is implemented with a custom server function. The implementation of that function
 * in 'myApi.js' user the transom-socketio-internal plugin to emit messages.
*/
function doMultiplyCall(){

    function setAuthToken(xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
    }

    var valToMultiply = $('#valToMultiply').val();
    if (isNaN(Number.parseFloat(valToMultiply))){
        return alert('Sorry, that is not a number.');
    }

    $.ajax({
        url: "/api/v1/fx/timesten",
        data: {val: Number.parseFloat(valToMultiply)},
        type: "GET",
        beforeSend: setAuthToken,
        success: function(data) {
            $('#lastResponse').text(JSON.stringify(data, undefined, 2));

            // Randomly pick another number between 1 and 100
            $('#valToMultiply').val(Math.round(Math.random()*100));
        },
        error: function(err){
            console.log(err);
            $('#lastResponse').text(JSON.stringify(err.responseJSON, undefined, 2) || 'Oh no, Something went terribly wrong!');

            $('#login-row').show();
            $('#multiplyfx-row').hide();            
        }
    });

}

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