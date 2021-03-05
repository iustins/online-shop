<?php

namespace App\Http\Controllers;

use App\Http\Traits\ImagesPath;
use App\OffersTabs;
use App\OffersTags;
use App\VehicleImages;
use Illuminate\Http\Request;
use DB;
use App\Offer;
use App\Variation;
use App\User;
use App\Vehicle;
use App\Brand;
use App\Tab;
use phpDocumentor\Reflection\DocBlock\Tag;
use Tymon\JWTAuth\Contracts\Providers\Auth;

class HomepageController extends Controller
{
    use ImagesPath;

    public function index()
    {
        $products = DB::select('
            select
                b.name as brand_name, veh.name as vehicle_name
            from
                vehicles veh, brands b
            where
            veh.id = var.vehicle_id and b.id = veh.brand_id
        ');

        return response()->json($products, 200);
    }

    public function index_slider()
    {
        $offers_visible = DB::select('
            select
                *
            from
                vehicles
            where
                in_slider = 1
            order by
                case when slide_order is null then id else 0 end, slide_order
            asc
        ');

        forEach ($offers_visible as $vehicle) {
            $vehicle->brand_name = Brand::find($vehicle->brand_id)->name;
            $vehicle->images = VehicleImages::where('vehicle_id',$vehicle->id)->get();
        }

        $leftovers = DB::select('
            select
                *
            from
                vehicles
            where
                in_slider = 0
        ');

        forEach ($leftovers as $vehicle) {
            $vehicle->brand_name = Brand::find($vehicle->brand_id)->name;
            $vehicle->images = VehicleImages::where('vehicle_id',$vehicle->id)->get();
        }

        $offers = $offers_visible;

        foreach ($leftovers as $offer)
            $offers[] = $offer;

        return response()->json($offers, 200);
    }

    public function swapPlacesInSlider(Request $request) {
        $offer1 = Vehicle::find($request->id1);
        $offer2 = Vehicle::find($request->id2);

        $aux = $offer1->slide_order;
        $offer1->slide_order = $offer2->slide_order;
        $offer2->slide_order = $aux;

        $offer1->save();
        $offer2->save();

        return $request;
    }

    public function update_slider(Request $request)
    {
        $product = Vehicle::find($request->offer_id);

        if ($product) {
            $product->in_slider = !$product->in_slider;

            if ($product->in_slider) {
                $currentlyInSlider = count(Vehicle::where('in_slider', 1)->get());
                $product->slide_order = $currentlyInSlider;
            } else {
                $product->slide_order = null;
            }

            if ($product->save())
                return response()->json(['message' => 'Slider updated.'], 201);
            else
                return response()->json(['message' => 'There was an error'], 500);
        }
    }

    public function getLastId($token){
        return User::where('auth_token', $token)->get()[0]->id;
    }

    public function getHomeData(Request $request)
    {
        $data = new \stdClass;

        // slider offers
        $allProducts = Vehicle::all();
        $sliderProducts = Vehicle::where('in_slider', '1')->orderBy('slide_order')->get();

        forEach ($allProducts as $vehicle) {
            $vehicle->brand = $vehicle->brand_name;
            $vehicle->brand_name = Brand::find($vehicle->brand_id)->name;
            $vehicle->brand_slug = Brand::find($vehicle->brand_id)->slug;
            $vehicle->images = VehicleImages::where('vehicle_id', $vehicle->id)->get();
        }

        forEach ($sliderProducts as $vehicle) {
            $vehicle->brand = $vehicle->brand_name;
            $vehicle->brand_name = Brand::find($vehicle->brand_id)->name;
            $vehicle->brand_slug = Brand::find($vehicle->brand_id)->slug;
            $vehicle->images = VehicleImages::where('vehicle_id', $vehicle->id)->get();
        }

        $data->products = $allProducts;
        $data->sliderProducts = $sliderProducts;
        $data->favorites = User::find($this->getLastId($request->token))->favorites;
        $data->user_id = $this->getLastId($request->token);

        return response()->json($data, 200);
    }

    public function getAllBrandsData()
    {
        $brands = Brand::all();

        return response()->json(['brands' => $brands], 200);
    }

    public function getCategoryListData(Request $request)
    {
        $data = new \stdClass();

        $data->category = Brand::where('slug', $request->category)->get()[0];
        $products = Vehicle::where('brand_id', $data->category->id)->get();

        foreach ($products as $product) {
            $product->brand_name = Brand::find($product->brand_id)->name;
            $product->images = VehicleImages::where('vehicle_id', $product->id)->get();
        }

        $data->products = $products;

        return response()->json($data, 200);
    }
}
