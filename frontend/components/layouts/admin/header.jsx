import React, { Component } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default class Header extends Component {
    render() {
        return (
            <div className="header" style={ { zIndex: 0 } }>
                <Head>
                    <link rel="stylesheet" type="text/css" href="/static/login_assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css"/>
                </Head>

                <div className="account" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <i className="fa fa-user-circle"></i>
                    <p style={{margin: '0 !important'}}>{ this.props.user.name + ' ' + this.props.user.surname }</p>
                    <i className="dropdown-account-actions fa fa-angle-down"></i>
                </div>
            </div>
        );
    }
}
