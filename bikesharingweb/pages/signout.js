import React, { Component } from 'react'
import Router from 'next/router'
import helpers from './helpers.js'

export default class Signout extends Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        helpers.logoutUser();
        Router.push('/signin');
    }

    render() {
        return null;
    }
}