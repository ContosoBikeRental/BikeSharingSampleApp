import { Component } from 'react'

export default class FormButton extends Component {

    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div>
                <button type="button" className={"btn " + (this.props.primary ? 'primary' : '')} onClick={() => this.props.onClick()}>{this.props.children}</button>
                <style jsx>{`
                    .btn {
                        background-color: #688379;
                        border-color: #688379;
                        width: 100%;
                        border-radius: 100px;
                        color: #fff;
                        margin-bottom: 10px;
                        font-size: 14px;
                        max-width: 250px;
                    }

                    .primary {
                        background-color: #E67938;
                        border-color: #E67938;
                    }
                `}</style>
            </div>
        )
    }
}