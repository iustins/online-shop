import axios from 'axios';

export let serverName = "http://online-shop-iustin.herokuapp.com/public/";
export let serverNameSrc = "http://online-shop-iustin.herokuapp.com/public/";

const attemptGetNoToken = (address, callback) => {
    axios.get(serverName + address)
        .then(response => callback(response))
        .catch(error => callback(error.response));
};

const attemptGet = (token, address, callback) => {
    axios.get(serverName + address + `?token=${ token }`)
        .then(response => callback(response))
        .catch(error => callback(error.response));
};

const attemptGet2 = (token, address, callback) => {
    axios.get(serverName + address + `&token=${ token }`)
        .then(response => callback(response))
        .catch(error => callback(error.response));
};

const attemptPost = (address, data, callback) => {
    axios.post(serverName + address, data,
        { headers: { 'Content-Type': "application/json; charset=utf-8" } }
    ).then(response => callback(response))
        .catch(error => callback(error.response));
};

const attemptPut = (token, address, data, callback) => {
    axios.put(serverName + address + `?token=${ token }`, data,
        { headers: { 'Content-Type': "application/json; charset=utf-8" } }
    ).then(response => callback(response))
        .catch(error => callback(error.response));
};

const attemptDelete = (token, address, callback) => {
    axios.delete(serverName + address + `?token=${ token }`,
        { headers: { 'Content-Type': "application/json; charset=utf-8" } }
    ).then(response => callback(response))
        .catch(error => callback(error.response));
};

export const attemptLogin = (data, callback) => attemptPost('api/user/login', data, response => callback(response.data));

export const attemptRegister = (data, callback) => attemptPost('api/user/register', data, response => callback(response.data));

export const checkAuth = (token, callback) => attemptGet(token, 'api/check-auth', response => callback(response.data));

export const setFavorites = (data, callback) => attemptPost('api/favorites/set', data, response => callback(response));

export const getHomepageData = (token, callback) => attemptGet(token, 'api/homepage/data', response => {if(response != null) callback(response)});

export const getProductHistory = (token, id, callback) => attemptGet(token, 'api/product-history?id=' + id, response => {if(response != null) callback(response)});

export const tokenExists = token => token !== '' ? true : false;

//shop

export const processTransaction = (token, id, callback) => attemptGet2(token, 'api/transactions/process?id='+id, response => callback(response.data));

export const getTransactions = (token, callback) => attemptGet(token, 'api/transactions', response => { if(response !== null && response !== undefined) callback(response.data) });

export const cardTransaction = (data, callback) => attemptPost('api/payment/card', data, response => callback(response));

// brands

export const getBrands = (token, callback) => attemptGet(token, 'api/brands', response => callback(response.data));

export const getBrandsListing = (callback) => attemptGetNoToken( 'api/brands/listing', response => callback(response.data));

export const getBrandByID = (token, id, callback) => attemptGet(token, 'api/brands/' + id, response => callback(response));

export const createBrand = (data, callback) => attemptPost('api/brands/create', data, response => callback(response));

export const updateBrand = (data, callback) => attemptPost('api/brands/update', data, response => callback(response));

export const updateBrandLogo = (token, data, callback) => attemptPost('api/brands/update-logo', data, response => callback(response));

export const deleteBrand = (token, id, callback) => attemptDelete(token,'api/brands/delete/' + id, response => callback(response));

// vehicles
export const getVehicles = (token, callback) => attemptGet(token, 'api/vehicles', response => callback(response.data));

export const getVehicleByID = (token, id, callback) => attemptGet(token, 'api/vehicles/' + id, response => callback(response));

export const getVehiclesByBrandID = (token, id, callback) => attemptGet(token, 'api/vehicles/bybrand/' + id, response => callback(response));

export const createVehicle = (data, callback) => attemptPost('api/vehicles/create', data, response => callback(response));

export const updateVehicle = (data, callback) => attemptPost('api/vehicles/update', data, response => callback(response));

export const deleteVehicle = (token, id, callback) => attemptDelete(token, 'api/vehicles/delete/' + id, response => callback(response));

//slider
export const getOffers = (token, callback) => attemptGet(token, 'api/homepage/index', response => callback(response.data));

export const getOffersSlider = (token, callback) => attemptGet(token, 'api/homepage/slider', response => callback(response.data));

export const swapPlacesInSlider = (data, callback) => attemptPost('api/homepage/swap', data, response => callback(response));

export const updateHomepageSlider = (data, callback) => attemptPost('api/homeslider/update', data, response => callback(response));
