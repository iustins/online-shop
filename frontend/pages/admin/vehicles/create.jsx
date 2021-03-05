import React, {Component} from 'react';
import {MDBInput, MDBFileInput, MDBBtn, MDBSelect, MDBSelectInput, MDBSelectOptions, MDBSelectOption} from 'mdbreact';
import Layout from '../layout';
import {crea
    teVehicle, getBrands, serverName} from "../../../helpers";
import {Divider} from "react-md";

export default class CreateVehicle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            brand: "",
            brands: [],
            selectedImages: [],
            currentImageCount: 0,
            is_checked: false,
        };

        this.createVehicle = this.createVehicle.bind(this);
        this.handleImageSelect = this.handleImageSelect.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        let token = JSON.parse(localStorage["appState"]).user.auth_token;

        getBrands(token, brands => {
            this.setState({brands: brands});
        });
    }

    createVehicle() {
        let brand_id = document.getElementsByName("brand")[0].getElementsByTagName("input")[0].value.split("(")[1].replace(")", "").replace(/ /g, "");
        let name = document.getElementsByName("name")[0].value;
        let brand = this.state.brand;
        let description = document.getElementsByName("description")[0].value;
        let delivery = document.getElementsByName("delivery")[0].value;
        let price = document.getElementsByName("price")[0].value;
        let special_price = document.getElementsByName("special_price")[0].value;
        let images = document.querySelector("input[type=file]").files;

        //console.log(images);

        let newVehicle = new FormData();
        newVehicle.append("brand_id", brand_id);
        newVehicle.append("name", name);
        newVehicle.append("brand", brand);
        newVehicle.append("description", description);
        newVehicle.append("is_clothing", this.state.is_checked ? '1' : '0');
        newVehicle.append("price", price);
        newVehicle.append("delivery", delivery);

        if(special_price != null && special_price != "")
            newVehicle.append("special_price", special_price);

        let i = 0;
        for (let key in images) {
            if (images.hasOwnProperty(key)) {
                if ( document.getElementById("current-images-new").getElementsByClassName(images[key].name).length != 0) {
                    newVehicle.append("image_" + i, images[key]);
                    i++;
                }
            }
        }
        newVehicle.append("image_count", i + "");
        newVehicle.append("token", JSON.parse(localStorage.appState).user.auth_token);

        createVehicle(newVehicle,
            response => {
                if (response.status == 201)
                    location.href = "/admin/vehicles/";
            }
        );
    }

    handleImageSelect(value) {
        this.setState({selectedImages: value});
    }

    renderBrands() {

        let result = [];

        for (let i = 0; i < this.state.brands.length; i++)
            result.push(
                <MDBSelectOption key={i}
                                 value={this.state.brands[i].id}>{this.state.brands[i].name + " (" + this.state.brands[i].id + ")"}</MDBSelectOption>
            );

        //console.log('selects ok');

        return result;
    }

    readAndPreview(file) {

        // Make sure `file.name` matches our extensions criteria
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            let reader = new FileReader();
            let preview = document.getElementById("current-images-new");
            reader.addEventListener("load", function () {
                let div = document.createElement("div");
                div.id = preview.childNodes.length + "";
                let image = new Image();
                image.className = file.name;
                image.src = this.result;

                let span = document.createElement("span");
                span.className = "fa fa-times close";
                span.onclick = () => {
                    preview.removeChild(document.getElementById(div.id));
                };
                div.appendChild(image);
                div.appendChild(span);
                preview.appendChild(div);
            }, false);

            reader.readAsDataURL(file);
        }

    }

    renderSelectedImages() {
        if (typeof document != "undefined") {
            let preview = document.getElementById("current-images-new");
            if (preview != null)
                while (preview.firstChild) {
                    preview.removeChild(preview.firstChild);
                }
        }

        let images = [];

        for (let key in this.state.selectedImages)
            if (this.state.selectedImages.hasOwnProperty(key))
                images.push(this.state.selectedImages[key]);

        if (images) {
            [].forEach.call(images, this.readAndPreview);
        }

        return null;
    }

  handleInput(event) {
    switch (event.target.name) {
      case "brand":
        this.state.brand = event.target.value;
        break;
    }
    this.forceUpdate();
  }

    render() {
        return (
            <Layout title="Products Create">
                <h1>Create Product</h1>

                <div style={ { position: 'relative' } }>
                    <MDBSelect name="brand">
                        <MDBSelectInput selected="Category select"/>
                        <MDBSelectOptions>
                            <MDBSelectOption disabled>Catgory Select</MDBSelectOption>
                            {this.renderBrands()}
                        </MDBSelectOptions>
                    </MDBSelect>
                    <label>Category</label>
                </div>

                <MDBInput label="Name" name="name" type="text"/>

                <MDBInput label="Brand" name="brand" type="text" value={this.state.brand} onChange={this.handleInput}/>

                <MDBInput type="textarea" label="Description" name="description"/>

                <MDBInput label="Price" name="price" type="number"/>

                <MDBInput label="Delivery price" name="delivery" type="number"/>

                <MDBInput label="Special price" name="special_price" type="number"/>

                <MDBFileInput multiple btnTitle="Choose Images" textFieldTitle="Upload product images" name="images"
                              getValue={this.handleImageSelect}/>

                <span className="current-images-title">Currently selected images</span>
                <div className="current-images-new" id="current-images-new">
                    {this.renderSelectedImages()}
                </div>
                <MDBBtn color="green" onClick={this.createVehicle}>Create</MDBBtn>
            </Layout>
        );
    }
}
