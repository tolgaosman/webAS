<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$row = Illuminate\Support\Facades\DB::table('personal')->first();
Illuminate\Support\Facades\DB::table('personal')->truncate();

putenv('APP_ENV=local');
$app['env'] = 'local'; // Force local to see error details

$req = Illuminate\Http\Request::create('/api/admin/personal', 'GET');
$req->headers->set('Accept', 'application/json');

use Firebase\JWT\JWT;
$token = JWT::encode(['uid'=>'admin','email'=>'alarasoysan@gmail.com','role'=>'admin','iat'=>time(),'exp'=>time()+7200], config('webas.jwt_secret'), 'HS256');
$req->cookies->set('auth_token', $token);

$res = $app->handle($req);
echo "Status: " . $res->getStatusCode() . "\n";
echo "Content: " . $res->getContent() . "\n";

if ($row) {
    Illuminate\Support\Facades\DB::table('personal')->insert((array)$row);
}
