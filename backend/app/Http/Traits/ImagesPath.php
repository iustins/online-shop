<?php

namespace App\Http\Traits;

trait ImagesPath
{
    public function get_images_path()
    {
        return "C:/xampp/htdocs/online-shop/frontend/static/images/online-shop/";
    }

    public function get_backend_path(){
        return "C:/xampp/htdocs/online-shop/backend/";
    }
}
