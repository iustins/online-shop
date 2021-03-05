import React, {Component, Fragment} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {Bar, Pie} from "react-chartjs-2";
import {MDBBtn, MDBContainer} from "mdbreact";
import Layout from './layout';
import {checkAuth, getTransactions, serverName} from '../../helpers';
import fetch from 'isomorphic-unfetch';
import Transactions from "../../components/layouts/admin/transactions";

export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      elementList: [],
      transactions: {
        columns: [
          {
            label: 'ID',
            field: 'id',
            sort: 'asc',
            width: 80
          },
          {
            label: 'Date',
            field: 'created_at',
            sort: 'desc',
            width: 80
          },
          {
            label: 'Total Price',
            field: 'price',
            sort: 'asc',
            attributes: {
              'aria-label': 'editable'
            }
          },
          {
            label: 'Paid',
            field: 'paid',
            sort: 'asc',
            attributes: {
              'aria-label': 'editable'
            }
          },
          {
            label: 'Processed',
            field: 'processed',
            sort: 'asc',
            attributes: {
              'aria-label': 'editable'
            }
          },
          {
            label: 'Actions',
            field: 'actions',
            sort: 'disabled',
            width: 300,
            attributes: {
              'aria-label': 'actions'
            }
          }
        ],
        rows: []
      },
    };
  }

  static getCartTotal(cart) {
    let sum = 0;
    for (let i = 0; i < cart.length; i++)
      sum += parseFloat(cart[i].price) * parseInt(cart[i].count);

    return (sum).toFixed(2);
  }

  componentDidMount() {
    this.setState({user: JSON.parse(localStorage.appState).user});

    let token = JSON.parse(localStorage["appState"]).user.auth_token;

    if (token)
      checkAuth(token, response => {
        if (response.status == 200) {
          getTransactions(token, transactions => {
            console.log("auth response", response);

            let months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];

            if (transactions) {

              console.log("transactions", transactions);
              let mappedTransactions = [];
              mappedTransactions = transactions.map(transaction => {

                let copy = {...transaction};

                try {
                  copy.actions = (
                      <Fragment>
                        <Link href={{pathname: '/admin/transaction/view', query: {id: transaction.id}}}>
                          <a>
                            <MDBBtn color="orange" outline size="sm">View</MDBBtn>
                          </a>
                        </Link>
                      </Fragment>
                  );

                  let monthNumber = parseInt(transaction.created_at.split(" ")[0].split("-")[1]);

                  let createdString = transaction.created_at.split(" ")[1] + ", "
                      + transaction.created_at.split(" ")[0].split("-")[2] + " "
                      + months[monthNumber - 1] + " "
                      + transaction.created_at.split(" ")[0].split("-")[0];
                  copy.created_at = createdString;
                  copy.price = Dashboard.getCartTotal(JSON.parse(transaction.cart_data)) + " RON";
                  copy.paid = transaction.paid == 1 ? <i style={{color: 'green'}} className="fa fa-check"></i> :
                      <i style={{color: 'red'}} className="fa fa-times"></i>;
                  copy.processed = transaction.processed == 1 ?
                      <i style={{color: 'green'}} className="fa fa-check"></i> :
                      <i style={{color: 'red'}} className="fa fa-times"></i>;
                } catch (e) { console.log(e, "at item", transaction) }
                return copy;
              });
              console.log("mappedTransactions", mappedTransactions);
              let tableData = {};
              tableData.columns = [...this.state.transactions.columns];
              tableData.rows = mappedTransactions.map(
                transaction => {
                  return {
                    id: transaction.id,
                    created_at: transaction.created_at,
                    price: transaction.price,
                    paid: transaction.paid,
                    processed: transaction.processed,
                    actions: transaction.actions
                  }
                }
              );
              console.log("tableData", tableData);
              this.setState({
                token: token,
                isLoggedIn: true,
                user: JSON.parse(localStorage["appState"]).user,
                elementList: transactions,
                transactions: tableData
              });
            } else {
              this.setState({
                token: token,
                isLoggedIn: true,
                user: JSON.parse(localStorage["appState"]).user,
                elementList: this.state.elementList,
                transactions: this.state.transactions
              });
            }
          });
        } else
          document.getElementById('goToLogin').click();
      });
    else {
      document.getElementById('goToLogin').click();
    }
  }

  render() {
    return (
      <Layout title="Dashboard">
        <Transactions transactions={this.state.transactions}/>
      </Layout>
    );
  }
};
