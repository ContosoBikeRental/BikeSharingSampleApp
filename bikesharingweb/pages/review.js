import React, { Component } from 'react'
import Page from "../components/Page"
import Header from "../components/Header"
import Content from "../components/Content"
import Field from "../components/Field"
import FormNote from "../components/FormNote"
import FormButton from "../components/FormButton"
import Map from "../components/Map"
import Link from 'next/link'
import Footer from '../components/Footer'
import { withRouter } from 'next/router'
import MediaQuery from 'react-responsive'
import helpers from './helpers';
import Router from 'next/router'
import ReviewControl from "../components/ReviewControl"


export default class Review extends Component {


    // handle return bike
    async handleClick(context) {
        // return bike
        console.log("submitting review...");

        // navigate to review
        Router.push("/");
    }


    render() {
        return (
            <Page>
                <Header cmd="back" />
                <Content>
                    <div className="container-fluid details-container">
                        <div className="review-control">
                            <ReviewControl />
                        </div>
                        <div className="row">
                            <div className="col col-sm-3"><FormButton>Comfortable</FormButton></div>
                            <div className="col col-sm-3"><FormButton>Good breaks</FormButton></div>
                            <div className="col col-sm-3"><FormButton>Easy pick-up</FormButton></div>
                            <div className="col col-sm-3"><FormButton>Smooth ride</FormButton></div>
                        </div>
                        <textarea placeholder="Additional notes"></textarea>

                        <MediaQuery minWidth={600}>
                            <div className="divider">
                                <FormButton primary url="/index" onClick={this.handleClick.bind(this)}>Submit</FormButton>
                            </div>
                        </MediaQuery>
                    </div>
                </Content>
                <MediaQuery maxWidth={600}>
                    <Footer>
                        <FormButton primary url="/index" onClick={this.handleClick.bind(this)}>Submit</FormButton>
                    </Footer>
                </MediaQuery>
                <style jsx>{`
            .divider {
                padding-top: 30px;
            }
            textarea {
                width: 100%;
                height: 295px;
                border-color: #C4C4C4;
                margin-top: 10px;
                resize: none;
                padding: 5px;
            }
            .review-control {
                padding-top: 25px;
                padding-bottom: 8px;
            }
            .details-container {
                text-align: center;
            }
            @media only screen and (min-width: 1024px) {
                .details-container {
                    max-width: 800px;
                }   
            }
        `}</style>
            </Page>
        )
    }
}