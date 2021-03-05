<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use JWTAuth;
use JWTAuthException;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    private function getToken($email, $password)
    {
        $token = null;
        //$credentials = $request->only('email', 'password');
        try {
            if (!$token = JWTAuth::attempt(['email' => $email, 'password' => $password])) {
                return response()->json([
                    'response' => 'error',
                    'message' => 'Password or email is invalid',
                    'token' => $token
                ]);
            }
        } catch (JWTAuthException $e) {
            return response()->json([
                'response' => 'error',
                'message' => 'Token creation failed',
            ]);
        }

        return $token;
    }

    public function getReduction($id)
    {
        return 0.12; // TODO
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->get()->first();

        if ($user && Hash::check($request->password, $user->password)) // The passwords match...
        {
            $token = self::getToken($request->email, $request->password);

            $user->auth_token = $token;

            $user->save();

            $response = [
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'auth_token' => $user->auth_token,
                    'email' => $user->email,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'address' => $user->address,
                    'phone' => $user->phone,
                    'favorites' => $user->favorites,
                    'isBirthday' => $this->isBirthday($user->birth),
                    'reduction' => $this->isBirthday($user->birth) ? $this->getReduction($user->id) : 0,
                    'type' => $user->type,
                ]
            ];
        } else
            $response = ['success' => false, 'data' => 'Record doesnt exists'];

        return response()->json($response, 200);
    }

    public function isBirthday($birth)
    {
        if ($birth == null)
            return false;
        $birthSplit = explode("-", $birth);

        $date = date("y-mm-dd");
        $dateSplit = explode("-", $date);

        if (strcmp($birthSplit[0], $dateSplit[1]) == 0 && strcmp($birthSplit[1], $dateSplit[2]) == 0)
            return true;

        return false; //hai sa iti zic niste chestii despre mine, nu esti singurul special care a avut probleme si a trebuit sa ia medicatii de la care a a vut efecte adverse nasoale, si acum am munca, am 2 proiecte de freelancing pe langa munca si mai am si un startup, si dupa ce lucrez toata ziua si sunt mort ma rogi la 1 noaptea sa iti fac o chestie, sunt de acord sa o faci si dupa ma ieie ca de ce nu a fost totul perfect, intelegi? e unu noaptea pt ca nu mi-ai raspuns de pe 10 a tot trebuit sa trag de tine sa imi raspunzi, ... si altfel ai fi facut chestia asta? daca te rugam altadata sau mai devreme? nu stiu daor ca cat timp osa ai atitudinea asta de perffectionist in conditiile in care tu nu cred ca ai invatat nimic din facultatea asta nu stiu ce  pretentii ai de la altii, sa fii sa natos sa te descurci

    public function setFavorites(Request $request){
        $user = User::find($request->user_id);
        $user->favorites = $request->favorites;
        $user->save();

        $response = ['success' => true, 'data' => 'Favorites set.'];
        return response()->json($response, 200);
    }

    public function register(Request $request)
    {
        $payload = [
            'password' => Hash::make($request->password),
            'email' => $request->email,
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'favorites' => $request->favorites,
            'auth_token' => ''
        ];

        $user = new User($payload);

        if ($user->save()) {
            $token = self::getToken($request->email, $request->password); // generate user token

            if (!is_string($token))
                return response()->json(['success' => false, 'data' => 'Token generation failed'], 201);

            $user = User::where('email', $request->email)->get()->first();

            $user->auth_token = $token; // update user token

            $user->save();

            $response = [
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'auth_token' => $user->auth_token,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'address' => $user->address,
                    'phone' => $user->phone,
                    'favorites' => $user->favorites,
                    'isBirthday' => $this->isBirthday($user->birth),
                    'email' => $user->email,
                    'type' => $user->type,
                ]
            ];
        } else
            $response = ['success' => false, 'data' => 'Couldnt register user'];

        return response()->json($response, 200);
    }

    public function isAuthenticated()
    {
        return response()->json(['status' => 200], 200);
    }
}
