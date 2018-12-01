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
    request.get(gatewayServiceUri + "/api/bike/availableBikes", function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get all bikes
app.get('/api/allbikes', function (req, res) {
    request.get(gatewayServiceUri + "/api/bike/allBikes", function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// create new bike
app.post('/api/bike', function(req, res) {
    var requestOptions = { json: req.body };
    request.post(gatewayServiceUri + "/api/bike", requestOptions, function(err, response, body) {
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

    request.get(gatewayServiceUri + "/api/billing/invoice/" + req.params.invoiceId, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Create new customer
app.post('/api/user', function(req, res) {
    var requestOptions = { json: req.body };
    request.post(gatewayServiceUri + "/api/user", requestOptions, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        
        res.status(response.statusCode).send(body);
    });
});

// Create new vendor
app.post('/api/user/vendor', function(req, res) {
    var requestOptions = { json: req.body };
    request.post(gatewayServiceUri + "/api/user/vendor", requestOptions, function(err, response, body) {
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

    request.get(gatewayServiceUri + "/api/billing/customer/" + req.params.userId, function(err, response, body) {
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

    request.get(gatewayServiceUri + "/api/billing/vendor/" + req.params.userId, function(err, response, body) {
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

    var authRequestOptions = { json: { "username": req.body.userName, "password": req.body.userPass } };
    request.post(gatewayServiceUri + "/api/user/auth", authRequestOptions, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get all users
app.get('/api/user/allUsers', function(req, res) {
    request.get(gatewayServiceUri + "/api/user/allUsers", function(err, response, body) {
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

    request.get(gatewayServiceUri + "/api/user/" + req.params.userId + "/reservations", function(err, response, body) {
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

    request.get(gatewayServiceUri + "/api/reservation/" + req.params.reservationId, function(err, response, body) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(response.statusCode).send(body);
    });
});

// Get all reservations
app.get('/api/reservation/allReservations', function(req, res) {
    request.get(gatewayServiceUri + "/api/reservation/allReservations", function(err, response, body) {
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

    handleReservation(res, { json: { "bikeId": req.params.bikeId, "userId": req.params.userId } }, "");
});

// Complete reservation
app.patch('/api/reservation/:resId/clear', function(req, res) {
    if (!req.params.resId) {
        res.status(400).send('Must specify resId');
        return;
    }

    handleReservation(res, {}, "/" + req.params.resId);
});

function handleReservation(res, requestOptions, endpointAppend) {
    request.post(gatewayServiceUri + "/api/reservation" + endpointAppend, requestOptions, function(err, response, body) {
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
