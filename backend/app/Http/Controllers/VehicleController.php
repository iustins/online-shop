<?php

namespace App\Http\Controllers;

use App\Brand;
use App\ProductPriceHistory;
use App\VehicleImages;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Intervention\Image\ImageManagerStatic as Image;
use App\Vehicle;
use DB;
use App\Http\Traits\ImagesPath;

class VehicleController extends Controller
{

    use ImagesPath;

    public function index()
    {
        $vehicles = Vehicle::all();

        forEach ($vehicles as $vehicle) {
            $vehicle->brand_fullname = $vehicle->brand_name;
            $vehicle->brand_name = Brand::find($vehicle->brand_id)->name;
            $vehicle->images = VehicleImages::where('vehicle_id', $vehicle->id)->get();
        }

        return response()->json($vehicles, 200);
    }

    function calculate_price($price)
    {
        if (rand(1, 10) % 2 == 0){
            if ($price < 100) {
                $modifier = rand(5, 15);
                if (rand(1, 10) % 2 == 0)
                    $modifier = -1 * $modifier;

                $percent = 100.00 + $modifier;
                $price = $price * $percent / 100.00;
            } elseif ($price < 500) {
                $modifier = rand(5, 12);
                if (rand(1, 10) % 2 == 0)
                    $modifier = -1 * $modifier;

                $percent = 100.00 + $modifier;
                $price = $price * $percent / 100.00;
            } else {
                $modifier = rand(1, 10);
                if (rand(1, 10) % 2 == 0)
                    $modifier = -1 * $modifier;

                $percent = 100.00 + $modifier;
                $price = $price * $percent / 100.00;
            }
        }
        return $price;
    }

    public function generatePriceHistory()
    {
        $vehicles = Vehicle::all();

        forEach ($vehicles as $vehicle) {
            $id = $vehicle->id;
            $price = $vehicle->price;
            $date = Carbon::now();

            $history = new ProductPriceHistory();
            $history->product_id = $id;
            $history->price = $price;
            $history->date = $date;
            $history->save();

            for ($i = 0; $i < 13; $i++) {
                $price = $this->calculate_price($price);
                $date = $date->subDays(7);

                $history = new ProductPriceHistory();
                $history->product_id = $id;
                $history->price = $price;
                $history->date = $date;
                $history->save();
            }
        }
    }

    public function get_vehicles_by_brand($brand_id)
    {
        $vehicles = DB::select('
            select
                id, name
            from
                vehicles
            where
                brand_id = ?
        ', [$brand_id]);

        return response()->json($vehicles, 200);
    }

    public function folder_exist($folder)
    {
        $path = realpath($folder);
        return ($path !== false && is_dir($path)) ? true : false;
    }

    public function store(Request $request)
    {
        $vehicle = new Vehicle();
        $vehicle->name = $request->name;
        $vehicle->slug = strtolower(str_replace(" ", "-", $request->name));
        $vehicle->brand_name = $request->brand;
        $vehicle->brand_id = $request->brand_id;
        $vehicle->description = $request->description;
        $vehicle->is_clothing = $request->is_clothing;
        $vehicle->price = $request->price;
        $vehicle->delivery = $request->delivery;

        if (isset($request->special_price))
            $vehicle->special_price = $request->special_price;
        else
            $vehicle->special_price = null;

        $images = [];

        for ($i = 0; $i < $request->image_count; $i++)
            array_push($images, $request->{"image_" . $i});

        if ($vehicle->save()) {
            $this->storeImages($vehicle->id, $images);
            return response()->json(['message' => 'New vehicle created.'], 201);
        } else
            return response()->json(['message' => 'There was an error'], 500);
    }

    public function show(Request $request)
    {
        $vehicle = Vehicle::where('slug', $request->slug)->get()->first();

        if ($vehicle) {
            $vehicle->history = $this->getPriceHistory($vehicle->id);
            $vehicle->brand = $vehicle->brand_name;
            $vehicle->brand_name = Brand::find($vehicle->brand_id)->name;
            $vehicle->brand_slug = Brand::find($vehicle->brand_id)->slug;
            $vehicle->images = VehicleImages::where('vehicle_id', $vehicle->id)->get();
            return response()->json(['product' => $vehicle], 200);
        } else
            return response()->json(['message' => 'There was an error retrieving the data'], 500);
    }

    public function getPriceHistory($id) {
        return ProductPriceHistory::where('product_id',$id)->orderBy('date', 'asc')->get();
    }

    public function showId($id)
    {
        $vehicle = Vehicle::find($id);

        if ($vehicle) {
            $vehicle->history = $this->getPriceHistory($vehicle->id);
            $vehicle->brand = $vehicle->brand_name;
            $vehicle->brand_name = Brand::find($vehicle->brand_id)->name;
            $vehicle->brand_slug = Brand::find($vehicle->brand_id)->slug;
            $vehicle->images = VehicleImages::where('vehicle_id', $vehicle->id)->get();
            return response()->json(['product' => $vehicle], 200);
        } else
            return response()->json(['message' => 'There was an error retrieving the data'], 500);
    }

    public function update(Request $request)
    {
        $vehicle = Vehicle::find($request->id);

        $vehicle->name = $request->name;
        $vehicle->brand_name = $request->brand;
        $vehicle->brand_id = $request->brand_id;
        $vehicle->description = $request->description;
        $vehicle->is_clothing = $request->is_clothing;
        $vehicle->price = $request->price;
        $vehicle->delivery = $request->delivery;

        if (isset($request->special_price))
            $vehicle->special_price = $request->special_price;
        else
            $vehicle->special_price = null;

        if ($request->deleted_images) {
            $deleted_images = json_decode($request->deleted_images);

            //delete old images

            foreach ($deleted_images as $image) {
                VehicleImages::destroy($image);
            }
        }

        $images = [];

        for ($i = 0; $i < $request->image_count; $i++)
            array_push($images, $request->{"image_" . $i});

        if ($vehicle->save()) {
            if (count($images) > 0)
                $this->storeImages($vehicle->id, $images);
            return response()->json(['message' => 'Vehicle updated.'], 201);
        } else
            return response()->json(['message' => 'There was an error'], 500);
    }

    public function destroy($id)
    {
        if (Vehicle::destroy($id) !== 0)
            return response()->json(['message' => 'Vehicle deleted.'], 201);
        else
            return response()->json(['message' => 'There was an error'], 500);
    }

    public function storeImages($vehicle_id, $images)
    {
        //store new images
        foreach ($images as $image) {
            $vehicleImage = new VehicleImages();

            $image_name = date('Y_m_d_H_i_s_') . $image->getClientOriginalName();
            $vehicleImage->image_path = $image_name;

            $vehicleImage->vehicle_id = $vehicle_id;

            $destinationPath = $this->get_images_path() . "products/";

            if (!$this->folder_exist($destinationPath))
                mkdir($destinationPath, 0777, true);

            $image_location = $destinationPath . $image_name;
            chmod($destinationPath, 0755);

            $imageToBeSaved = Image::make($image->getRealPath());

            // resize the image to a width of 500 and constrain aspect ratio (auto height)
            $imageToBeSaved->resize(500, null, function ($constraint) {
                $constraint->aspectRatio();
            });

            $imageToBeSaved->save($image_location);

            if ($vehicleImage)
                $vehicleImage->save();
        }
    }
}
