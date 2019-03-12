import Cookies from 'universal-cookie'

const helpers = {
    getApiHostAsync: async function() {
        const apiRequest = await fetch('/api/host');
        const data = await apiRequest.json();
        console.log('apiHost: ' + data.apiHost);
        return data.apiHost;
    },
    verifyUserAsync: async function(apiHost) {
        var cookies = new Cookies();
        var user = cookies.get('user');
        if (!user || !user.id) {
            return null;
        }
        
        if (!apiHost) {
            apiHost = await this.getApiHostAsync();
        }
        const url = apiHost + '/api/user/' + user.id;
        const userResponse = await fetch(url);
        if (userResponse.ok) {
            return await userResponse.json();
        }

        // User stored locally isn't valid anymore. Let's clear the local data.
        logoutUser();
        return null;
    },
    logoutUser: function() {
        var cookies = new Cookies();
        cookies.remove('user');
    },
    getVendorAsync: async function(ownerUserId, apiHost) {
        if (!apiHost) {
            apiHost = await this.getApiHostAsync();
        }
        const url = apiHost + '/api/user/' + ownerUserId;
        const res = await fetch(url);
        const vendor = await res.json();
        if (!res.ok) {
            console.log("vendor does not exist");
            vendor = null;
        }
        return vendor;
    },
    getBikeAsync: async function(bikeId, apiHost) {
        if (!apiHost) {
            apiHost = await this.getApiHostAsync();
        }
        const url = apiHost + '/api/bike/' + bikeId;
        const res = await fetch(url);
        const bike = await res.json();
        if (!res.ok) {
            console.log("bike does not exist");
            bike = null;
        }
        return bike;
    },
    getReservationForUserAsync: async function(userId, apiHost, state) {
        if (!apiHost) {
            apiHost = await this.getApiHostAsync();
        }
        const url = apiHost + '/api/user/' + userId + '/reservations';
        const res = await fetch(url);
        const reservations = await res.json();
        if (!res.ok) {
            console.log("user does not have any reservations");
            return;
        }
        const reservation = reservations.reverse().find(function(r) { return r.state == state }); 
        return reservation;
    },
    getInvoiceAsync: async function (invoiceId, apiHost) {
        if (!apiHost) {
            apiHost = await this.getApiHostAsync();
        }
        const url = apiHost + '/api/billing/invoice/' + invoiceId;
        const res = await fetch(url);
        const vendor = await res.json();
        if (!res.ok) {
            console.log("invoice does not exist");
            vendor = null;
        }
        return vendor;
    },
}

export default helpers;
