import React, {Component, Fragment} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {checkAuth, getTransactions, tokenExists} from '../../helpers';
import { Header, Sidebar } from '../../components/layouts/admin';
import Transactions from '../../components/layouts/admin/transactions'
import {MDBBtn, MDBContainer} from "mdbreact";

export default class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            isLoggedIn: false,
            user: {}
        };
    }

    componentDidMount()
    {
        this.setState({ user: JSON.parse(localStorage.appState).user });
    }

    render() {
            return (
                <div>
                    <Head>
                        <title>Online-shop Admin - { this.props.title }</title>
                        <link rel="stylesheet" type="text/css" href="/static/css/bootstrap.min.css"/>
                        <link rel="stylesheet" type="text/css" href="/static/css/mdb.css"/>
                        <link rel="stylesheet" type="text/css" href="/static/admin/css/stylesheet.css"/>
                        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700,900" rel="stylesheet"/>
                    </Head>

                    <Header user={ this.state.user } parent={ this }/>

                    <div className="sidebar-container">
                        <Sidebar type={ 1 }/>

                        <div className="page-content">
                            { this.props.children }
                        </div>
                    </div>

                    <Link href="/admin/login">
                        <a id="goToLogin"></a>
                    </Link>
                </div>
            );
    }
};
