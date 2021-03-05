import React, { Component } from 'react';
import { MDBInput, MDBFileInput, MDBBtn } from 'mdbreact';
import Layout from '../layout';
import { createBrand } from "../../../helpers";

export default class CreateBrand extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chosenImage: null
        }

        this.createBrand = this.createBrand.bind(this);
    }

    createBrand() {
        let name = document.getElementsByName("name")[0].value;
        let slug = document.getElementsByName("slug")[0].value;
        let description = document.getElementsByName("description")[0].value;
        let image = document.querySelector("input[type=file]").files[0];

        let newBrand = new FormData();
        newBrand.append("name", name);
        newBrand.append("slug", slug);
        newBrand.append("description", description);
        newBrand.append("image", image);
        newBrand.append("token", JSON.parse(localStorage.appState).user.auth_token);

        createBrand(newBrand,
            response => {
                if (response.status == 201)
                    location.href = "/admin/brands/";
            }
        );
    }

    render() {
        return (
            <Layout title="Create Category">
                <h1>Create Category</h1>

                <MDBInput label="Name" name="name" type="text"/>
                <MDBInput label="Slug" name="slug" type="text"/>
                <MDBInput label="Description" name="description" type="textarea"/>

                <MDBFileInput btnTitle="Choose Image" name="logo"/>

                <MDBBtn color="green" onClick={  this.createBrand }>Create</MDBBtn>
            </Layout>
        );
    }
}
