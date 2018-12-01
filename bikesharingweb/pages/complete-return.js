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


var bike = {
    id: "1", name: "Schwinn Women's Cruiser", address: "One Microsoft Way, Redmond, WA 98052",
    rate: "1.68", imageUrl: "/static/sample-bike-medium.png", owner: "Kelly", riderHeight: 7.35, maxWeight: 113.4
};

var reservation = {
    id: "001", bikeId: "1", totalCost: 10.08,
    returnInstructions: "Please place the bike on the porch and use the provided lock (code: 8432). Hope you enjoyed your ride!"
}

const CompleteReturn = withRouter((props) => (
    <Page>
        <Header cmd="back" />
        <Content>
            <div className="details-container">
                <Map />
                <Field label="Pick-up/return address" value={bike.address} />
                <Field label="Return instructions" value={reservation.returnInstructions} />
                <div className="row">
                    <div className="col">
                        <Field label="Price per hour" value={"$" + bike.rate} />
                        <FormNote text="Charging card ending with 1732" />
                    </div>
                    <div className="col">
                        <Field label="Total cost" value={"$" + reservation.totalCost} />
                    </div>
                </div>
                <MediaQuery minWidth={600}>
                    <div className="divider">
                        <FormButton primary url="/review">Complete return</FormButton>
                    </div>
                </MediaQuery>
            </div>
        </Content>
        <MediaQuery maxWidth={600}>
            <Footer>
                <FormButton primary url="/review">Complete return</FormButton>
            </Footer>
        </MediaQuery>
        <style jsx>{`
            .divider {
                padding-top: 10px;
            }
            img {
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
        `}</style>
    </Page>
))

export default CompleteReturn