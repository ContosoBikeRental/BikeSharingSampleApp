
// Angular
var app = angular.module('myApp', ['ngRoute', 'ngCookies']);

app.controller('MainController', function($scope, $http, $timeout, $window, $document, $cookies) {
    $scope.layout = function() {
        $timeout(function() {
            var divHeight = $('#header-wrap').height(); 
            $('#container').css('margin-top', divHeight+'px');
        }, 100);
    }

    angular.element($document).ready(function() {
        $scope.layout();
    });

    angular.element($window).bind('resize', function() {
        $scope.layout();
    });

    $scope.messages = [];
    var pushLogMessage = function(msg) {
        $scope.messages.push(msg);
        $timeout(function() { window.scrollTo(0, document.body.scrollHeight); }, 50);
    }

    $scope.getAvailableBikes = function() {
        $http.get("/api/availableBikes").then(function(response) {
            pushLogMessage("Available bikes: " + JSON.stringify(response.data));
        }, function(response) {
            pushLogMessage("Couldn't get available bikes: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
        });
    }
    $scope.getAvailableBikes();

    $scope.getAllBikes = function() {
        $http.get("/api/allbikes").then(function(response) {
            pushLogMessage("All bikes: " + JSON.stringify(response.data));
        }, function(response) {
            pushLogMessage("Couldn't get all bikes: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
        });
    }

    $scope.bikeId = "";
    $scope.reservationId = "";
    $scope.myReservations = [];
    var bikeReservationInner = function(response) {
        pushLogMessage(response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
    }
    $scope.reserveBike = function() {
        if (!$scope.bikeId) {
            pushLogMessage("Please specify a BikeId");
            return;
        }

        var reserveBikeFunc = function(userId) {
            $http.patch("/api/bikes/" + $scope.bikeId + "/reserve/" + userId).then(function(response) {
                bikeReservationInner(response);
                $scope.myReservations.push({ bikeId: $scope.bikeId, reservationId: response.data.reservationId });
                $scope.bikeId = "";
                $scope.layout();
            }, bikeReservationInner);
        };

        if ($scope.authenticatedUser && $scope.authenticatedUser.type == "customer") {
            reserveBikeFunc($scope.authenticatedUser.id);
        } else {
            pushLogMessage("Choosing a customer at random...");
            $scope.getAllUsers(function(err, users) {
                if (err) {
                    pushLogMessage("Unexpected error checking existing customers for the reservation.");
                    return;
                }

                var createCustomerFunc = function() {
                    pushLogMessage("Creating a new customer...");
                    $scope.createRandomCustomer(function(err, newCustomer) {
                        if (err) {
                            pushLogMessage("Unexpected error creating new customer for the reservation.");
                            return;
                        }
                        $scope.userName = newCustomer.username;
                        $scope.userPass = newCustomer.password;
                        $scope.login();
                        reserveBikeFunc(newCustomer.id);
                    });
                };

                if (users.length == 0) {
                    createCustomerFunc();
                } else {
                    var customer = users.find(function (u) {
                        return u.type == "customer";
                    });

                    if (customer) {
                        reserveBikeFunc(customer.id);
                    } else {
                        createCustomerFunc();
                    }
                }
            })
        }
    }
    $scope.clearBike = function() {
        if (!$scope.reservationId) {
            pushLogMessage("Please specify a ReservationId");
            return;
        }

        $http.patch("/api/reservation/" + $scope.reservationId + "/clear").then(function(response) {
            bikeReservationInner(response);
            var resToRemove = $scope.myReservations.find(function(res) {
                return res.reservationId == $scope.reservationId;
            });
            var index = $scope.myReservations.indexOf(resToRemove);
            if (index > -1) {
                $scope.myReservations.splice(index, 1);
            }
            $scope.reservationId = "";
            $scope.layout();
        }, bikeReservationInner);
    }

    $scope.invoiceId = "";
    $scope.getInvoice = function() {
        var invoiceId = $scope.invoiceId;
        if (!invoiceId || invoiceId == "") {
            pushLogMessage("Please specify InvoiceId");
            return;
        }

        $http.get("/api/billing/invoice/" + invoiceId).then(function(response) {
            pushLogMessage("Invoice details: " + JSON.stringify(response.data));
            $scope.invoiceId = "";
        }, function(response) {
            pushLogMessage("Couldn't get invoice: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
        });
    }

    $scope.createRandomCustomer = function(optionalCallback) {
        $http.get('https://randomuser.me/api/').then(function(response) {
            var randUser = response.data.results[0];
            var userDef = {
                "Username": randUser.login.username,
                "Password": randUser.login.password,
                "Name": randUser.name.first + " " + randUser.name.last,
                "Address": randUser.location.street,
                "Phone": "1234567890",
                "Email": randUser.email,
                "CCNumber": randUser.login.md5,
                "CCExpiry": randUser.dob.date,
                "CCCCV": randUser.location.postcode.toString()
            };

            $http.post("/api/user", JSON.stringify(userDef)).then(function(response) {
                response.data.password = randUser.login.password;
                response.data.ccNumber = userDef.CCNumber;
                response.data.ccExpiry = userDef.CCExpiry;
                response.data.ccCCV = userDef.CCCCV;
                pushLogMessage("Created customer: " + JSON.stringify(response.data));
                if (optionalCallback) {
                    optionalCallback(null, response.data);
                }
            }, function(response) {
                pushLogMessage("Couldn't create customer: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data))
                if (optionalCallback) {
                    optionalCallback(response);
                }
            });
        }, function(response) {
            pushLogMessage(response);
            if (optionalCallback) {
                optionalCallback(response);
            }
        })
    }

    $scope.createRandomVendor = function(optionalCallback) {
        $http.get('https://randomuser.me/api/').then(function(response) {
            var randUser = response.data.results[0];
            var userDef = {
                "Username": randUser.login.username,
                "Password": randUser.login.password,
                "Name": randUser.name.first + " " + randUser.name.last,
                "Address": randUser.location.street,
                "Phone": "1234567890",
                "Email": randUser.email,
                "RoutingNumber": randUser.login.sha1,
                "AccountNumber": randUser.login.sha256
            };

            $http.post("/api/user/vendor", JSON.stringify(userDef)).then(function(response) {
                response.data.password = randUser.login.password;
                response.data.routingNumber = userDef.RoutingNumber;
                response.data.accountNumber = userDef.AccountNumber;
                pushLogMessage("Created vendor: " + JSON.stringify(response.data));
                if (optionalCallback) {
                    optionalCallback(null, response.data);
                }
            }, function(response) {
                pushLogMessage("Couldn't create vendor: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data))
                if (optionalCallback) {
                    optionalCallback(response);
                }
            });
        }, function(response) {
            pushLogMessage(response);
            if (optionalCallback) {
                optionalCallback(response);
            }
        })
    }

    var showOverlay = function() {
        $('#headerOverlay').removeClass('collapsed');
    }
    var hideOverlay = function() {
        $('#headerOverlay').addClass('collapsed');
    }

    $scope.createBikeOwnerUserId = "";
    $scope.createRandomBike = function() {
        if ($scope.authenticatedUser && $scope.authenticatedUser.type == "vendor") {
            $scope.createBikeOwnerUserId = $scope.authenticatedUser.id;
        }
        showOverlay();
    }
    $scope.cancelCreateRandomBike = function() {
        hideOverlay();
    }
    $scope.submitCreateRandomBike = function() {
        hideOverlay();

        var createBikeFunc = function() {
            $http.get('https://randomuser.me/api/').then(function(response) {
                var randUser = response.data.results[0];
                var bikeTypes = ["mountain", "tandem", "road"];
                var bikeDef = {
                    "manufacturer": randUser.name.last,
                    "model": randUser.name.first,
                    "hourlyCost": (Math.random() * 10.0).toFixed(2),
                    "type": bikeTypes[Math.floor(Math.random() * 3)],
                    "ownerUserId": $scope.createBikeOwnerUserId,
                    "suitableHeightInMeters": Math.random() * 10.0,
                    "maximumWeightInKg": Math.random() * 10.0
                };

                $http.post("/api/bike", JSON.stringify(bikeDef)).then(function(response) {
                    pushLogMessage("Created bike: " + JSON.stringify(response.data));
                }, function(response) {
                    pushLogMessage("Couldn't create bike: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
                });
            }, function(response) {
                pushLogMessage(response);
            });
        }

        if (!$scope.createBikeOwnerUserId || $scope.createBikeOwnerUserId == "") {
            pushLogMessage("Choosing a vendor at random...");
            $scope.getAllUsers(function(err, users) {
                if (err) {
                    pushLogMessage("Unexpected error checking existing vendors for the new bike.");
                    return;
                }

                var createVendorFunc = function() {
                    pushLogMessage("Creating a new vendor...");
                    $scope.createRandomVendor(function(err, newVendor) {
                        if (err) {
                            pushLogMessage("Unexpected error creating new vendor for the new bike.");
                            return;
                        }

                        $scope.createBikeOwnerUserId = newVendor.id;
                        createBikeFunc();
                    });
                };

                if (users.length == 0) {
                    createVendorFunc();
                } else {
                    var vendor = users.find(function(u) {
                        return u.type == "vendor";
                    });
                    
                    if (vendor) {
                        $scope.createBikeOwnerUserId = vendor.id;
                        createBikeFunc();
                    } else {
                        createVendorFunc();
                    }
                }
            });
        } else {
            createBikeFunc();
        }
    }

    $scope.billingUserId = "";
    $scope.getVendorDetails = function() {
        if (!$scope.billingUserId || $scope.billingUserId == "") {
            pushLogMessage("Please specify UserId");
            return;
        }

        $http.get('/api/billing/vendor/' + $scope.billingUserId).then(function(response) {
            pushLogMessage("Vendor details: " + JSON.stringify(response.data));
            $scope.billingUserId = "";
        }, function(response) {
            pushLogMessage("Couldn't get vendor details: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
        });
    }
    $scope.getCustomerDetails = function() {
        if (!$scope.billingUserId || $scope.billingUserId == "") {
            pushLogMessage("Please specify UserId");
            return;
        }

        $http.get('/api/billing/customer/' + $scope.billingUserId).then(function(response) {
            pushLogMessage("Customer details: " + JSON.stringify(response.data));
            $scope.billingUserId = "";
        }, function(response) {
            pushLogMessage("Couldn't get customer details: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
        });
    }

    $scope.getReservation = function() {
        if (!$scope.reservationId) {
            pushLogMessage("Please specify a ReservationId");
            return;
        }

        $http.get('/api/reservation/' + $scope.reservationId).then(function (response) {
            pushLogMessage("Reservation details: " + JSON.stringify(response.data));
        }, function(response) {
            pushLogMessage("Couldn't get reservation: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
        });
    }

    $scope.getAllReservations = function() {
        $http.get('/api/reservation/allReservations').then(function (response) {
            pushLogMessage("All reservations: " + JSON.stringify(response.data));
        }, function (response) {
            pushLogMessage("Couldn't get all reservations: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
        });
    }

    $scope.getAllUsers = function(optionalCallback) {
        $http.get('/api/user/allUsers').then(function (response) {
            pushLogMessage("All users: " + JSON.stringify(response.data));
            if (optionalCallback) {
                optionalCallback(null, response.data);
            }
        }, function(response) {
            pushLogMessage("Couldn't get all users: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
            if (optionalCallback) {
                optionalCallback(response);
            }
        });
    }

    $scope.getAllReservationsForUser = function() {
        if ($scope.authenticatedUser) {
            getReservationsForUser(false, function(reservations) {
                pushLogMessage("All reservations for user: " + JSON.stringify(reservations));
            });
        }
        else {
            pushLogMessage("Please login to get all reservations for a user");
        }
    }

    var getReservationsForUser = function(onlyActive, callback) {
        $http.get('/api/user/' + $scope.authenticatedUser.id + "/reservations").then(function(response) {
            var reservations = [];
            if (response.data != "null") {
                response.data.forEach(function(res) {
                    if (onlyActive && res.state != "Booked") {
                        return;
                    }
                    reservations.push(res);
                });
            }
            
            callback(reservations);
        }, function(response) {
            pushLogMessage("Couldn't get user's reservations: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
            callback([]);
        })
    }

    var setCurrentUserCookie = function(userName, password) {
        $cookies.putObject("CurrentUser", {userName: userName, password: password});
    }

    var deleteCurrentUserCookie = function() {
        $cookies.remove("CurrentUser");
    }

    var getCurrentUserCookie = function() {
        return $cookies.getObject("CurrentUser");
    }

    $scope.userName = "";
    $scope.userPass = "";
    $scope.authenticatedUser = null;
    $scope.login = function(optionalCallback) {
        $http.post("/api/user/auth", { userName: $scope.userName, userPass: $scope.userPass }).then(function(response) {
            pushLogMessage("Login success: " + JSON.stringify(response.data));
            $scope.authenticatedUser = response.data;
            $scope.authenticatedUser.password = $scope.userPass;
            getReservationsForUser(true, function(reservations) {
                $scope.myReservations.length = 0;
                reservations.forEach(function(res) {
                    $scope.myReservations.push({ bikeId: res.bikeId, reservationId: res.reservationId });
                })
                $scope.layout();
            });
            setCurrentUserCookie($scope.userName, $scope.userPass);
            $scope.userName = "";
            $scope.userPass = "";
            if (optionalCallback) {
                optionalCallback(null, $scope.authenticatedUser);
            }
        }, function(response) {
            pushLogMessage("Login error: " + response.status + " " + response.statusText + ": " + JSON.stringify(response.data));
            if (optionalCallback) {
                optionalCallback(response);
            }
        });
    }
    $scope.logout = function() {
        $scope.authenticatedUser = null;
        $scope.myReservations.length = 0;
        deleteCurrentUserCookie();
        pushLogMessage("Logged out.");
        $scope.layout();
    }
    $scope.showPassword = function() {
        if (!$scope.authenticatedUser) {
            pushLogMessage("You must login for this action!");
            return;
        }

        pushLogMessage("Current user password: " + $scope.authenticatedUser.password);
    }

    $scope.isHeaderOpen = true;
    $scope.showHeader = function() {
        $scope.isHeaderOpen = true;
        $('#leftControlPane').removeClass('collapsed');
        $('#rightControlPane').removeClass('collapsed');
        $scope.layout();
    }
    $scope.hideHeader = function() {
        $scope.isHeaderOpen = false;
        $('#leftControlPane').addClass('collapsed');
        $('#rightControlPane').addClass('collapsed');
        $scope.layout();
    }
    
    var styles = [];
    var colors = ["green", "blue", "orange", "rebeccapurple", "gray", "saddlebrown", "hotpink", "mediumaquamarine"];
    var colorIndex = 0;
    
    $scope.getStyle = function(message) {
        if (!styles[message]) {
            styles[message] = {'color': colors[colorIndex]};
            colorIndex = colorIndex < colors.length - 1 ? colorIndex + 1 : 0;
        }
        return styles[message];
    }

    // Check cookies for current user
    var cuser = getCurrentUserCookie();
    if (cuser) {
        $scope.userName = cuser.userName;
        $scope.userPass = cuser.password;
        $scope.login(function(err, authUser) {
            if (err) {
                deleteCurrentUserCookie();
            }
        });
    }
});