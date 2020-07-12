import "../css/reset.css";
import "../css/main.scss";
import App from "../comp/App.svelte";

const app = new App({ target: document.body });

export default app;

if ("serviceWorker" in navigator && window.location.host !== "0.0.0.0:8080") {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("../service-worker.js").then(
      function (registration) {},
      function (err) {
        console.error("ServiceWorker registration failed :( ", err);
      }
    );
  });
} else console.warn("Service Worker unavailable !");
