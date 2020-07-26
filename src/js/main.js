import App from "../Components/App.svelte";

const app = new App({
  target: document.body,
  props: {},
});


if ("serviceWorker" in navigator && location.hostname !== "192.168.1.50") {
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
        console.error("ServiceWorker registration failed: ", err);
      }
    );
  });
}
else console.warn(`ServiceWorker no available.`);

export default app;
