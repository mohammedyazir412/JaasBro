<?php
/* Local-dev-only helper: mimics the .htaccess clean-URL rewrite so
   `php -S localhost:PORT router.php` serves /contact as contact.html
   and /study-mbbs/<page> as study-mbbs/<page>.html.
   Not used in production — Hostinger/Apache handles this via .htaccess. */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false; // real file (css/js/assets/etc.) — let the built-in server serve it
}

$clean = trim($uri, '/');
if ($clean === '') {
    $clean = 'index';
} elseif ($clean === 'study-mbbs') {
    $clean = 'study-mbbs/index';
}

$file = __DIR__ . '/' . $clean . '.html';
if (file_exists($file)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($file);
    return true;
}

return false; // not a known page — let the server return its normal 404
