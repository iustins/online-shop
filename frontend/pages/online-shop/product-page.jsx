import React, {Component, Fragment} from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import {serverName, serverNameSrc} from "../../helpers";
import {
  MDBBtn,
  MDBCarousel,
  MDBCarouselCaption,
  MDBCarouselInner,
  MDBCarouselItem, MDBInput,
  MDBMask,
  MDBView
} from "mdbreact";
import NewHeader from "../../components/layouts/newHeader";
import NewFooter from "../../components/layouts/newFooter";
import {Line} from "react-chartjs-2";

export default class CategoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'm',
      gender: 'm',
      data: {
        labels: props.product.history.map(history => history.date),
        datasets: [
          {
            label: 'Evolutia pretului in ultimele 3 luni',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: props.product.history.map(history => history.price)
          }
        ]
      }
    };

    this.addToCart = this.addToCart.bind(this);
  }

  static async getInitialProps({query}) {
    const res = await fetch(serverName + 'api/product-data?slug=' + query.slug);
    const data = await res.json();

    return {
      product: data.product,
    };
  }

  addToCart() {
    let currentCartString = localStorage.getItem('donoriumCart');

    var currentCart;

    if (currentCartString == '' || currentCartString == null || typeof currentCartString == undefined || currentCartString === 'null')
      currentCart = [];
    else
      currentCart = JSON.parse(currentCartString);

    let cartItem = {
      id: currentCart.length == 0 ? 1 : (currentCart[currentCart.length - 1].id + 1),
      product_id: this.props.product.id,
      name: this.props.product.name,
      image: this.props.product.images[0].image_path,
      count: document.querySelector('input[type=number]').value,
      delivery: this.props.product.delivery,
      price: this.props.product.special_price != null ? this.props.product.special_price : this.props.product.price,
      size: this.props.product.is_clothing == 1 ? this.state.size : null,
      gender: this.props.product.is_clothing == 1 ? this.state.gender : null
    };

    if (cartItem.count <= 0)
      return;

    currentCart.push(cartItem);

    localStorage.setItem('donoriumCart', JSON.stringify(currentCart));

    //this.forceUpdate();
    setTimeout(() => {
      location.reload();
    }, 200);
  }

  render() {
    return (
      <Fragment>
        <Head>
          <title>Online Shop - {this.props.product.name}</title>
          <meta name="viewport" content="width=device-width"/>
          <meta name="title" content={"Online Shop - " + this.props.product.name}/>
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

        <NewHeader/>

        <div className="container-fluid product-details">
          <div className="container">
            <a style={{marginLeft: '5px', marginBottom: '10px', fontSize: '16px !important'}} className="back-btn" href={'/online-shop/shop/'}>
              <span><i className="fa fa-long-arrow-left"/>Inapoi</span>
            </a>
            <span className="breadcrumb">
                            <a href={'/online-shop/shop'}>Acasa</a>/
                            <a>{this.props.product.brand_name}</a>
                            / {this.props.product.name}
                        </span>
            <div className="product-presentation">
              <div>
                <MDBCarousel activeItem={1} length={this.props.product.images.length} interval={3000}>
                  <MDBCarouselInner>
                    {
                      this.props.product.images.map(
                        (image, index) =>
                          <MDBCarouselItem itemId={index + 1} key={index}>
                            <MDBView>
                              <img style={{opacity: '0 !important'}} className="d-block"
                                   src="/static/images/donorium-home.jpg"
                                   alt="slide"/>
                              <MDBMask/>
                            </MDBView>

                            <MDBCarouselCaption className="home-slider-caption">
                              <img
                                src={serverNameSrc + "images/products/" + image.image_path}/>
                            </MDBCarouselCaption>
                          </MDBCarouselItem>
                      )
                    }
                  </MDBCarouselInner>
                </MDBCarousel>
              </div>
              <div>
                <h1>{this.props.product.name}</h1>
                <h3>{this.props.product.brand}</h3>
                <pre>{this.props.product.description}</pre>
                <div className="cart-btn">
                  {
                    this.props.product.special_price != null ?
                      <span className='cut'>{this.props.product.price} RON</span>
                      : null
                  }
                  <span className="price">{this.props.product.special_price != null ? this.props.product.special_price : this.props.product.price} RON</span>
                  <MDBInput type="number" name="count" valueDefault={1}/>
                  <MDBBtn outline onClick={(e) => {
                    this.addToCart();
                  }}>Adauga in cos</MDBBtn>
                </div>
                <span className="delivery-cost">+{this.props.product.delivery} RON livrare</span>
              </div>
            </div>
            <div className="price-history">
              <div>
                <h2>Istoricul pretului</h2>
                <Line data={this.state.data} />
              </div>
            </div>
          </div>
        </div>

        <NewFooter/>

      </Fragment>
    );
  }
};
