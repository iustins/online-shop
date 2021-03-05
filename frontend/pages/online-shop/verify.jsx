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
      livrare: null,
      facturare: null,
      cart: null
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

    this.setState({currentCart: currentCart, user: userData});

    this.state.facturare = JSON.parse(localStorage.getItem('facturare'));
    this.state.livrare = JSON.parse(localStorage.getItem('livrare'));
    this.state.cart = JSON.parse(localStorage.getItem('cart'));

    //localStorage.setItem('facturare','');
    //localStorage.setItem('livrare','');
    //localStorage.setItem('cart','');

    this.forceUpdate();
  }

  placeOrder() {
    let formData = new FormData();
    formData.append('facturare', JSON.stringify(this.state.facturare));
    formData.append('livrare', JSON.stringify(this.state.livrare));
    formData.append('cart', JSON.stringify(this.state.cart));

    cardTransaction(formData, response => {
      if (response.status == 200)
        location.href = '/online-shop/checkout/payment/' + response.data.txn;
    });
  }

  getCartTotal() {
    let sum = 0;
    for (let i = 0; i < this.state.cart.length; i++)
      sum += parseFloat(this.state.cart[i].price) * parseInt(this.state.cart[i].count);

    return (sum).toFixed(2);
  }


  render() {
    if (this.state.cart == null)
      return null;
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
          <h1 style={{textAlign: 'center'}}>Confirma datele</h1>
          <div className="container">
            <h2>Produsele tale</h2>
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
                      </div>
                    </div>
                )
              }
              <div>
                <div>
                  Total:
                </div>
                <div><b>{this.getCartTotal()} RON</b></div>
              </div>
              {this.state.user === null ? null : this.state.user.isBirthday ?
                <div style={{border: 'none', color: 'red'}}>
                  <div>Reducere aniversara:</div>
                  <div><b>{this.getCartTotal() * this.state.user.reduction} RON</b></div>
                </div> : null
              }
              {this.state.user === null ? null : this.state.user.isBirthday ?
                <div style={{padding: '0 !important', border: 'none', color: 'red', fontWeight: 'bold', fontSize: '25px !important'}}>
                  <div>
                    Total nou:
                  </div>
                  <div><b>{this.getCartTotal() * (1 - this.state.user.reduction)} RON</b></div>
                </div> : null
              }
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
                  <MDBInput disabled={true} type="email" name="l_email" label="Email" value={this.state.livrare.email}/>
                  <MDBInput className="long-number" disabled={true} type="number" name="l_phone" label="Telefon"
                            value={this.state.livrare.phone}/>
                  <MDBInput disabled={true} type="textarea" name="l_address" label="Adresa completa"
                            value={this.state.livrare.address}/>
                </div>
              </div>
            </Fragment>


            <MDBBtn color="danger" outline onClick={(e) => location.href = '/online-shop/checkout/form'}>Vreau sa schimb
              datele</MDBBtn>

            <MDBBtn outline onClick={(e) => this.placeOrder()}>Datele sunt ok, ontinua spre plata</MDBBtn>

          </div>
        </div>

        <NewFooter/>

      </Fragment>
    );
  }
};
