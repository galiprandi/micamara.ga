<script>
  import { toggleMenu, closeMenu } from "./Aside.svelte";

  export let QUERY, LAST_SEARCH;

  const serachSuggestions = [
    "Sony",
    "Flashes",
    "Nikon",
    "Canon",
    "Godox",
    "Zhiyun-tech",
    "Usados Seleccionados",
  ];

  $: if (LAST_SEARCH) {
    LAST_SEARCH = [...LAST_SEARCH, ...serachSuggestions].slice(0, 7);
  } else LAST_SEARCH = [...serachSuggestions];

  let active = false;
  let action = "search";

  function floatContainer(el) {
    active = !active;
    const icon = el.target;
    if (icon.getAttribute("action")) action = icon.getAttribute("action");
  }

  async function btnShare() {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: window.location,
      });
    } else {
      //floatContainer(el);
      action = "share";
      active = !active;
    }
  }
  export const iconClose = `
  <title>Cerrar</title>
  <line x1="430" y1="430" x2="144" y2="144" style="fill: none;stroke-linecap: round;stroke-linejoin: round;stroke-width: 32px;" />
  <line x1="430" y1="144" x2="144" y2="430" style="fill: none;stroke-linecap: round;stroke-linejoin: round;stroke-width: 32px;" />
  `;
</script>

<style>
  nav {
    background-color: var(--color-1);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    color: var(--color-2);
    padding: 1rem;
    text-transform: capitalize;
    --icon-size: 32px;
  }
  .fixedIcons {
    display: flex;
    justify-content: space-around;
    height: var(--icon-size);
  }
  .fixedIcons * {
    display: block;
    height: var(--icon-size);
    width: var(--icon-size);
  }

  .btn-icon {
    cursor: pointer;
    stroke: var(--color-2);
  }

  .btn-icon:hover,
  .btn-icon:active {
    stroke: var(--Color-3);
  }

  .btn-icon.filled {
    fill: var(--color-2);
  }
  .btn-icon.filled:hover {
    fill: var(--color-3);
  }
  #floatContainer {
    margin: 1rem 0;
  }
  #floatContainer h1 {
    color: var(--Color-3);
  }
  #floatContainer input {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 20px;
    outline: 0;
    text-transform: capitalize;
  }
  #floatContainer ul {
    margin: 1rem 0;
    line-height: 2rem;
  }
  #floatContainer ul li {
    cursor: pointer;
    margin: 1rem 0;
  }
  #floatContainer ul li:hover {
    color: var(--Color-3);
  }
  #floatContainer .shareButtons {
    display: flex;
    justify-content: space-around;
  }
</style>

