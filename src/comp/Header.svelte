<script>
  import { onMount } from "svelte";

  onMount(async () => {
    // Install App Function
    let deferredPrompt;
    const addBtn = document.querySelector("#add-button");
    // addBtn.style.display = "none";
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      addBtn.style.display = "block";
      addBtn.addEventListener("click", (e) => {
        addBtn.style.display = "none";
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the A2HS prompt");
          } else {
            console.log("User dismissed the A2HS prompt");
          }
          deferredPrompt = null;
        });
      });
    });
  });
</script>

<style>
  .searchBarContainer {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    border-top: 10px solid var(--color-2);
    background-color: var(--color-1);
    height: 30px;
    box-sizing: content-box;
  }
  .searchBarContainer * {
    height: inherit;
  }
  .logoContainer {
    flex-grow: 2;
  }

  #logo {
    stroke: var(--color-2);
    height: 36px;
    width: auto;
  }
  #logo:hover {
    stroke: var(--Color-3);
  }
  #add-button {
    display: flex;
    align-items: center;
    line-height: 30px;
    color: var(--color-2);
    cursor: pointer;
  }
  #add-button i {
    margin-left: 10px;
  }
</style>

<div class="searchBarContainer">
  <div class="logoContainer">
    <a href="/" title="Gadget">

      <svg
        id="logo"
        aria-label="Logo Gadget"
        class="logo"
        version="1.1"
        viewBox="0 0 90 24"
        height="25"
        width="100">

        <path
          d="m 8.769578,8.81618 h 7.520376 c 0,3.587775 -2.534384,6.67593
          -6.053223,7.375875 C 6.717891,16.891993 3.19464,15.008782
          1.821657,11.694104 0.448673,8.379426 1.608352,4.556474
          4.591481,2.563212 7.57461,0.56995 11.550344,0.961528
          14.087286,3.498468"
          style="fill:none;fill-opacity:0;stroke-width:2.50136;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
          id="path4296" />
        <path
          d="m 31.878773,5.0110277 -0.01918,12.5055583 m -1e-6,-6.890698 A
          5.6400223,5.6400223 0 0 1 26.21957,16.26591 5.6400223,5.6400223 0 0 1
          20.579548,10.625888 5.6400223,5.6400223 0 0 1 26.21957,4.9858656
          5.6400223,5.6400223 0 0 1 31.859592,10.625888"
          style="fill:none;fill-opacity:0;fill-rule:evenodd;stroke-width:2.50135;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
          id="path4302" />
        <path
          d="m 75.868555,15.530364 c -2.21071,1.276349 -5.00308,0.908733
          -6.80811,-0.896302 -1.80504,-1.805035 -2.17266,-4.597405
          -0.89631,-6.80811 1.27636,-2.210713 3.87842,-3.288522
          6.34415,-2.627831 2.46572,0.660683 4.18027,2.895134 4.18027,5.447841 h
          -5.64002"
          style="fill:none;fill-opacity:0;stroke-width:2.50136;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
          id="path4304" />
        <path
          d="m 89.754017,16.232097 c -3.114903,0 -5.640028,-2.525125
          -5.640028,-5.640028 m 0,-10.591984259876 V 7.0497671 10.836345 M
          89.742185,5.0047267 81.729449,4.992069"
          style="fill:none;fill-opacity:0;stroke-width:2.50135;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
          id="path4312" />
        <path
          d="M 47.467589,0.00136965 47.44841,17.516586 m 0,-6.890699 a
          5.6400224,5.6400224 0 0 1 -5.640023,5.640023 5.6400224,5.6400224 0 0 1
          -5.640022,-5.640023 5.6400224,5.6400224 0 0 1 5.640022,-5.6400221
          5.6400224,5.6400224 0 0 1 5.640023,5.6400221"
          style="fill:none;fill-opacity:0;fill-rule:evenodd;stroke-width:2.50135;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
          id="path4328" />
        <path
          id="path4322"
          style="fill:none;fill-opacity:0;stroke-width:2.50135;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
          d="m 63.122585,17.072501 c 0,3.114898 -2.526416,5.659172
          -5.641314,5.659172 M 63.014288,5.0137675 63.121293,17.103785 m
          -0.08406,-6.457832 a 5.6400224,5.6400224 0 0 1 -5.640022,5.640023
          5.6400224,5.6400224 0 0 1 -5.640023,-5.640023 5.6400224,5.6400224 0 0
          1 5.640023,-5.6400214 5.6400224,5.6400224 0 0 1 5.640022,5.6400214" />
      </svg>

    </a>
  </div>
  <div class="iconContainer" title="Instalar">
    <!-- Add to Home -->
    <div id="add-button">
      <span>Instalar</span>
      <i class="material-icons btn-icon hover">favorite</i>
    </div>

    <!-- <svg
      id="add-button"
      xmlns="http://www.w3.org/2000/svg"
      class="btn-icon add-button"
      width="512"
      height="512"
      viewBox="0 0 512 512">
      <title>Instalar Aplicación</title>
      <path
        d="M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z"
        style="fill:none;stroke-miterlimit:10;stroke-width:32px" />
      <line
        x1="256"
        y1="176"
        x2="256"
        y2="336"
        style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
      <line
        x1="336"
        y1="256"
        x2="176"
        y2="256"
        style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
    </svg> -->
    <!-- / Add to Home -->
  </div>
</div>
