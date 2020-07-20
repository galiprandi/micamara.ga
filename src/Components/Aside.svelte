<script>
  import App, { saveSearch } from "./App.svelte";

  export let PRODUCTS_TYPES, BRANDS, QUERY, isOpenMenu;

  $: if (isOpenMenu) openMenu();
  else closeMenu();

  function openMenu() {
    if (document.getElementById("asideMenu")) {
      isOpenMenu = true;
      document.getElementById("asideMenu").classList.add("active");
    }
  }

  function closeMenu() {
    if (document.getElementById("asideMenu")) {
      isOpenMenu = false;
      document.getElementById("asideMenu").classList.remove("active");
    }
  }

  function newSearch(query) {
    QUERY = query.trim();
    saveSearch(query);
    closeMenu();
  }
</script>

<style>
  aside {
    position: fixed;
    right: -100%;
    top: 0;
    bottom: 0;
    width: 300px;
    background-color: var(--color-2);
    color: var(--color-4);
    line-height: 2.5;
    text-align: right;
    overflow: scroll;
    box-shadow: -1px 0 5px 1px rgba(10, 10, 10, 0.6);
    transition: 0.4s all cubic-bezier(1, 0, 0, 1);
  }

  aside.isOpenMenu {
    right: 0;
  }

  aside nav label {
    display: inline-block;
    padding: 0 15px;
  }
  ul {
    display: block;
    margin-bottom: 100px;
  }
  li {
    display: block;
    /* padding: 0 15px 0 40px; */
    cursor: pointer;
    margin: 0 1rem;
  }
  li:hover {
    color: var(--color-2);
    background: var(--color-1);
  }
  label {
    opacity: 0.7;
    background: var(--color-4);
    color: var(--color-5);
    cursor: pointer;
  }

  nav .inputs,
  nav .content {
    display: none;
  }
  nav #op-1:checked ~ section .content-1,
  nav #op-2:checked ~ section .content-2 {
    display: block;
  }
  .inputs:checked + label {
    opacity: 1;
    color: var(--color-1);
  }
  .inputs:checked + label,
  section > div {
    background: var(--color-2);
  }
</style>

<!-- <script context="module">
  let active = false;
  export const iconClose = `<title>Cerrar Menú</title>
              <line x1="430" y1="430" x2="144" y2="144" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="430" y1="144" x2="144" y2="430" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>`;

  const iconMenu = `<title>Mostrar categorías y rubros</title>
              <line x1="80" y1="146" x2="432" y2="146" style="fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px"/>
              <line x1="80" y1="256" x2="432" y2="256" style="fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px"/>
              <line x1="80" y1="366" x2="432" y2="366" style="fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px"/>`;

  export function toggleMenu() {
    active ? closeMenu() : openMenu();
  }
  export function openMenu() {
    active = true;
    document.getElementById("asideMenu").classList.add("active");
    //document.getElementById("iconClose").innerHTML = iconClose;
  }
  export function closeMenu() {
    active = false;
    document.getElementById("asideMenu").classList.remove("active");
    // document.getElementById("iconClose").innerHTML = iconMenu;
  }
</script> -->

<aside class="asideMenu" class:isOpenMenu id="asideMenu">
  <nav>
    <input class="inputs" checked type="radio" name="opt" id="op-1" />
    <label for="op-1">Rubros</label>
    <input class="inputs" type="radio" name="opt" id="op-2" />
    <label for="op-2">Marcas</label>
    <section>
      <div class="content content-1">
        <ul>
          {#if PRODUCTS_TYPES}
            {#each PRODUCTS_TYPES as item, i}
              <li on:click={() => newSearch(item)}>{item}</li>
            {/each}
          {/if}
        </ul>
      </div>
      <div class="content content-2">
        <ul>
          {#if BRANDS}
            {#each BRANDS as item, i}
              <li id={i} on:click={() => newSearch(item)}>{item}</li>
            {/each}
          {/if}
        </ul>
      </div>
    </section>
  </nav>
</aside>
