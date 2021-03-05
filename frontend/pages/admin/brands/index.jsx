import React, { Component, Fragment } from 'react';
import Link from 'next/link';
import {
    checkAuth,
    deleteBrand,
    getBrands,
    serverName,
    serverNameSrc,
    tokenExists,
    updateBrandVisibility
} from '../../../helpers';
import { MDBBtn, MDBDataTable, MDBFileInput, MDBSpinner, MDBCol, MDBInput } from "mdbreact";
import Layout from '../layout';

export default class brandIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectList: [],
            elementList: [],
            rerender: false,
            changeLogoID: null,
            brands: {
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                        sort: 'asc',
                        width: 80
                    },
                    {
                        label: 'Image',
                        field: 'image',
                        sort: 'disabled',
                        width: 80
                    },
                    {
                        label: 'Name',
                        field: 'name',
                        sort: 'asc',
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
            }
        };
    }

    deleteElement(id) {
        deleteBrand(this.state.token, id,
            response => {
                if (response != null && response.status == 201) {
                    let newArr = [];
                    for (let i = 0; i < this.state.elementList.length; i++)
                        if (this.state.elementList[i].id != id)
                            newArr.push(this.state.elementList[i]);

                    this.state.elementList = newArr;
                    location.reload();
                }
            });
    }

    changeVisibility = event => {
        let brand_id = event.target.dataset.index;
        this.state[`checkbox_${ event.target.dataset.index }`] = !this.state[`checkbox_${ event.target.dataset.index }`];

        this.state.brands.rows.forEach((brand, index) => {
            if (brand.id == brand_id)
                this.state.brands.rows[index].visible_home = (<MDBInput type="checkbox" id={ `checkbox_${ brand_id }` } label="Visible"
                                           checked={ this.state[`checkbox_${ event.target.dataset.index }`] } onChange={ this.changeVisibility } data-index={ brand_id } />);
        });

        this.forceUpdate();

        let data = new FormData();

        data.append('brand_id', brand_id);
        data.append('token', JSON.parse(localStorage["appState"]).user.auth_token);

        updateBrandVisibility(data, response => console.log(response.data));
    };

    componentDidMount() {
        let token = JSON.parse(localStorage["appState"]).user.auth_token;

        if (token)
            checkAuth(token, response => {
                if (response.status == 200) {
                    getBrands(token, brands => {
                        if (brands !== null) {
                            brands.map(brand => {
                                delete brand.description;

                                brand.actions = (
                                    <Fragment>
                                        <Link href={{ pathname: '/admin/brands/edit', query: { id: brand.id } }}>
                                            <a>
                                                <MDBBtn color="orange" outline size="sm">Edit</MDBBtn>
                                            </a>
                                        </Link>

                                        <MDBBtn className="delete" color="red" outline size="sm" onClick={ (e) => this.deleteElement(brand.id) }>Delete</MDBBtn>
                                    </Fragment>
                                );

                                this.state[`checkbox_${ brand.id }`] = Boolean(brand.visible_home);

                                brand.image = (<img src={serverNameSrc + 'images/categories/' + brand.logo} />);
                            });

                            let newBrands = this.state.brands;
                            newBrands.rows = brands.map(
                                brand => {
                                    return {
                                        id: brand.id,
                                        image: brand.image,
                                        name: brand.name,
                                        actions: brand.actions
                                    }
                                }
                            );

                            this.setState({
                                token: token,
                                isLoggedIn: true,
                                user: JSON.parse(localStorage["appState"]).user,
                                elementList: brands,
                                brands: newBrands
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
    }

    render() {
        if (this.state.brands.rows.length > 0)
            return (
                <Layout title="Categories">
                    <h1>Categories</h1>

                    <MDBCol>
                        <Link href="/admin/brands/create">
                            <a>
                                <button type="button" className="btn button-create btn-outline-primary">Create</button>
                            </a>
                        </Link>
                    </MDBCol>

                    <div className="main-table">
                        <MDBDataTable
                            id='brand_table'
                            striped
                            bordered
                            hover
                            data={ this.state.brands }
                        />
                    </div>

                    <Link href="/admin/login">
                        <a id="goToLogin" className="link-to"></a>
                    </Link>
                </Layout>
            );
        else
            return (
                <Layout title="Brands">
                    <h1>Categories</h1>

                    <MDBCol>
                        <Link href="/admin/brands/create">
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
