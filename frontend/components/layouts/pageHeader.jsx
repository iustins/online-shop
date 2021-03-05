import React, { Component } from 'react';
import BreadCrumb from './breadcrumb';
import { MDBContainer } from 'mdbreact';

export default class PageHeader extends Component {
    render()
    {
        return (
            <MDBContainer fluid className="page-header text-center">
                <MDBContainer className="text-left" style={ { marginBottom: 15 } }>
                    <BreadCrumb data={ this.props.breadcrumbs }/>
                </MDBContainer>
                <h1 className="h1-responsive">{ this.props.title }</h1>
                <p>{ this.props.description }</p>
            </MDBContainer>
        );
    }
}
