import React, {Component, Fragment} from 'react';
import Link from 'next/link';
import {
  checkAuth,
  deleteOffer, deleteVehicle,
  getOffersSlider as getOffers, getVehicles,
  serverNameSrc as serverName,
  swapPlacesInSlider,
  tokenExists,
  updateHomepageSlider
} from '../../../helpers';
import {MDBBtn, MDBDataTable, MDBFileInput, MDBSpinner, MDBCol, MDBInput, MDBIcon} from "mdbreact";
import Layout from '../layout';

export default class HomepageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectList: [],
      elementList: [],
      rerender: false,
      changeLogoID: null,
      offers: {
        columns: [
          {
            label: 'ID',
            field: 'id',
            sort: 'disabled',
            width: 80
          },
          {
            label: 'Visible',
            field: 'visible',
            sort: 'disabled',
            width: 80
          },
          {
            label: 'Image',
            field: 'default_image',
            sort: 'disabled',
            attributes: {
              'aria-label': 'editable'
            }
          },
          {
            label: 'Category',
            field: 'category',
            sort: 'disabled',
            attributes: {
              'aria-label': 'editable'
            }
          },
          {
            label: 'Name',
            field: 'name',
            sort: 'disabled',
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
      visible_offers: 0,
      visible_offers_stack: [],
      leftovers_offers: []
    };

    this.myTimeoutFunc = this.myTimeoutFunc.bind(this);
  }

  deleteElement(id) {
    deleteVehicle(this.state.token, id,
      response => {
        if (response.status == 201)
          location.reload();
      });
  }

  swapPlacesInSliderInDB(id1, id2) {
    let data = new FormData();
    data.append('id1', id1);
    data.append('id2', id2);
    data.append("token", JSON.parse(localStorage["appState"]).user.auth_token);
    swapPlacesInSlider(data, response => {
      console.log(response);
      location.reload();
    });
  }

  moveUp(id) {
    console.log(this.state.offers.rows);
    for (let i = 0; i < this.state.offers.rows.length; i++) {
      if (this.state.offers.rows[i].id == id) {
        let last = this.state.offers.rows[i - 1];
        this.state.offers.rows[i - 1] = this.state.offers.rows[i];
        this.state.offers.rows[i] = last;
        this.swapPlacesInSliderInDB(this.state.offers.rows[i].id, this.state.offers.rows[i - 1].id);
        break;
      }
    }
    console.log(this.state.offers.rows);
    this.forceUpdate();
  }

  moveDown(id) {
    console.log("before");
    console.log(this.state.offers.rows);
    for (let i = 0; i < this.state.offers.rows.length; i++) {
      if (this.state.offers.rows[i].id == id) {
        let next = this.state.offers.rows[i + 1];
        this.state.offers.rows[i + 1] = this.state.offers.rows[i];
        this.state.offers.rows[i] = next;
        this.swapPlacesInSliderInDB(this.state.offers.rows[i].id, this.state.offers.rows[i + 1].id);
        break;
      }
    }
    console.log("after");
    console.log(this.state.offers.rows);
    this.forceUpdate();
  }

  changeVisibleInSlider = event => {
    // update db

    let data = new FormData();
    let offer_id = event.target.dataset.index;
    data.append('offer_id', offer_id);
    data.append('token', JSON.parse(localStorage["appState"]).user.auth_token);

    updateHomepageSlider(data, response => {
      console.log(response.data);
      location.reload();
    });

    // update state
    let newOfferData = [];

    //console.log(this.state.offers, 'inainte');
    //
    // this.state.visible_offers_stack = JSON.parse(JSON.stringify(this.state.offerData));
    // this.state.leftovers_offers = JSON.parse(JSON.stringify(this.state.offerData));

    this.state.offerData.map((offer, index) => {
      if (offer.id == offer_id) {
        let in_slider_wannabe = !offer.in_slider;

        if (in_slider_wannabe) {
          if (this.state.visible_offers + 1 <= 7) {
            this.state.offerData[index].slide_order = this.state.visible_offers + 1;

            // this.state.visible_offers_stack.splice(this.state.visible_offers);
            //
            // this.state.leftovers_offers = this.state.leftovers_offers.splice(this.state.visible_offers);
            //
            // this.state.leftovers_offers.forEach((leftover_offer, index_lf) => {
            //     if (leftover_offer.id == offer_id)
            //         this.state.leftovers_offers.splice(this.state.leftovers_offers.indexOf(index_lf, 1));
            // });
            //
            // this.state.visible_offers_stack.push(this.state.offerData[index]);
            // newOfferData = this.state.visible_offers_stack;
            //
            // this.state.leftovers_offers.forEach(leftover_offer => newOfferData.push(leftover_offer));

            this.state.visible_offers++;

            // this.state.offerData = newOfferData;
          }
          else {
            console.log('Maximum 7 slides!');
          }
        }
        else {
          this.state.visible_offers--;
          this.state.offerData[index].slide_order = null;
        }

        this.state.offerData[index].in_slider = in_slider_wannabe;
      }
    });

    // -> for frontend checkbox switch
    this.state[`checkbox_${ event.target.dataset.index }`] = !this.state[`checkbox_${ event.target.dataset.index }`];

    this.state.offers.rows.forEach((offer, index) => {
      if (offer.id == offer_id)
        this.state.offers.rows[index].visible = (<MDBInput type="checkbox" id={`checkbox_${ offer_id }`} label="Visible"
                                                           checked={this.state[`checkbox_${ event.target.dataset.index }`]}
                                                           onChange={this.changeVisibleInSlider}
                                                           data-index={offer_id}/>);
    });

    if (this.state.offerData !== null) {
      let offers = this.state.offerData;
      let lastVisibleOffer = 0;
      let visible_offers = 0;

      offers.map((offer, index) => {
        if (offer.in_slider) {
          lastVisibleOffer = index;
          visible_offers++;
        }
      });

      this.state.visible_offers = visible_offers;

      offers.map((offer, index) => {
        offer.category = offer.brand_name;
        offer.default_image = <img className="offer-image"
                                   src={serverName + "images/products" + offer.images[0].image_path}/>;
        if (offer.in_slider) {
          offer.actions = (
            <Fragment>
              <MDBBtn disabled={index === 0 ? true : false} color="blue" outline size="sm" onClick={
                (e) => {
                  if (index === 0)
                    return;
                  else
                    this.moveUp(offer.id)
                }
              }><MDBIcon icon="chevron-up"/></MDBBtn>

              <MDBBtn disabled={index === lastVisibleOffer ? true : false} color="blue" outline size="sm"
                      onClick={(e) => {
                        if (index === lastVisibleOffer) return; else this.moveDown(offer.id)
                      }}><MDBIcon icon="chevron-down"/></MDBBtn>

              <Link href={{pathname: '/admin/offers/edit', query: {id: offer.id}}}>
                <a>
                  <MDBBtn color="green" outline size="sm">See Offer</MDBBtn>
                </a>
              </Link>
            </Fragment>
          );
        }
        else {
          offer.actions = (
            <Fragment>
              <Link href={{pathname: '/admin/offers/edit', query: {id: offer.id}}}>
                <a>
                  <MDBBtn color="green" outline size="sm">See Offer</MDBBtn>
                </a>
              </Link>
            </Fragment>
          );
        }

        offer.visible = (<MDBInput type="checkbox" id={`checkbox_${ offer.id }`} label="Visible"
                                   checked={offer.in_slider} onChange={this.changeVisibleInSlider}
                                   data-index={offer.id}/>);

        this.state[`checkbox_${ offer.id }`] = Boolean(offer.in_slider);
      });

      let newOffers = this.state.offers;
      newOffers.rows = offers.map(
        offer => {
          return {
            id: offer.id,
            visible: offer.visible,
            default_image: offer.default_image,
            category: offer.category,
            name: offer.name,
            actions: offer.actions
          }
        }
      );

      this.setState({
        elementList: offers,
        offers: newOffers
      });
    }

    this.forceUpdate();
  };

  myTimeoutFunc() {
    console.log("trying to add border bottom to:");
    let elem = document.querySelector(".last-offer-in-slider");
    console.log(elem);
    if (elem != null && elem !== undefined) {
      console.log(elem.closest("tr"));
      elem.closest("tr").style.borderBottom = '2px solid blue';
    } else
      setTimeout(this.myTimeoutFunc, 100);
  }

  componentDidMount() {
    let token = JSON.parse(localStorage["appState"]).user.auth_token;

    setTimeout(this.myTimeoutFunc, 100);

    if (token)
      checkAuth(token, response => {
        if (response.status == 200) {
          getOffers(token, offers => {
            this.state.offerData = offers;

            if (offers !== null) {
              let lastVisibleOffer = 0;
              let visible_offers = 0;

              offers.map((offer, index) => {
                if (offer.in_slider) {
                  lastVisibleOffer = index;
                  visible_offers++;
                }
              });

              this.state.visible_offers = visible_offers;

              offers.map((offer, index) => {
                offer.category = offer.brand_name;
                offer.default_image = <img className="offer-image"
                                           src={serverName + "images/products/" + offer.images[0].image_path}/>;

                if (offer.in_slider) {
                  offer.actions = (
                    <Fragment>
                      <MDBBtn disabled={index === 0 ? true : false} color="blue" outline size="sm"
                              className={index === lastVisibleOffer ? "last-offer-in-slider" : ""} onClick={(e) => {
                        if (index === 0) return; else this.moveUp(offer.id)
                      }}><MDBIcon icon="chevron-up"/></MDBBtn>

                      <MDBBtn disabled={index === lastVisibleOffer ? true : false} color="blue" outline size="sm"
                              onClick={(e) => {
                                if (index === lastVisibleOffer) return; else this.moveDown(offer.id)
                              }}><MDBIcon icon="chevron-down"/></MDBBtn>

                      <Link href={{pathname: '/admin/vehicles/edit', query: {id: offer.id}}}>
                        <a>
                          <MDBBtn color="green" outline size="sm">See Product</MDBBtn>
                        </a>
                      </Link>
                    </Fragment>
                  );
                }
                else {
                  offer.actions = (
                    <Fragment>
                      <Link href={{pathname: '/admin/vehicles/edit', query: {id: offer.id}}}>
                        <a>
                          <MDBBtn color="green" outline size="sm">See Product</MDBBtn>
                        </a>
                      </Link>
                    </Fragment>
                  );
                }

                offer.visible = (<MDBInput type="checkbox" id={`checkbox_${ offer.id }`} label="Visible"
                                           checked={offer.in_slider} onChange={this.changeVisibleInSlider}
                                           data-index={offer.id}/>);

                this.state[`checkbox_${ offer.id }`] = Boolean(offer.in_slider);
              });

              let newOffers = this.state.offers;
              newOffers.rows = offers.map(
                offer => {
                  return {
                    id: offer.id,
                    visible: offer.visible,
                    default_image: offer.default_image,
                    category: offer.category,
                    name: offer.name,
                    actions: offer.actions
                  }
                }
              );

              this.setState({
                token: token,
                isLoggedIn: true,
                user: JSON.parse(localStorage["appState"]).user,
                elementList: offers,
                offers: newOffers
              });
            } else {
              this.setState({
                token: token,
                isLoggedIn: true,
                user: JSON.parse(localStorage["appState"]).user
              });
            }
          });
        } else
          document.getElementById('goToLogin').click();
      });
    else {
      document.getElementById('goToLogin').click();
    }

    let inSlider = 0;

    for (let i = 0; i < this.state.elementList.length; i++) {
      if (this.state.elementList.in_slider == 1)
        inSlider++;
    }
  }

  renderTable = offers => {
    return (
      <MDBDataTable
        id='offer_table'
        striped
        bordered
        hover
        data={offers}
        entriesOptions={[offers.rows.length]}
        entries={offers.rows.length}
      />
    );
  };

  render() {
    //console.log(this.state.offers, 'dupa');
    if (this.state.offers.rows.length > 0)
      return (
        <Layout title="Slider Offers">
          <h1>Slider Offers</h1>

          <div className="main-table"> {this.renderTable(this.state.offers)} </div>

          <Link href="/admin/login">
            <a id="goToLogin" className="link-to"></a>
          </Link>
        </Layout>
      );
    else
      return (
        <Layout title="offers">
          <h1>Slider Offers</h1>

          <MDBCol>
            <Link href="/admin/offers/create">
              <a>
                <button type="button" className="btn button-create btn-outline-primary">Create</button>
              </a>
            </Link>
          </MDBCol>

          <MDBSpinner/>

          <Link href="/admin/login">
            <a id="goToLogin" className="link-to"></a>
          </Link>
        </Layout>
      );
  }
};
