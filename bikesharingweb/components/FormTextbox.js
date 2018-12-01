// const FormTextbox = (props) => (
//     <div>
//         <div className="form-group">
//             {/* <label for="exampleInputEmail1">Email address</label> */}
//             <input type={props.inputType} className="form-control" id={props.inputID} placeholder={props.placeholder}></input>
//         </div>
//         <style jsx>{`
//         input {
//             font-size: 14px;
//         }
//         `}</style>
//     </div>
// )

// export default FormTextbox
import React, { Component } from 'react'
import Router from 'next/router'

export default class FormTextbox extends React.Component {

    constructor (props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // Router.push('/index');
    }

    render() {
        return (
            <div>
            <div className="form-group">
            {/* <label for="exampleInputEmail1">Email address</label> */}
            <input 
                className="form-control" 
                type={this.props.inputType} 
                id={this.props.inputID} 
                placeholder={this.props.placeholder}
                value={this.props.value}
                onChange={this.props.onChange}
                /*onChange={this.handleChange}*/>
            </input>
        </div>
        <style jsx>{`
        input {
            font-size: 14px;
        }
        `}</style>
    </div>
        )
    }
}