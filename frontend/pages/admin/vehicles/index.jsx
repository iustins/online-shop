import React, {Component, Fragment} from 'react';
import Link from 'next/link';
import {
  checkAuth, deleteVehicle, getVehicles, serverNameSrc as serverName,
  tokenExists, updateVehicles
} from '../../../helpers';
import EditableTable from '../../../components/layouts/admin/editabletable';
import {MDBBtn, MDBDataTable, MDBSpinner, MDBCol} from "mdbreact";
import Layout from '../layout';

export default class vehiclesIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectList: [],
      elementList: [],
      rerender: false,
      vehicles: {
        columns: [
          {
            label: 'ID',
            field: 'id',
            sort: 'asc',
            width: 80
          },
          {
            label: 'Category',
            field: 'brand',
            sort: 'asc'
          },
          {
            label: 'Image',
            field: 'image',
            sort: 'disabled'
          },
          {
            label: 'Name',
            field: 'name',
            sort: 'asc'
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
    deleteVehicle(this.state.token, id,
      response => {
        if (response.status == 201)
          location.reload();
      });
  }

  componentDidMount() {
    let token = JSON.parse(localStorage["appState"]).user.auth_token;

    if (token)
      checkAuth(token, response => {
        if (response.status == 200) {
          getVehicles(token, vehicles => {
            if (vehicles !== null) {
              let mapped = vehicles.map(vehicle => {
                return (
                  {
                    id: vehicle.id,
                    brand: vehicle.brand_name,
                    image: (<img style={{maxHeight: '80px'}}
                                 src={serverName + "images/products/" + vehicle.images[0].image_path}/>),
                    name: vehicle.name,
                    actions: (<Fragment>
                      <Link href={{pathname: '/admin/vehicles/edit', query: {id: vehicle.id}}}>
                        <a>
                          <MDBBtn color="orange" outline size="sm">
                            Edit
                          </MDBBtn>
                        </a>
                      </Link>
                      <MDBBtn className="delete" color="red" outline size="sm" onClick={(e) => {
                        this.deleteElement(vehicle.id)
                      }}>Delete</MDBBtn>
                    </Fragment>)
                  }
                );
              });

              this.state.vehicles.rows = mapped;

              this.setState({
                token: token,
                isLoggedIn: true,
                user: JSON.parse(localStorage["appState"]).user,
                elementList: vehicles
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
    if (this.state.vehicles.rows.length > 0)
      return (
        <Layout>
          <h1>Products</h1>

          <MDBCol>
            <Link href="/admin/vehicles/create">
              <a>
                <button type="button" className="btn button-create btn-outline-primary">Create</button>
              </a>
            </Link>
          </MDBCol>

          <div className="main-table">
            <MDBDataTable
              id='vehicle_table'
              striped
              bordered
              hover
              data={this.state.vehicles}
            />
          </div>

          <Link href="/admin/login">
            <a id="goToLogin" className="link-to"></a>
          </Link>
        </Layout>
      );
    else
      return (
        <Layout title="Vehicles">
          <h1>Products</h1>

          <button type="button" className="btn button-create btn-outline-primary">
            <Link href="/admin/vehicles/create">
              <a>Create</a>
            </Link>
          </button>

          <MDBSpinner/>

          <Link href="/admin/login">
            <a id="goToLogin" className="link-to"></a>
          </Link>
        </Layout>
      );
  }
};
