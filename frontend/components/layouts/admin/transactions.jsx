import React, {Component, Fragment} from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
    checkAuth,
    getTransactions
} from "../../../helpers";
import {MDBBtn, MDBCol, MDBDataTable, MDBInput, MDBSpinner} from "mdbreact";
import Layout from "../../../pages/admin/layout";

export default class Transactions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("tableData", this.props.transactions)
        if (this.props.transactions.rows.length > 0)
            return (
                <div>
                    <h1>Client Orders</h1>

                    <div className="main-table">
                        <MDBDataTable
                            id='brand_table'
                            striped
                            bordered
                            hover
                            data={ this.props.transactions }
                        />
                    </div>

                    <Link href="/admin/login">
                        <a id="goToLogin" className="link-to"></a>
                    </Link>
                </div>
            );
        else
            return (
                <div>
                    <h1>Orders</h1>

                    <MDBSpinner/>

                    <Link href="/admin/login">
                        <a id="goToLogin" className="link-to"></a>
                    </Link>
                </div>
            );
    }
}