<nav id="nav">
  {#if active}
    <!-- Float container -->
    <div class="floatContainer" id="floatContainer">

      <!-- input search -->
      {#if action == 'search'}
        <div class="search">
          {#if LAST_SEARCH}
            <h1>Búsquedas recientes</h1>
            <ul>
              {#each LAST_SEARCH as item}
                <li
                  on:click={() => {
                    active = false;
                    QUERY = item;
                    closeMenu();
                  }}>
                  {item}
                </li>
              {/each}
            </ul>
          {/if}
          <input
            on:focus={(e) => e.target.select()}
            id="searchBox"
            type="searchBox"
            bind:value={QUERY}
            placeholder="¿ Qué necesita ?" />
          <!-- input search -->
        </div>
      {:else if action == 'share'}
        <div class="shareButtons">
          <!-- Share on Facebook -->
          <a
            href="http://www.facebook.com/sharer.php?u={location.href}"
            target="_blank">
            <svg
              class="btn-icon filled"
              xmlns="http://www.w3.org/2000/svg"
              width="512"
              height="512"
              viewBox="0 0 512 512">
              <title>Compartir en Facebook</title>
              <path
                fill="currentColor"
                d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69
                226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48
                93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8
                0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31
                482.38 504 379.78 504 256z" />
            </svg>
          </a>
          <!-- Share on Facebook -->

          <!-- Share on Whatsapp -->
          <a
            href="whatsapp://send?text={location.href}"
            data-action="share/whatsapp/share">
            <svg
              class="btn-icon filled"
              xmlns="http://www.w3.org/2000/svg"
              width="512"
              height="512"
              viewBox="0 0 512 512">
              <title>Compartir en Whatsapp</title>
              <path
                d="M414.73,97.1A222.14,222.14,0,0,0,256.94,32C134,32,33.92,131.58,33.87,254A220.61,220.61,0,0,0,63.65,365L32,480l118.25-30.87a223.63,223.63,0,0,0,106.6,27h.09c122.93,0,223-99.59,223.06-222A220.18,220.18,0,0,0,414.73,97.1ZM256.94,438.66h-.08a185.75,185.75,0,0,1-94.36-25.72l-6.77-4L85.56,427.26l18.73-68.09-4.41-7A183.46,183.46,0,0,1,71.53,254c0-101.73,83.21-184.5,185.48-184.5A185,185,0,0,1,442.34,254.14C442.3,355.88,359.13,438.66,256.94,438.66ZM358.63,300.47c-5.57-2.78-33-16.2-38.08-18.05s-8.83-2.78-12.54,2.78-14.4,18-17.65,21.75-6.5,4.16-12.07,1.38-23.54-8.63-44.83-27.53c-16.57-14.71-27.75-32.87-31-38.42s-.35-8.56,2.44-11.32c2.51-2.49,5.57-6.48,8.36-9.72s3.72-5.56,5.57-9.26.93-6.94-.46-9.71-12.54-30.08-17.18-41.19c-4.53-10.82-9.12-9.35-12.54-9.52-3.25-.16-7-.2-10.69-.2a20.53,20.53,0,0,0-14.86,6.94c-5.11,5.56-19.51,19-19.51,46.28s20,53.68,22.76,57.38,39.3,59.73,95.21,83.76a323.11,323.11,0,0,0,31.78,11.68c13.35,4.22,25.5,3.63,35.1,2.2,10.71-1.59,33-13.42,37.63-26.38s4.64-24.06,3.25-26.37S364.21,303.24,358.63,300.47Z"
                style="fill-rule:evenodd" />
            </svg>
          </a>
          <!-- Share on Whatsapp -->
          <!-- Share on Twitter -->
          <a
            href="https://twitter.com/share?url={location.href}"
            target="_blank">
            <svg
              class="btn-icon filled"
              xmlns="http://www.w3.org/2000/svg"
              width="512"
              height="512"
              viewBox="0 0 512 512">
              <title>Compartir en Twitter</title>
              <path
                d="M496,109.5a201.8,201.8,0,0,1-56.55,15.3,97.51,97.51,0,0,0,43.33-53.6,197.74,197.74,0,0,1-62.56,23.5A99.14,99.14,0,0,0,348.31,64c-54.42,0-98.46,43.4-98.46,96.9a93.21,93.21,0,0,0,2.54,22.1,280.7,280.7,0,0,1-203-101.3A95.69,95.69,0,0,0,36,130.4C36,164,53.53,193.7,80,211.1A97.5,97.5,0,0,1,35.22,199v1.2c0,47,34,86.1,79,95a100.76,100.76,0,0,1-25.94,3.4,94.38,94.38,0,0,1-18.51-1.8c12.51,38.5,48.92,66.5,92.05,67.3A199.59,199.59,0,0,1,39.5,405.6,203,203,0,0,1,16,404.2,278.68,278.68,0,0,0,166.74,448c181.36,0,280.44-147.7,280.44-275.8,0-4.2-.11-8.4-.31-12.5A198.48,198.48,0,0,0,496,109.5Z" />
            </svg>
          </a>
          <!-- Share on Twitter -->
        </div>
      {/if}
    </div>
    <!-- Float container -->
  {/if}
  <div class="fixedIcons">

    <!-- Share Button -->
    <div>
      <svg
        on:click|capture={btnShare}
        action="share"
        class="btn-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="512"
        height="512"
        viewBox="0 0 512 512">
        {#if active && action === 'share'}
          <title>Cerrar</title>
          <line
            x1="430"
            y1="430"
            x2="144"
            y2="144"
            style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
          <line
            x1="430"
            y1="144"
            x2="144"
            y2="430"
            style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
        {:else}
          <title>Compartir</title>
          <circle
            cx="128"
            cy="256"
            r="48"
            style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
          <circle
            cx="384"
            cy="112"
            r="48"
            style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
          <circle
            cx="384"
            cy="400"
            r="48"
            style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
          <line
            x1="169.83"
            y1="279.53"
            x2="342.17"
            y2="376.47"
            style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
          <line
            x1="342.17"
            y1="135.53"
            x2="169.83"
            y2="232.47"
            style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
        {/if}
      </svg>
    </div>
    <!-- / Share Button -->
    <!-- Call Button -->
    <div>
      <a href="tel:+5493815900868" title="Llamar">
        <svg
          class="btn-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="512"
          height="512"
          viewBox="0 0 512 512">
          <title>Llamar</title>
          <path
            d="M451,374c-15.88-16-54.34-39.35-73-48.76C353.7,313,351.7,312,332.6,326.19c-12.74,9.47-21.21,17.93-36.12,14.75s-47.31-21.11-75.68-49.39-47.34-61.62-50.53-76.48,5.41-23.23,14.79-36c13.22-18,12.22-21,.92-45.3-8.81-18.9-32.84-57-48.9-72.8C119.9,44,119.9,47,108.83,51.6A160.15,160.15,0,0,0,83,65.37C67,76,58.12,84.83,51.91,98.1s-9,44.38,23.07,102.64,54.57,88.05,101.14,134.49S258.5,406.64,310.85,436c64.76,36.27,89.6,29.2,102.91,23s22.18-15,32.83-31a159.09,159.09,0,0,0,13.8-25.8C465,391.17,468,391.17,451,374Z"
            style="fill:none;stroke-miterlimit:10;stroke-width:32px" />
        </svg>
      </a>
    </div>
    <!-- / Call Button -->
    <!-- Messenger Button -->
    <div>
      <a
        href="https://m.me/100010196598541"
        target="_blank"
        rel="noopener"
        title="Enviar un mensaje">
        <svg
          class="btn-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="512"
          height="512"
          viewBox="0 0 512 512">
          <title>Enviar un mensaje</title>
          <path
            d="M87.49,380c1.19-4.38-1.44-10.47-3.95-14.86A44.86,44.86,0,0,0,81,361.34a199.81,199.81,0,0,1-33-110C47.65,139.09,140.73,48,255.83,48,356.21,48,440,117.54,459.58,209.85A199,199,0,0,1,464,251.49c0,112.41-89.49,204.93-204.59,204.93-18.3,0-43-4.6-56.47-8.37s-26.92-8.77-30.39-10.11a31.09,31.09,0,0,0-11.12-2.07,30.71,30.71,0,0,0-12.09,2.43L81.51,462.78A16,16,0,0,1,76.84,464a9.6,9.6,0,0,1-9.57-9.74,15.85,15.85,0,0,1,.6-3.29Z"
            style="fill:none;stroke-miterlimit:10;stroke-width:32px" />
        </svg>
      </a>
    </div>
    <!-- / Messenger Button -->
    <!-- Search Button -->
    <div>
      <svg
        on:click={() => {
          active = !active;
          action = 'search';
        }}
        action="search"
        class="btn-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="512"
        height="512"
        viewBox="0 0 512 512">
        {#if active && action === 'search'}
          <title>Cerrar Menú</title>
          <line
            x1="430"
            y1="430"
            x2="144"
            y2="144"
            style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
          <line
            x1="430"
            y1="144"
            x2="144"
            y2="430"
            style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />
        {:else}
          <title>Buscar</title>
          <path
            d="M221.09,64A157.09,157.09,0,1,0,378.18,221.09,157.1,157.1,0,0,0,221.09,64Z"
            style="fill:none;;stroke-miterlimit:10;stroke-width:32px" />
          <line
            x1="338.29"
            y1="338.29"
            x2="448"
            y2="448"
            style="fill:none;;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" />
        {/if}
      </svg>

    </div>
    <!-- / Search Button -->
    <!-- Menu Button -->
    <div title="Mostrar categorías y rubros">
      <svg
        on:click={() => {
          active = false;
          toggleMenu();
        }}
        id="iconClose"
        action="menu"
        class="btn-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="512"
        height="512"
        viewBox="0 0 512 512">
        <line
          x1="80"
          y1="146"
          x2="432"
          y2="146"
          style="fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" />
        <line
          x1="80"
          y1="256"
          x2="432"
          y2="256"
          style="fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" />
        <line
          x1="80"
          y1="366"
          x2="432"
          y2="366"
          style="fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" />
      </svg>
    </div>
    <!-- / Menu Button -->
  </div>

</nav>
