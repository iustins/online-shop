import React from "react";
import {Component} from "react";
import {serverNameSrc} from "../../helpers";

export default class NewHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentCart: [],
      user: null,
    };
  }

  componentDidMount() {
    let currentCartString = localStorage.getItem('donoriumCart');
    let currentCart;
    if (currentCartString === '' || currentCartString === null || currentCartString === undefined || currentCartString === 'null')
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
  }

  getCartTotal() {
    let sum = 0;
    for (let i = 0; i < this.state.currentCart.length; i++)
      sum += (parseFloat(this.state.currentCart[i].price) * parseInt(this.state.currentCart[i].count));

    return (sum).toFixed(2);
    ;
  }

  removeFromCart(id) {
    let currentCartString = localStorage.getItem('donoriumCart');

    var currentCart;

    if (currentCartString == '' || currentCartString == null || typeof currentCartString == undefined)
      currentCart = [];
    else
      currentCart = JSON.parse(currentCartString);

    let newCart = [];

    for (let i = 0; i < currentCart.length; i++)
      if (currentCart[i].id != id)
        newCart.push(currentCart[i]);

    localStorage.setItem('donoriumCart', JSON.stringify(newCart));

    this.state.currentCart = newCart;
    this.forceUpdate();
  }

  static swapCart() {
    let cart = document.getElementById('cart-list');

    if (window.getComputedStyle(cart, null).display == 'none')
      cart.style.display = 'flex';
    else
      cart.style.display = 'none';

  }

  cartSize() {
    let sum = 0;
    for (let i = 0; i < this.state.currentCart.length; i++)
      sum += parseInt(this.state.currentCart[i].count);

    return sum;
  }

  logout() {
    localStorage.setItem('userData', null);
    localStorage.setItem('donoriumCart', null);
    location.reload();
  }

  render() {
    console.log("user log", this.state.user);
    let width = this.state.user !== null ? (this.state.user.isBirthday ? '35%' : '35%') : '35%';
    return (
      <div className="container-fluid my-header" style={this.props.style}>
        <span style={{paddingRight: '1000px'}} onClick={(e) => location.href = '/online-shop/shop'}>
                  Online-Shop
        </span>
        {this.state.user == null ? null :
            <div style={{width: '40% !important', display: 'flex', justifyContent: 'flex-end', paddingRight: '30px'}}>
              <i className="fa fa-shopping-cart" onClick={(e) => NewHeader.swapCart()}><span>({this.cartSize()})</span></i>
              <div style={{display: 'none'}} id="cart-list">
            <span key={1}><span>Total: <b>{this.getCartTotal()} RON</b></span>{this.state.currentCart.length > 0 ?
                <div className="checkout"
                     onClick={(e) => location.href = '/online-shop/checkout/form'}>Checkout</div> : null}</span>
                {
                  this.state.currentCart.map(
                      (item, index) =>
                          <div key={index + 2}>
                            <img src={serverNameSrc + 'images/products/' + item.image}/>
                            <span><b>{item.name}</b> ({item.count} x {item.price})</span>
                            <i className="fa fa-times" onClick={(e) => this.removeFromCart(item.id)}></i>
                          </div>
                  )
                }
              </div>
            </div>
        }
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: width}}>
          <i className="fa fa-user-circle"></i>
          {this.state.user == null ? <a style={{paddingLeft: '10px'}} href='/online-shop/login'>Login</a> :
            <span style={{paddingLeft: '10px'}}>Salut, <b>{this.state.user.name}</b>!
              <span style={{color: 'blue', paddingLeft: '5px', textDecoration: 'underline'}} onClick={(e) => this.logout()}>Logout</span>
              <br/>
              {this.state.user.isBirthday ?
              <a style={{color: 'red', fontWeight: 'bold'}}
                 title="Reducerea se aplica odata ajuns pe ecranul de checkout">Azi e ziua ta! Beneficiezi de {this.state.user.reduction * 100}%
                reducere la orice comanda</a> : null }</span>}
        </div>
      </div>
    );
  }
}
