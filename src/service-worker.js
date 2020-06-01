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
