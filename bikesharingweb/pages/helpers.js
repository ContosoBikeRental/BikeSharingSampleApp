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
        if (user && user.id) {
            if (!apiHost) {
                apiHost = await this.getApiHostAsync();
            }
            const url = apiHost + '/api/user/' + user.id;
            const res = await fetch(url);
            if (!res.ok) {
                cookies.remove('user');
                user = null;
            }
        }

        return user;
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
    getReservationForUserAsync: async function(userId, apiHost) {
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
        const reservation = reservations.find(function(r) { return r.state == 'Booked' }); 
        return reservation;
    }
}

export default helpers;
