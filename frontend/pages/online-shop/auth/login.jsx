import {Component, Fragment} from "react";
import React from "react";
import {MDBBtn, MDBFileInput, MDBInput} from "mdbreact";
import Layout from "../../admin/layout";
import Head from "next/head";
import {attemptLogin} from "../../../helpers";

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.loginPress = this.loginPress.bind(this);
  }

  loginPress() {
    let email = document.getElementsByName("email")[0].value;
    let password = document.getElementsByName("password")[0].value;

    let loginData = new FormData();
    loginData.append("email", email);
    loginData.append("password", password);

    attemptLogin(loginData,
      response => {
        if (response.success) {
          localStorage.setItem('userData', JSON.stringify(response.data));
          setTimeout(() => {
            location.href = "/online-shop/shop/";
          }, 200);
        }
      }
    );
  };

  render() {
    return (
      <Fragment>
        <Head>
          <title>Online Shop - Inregistrare</title>
          <meta name="viewport" content="width=device-width"/>
          <meta name="title" content={"Online Shop - Inregistrare"}/>
          <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,600,700,800"
                rel="stylesheet"/>

          <link rel="stylesheet"
                href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                type="text/css"/>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
                type="text/css"/>
          <link rel="stylesheet" href="/static/css/mdb.css" type="text/css"/>
          <link rel="stylesheet" href="/static/css/online-shop-stylesheet.css" type="text/css"/>
        </Head>
        <div className="loginScreen">
          <h3>Online-Shop Login</h3>
          <MDBInput label="Email" name="email" type="email"/>
          <MDBInput label="Parola" name="password" type="password"/>
          <MDBBtn color="green" onClick={  this.loginPress }>Login</MDBBtn>
          <a href='/online-shop/register'>Nu ai un cont? Creeaza unul pe gratis</a>
          <a href='/online-shop/shop'>Inapoi la Online-shop</a>
        </div>
      </Fragment>
    );
  }
}
