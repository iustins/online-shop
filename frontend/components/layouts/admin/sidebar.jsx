import React, { Component, Fragment } from 'react';
import { MDBIcon, MDBSideNavCat, MDBSideNavNav, MDBSideNav, MDBSideNavLink, MDBContainer, MDBRow, MDBBtn } from 'mdbreact';
import Link from 'next/link';

export default class Sidebar extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            isOpen : false
        };
    }

    handleToggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        const { isOpen } = this.state;
        return this.props.type == 1 ? (
            <MDBContainer style={ { width: 280 } }>
                <MDBRow>
                    <MDBBtn onClick={this.handleToggle}><MDBIcon icon="bars" size="5x" /></MDBBtn>
                </MDBRow>
                <MDBSideNav
                    logo="/static/images/logo-header.png"
                    hidden
                    triggerOpening={isOpen}
                    breakWidth={1300}
                    className="deep-purple darken-4"
                >
                    <MDBSideNavNav>
                        <Link href="/admin/dashboard">
                            <a>
                                <li><i className="fa fa-cloud"></i> Dashboard</li>
                            </a>
                        </Link>

                        <MDBSideNavCat
                            name="Home Page"
                            id="homepage"
                            icon="home"
                        >

                            <Link href="/admin/homepage/slider">
                                <a>
                                    <li><i className="fa fa-cloud"></i> Slider</li>
                                </a>
                            </Link>

                        </MDBSideNavCat>

                        <Link href="/admin/brands">
                            <a>
                                <li><i className="fa fa-tasks"></i> Categories</li>
                            </a>
                        </Link>

                        <Link href="/admin/vehicles">
                            <a>
                                <li><i className="fa fa-wifi"></i> Products</li>
                            </a>
                        </Link>
                    </MDBSideNavNav>
                </MDBSideNav>
            </MDBContainer>
        ) :
            (
                <MDBContainer style={ { width: 280 } }>
                    <MDBRow>
                        <MDBBtn onClick={this.handleToggle}><MDBIcon icon="bars" size="5x" /></MDBBtn>
                    </MDBRow>
                    <MDBSideNav
                        logo="/static/images/logo-header.png"
                        hidden
                        triggerOpening={isOpen}
                        breakWidth={1300}
                        className="deep-purple darken-4"
                    >
                        <MDBSideNavNav>
                            <Link href="/admin/dashboard">
                                <a>
                                    <li><i className="fa fa-cloud"></i> Dashboard</li>
                                </a>
                            </Link>
                        </MDBSideNavNav>
                    </MDBSideNav>
                </MDBContainer>
            );

    }
}
