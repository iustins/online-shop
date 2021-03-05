import React, {Component, Fragment} from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import {beginTransaction, cardTransaction, cashTransaction, placeOrder, serverName, serverNameSrc} from "../../helpers";
import {
  MDBBtn,
  MDBCarousel,
  MDBCarouselCaption,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBInput,
  MDBMask,
  MDBView
} from "mdbreact";
import NewHeader from "../../components/layouts/newHeader";
import NewFooter from "../../components/layouts/newFooter";

export default class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      payment: 0,
      cart: [],
      user: null,
    };
  }

  componentDidMount() {
    let currentCartString = localStorage.getItem('donoriumCart');
    let currentCart;

    if (currentCartString === '' || currentCartString == null || typeof currentCartString === undefined)
      currentCart = [];
    else
      currentCart = JSON.parse(currentCartString);

    let userDataString = localStorage.getItem('userData');
    let userData;

    if (userDataString === '' || userDataString == null || typeof userDataString === undefined)
      userData = null;
    else
      userData = JSON.parse(userDataString);

    this.setState({cart: currentCart, user: userData});
  }

  removeFromCart(id) {
    let currentCartString = localStorage.getItem('donoriumCart');

    var currentCart;

    if (currentCartString === '' || currentCartString == null || typeof currentCartString === undefined)
      currentCart = [];
    else
      currentCart = JSON.parse(currentCartString);

    let newCart = [];

    for (let i = 0; i < currentCart.length; i++)
      if (currentCart[i].id != id)
        newCart.push(currentCart[i]);

    localStorage.setItem('donoriumCart', JSON.stringify(newCart));

    this.state.cart = newCart;
    location.reload();
  }

  getCartTotal() {
    var sum = 0;
    var final;

    let maxDeliv = 0;
    for (let i = 0; i < this.state.cart.length; i++) {
      sum += parseFloat(this.state.cart[i].price) * parseInt(this.state.cart[i].count);
      maxDeliv = Math.max(maxDeliv, parseFloat(this.state.cart[i].delivery));
    }
    final = sum + maxDeliv;
    return {total: final, delivery: maxDeliv};
  }

  verifyTransaction() {
    let detaliiFacturare = {
      name: document.querySelector('input[name=name]').value,
      email: document.querySelector('input[name=email]').value,
      phone: document.querySelector('input[name=phone]').value,
      address: document.querySelector('textarea[name=address]').value
    };

    let detaliiLivrare = this.state.checked ? detaliiFacturare : {
      name: document.querySelector('input[name=l_name]').value,
      email: document.querySelector('input[name=l_email]').value,
      phone: document.querySelector('input[name=l_phone]').value,
      address: document.querySelector('textarea[name=l_address]').value
    };

    if (
      detaliiFacturare.name == '' || typeof detaliiFacturare.name == undefined ||
      detaliiFacturare.email == '' || typeof detaliiFacturare.email == undefined ||
      detaliiFacturare.phone == '' || typeof detaliiFacturare.phone == undefined ||
      detaliiFacturare.address == '' || typeof detaliiFacturare.address == undefined
    )
      return;

    if (
      !this.state.checked &&
      (
        detaliiLivrare.name == '' || typeof detaliiLivrare.name == undefined ||
        detaliiLivrare.email == '' || typeof detaliiLivrare.email == undefined ||
        detaliiLivrare.phone == '' || typeof detaliiLivrare.phone == undefined ||
        detaliiLivrare.address == '' || typeof detaliiLivrare.address == undefined
      )
    )
      return;

    localStorage.setItem('facturare', JSON.stringify(detaliiFacturare));
    localStorage.setItem('livrare', JSON.stringify(detaliiLivrare));
    localStorage.setItem('cart', JSON.stringify(this.state.cart));

    location.href = '/online-shop/checkout/verify';
  }

  render() {

    if(!this.state.cart)
      window.location.href = "/online-shop/login";

    return (
      <Fragment>
        <Head>
          <title>Online Shop - Checkout</title>
          <meta name="viewport" content="width=device-width"/>
          <meta name="title" content="Online Shop - Checkout"/>
          <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,600,700,800"
                rel="stylesheet"/>

          <link rel="stylesheet"
                href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                type="text/css"/>
          <link rel="stylesheet"
                href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
                type="text/css"/>
          <link rel="stylesheet" href="/static/css/mdb.css" type="text/css"/>
          <link rel="stylesheet" href="/static/css/online-shop-stylesheet.css" type="text/css"/>
        </Head>

        <NewHeader/>

        <div className="container-fluid checkout-page">
          <div className="container">
            <a className="back-btn" href={'/online-shop/shop/'}>
              <span><i className="fa fa-long-arrow-left"/>Inapoi</span>
            </a>
            <h1>Produsele tale</h1>
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
                        <span><b>{item.name}</b> ({item.count} x {item.price} RON)</span>
                      </div>
                      <div>
                        <span>{parseInt(item.count) * parseFloat(item.price)} RON</span>
                        <i className="fa fa-times"
                           onClick={(e) => this.removeFromCart(item.id)}></i>
                      </div>
                    </div>
                )
              }
              <div style={{borderBottom: 'none'}}>
                <div>
                  Cost de livrare:
                </div>
                <div>{this.getCartTotal().delivery} RON</div>
              </div>
              <div>
                <div>
                  Total:
                </div>
                <div><b>{this.getCartTotal().total} RON</b></div>
              </div>
              {this.state.user === null ? null : this.state.user.isBirthday ?
                <div style={{border: 'none', color: 'red'}}>
                  <div>Reducere aniversara:</div>
                  <div><b>{this.getCartTotal().total * this.state.user.reduction} RON</b></div>
                </div> : null
              }
              {this.state.user === null ? null : this.state.user.isBirthday ?
                <div style={{padding: '0 !important', border: 'none', color: 'red', fontWeight: 'bold',fontSize: '25px !important'}}>
                  <div>
                    Total nou:
                  </div>
                  <div><b>{this.getCartTotal().total * (1 - this.state.user.reduction)} RON</b></div>
                </div> : null
              }
            </div>
            <h1>Detalii facturare</h1>
            <div className='facturare'>
              <MDBInput type="text" name="name" label="Nume si prenume"/>
              <MDBInput type="email" name="email" label="Email"/>
              <MDBInput className="long-number" type="number" name="phone" label="Telefon"/>
              <MDBInput type="textarea" name="address" label="Adresa completa"/>
            </div>
            {this.state.checked ?
              <Fragment>
                <MDBInput type="checkbox" id="checkbox" label="Datele de facturare sunt aceleasi cu cele de livrare?"
                          checked onClick={(e) => {
                  this.setState({checked: false})
                }}/>
              </Fragment>
              : <Fragment>
                <MDBInput type="checkbox" id="checkbox" label="Datele de facturare sunt aceleasi cu cele de livrare?"
                          onClick={(e) => {
                            this.setState({checked: true})
                          }}/>
                < div id='livrare'>
                  <h1>Detalii livrare</h1>
                  <div className='livrare'>
                    <MDBInput type="text" name="l_name" label="Nume si prenume"/>
                    <MDBInput type="email" name="l_email" label="Email"/>
                    <MDBInput className="long-number" type="number" name="l_phone" label="Telefon"/>
                    <MDBInput type="textarea" name="l_address" label="Adresa completa"/>
                  </div>
                </div>
              </Fragment>
            }

            <MDBBtn outline onClick={(e) => this.verifyTransaction()}>Verifica comanda</MDBBtn>

          </div>
        </div>

        <NewFooter/>

      </Fragment>
    );
  }
};
