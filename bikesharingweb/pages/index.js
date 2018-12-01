import React, { Component } from 'react'
import Page from "../components/Page"
import Header from "../components/Header"
import Content from "../components/Content"
import Link from 'next/link'
import BikeCard from "../components/BikeCard"
import fetch from 'isomorphic-fetch'
import Router from 'next/router'
import Cookies from 'universal-cookie'
import helpers from './helpers.js'

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            bikes: []
        };
    }

    async componentDidMount() {
        this.apiHost = await helpers.getApiHostAsync();
        var user = await helpers.verifyUserAsync(this.apiHost);
        if (!user) {
            Router.push('/signin');
            return;
        }

        // User exists
        this.setState({ userId: user.id });
        console.log(this.state.userId);

        // fetch user state, then navigate appropriately
        var url = this.apiHost + '/api/user/' + this.state.userId + '/reservations';

        const reservationsResponse = await fetch(url);
        const reservations = await reservationsResponse.json();
        if (reservations.findIndex(function(r) { return r.state == 'Booked' }) >= 0) {
            console.log('Navigating to reserved bike...');
            Router.push("/current-ride");
            return;
        }
        else {
            console.log("fetching list of bikes...");
            var url = this.apiHost + '/api/bike/availableBikes';
            const res = await fetch(url);
            const bikes = await res.json();
            this.setState({ bikes: bikes });
            console.log(bikes);
        }
    }

    render() {
        function isEven(index) {
            return (index % 2);
        }

        function isOdd(index) {
            return !isEven(index);
        }

        function listBikes(bikes, func) {
            return (
                bikes.map(function (bike, index) {
                    if (func(index)) {
                        return (
                            <Link href={`/preview/${bike.id}`} key={bike.id}>
                                <div>
                                    <BikeCard id={bike.id} name={bike.model} address={bike.address} rate={bike.hourlyCost} imageUrl={bike.imageUrl} />

                                </div>
                            </Link>
                        );
                    }
                })
            );
        }

        return (
            <Page>
                <Header />
                <Content>
                    <div className="row">
                        <div className="col-md-6">
                            {listBikes(this.state.bikes, isOdd)}
                        </div>
                        <div className="col-md-6">
                            {listBikes(this.state.bikes, isEven)}
                        </div>
                    </div>
                </Content>
            </Page>
        );
    }
}