// Instalación y pre carga
var CACHE_NAME = "offline";
var urlsToCache = ["/"];

// Install SW
self.addEventListener("install", function (event) {
  // Create cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.info(`${CACHE_NAME} cache created`);
      return cache.addAll(urlsToCache);
    })
  );
});

// When require a resource
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Si está almacenado, se devuelve desde la cache.
      if (response) {
        return response;
      }
      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(function (response) {
        /* 
             Verifica que le petición devuelva una respuesta válida. 
             para almacenar solo recursos locales, use:
             || response.type !== "basic" 
            */
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        var responseToCache = response.clone();
        // Almacena el recurso en la cache
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

/* Workbox 
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

import { registerRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  NetworkFirst,
} from "workbox-strategies";

registerRoute(
  ({ request }) => request.destination === "empty",
  new NetworkFirst({cacheName: 'ofline'})
);

registerRoute(
  ({url}) => url.pathname.startsWith('/'),
  new StaleWhileRevalidate({cacheName: 'ofline'})
);
*/
