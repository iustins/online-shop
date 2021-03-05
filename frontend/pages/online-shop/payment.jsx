import React, {Component, Fragment} from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import {beginTransaction, cardTransaction, cashTransaction, placeOrder, serverName, serverNameSrc} from "../../helpers";

export default class Payment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            transaction: null
        };
    }

    static async getInitialProps({query}) {
        const res = await fetch(serverName + 'api/transaction-data?id=' + query.txn);
        const data = await res.json();

        return {
            transaction: data.transaction,
        };
    }

    componentDidMount() {
        location.href = '/online-shop/checkout/success/'+ this.props.transaction.id;
    }

    render() {
        return null;
    }
};
