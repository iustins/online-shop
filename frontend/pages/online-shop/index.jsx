import React, {Component, Fragment} from 'react';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import {getHomepageData, serverName, serverNameSrc, setFavorites} from "../../helpers";
import {MDBBtn, MDBCarousel, MDBCarouselCaption, MDBCarouselInner, MDBCarouselItem, MDBMask, MDBView} from "mdbreact";
import NewHeader from "../../components/layouts/newHeader";
import NewFooter from "../../components/layouts/newFooter";

let once = false;

setInterval(() => {
  if(typeof document === "undefined")
    return;
  console.log("changing");
  let carousel = document.querySelector(".carousel-inner");
  let inner = carousel.querySelectorAll(".carousel-item");

  for(let i = 0; i < inner.length; i++) {
    if(inner[i].className.includes("active")){
      inner[i].className = "carousel-item";

      if(i < inner.length - 1){
        inner[i+1].className = "carousel-item active";
      } else {
        inner[0].className = "carousel-item active";
      }
      return;
    }
  }

}, 3000);

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: "cheap",
      brands: [],
      sliderProducts: [],
      allProducts: [],
      favorites: ";",
      user_id: null,
      selectedCategory: "toate",
      favOnly: false,
      filterBrand: "all",
      search: "",
    };

    this.sortBy = this.sortBy.bind(this);
  }

  componentDidMount() {

    if (once)
      return;

    if(JSON.parse(localStorage.getItem('userData')) == null)
      location.href = '/online-shop/login';

    once = true;

    getHomepageData(JSON.parse(localStorage.getItem('userData')).auth_token, response => {

      console.log('homepage data', response);

      if (response.status == 200) {
        let brands = [];
        response.data.products.forEach(product => {
          if (!brands.some(item => item === product.brand))
            brands.push(product.brand);
        });

        this.setState({
          brands: brands,
          sliderProducts: response.data.sliderProducts,
          allProducts: response.data.products.sort((a, b) => {
            return (a.special_price != null ? a.special_price : a.price) - (b.special_price != null ? b.special_price : b.price);
          }),
          favorites: response.data.favorites,
          user_id: response.data.user_id,
        });
      }
    });
  }

  isFavorite(id, favorites) {
    return favorites.includes(";" + id + ";");
  }

  setFavorite(id, favorites) {
    if (favorites.includes(";" + id + ";")) {
      favorites = favorites.replace(";" + id + ";", ";");
    } else {
      favorites = favorites + id + ";";
    }
    console.log("favorites", favorites);
    this.setState({favorites});

    setTimeout(
      () => {
        let data = new FormData();
        data.append("token", JSON.parse(localStorage.getItem('userData')).auth_token);
        data.append("user_id", this.state.user_id);
        data.append("favorites", this.state.favorites);
        setFavorites(data, response => {
          console.log(response);
        })
      }, 200);
  }

  sortBy(e) {
    let newProducts = this.state.allProducts;

    switch (e.target.value) {
      case "cheap":
        newProducts.sort((a, b) => {
          return (a.special_price != null ? a.special_price : a.price) - (b.special_price != null ? b.special_price : b.price);
        });
        break;
      case "expensive":
        newProducts.sort((a, b) => {
          return (b.special_price != null ? b.special_price : b.price) - (a.special_price != null ? a.special_price : a.price);
        });
        break;
      case "full_price":
        newProducts.sort((a, b) => {
          return (a.special_price != null ? a.special_price : a.price) + a.delivery - (b.special_price != null ? b.special_price : b.price) - b.delivery;
        });
        break;
      case "promotion":
        newProducts.sort((a, b) => {
          return (a.special_price != null ? (a.price / a.special_price) : 1) - (b.special_price != null ? b.price / b.special_price : 1);
        });
        break;
    }
    this.setState({allProducts: newProducts, sort: e.target.value});
  }

  render() {
    console.log("all prods", this.state.allProducts);
    console.log("selected brand", this.state.filterBrand);
    return (
      <Fragment>
        <Head>
          <title>Online Shop - Acasa</title>
          <meta name="viewport" content="width=device-width"/>
          <meta name="title" content="Online Shop"/>
          <link rel="stylesheet" href="/static/css/mdb.css" type="text/css"/>
          <link rel="stylesheet" href="/static/css/online-shop-stylesheet.css" type="text/css"/>
          <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,600,700,800" rel="stylesheet"/>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                type="text/css"/>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
                type="text/css"/>
        </Head>

        <NewHeader style={{backgroundColor: "white !important"}}/>

        {console.log(this.state.sliderProducts, this.state.sliderProducts.length)}

        <div className="container-fluid product-slider">
          <MDBCarousel activeItem={1} length={this.state.sliderProducts.length} interval={3000}>
            <MDBCarouselInner>
              {
                this.state.sliderProducts.map(
                  (product, index) =>
                    <MDBCarouselItem itemId={index + 1} key={index}>
                      <MDBView>
                        <img className="d-block" src="/static/images/online-shop-home.jpg" alt="slide"/>
                        <MDBMask/>
                      </MDBView>

                      <MDBCarouselCaption className="home-slider-caption">
                        <a href={'/online-shop/shop/' + product.brand_slug + '/' + product.slug} className="container">
                          <div>
                            <h2 className="h1-responsive">{product.name}</h2>
                            {product.special_price != null ? (<h3>{product.price} RON</h3>) : null}
                            <h2>{product.special_price != null ? product.special_price : product.price} RON</h2>
                          </div>
                          <div>
                            <img
                              src={serverNameSrc + "images/products/" + product.images[0].image_path}/>
                          </div>
                        </a>
                      </MDBCarouselCaption>
                    </MDBCarouselItem>
                )
              }
            </MDBCarouselInner>
          </MDBCarousel>
        </div>

        <div className="container">
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <h1 style={{width: 'auto !important', padding: '0 !important', margin: '40px 0 40px 10px !important'}}>
              Lista de produse:
            </h1>
            <div onClick={() => {
              this.state.favOnly = !this.state.favOnly;
              this.forceUpdate()
            }} style={{
              fontSize: '24px !important',
              cursor: 'pointer',
              marginLeft: '30px',
              padding: '10px 20px',
              borderRadius: '7px',
              backgroundColor: 'lightGray',
              color: this.state.favOnly ? 'yellow' : 'white'
            }}>
              <i className="fa fa-star"/>
            </div>
          </div>

          <div className="container category-product-list">
            <div className="category-sselect">
              <h4>Categorii</h4>
              <span onClick={(e) => {
                this.setState({selectedCategory: "toate"})
              }} className={this.state.selectedCategory == "toate" ? "selected" : ""}><i
                className="fa fa-list"/>Toate</span>
              <span onClick={(e) => {
                this.setState({selectedCategory: "laptop-uri"})
              }} className={this.state.selectedCategory == "laptop-uri" ? "selected" : ""}><i className="fa fa-laptop"/>Laptop-uri</span>
              <span onClick={(e) => {
                this.setState({selectedCategory: "telefoane"})
              }} className={this.state.selectedCategory == "telefoane" ? "selected" : ""}><i className="fa fa-mobile"
                                                                                             style={{fontSize: '30px !important'}}/>Telefoane</span>
              <span onClick={(e) => {
                this.setState({selectedCategory: "gadgets"})
              }} className={this.state.selectedCategory == "gadgets" ? "selected" : ""}><i
                className="fa fa-microphone"/>Gadgets</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <div className="product-list-filters-sort">
                  <div>
                    <i className="fa fa-list"/>
                    <div>
                      <span>Brand</span>
                      <select value={this.state.filterBrand} onChange={e => { console.log("change", e.target.value); this.setState({filterBrand: e.target.value}); }}>
                        <option key={0} value="all">Toate</option>
                        {
                          this.state.brands.map((brand, index) =>
                            <option key={index + 1} value={brand}>{brand}</option>
                          )
                        }
                      </select>
                    </div>
                  </div>
                  <div>
                    <i className="fa fa-sort"/>
                    <div>
                      <span>Sortare dupa</span>
                      <select value={this.state.sort} onChange={this.sortBy}>
                        <option value="cheap">Ieftine</option>
                        <option value="expensive">Scumpe</option>
                        <option value="full_price">Pret + Livrare</option>
                        <option value="promotion">Promotie</option>
                      </select>
                    </div>
                  </div>
              </div>
              <div style={{paddingTop: 10, paddingBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <i className="fa fa-search" style={{fontSize: 25, paddingRight: 7}}/>
                <input style={{paddingTop: 3,paddingBottom: 3, paddingLeft: 5, fontSize: 16, width: 250, borderRadius: 3}} type="text" placeholder={"Cauta un produs..."} value={this.state.search} onChange={e => this.setState({search: e.target.value})}/>
              </div>
            </div>
            <div>
              <div style={{minHeight: '450px'}}>
                {
                  this.state.allProducts.map(
                    (product, index) =>
                      (product.brand_slug != this.state.selectedCategory) && (this.state.selectedCategory != "toate") ? null : (this.state.filterBrand !== "all" && this.state.filterBrand !== product.brand) ? null :
                        (!this.isFavorite(product.id, this.state.favorites) && this.state.favOnly) ? null :
                            (!product.name.includes(this.state.search) && !product.brand.includes(this.state.search)) ? null :
                          <a key={index + 1}>
                            {
                              product.special_price != null ? <div
                                className='reduction'>- {parseInt((1 - (product.special_price / product.price)) * 100)}%</div> : null
                            }
                            <div className='favorite'
                                 onClick={(e) => this.setFavorite(product.id, this.state.favorites)}>{this.isFavorite(product.id, this.state.favorites) ?
                              <i style={{color: 'yellow'}} className="fa fa-star"/> :
                              <i style={{color: 'grey'}} className="fa fa-star"/>}</div>
                            <img
                              onClick={(e) => location.href = ('/online-shop/shop/' + product.brand_slug + '/' + product.slug)}
                              src={serverNameSrc + "images/products/" + product.images[0].image_path}/>
                            <div className='price'
                                 onClick={(e) => location.href = ('/online-shop/shop/' + product.brand_slug + '/' + product.slug)}>
                              <h3>{product.name}</h3>
                              {product.special_price != null ?
                                <span className="cut-price">{product.price} RON</span> : null}
                              <span
                                className="normal-price">{product.special_price != null ? product.special_price : product.price} RON</span>
                              <span className="delivery-cost"> +{product.delivery} RON livrare </span>
                            </div>
                          </a>
                  )
                }
              </div>
            </div>
          </div>
        </div>

        <NewFooter/>

      </Fragment>
    );
  }
};
