import React, {Component} from 'react';
import {
  MDBInput,
  MDBFileInput,
  MDBBtn,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
  MDBSpinner,
  MDBChip
} from 'mdbreact';
import Layout from '../layout';
import {getBrands, getVehicleByID, serverNameSrc as serverName, updateVehicle} from "../../../helpers";
import Link from "next/link";

export default class UpdateVehicle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vehicle: {
        brand_id: "",
        brand_name: "", //category
        id: "",
        name: "",
        brand: "", //brand
        description: "",
        price: "",
        delivery: "",
        special_price: "",
        images: [],
      },
      brands: [],
      deleted_images: [],
      is_checked: false,
    };

    this.updateVehicle = this.updateVehicle.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleImageSelect = this.handleImageSelect.bind(this);
  }

  static async getInitialProps({query}) {
    return {query};
  }

  componentDidMount() {
    let token = JSON.parse(localStorage["appState"]).user.auth_token;
    let id = this.props.query.id;

    if (this.state.vehicle.id == "") {
      getVehicleByID(token, id, response => {
        this.setState({vehicle: response.data.product, is_checked: response.data.product.is_clothing == 1});
        getBrands(token, brands => {
          this.setState({brands: brands});

          let current_chips = document.querySelectorAll('.current-images .chip');

          if (current_chips.length > 0) {
            current_chips.forEach(chip => {
              chip.querySelector('i').addEventListener('click', () => {
                let id = chip.querySelector('img').dataset.index;
                let deleted_images = this.state.deleted_images;
                deleted_images.push(id);

                this.setState({deleted_images});
                //console.log(this.state.deleted_images);
                chip.remove();
              });
            });
          }
        });
      });
    }


  }

  updateVehicle() {
    let brand_id = document.getElementsByName("brand")[0].getElementsByTagName("input")[0].value.split("(")[1].replace(")", "").replace(/ /g, "");
    let name = document.getElementsByName("name")[0].value;
    let brand = this.state.vehicle.brand;
    let description = document.getElementsByName("description")[0].value;
    let price = document.getElementsByName("price")[0].value;
    let delivery = document.getElementsByName("delivery")[0].value;
    let special_price = document.getElementsByName("special_price")[0].value;
    let images = document.querySelector("input[type=file]").files;

    let newVehicle = new FormData();
    newVehicle.append("brand_id", brand_id);
    newVehicle.append("id", this.state.vehicle.id);
    newVehicle.append("name", name);
    newVehicle.append("brand", brand);
    newVehicle.append("description", description);
    newVehicle.append("is_clothing", this.state.is_checked ? '1' : '0');
    newVehicle.append("price", price);
    newVehicle.append("delivery", delivery);

    if (special_price != null && special_price != "")
      newVehicle.append("special_price", special_price);

    if (this.state.deleted_images.length > 0)
      newVehicle.append("deleted_images", JSON.stringify(this.state.deleted_images));

    let i = 0;
    for (let key in images) {
      if (images.hasOwnProperty(key)) {
        if (document.getElementById("current-images-new").getElementsByClassName(images[key].name).length != 0) {
          newVehicle.append("image_" + i, images[key]);
          i++;
        }
      }
    }

    newVehicle.append("image_count", i + "");
    newVehicle.append("token", JSON.parse(localStorage.appState).user.auth_token);

    updateVehicle(newVehicle,
      response => {
        if (response.status == 201)
          location.href = "/admin/vehicles/";
      }
    );
  }

  renderBrands() {

    let result = [];

    for (let i = 0; i < this.state.brands.length; i++)
      result.push(
        <MDBSelectOption key={i}
                         value={this.state.brands[i].id}>{this.state.brands[i].name + " (" + this.state.brands[i].id + ")"}</MDBSelectOption>
      );

    return result;
  }

  handleInput(event) {
    switch (event.target.name) {
      case "name":
        this.state.vehicle.name = event.target.value;
        break;
      case "brand":
        this.state.vehicle.brand = event.target.value;
        break;
      case "description":
        this.state.vehicle.description = event.target.value;
        break;
      case "price":
        this.state.vehicle.price = event.target.value;
        break;
      case "delivery":
        this.state.vehicle.delivery = event.target.value;
        break;
      case "special_price":
        this.state.vehicle.special_price = event.target.value;
        break;
    }
    this.forceUpdate();
  }

  handleImageSelect(value) {
    this.setState({selectedImages: value});
  }

  renderVehicleImages() {
    let result = [];
    for (let i = 0; i < this.state.vehicle.images.length; i++)
      result.push(<MDBChip waves close> <img data-index={this.state.vehicle.images[i].id} key={i}
                                             src={serverName + "images/products/" + this.state.vehicle.images[i].image_path}/>
      </MDBChip>);
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

  render() {
    if (this.state.vehicle.id !== "")
      return (
        <Layout title="Edit Product">
          <h1>Edit Product {this.state.vehicle.id}</h1>

          <div style={{position: 'relative'}}>
            <MDBSelect name="brand">
              <MDBSelectInput
                selected={this.state.vehicle.brand_name + " (" + this.state.vehicle.brand_id + ")"}/>
              <MDBSelectOptions>
                <MDBSelectOption disabled>Category Select</MDBSelectOption>
                {this.renderBrands()}
              </MDBSelectOptions>
            </MDBSelect>
            <label>Category</label>
          </div>

          <MDBInput label="Name" name="name" type="text" value={this.state.vehicle.name}
                    onChange={this.handleInput}/>

          <MDBInput label="Brand" name="brand" type="text" value={this.state.vehicle.brand}
                    onChange={this.handleInput}/>

          <MDBInput type="textarea" label="Description" name="description" value={this.state.vehicle.description}
                    onChange={this.handleInput}/>

          <MDBInput label="Price" name="price" type="number" value={this.state.vehicle.price}
                    onChange={this.handleInput}/>

          <MDBInput label="Delivery price" name="delivery" type="number" value={this.state.vehicle.delivery}
                    onChange={this.handleInput}/>

          <MDBInput label="Special price" name="special_price" type="number"
                    value={this.state.vehicle.special_price == null ? "" : this.state.vehicle.special_price}
                    onChange={this.handleInput}/>

          <span className="current-images-title">Current Product Images</span>
          <div className="current-images">
            {this.renderVehicleImages()}
          </div>

          <MDBFileInput multiple btnTitle="Choose New Images" textFieldTitle="Upload new product images"
                        name="images" getValue={this.handleImageSelect}/>

          <span className="current-images-title">Currently selected for upload</span>
          <div className="current-images-new" id="current-images-new">
            {this.renderSelectedImages()}
          </div>

          <MDBBtn color="green" onClick={this.updateVehicle}>Save changes</MDBBtn>
        </Layout>
      );
    else
      return (
        <Layout title="Edit Vehicle">
          <h1>Edit Product</h1>

          <MDBSpinner/>

          <Link href="/admin/login">
            <a id="goToLogin" className="link-to"></a>
          </Link>
        </Layout>
      );
  }
}
