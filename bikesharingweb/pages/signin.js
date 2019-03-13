import React, { Component } from 'react'
import Page from "../components/Page"
import Content from "../components/Content"
import SigninFormLayout from '../components/SigninFormLayout'
import Logo from '../components/Logo'
import FormButton from '../components/FormButton'
import Router from 'next/router'
import Cookies from 'universal-cookie'
import helpers from './helpers';

export default class Signin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    async componentDidMount() {
        // Clears any login information the user may still have.
        helpers.logoutUser();

        // Retrieves all users that can be selected for sign-in.
        this.apiHost = await helpers.getApiHostAsync();
        const usersResponse = await fetch(`${this.apiHost}/api/user/allUsers`);
        let users = await usersResponse.json();
        console.log("Users retrieved", users);

        // Filtering out vendors, as we don't provide any vendors experience for now.
        users = users.filter(user => user.type != "vendor");

        this.setState({users: users});
    }

    async handleClick(context) {
        const userId = arguments[0];
        const userName = arguments[1];

        console.log(`User selected: ${userName} - ${userId}`);

        const cookies = new Cookies();
        cookies.set('user', {
            id: userId
        }, {
            path: "/"
        });

        // Navigate to index.
        Router.push("/");
    }

    render() {
        return (
            <Page>
                <Content>
                    <SigninFormLayout>
                        <Logo />
                        <br /><br />
                        {this.state.users.length > 0 &&
                            <form>
                                <div className={"userSelectionHeader"}>Select current user:</div>
                                {this.state.users.map((user, index) => (
                                    <FormButton key={index} primary onClick={this.handleClick.bind(this, user.id, user.name)}>{user.name} ({user.type})</FormButton>
                                ))}
                            </form>
                        }
                    </SigninFormLayout>
                </Content>
                <style jsx>{`
                    form {
                        width: 85%;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .userSelectionHeader {
                        margin-bottom: 10px;
                    }
                `}
                </style>
            </Page>
        );
    }
}
