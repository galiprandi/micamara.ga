<script>
  export let QUERY, LAST_SEARCH, showProductOnStock, isOpenMenu;

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
  let action = "share";

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
      action = "share";
      active = !active;
      if (active) isOpenMenu = false;
    }
  }
</script>

<style>
  nav {
    background-color: var(--color-1);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    /* color: var(--color-2); */
    padding: 1rem;
    text-transform: capitalize;
  }
  .fixedIcons {
    display: flex;
    justify-content: space-around;
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
  a {
    text-decoration: none;
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
      <i
        on:click|capture={btnShare}
        title="Compartir"
        action="share"
        class="material-icons btn-icon">
        {#if active && action === 'share'}close{:else}share{/if}
      </i>
    </div>
    <!-- / Share Button -->
    <!-- Call Button -->
    <div>
      <a href="tel:+5493815900868" title="Llamar">
        <i class="material-icons btn-icon">phone</i>
      </a>
    </div>
    <!-- / Call Button -->
    <!-- Messenger Button -->
    <div>
      <a
        href="https://m.me/100010196598541"
        target="_blank"
        rel="noopener"
        title="Chatear">
        <i class="material-icons btn-icon">chat</i>
      </a>
    </div>
    <!-- / Messenger Button -->
    <!-- Search Button -->
    <div>
      <i
        on:click={() => {
          active = !active;
          if (active) isOpenMenu = false;
          action = 'search';
        }}
        title="Buscar"
        class="material-icons btn-icon">
        {#if active && action === 'search'}close{:else}search{/if}
      </i>
    </div>
    <!-- / Search Button -->

    <!-- Filter: Show products on stock -->
    <div>
      <i
        on:click={() => (showProductOnStock = !showProductOnStock)}
        class="material-icons btn-icon"
        title="Todos los productos">
        {#if showProductOnStock}visibility_off{:else}visibility{/if}
      </i>
    </div>
    <!-- / Filter: Show products on stock -->

    <!-- Menu Button -->
    <div>
      <i
        on:click={() => {
          isOpenMenu = !isOpenMenu;
          if (isOpenMenu) active = false;
        }}
        title="Menú"
        class="material-icons btn-icon">
        {#if isOpenMenu}close{:else}menu{/if}
      </i>
    </div>
    <!-- / Menu Button -->
  </div>

</nav>
