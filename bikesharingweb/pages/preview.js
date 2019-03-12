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
import fetch from 'isomorphic-fetch'
import Router from 'next/router'
import Cookies from 'universal-cookie'
import helpers from './helpers.js'

class PreviewBase extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: undefined,
            userName: undefined,
            bike: {},
            vendor: {}
        };
    }

    async componentDidMount() {
        this.apiHost = await helpers.getApiHostAsync();
        var user = await helpers.verifyUserAsync(this.apiHost);
        if (!user) {
            Router.push('/signin');
            return;
        }

        // get bike
        const bikeData = await helpers.getBikeAsync(this.props.bikeId, this.apiHost);

        // set vendor 
        const vendorData = await helpers.getVendorAsync(bikeData.ownerUserId, this.apiHost);

        // set state
        this.setState({
            userId: user.id,
            userName: user.name,
            bike: bikeData,
            vendor: vendorData
        })
    }
    
    static async getInitialProps(context) {
        return {
            bikeId: context.query.id
        }
    }

    async handleClick(context) {
        // reserve bike
        console.log("reserving bike...");
        var url = this.apiHost + '/api/reservation';
        const res = await fetch(url,      
        {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                userId: this.state.userId,
                bikeId: this.state.bike.id })
        });

        // confirm reservation
        const data = await res.json();
        console.log(data);

        // navigate to current-ride
        Router.push("/current-ride");
    }

    render() {
        return (
            <Page>
                <Header userName={this.state.userName} />
                <Content>

                    <div className="row">
                        <div className="col-sm-6">
                            <img src={this.state.bike.imageUrl} alt="photo of bike" />
                        </div>
                        <div className="col-sm-6">
                            <div className="details-container">
                                <div className="title">{this.state.bike.model}</div>
                                {/* <div className="owner">Owned by {this.state.bike.ownerUserId}</div> */}
                                <div className="owner">Owned by {this.state.vendor.name}</div>
                                <Field label="Price per hour" value={"$" + this.state.bike.hourlyCost} />
                                <FormNote text="Charging card ending with 1732" />
                                <Field label="Suggested rider height (meters)" value={this.state.bike.suitableHeightInMeters} />
                                <Field label="Max weight (kg)" value={this.state.bike.maximumWeightInKg} />
                                <Field label="Pick-up/return address" value={this.state.bike.address} />

                                <MediaQuery minWidth={600}>
                                    <div className="divider">
                                        <FormButton primary url="/current-ride" onClick={this.handleClick.bind(this)}>Rent bike</FormButton>
                                        <FormNote text="*You won't be charged until you return the bike" />
                                    </div>
                                </MediaQuery>
                            </div>
                        </div>
                        <div className="col">
                            <Map />
                        </div>
                    </div>
                </Content>
                <MediaQuery maxWidth={600}>
                    <Footer>
                        <FormButton primary url="/current-ride" onClick={this.handleClick.bind(this)}>Rent bike</FormButton>
                        <FormNote text="*You won't be charged until you return the bike" />
                    </Footer>
                </MediaQuery>
                <style jsx>{`
            .footer-content {
                width: 80%;
                margin-left: auto;
                margin-right: auto;
            }
        `}</style>
                <style jsx>{`
            .divider {
                padding-top: 10px;
            }
            img {
                padding-top: 11px;
                width: 100%;
                max-width: 400px;
            }
            .details-container {
                padding-top: 11px;
                letter-spacing: 0.5px;
            }
            .title {
                font-size: 18px;
                padding-top: 10px;
                letter-spacing: 1px;
                font-weight: 600;
            }
            .owner {
                font-size: 13px;
            }
            @media only screen and (min-width: 600px) {
                .title {
                    font-size: 18px;
                    padding-top: 0px;
                    letter-spacing: 1px;
                    font-weight: 600;
                }   
            }

        `}</style>
            </Page>
        )
    }
}

const Preview = withRouter(PreviewBase);

export default Preview