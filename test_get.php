<?php
require 'backend/vendor/autoload.php';
use Firebase\JWT\JWT;
$token = JWT::encode(['uid'=>'admin','email'=>'alarasoysan@gmail.com','role'=>'admin','iat'=>time(),'exp'=>time()+7200], 'fallback_secret_change_in_production', 'HS256');
$ch = curl_init('https://alarasysn.com/api/admin/personal');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_COOKIE, 'auth_token='.$token);
$res = curl_exec($ch);
echo "Response: $res\n";
