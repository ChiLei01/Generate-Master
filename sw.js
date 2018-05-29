if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

let CACHE_NAME = 'GM-v2';
let urlsToCache = [
    '/',
    'index.html',
    'manifest.json',
    'assets/css/screen.css',
    'assets/css/bootstrap.min.css',
    'assets/js/script.js',
    "assets/data/5e-SRD-Monsters.json",
    "assets/images/dnd-background.jpg",
    "assets/images/findMonster.png",
    "assets/images/noMonsters.png",
    "assets/images/icons/icon-512x512.png"

];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});

self.addEventListener('activate', function(event) {
    let cacheWhitelist = ['GM-v2'];

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});