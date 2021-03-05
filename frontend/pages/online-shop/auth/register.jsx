import {Component, Fragment} from "react";
import React from "react";
import {MDBBtn, MDBInput, MDBDatePicker } from "mdbreact";
import Layout from "../../admin/layout";
import Head from "next/head";
import {attemptRegister} from "../../../helpers";

export default class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date: null
    };

    this.registerPress = this.registerPress.bind(this);
  }

  monthToNr(short) {
    switch(short) {
      case "Jan":
        return "01";
      case "Feb":
        return "02";
      case "Mar":
        return "03";
      case "Apr":
        return "04";
      case "May":
        return "05";
      case "Jun":
        return "06";
      case "Jul":
        return "07";
      case "Aug":
        return "08";
      case "Sep":
        return "09";
      case "Oct":
        return "10";
      case "Nov":
        return "11";
      case "Dec":
        return "12";
    }
  }

  registerPress() {
    if(this.state.date == null)
      return;

    let name = document.getElementsByName("name")[0].value;
    let surname = document.getElementsByName("surname")[0].value;
    let email = document.getElementsByName("email")[0].value;
    let password = document.getElementsByName("password")[0].value;
    let address = document.getElementsByName("address")[0].value;
    let phone = document.getElementsByName("phone")[0].value;

    let day = this.state.date.toString().split(" ")[2];
    let date = this.monthToNr(this.state.date.toString().split(" ")[1]) + "-" + day;

    let registerData = new FormData();
    registerData.append("name", name);
    registerData.append("surname", surname);
    registerData.append("email", email);
    registerData.append("password", password);
    registerData.append("address", address);
    registerData.append("phone", phone);
    registerData.append("birth", date);
    registerData.append("favorites", ";");

    attemptRegister(registerData,
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
        <div className="registerScreen">
          <h3>Online-Shop Inregistrare</h3>
          <MDBInput label="Nume" name="surname" type="text"/>
          <MDBInput label="Prenume" name="name" type="text"/>
          <MDBInput label="Email" name="email" type="email"/>
          <MDBInput label="Parola" name="password" type="password"/>
          <MDBInput label="Adresa" name="address" type="text"/>
          <MDBInput label="Telefon" name="phone" type="number"/>
          <span>Data nasterii</span>
          <MDBDatePicker disableFuture onInputChange={e => console.log("e", e)} getValue={(date)=> {console.log(date); this.setState({date: date})}} />
          <MDBBtn color={this.state.date != null ? "green" : "grey"} onClick={  this.registerPress }>Creare cont</MDBBtn>
          <a href='/online-shop/login'>Ai deja un cont? Login aici</a>
        </div>
      </Fragment>
    );
  }
}