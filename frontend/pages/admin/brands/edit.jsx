import React, {Component} from 'react';
import {
    MDBInput,
    MDBFileInput,
    MDBBtn,
    MDBSelect,
    MDBSelectInput,
    MDBSelectOptions,
    MDBSelectOption,
    MDBSpinner
} from 'mdbreact';
import Layout from '../layout';
import Link from 'next/link';
import {getBrandByID, serverNameSrc as serverName, updateBrand} from "../../../helpers";

export default class UpdateBrand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: {
                id: "",
                name: "",
                slug: "",
                logo: "",
                description: ""
            }
        };

        this.updateBrand = this.updateBrand.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    static async getInitialProps({query}) {
        return {query};
    }

    componentDidMount() {
        let token = JSON.parse(localStorage["appState"]).user.auth_token;
        let id = this.props.query.id;

        getBrandByID(token, id, response => {
            this.setState({brand: response.data.brand});
        });
    }

    updateBrand() {
        let name = document.getElementsByName("name")[0].value;
        let slug = document.getElementsByName("slug")[0].value;
        let logo = false;

        if (document.querySelector("input[type='file']").files.length > 0)
            logo = document.querySelector("input[type='file']").files[0];

        let description = document.getElementsByName("description")[0].value;

        let updatedBrand = new FormData();
        updatedBrand.append("id", this.state.brand.id);
        updatedBrand.append("name", name);
        updatedBrand.append("slug", slug);

        if (logo !== false)
            updatedBrand.append("logo", logo);

        updatedBrand.append("description", description);
        updatedBrand.append("token", JSON.parse(localStorage.appState).user.auth_token);

        updateBrand(updatedBrand, response => {
            if (response.status == 201)
                location.href = "/admin/brands/";
        });
    }

    handleInput(event) {
        switch (event.target.name) {
            case "name":
                this.state.brand.name = event.target.value;
                break;
            case "slug":
                this.state.brand.slug = event.target.value;
                break;
            case "description":
                this.state.brand.description = event.target.value;
                break;
            default:
                break;
        }
        this.forceUpdate();
    }

    render() {
        if (this.state.brand.id !== "")
            return (
                <Layout title="Edit Category">
                    <h1>Edit Category</h1>

                    <MDBInput label="Name" name="name" type="text" value={this.state.brand.name}
                              onChange={this.handleInput}/>

                    <MDBInput label="Slug" name="slug" type="text" value={this.state.brand.slug}
                              onChange={this.handleInput}/>

                    <MDBInput label="Description" name="description" type="textarea"
                              value={this.state.brand.description} onChange={this.handleInput}/>

                    <span className="current-images-title">Current category image</span>

                    <div className="current-images">
                        <img src={serverName + "images/categories/" + this.state.brand.logo}/>
                    </div>

                    <MDBFileInput btnTitle="Choose New Image" textFieldTitle="Upload new category image" name="logo"/>

                    <MDBBtn color="green" onClick={this.updateBrand}>Save changes</MDBBtn>
                </Layout>
            )
        else
            return (
                <Layout title="Edit Category">
                    <h1>Edit Category</h1>

                    <MDBSpinner/>

                    <Link href="/admin/login">
                        <a id="goToLogin" className="link-to"></a>
                    </Link>
                </Layout>
            );
    }
}
