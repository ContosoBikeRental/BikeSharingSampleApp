import React, { Component } from 'react'
import Page from "../components/Page"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Content from "../components/Content"
import Link from 'next/link'
import SigninFormLayout from '../components/SigninFormLayout'
import Logo from '../components/Logo'
import FormTextbox from '../components/FormTextbox'
import FormButton from '../components/FormButton'
import Router from 'next/router'
import Cookies from 'universal-cookie'
import helpers from './helpers';

export default class Signin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
        const cookies = new Cookies();
        const user = cookies.get('user');
        if (user) {
            console.log('current userId: ' + user.id);
        } else {
            console.log('not logged in');
        }

        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    async componentDidMount() {
        this.apiHost = await helpers.getApiHostAsync();
    }

    handleUsername(event) { 
        this.setState({username: event.target.value});
    }

    handlePassword(event) { 
        this.setState({password: event.target.value });
    }
    
    async handleClick(context) {
        // Sign in
        console.log("signing in...");

        var url = this.apiHost + '/api/user/auth';
        
        const res = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
           }  
        )
        
        // get user id
        const user = await res.json();
        console.log(user);
        
        const cookies = new Cookies();
        cookies.set('user', user);
        // TODO: authorization confirmation
        
        // navigate to index
        Router.push("/index");
    }

    render() {
        return (
            <Page>
                <Content>
                    <SigninFormLayout>
                        <Logo />
                        <br /><br /><br />
                        <form>
                            <FormTextbox 
                                inputType="email" 
                                inputID="inputEmail" 
                                placeholder="Username" 
                                value={this.state.username} 
                                onChange={this.handleUsername}/>
                            <FormTextbox 
                                inputType="password" 
                                inputID="inputPassword" 
                                placeholder="Password" 
                                value={this.state.password} 
                                onChange={this.handlePassword}/>
                            
                            <br />
                            <FormButton primary onClick={this.handleClick.bind(this)}>Sign in</FormButton>
                            <div>
                                <Link href="/"><a>Sign up</a></Link>
                            </div>
                        </form>
                    </SigninFormLayout>
                </Content>
                <style jsx>{`
                form {
                    width: 85%;
                    margin-left: auto;
                    margin-right: auto;
                }
                `}</style>
            </Page>
        );
    }
}
