var os = require('os');
var morgan = require('morgan');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var gatewayServiceUri = "http://" + process.env.GATEWAY_DNSNAME;

if (!gatewayServiceUri) {
    console.error("Bikes service URI not defined!");
    process.exit(1);
}
console.log("Gateway URI: " + gatewayServiceUri)

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(morgan("dev"));
app.use(bodyParser.json());

// application -------------------------------------------------------------
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/hello', function(req, res) {
    res.send("Hello!");
});

// Get available bikes
app.get('/api/availableBikes', function (req, res) {
    const options = {
        url: gatewayServiceUri + "/api/bike/availableBikes",
        headers: {
            'azds-route-as': req.get('azds-route-as')
        }
    };
    request.get(options, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get all bikes
app.get('/api/allbikes', function (req, res) {
    const options = {
        url: gatewayServiceUri + "/api/bike/allBikes",
        headers: {
            'azds-route-as': req.get('azds-route-as')
        }
    };
    request.get(options, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// create new bike
app.post('/api/bike', function(req, res) {
    const requestOptions = { 
        url: gatewayServiceUri + "/api/bike",
        headers: {
            'azds-route-as': req.get('azds-route-as')
        },
        json: req.body 
    };
    request.post(requestOptions, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get invoice
app.get('/api/billing/invoice/:invoiceId', function(req, res) {
    if (!req.params.invoiceId) {
        res.status(400).send('Must specify invoiceId');
        return;
    }

    const options = {
        url: gatewayServiceUri + "/api/billing/invoice/" + req.params.invoiceId,
        headers: {
            'azds-route-as': req.get('azds-route-as')
        }
    };
    request.get(options, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Create new customer
app.post('/api/user', function(req, res) {
    const requestOptions = { 
        url: gatewayServiceUri + "/api/user",
        headers: {
            'azds-route-as': req.get('azds-route-as')
        },
        json: req.body 
    };
    request.post(requestOptions, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        
        res.status(response.statusCode).send(body);
    });
});

// Create new vendor
app.post('/api/user/vendor', function(req, res) {
    const requestOptions = { 
        url: gatewayServiceUri + "/api/user/vendor",
        headers: {
            'azds-route-as': req.get('azds-route-as')
        },
        json: req.body 
    };
    request.post(requestOptions, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get customer billing data
app.get('/api/billing/customer/:userId', function(req, res) {
    if (!req.params.userId) {
        res.status(400).send("Must specify userId");
        return;
    }

    const options = {
        url: gatewayServiceUri + "/api/billing/customer/" + req.params.userId,
        headers: {
            'azds-route-as': req.get('azds-route-as')
        }
    };
    request.get(options, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get vendor billing data
app.get('/api/billing/vendor/:userId', function(req, res) {
    if (!req.params.userId) {
        res.status(400).send("Must specify userId");
        return;
    }

    const options = {
        url: gatewayServiceUri + "/api/billing/vendor/" + req.params.userId,
        headers: {
            'azds-route-as': req.get('azds-route-as')
        }
    };
    request.get(options, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Authenticate user
app.post('/api/user/auth', function(req, res) {
    if (!req.body.userName) {
        res.status(400).send('Must specify userName');
        return;
    }
    if (!req.body.userPass) {
        res.status(400).send('Must specify userPass');
        return;
    }

    var authRequestOptions = { 
        url: gatewayServiceUri + "/api/user/auth",
        headers: {
            'azds-route-as': req.get('azds-route-as')
        },
        json: { 
            "username": req.body.userName, 
            "password": req.body.userPass 
        } 
    };
    request.post(authRequestOptions, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get all users
app.get('/api/user/allUsers', function(req, res) {
    const options = {
        url: gatewayServiceUri + "/api/user/allUsers",
        headers: {
            'azds-route-as': req.get('azds-route-as')
        }
    };
    request.get(options, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get reservations for user
app.get('/api/user/:userId/reservations', function(req, res) {
    if (!req.params.userId) {
        res.status(400).send('Must specify userId');
        return;
    }

    const options = {
        url: gatewayServiceUri + "/api/user/" + req.params.userId + "/reservations",
        headers: {
            'azds-route-as': req.get('azds-route-as')
        }
    };
    request.get(options, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get specific reservation
app.get('/api/reservation/:reservationId', function(req, res) {
    if (!req.params.reservationId) {
        res.status(400).send('Must specify reservationId');
        return;
    }

    const options = {
        url: gatewayServiceUri + "/api/reservation/" + req.params.reservationId,
        headers: {
            'azds-route-as': req.get('azds-route-as')
        }
    };
    request.get(options, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get all reservations
app.get('/api/reservation/allReservations', function(req, res) {
    const options = {
        url: gatewayServiceUri + "/api/reservation/allReservations",
        headers: {
            'azds-route-as': req.get('azds-route-as')
        }
    };
    request.get(options, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
})

// Create reservation
app.patch('/api/bikes/:bikeId/reserve/:userId', function(req, res) {
    if (!req.params.bikeId) {
        res.status(400).send('Must specify bikeId');
        return;
    }
    if (!req.params.userId) {
        res.status(400).send('Must login');
        return;
    }

    handleReservation(req, res, { json: { "bikeId": req.params.bikeId, "userId": req.params.userId } }, "");
});

// Complete reservation
app.patch('/api/reservation/:resId/clear', function(req, res) {
    if (!req.params.resId) {
        res.status(400).send('Must specify resId');
        return;
    }

    handleReservation(req, res, {}, "/" + req.params.resId);
});

function handleReservation(req, res, requestOptions, endpointAppend) {
    requestOptions.url = gatewayServiceUri + "/api/reservation" + endpointAppend;
    requestOptions.headers = {
        'azds-route-as': req.get('azds-route-as')
    };
    request.post(requestOptions, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
}

process.on("SIGINT", () => {
    console.log("Interrupted. Terminating...");
    if (server) {
        server.close();
    }
});

process.on("SIGTERM", () => {
    console.log("Terminating...");
    if (server) {
        server.close();
    }
});

var port = 80;
var server = app.listen(port, function () {
    console.log('Listening on port ' + port);
});
