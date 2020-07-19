import App from "../Components/App.svelte";

const app = new App({
  target: document.body,
  props: {},
});

if ("serviceWorker" in navigator && location.hostname === "localhost") {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").then(
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.warn("ServiceWorker registration failed: ", err);
      }
    );
  });
} else console.warn("ServiceWorker only available on localhost");

export default app;
