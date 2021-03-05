import React, {Component, Fragment} from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import Layout from './layout';
import {
    beginTransaction,
    cardTransaction,
    cashTransaction,
    placeOrder,
    processTransaction,
    serverName,
    serverNameSrc
} from "../../helpers";
import {MDBBtn, MDBInput} from "mdbreact";
import Sidebar from "../../components/layouts/admin/sidebar";
import Header from "../../components/layouts/admin/header";

export default class TransactionView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            transaction: null,
            cart: null,
            livrare: null,
            facturare: null,
            user: {}
        };
    }

    static async getInitialProps({query}) {
        const res = await fetch(serverName + 'api/transaction-data?id=' + query.id);
        const data = await res.json();
        return {
            transaction: data.transaction,
        };
    }

    componentWillMount() {
        console.log("t", this.props.transaction);
        this.state.cart = JSON.parse(this.props.transaction.cart_data);
        this.state.livrare = JSON.parse(this.props.transaction.delivery_data);
        this.state.facturare = JSON.parse(this.props.transaction.fiscal_data);
    }

    componentDidMount() {
        this.setState({user: JSON.parse(localStorage.appState).user});
    }

    getCartTotal() {
        let sum = 0;
        let maxDeliv = 0;
        for (let i = 0; i < this.state.cart.length; i++) {
            sum += parseFloat(this.state.cart[i].price) * parseInt(this.state.cart[i].count);
            console.log("delivery",this.state.cart[i]);
            if(!isNaN(parseFloat(this.state.cart[i].delivery)))
                maxDeliv = Math.max(maxDeliv, parseFloat(this.state.cart[i].delivery));
        }

        return {total: (sum).toFixed(2), delivery: maxDeliv};
    }

    processOrder() {
        let token = JSON.parse(localStorage["appState"]).user.auth_token;
        processTransaction(
            token, this.props.transaction.id, response => {
                if (response.success == true)
                    location.href = '/admin/dashboard';
            }
        );
    }

    render() {
        return (
          <Layout title="View Order">
                <Head>
                    <title>Admin Panel - View Order</title>
                    <meta name="viewport" content="width=device-width"/>
                    <meta name="title" content="Admin Panel - Vizualizare Tranzactie"/>
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,600,700,800" rel="stylesheet"/>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" type="text/css"/>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css"/>
                    <link rel="stylesheet" href="/static/css/mdb.css" type="text/css"/>
                    <link rel="stylesheet" href="/static/css/online-shop-stylesheet.css" type="text/css"/>
                    <link rel="stylesheet" type="text/css" href="/static/css/bootstrap.min.css"/>
                    <link rel="stylesheet" type="text/css" href="/static/css/mdb.css"/>
                    <link rel="stylesheet" type="text/css" href="/static/admin/css/stylesheet.css"/>
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700,900" rel="stylesheet"/>
                </Head>


                <div className="sidebar-container">
                    <div className="page-content">
                        <div className="container-fluid checkout-page">
                            <h1>Comanda ID {this.props.transaction.id}</h1>
                            <div className="container-fluid">
                                <h2>Lista de produse</h2>
                                <div className='produse'>
                                    {
                                        this.state.cart.map(
                                            (item, index) =>
                                                <div key={index + 1}>
                                                    <div>
                                                        <div>
                                                            <img
                                                                src={serverNameSrc + 'images/products/' + item.image}/>
                                                        </div>
                                                        <span><b>{item.name + (item.gender == null ? '' : ((item.gender == 'm' ? ', Barbati' : ', Femei') + ', Marime ' + item.size.toUpperCase()))}</b> ({item.count} x {item.price} RON)</span>
                                                    </div>
                                                    <div>
                                                        <span>{parseInt(item.count) * parseFloat(item.price)} RON</span>
                                                    </div>
                                                </div>
                                        )
                                    }
                                    <div style={{fontWeight: 'normal', fontSize: 16}}>
                                        <div>
                                            Taxa de livrare:
                                        </div>
                                        <div><b>{this.getCartTotal().delivery} RON</b></div>
                                    </div>
                                    <div>
                                        <div>
                                            Total:
                                        </div>
                                        <div><b>{this.getCartTotal().total} RON</b></div>
                                    </div>
                                </div>
                                <h2>Detalii facturare</h2>
                                <div className='facturare'>
                                    <MDBInput disabled={true} type="text" name="name" label="Nume si prenume"
                                              value={this.state.facturare.name}/>
                                    <MDBInput disabled={true} type="email" name="email" label="Email"
                                              value={this.state.facturare.email}/>
                                    <MDBInput className="long-number" disabled={true} type="number" name="phone" label="Telefon"
                                              value={this.state.facturare.phone}/>
                                    <MDBInput disabled={true} type="textarea" name="address" label="Adresa completa"
                                              value={this.state.facturare.address}/>
                                </div>
                                <Fragment>
                                    < div id='livrare'>
                                        <h2>Detalii livrare</h2>
                                        <div className='livrare'>
                                            <MDBInput disabled={true} type="text" name="l_name" label="Nume si prenume"
                                                      value={this.state.livrare.name}/>
                                            <MDBInput disabled={true} type="email" name="l_email" label="Email"
                                                      value={this.state.livrare.email}/>
                                            <MDBInput className="long-number" disabled={true} type="number" name="l_phone"
                                                      label="Telefon" value={this.state.livrare.phone}/>
                                            <MDBInput disabled={true} type="textarea" name="l_address" label="Adresa completa"
                                                      value={this.state.livrare.address}/>
                                        </div>
                                    </div>
                                </Fragment>


                                {
                                    this.props.transaction.processed == 1 ?
                                        null :
                                        <MDBBtn outline onClick={(e) => this.processOrder()}>Marcheaza ca procesat</MDBBtn>
                                }

                            </div>
                        </div>
                    </div>
                </div>

            </Layout>
        );
    }
};
