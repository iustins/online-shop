<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('homepage/data', 'HomepageController@getHomeData');
Route::get('brandlist/data', 'HomepageController@getAllBrandsData');
Route::get('brand-carlist/data', 'HomepageController@getCategoryListData');
Route::get('product-data', 'VehicleController@show');
Route::get('product-history', 'VehicleController@getPriceHistory');


//shop
Route::get('transaction-data', 'TransactionController@show');
Route::post('payment/card', 'TransactionController@cardPayment');

Route::group(['middleware' => ['jwt-auth', 'api-header']], function () {

    // all routes to protected resources are registered here
    Route::get('users/list', function() {
        $users = App\User::all();

        $response = ['success' => true, 'data' => $users];
        return response()->json($response, 201);
    });

    Route::get('transactions', 'TransactionController@index');
    Route::get('transactions/process', 'TransactionController@markAsProcessed');

    Route::get('brands', 'BrandController@index');
    Route::get('brands/{id}', 'BrandController@show');
    Route::post('brands/create', 'BrandController@store');
    Route::post('brands/update', 'BrandController@update');
    Route::post('brands/update-logo', 'BrandController@updateImage');
    Route::delete('brands/delete/{id}', 'BrandController@destroy');

    Route::get('vehicles', 'VehicleController@index');
    Route::get('vehicles/bybrand/{id}', 'VehicleController@get_vehicles_by_brand');
    Route::get('vehicles/{id}', 'VehicleController@showId');
    Route::post('vehicles/create', 'VehicleController@store');
    Route::post('vehicles/update', 'VehicleController@update');
    Route::delete('vehicles/delete/{id}', 'VehicleController@destroy');

    Route::get('homepage/index', 'HomepageController@index');
    Route::get('homepage/slider', 'HomepageController@index_slider');
    Route::get('homepage/swap', 'HomepageController@swapPlacesInSlider');
    Route::post('homeslider/update', 'HomepageController@update_slider');

    Route::get('/check-auth', 'UserController@isAuthenticated');

    Route::post('favorites/set', 'UserController@setFavorites');
});

Route::group(['middleware' => 'api-header'], function () {
    // The registration and login requests doesn't come with tokens
    // as users at that point have not been authenticated yet
    // Therefore the jwtMiddleware will be exclusive of them

    Route::post('user/login', 'UserController@login');
    Route::post('user/register', 'UserController@register');
});
