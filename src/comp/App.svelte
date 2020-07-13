<script context="module">
  export function saveSearch(str) {
    let store = getFromLocal("lastSearch");
    if (!store) store = [];
    store = [...new Set([str, ...store])].slice(0, 7);
    setToLocal("lastSearch", store);
  }
</script>

<script>
  console.clear();
  import { sortObjetcByKey } from "../js/t&u";
  import { onMount } from "svelte";

  // Components imports
  import Header from "./Header.svelte";
  import ProductList from "./ProductList.svelte";
  import Footer from "./Footer.svelte";
  import Aside from "./Aside.svelte";
  import Icon from "./Icons.svelte";

  let QUERY,
    PRODUCTS,
    PRODUCTS_SHOWED,
    LAST_SEARCH,
    CATEGORIES,
    PRODUCTS_TYPES,
    BRANDS,
    ONLINE = false;

  const limitOfResultToShow = 100;
  const urlOfData =
    "https://spreadsheets.google.com/feeds/list/1FjerBKgvNepZfQkPaUbd9DMy5-SMr-XxEKeNsZhcPM4/od6/public/values?alt=json";

  // $: $Query, $Products, searchOnList();

  $: QUERY, searchOnList();

  onMount(async () => {
    try {
      // FROM LOCAL
      QUERY = getFromLocal("Query");
      PRODUCTS = getFromLocal("Products");
      CATEGORIES = getFromLocal("Categories");
      PRODUCTS_TYPES = getFromLocal("ProductsTypes");
      BRANDS = getFromLocal("Brands");
      if (location.hash)
        QUERY = decodeURI(location.hash.replace(/(_)/g, " ").slice(1));

      // FROM NETWORK
      PRODUCTS = await updateProducts();
      searchOnList();
    } catch (error) {
      console.error(error);
    }
  });

  // ------------------------------------
  // Update list of product from source
  // ------------------------------------
  async function updateProducts() {
    try {
      const data = await fechingData(urlOfData);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  // ------------------------------------
  // Search $Query on list to be displayed
  // ------------------------------------
  function searchOnList(str = QUERY) {
    if (!PRODUCTS) return;
    let results;
    if (!!str) {
      location.hash = str.replace(/( )/g, "_");

      // Search products by str
      str = str.trim();
      setToLocal("Query", str);
      results = PRODUCTS.filter((item) => {
        let regEx = "";
        try {
          regEx = new RegExp(str, "gi");
        } catch (error) {
          // console.error(error);
          return false;
        }
        return (
          item.name.match(regEx) ||
          item.brand.match(regEx) ||
          item.categorie.match(regEx) ||
          item.productType.match(regEx)
        );
      });
    }

    // Show shuffle default results
    else results = PRODUCTS.sort(() => Math.random() - 0.5);
    results = sortObjetcByKey(results, "name"); // Order results
    results = results.slice(0, limitOfResultToShow); // Cut results to limit
    PRODUCTS_SHOWED = results;
    LAST_SEARCH = getFromLocal("lastSearch");
  }

  // ------------------------------------
  // Get JSON from Google
  // ------------------------------------
  async function fechingData(url) {
    console.time("Fething data from database");
    try {
      const response = await fetch(url);
      const data = await response.json();
      return parseData(data.feed.entry);
      console.timeEnd("Fething data from database");
    } catch (error) {
      console.error(error);
    }
  }

  // ------------------------------------
  // Prepare and filter data
  // ------------------------------------
  function parseData(data) {
    let categories = [];
    let productsTypes = [];
    let brands = [];
    let results = data.reduce((accu, item, i) => {
      // Verifica Stock, Activo, Web
      if (
        item.gsx$act.$t !== "*" ||
        item.gsx$web.$t !== "*" ||
        item.gsx$stock.$t == ""
      )
        return accu;

      const id = i;
      let {
        gsx$producto: { $t: name },
        gsx$pvp: { $t: price },
        gsx$fin: { $t: feeAmount },
        gsx$cuotas: { $t: feeValue },
        gsx$stock: { $t: stock },
        gsx$d: { $t: ofert },
        gsx$categoria: { $t: categorie },
        gsx$rubro: { $t: productType },
        gsx$marca: { $t: brand },
        gsx$gtia: { $t: warranty },
        gsx$desc: { $t: description },
        gsx$img: { $t: image },
        gsx$act: { $t: active },
        gsx$web: { $t: activeForWeb },
        id: { $t: link },
        updated: { $t: updated },
      } = item;

      ofert = !!ofert;
      active = !!active;
      activeForWeb = !!activeForWeb;
      const toAdd = {
        id,
        active,
        activeForWeb,
        name,
        price,
        feeAmount,
        feeValue,
        stock,
        ofert,
        categorie,
        productType,
        brand,
        warranty,
        description,
        image,
        link,
        updated,
      };

      accu = [...accu, toAdd];
      categories = [...categories, categorie.capitalize()];
      productsTypes = [...productsTypes, productType.capitalize()];
      brands = [...brands, brand.capitalize()];
      return accu;
    }, []); // Reduce

    ONLINE = true;

    CATEGORIES = [...new Set(categories)].sort();
    setToLocal("Categories", CATEGORIES);

    PRODUCTS_TYPES = [...new Set(productsTypes)].sort();
    setToLocal("ProductsTypes", PRODUCTS_TYPES);

    BRANDS = [...new Set(brands)].sort();
    setToLocal("Brands", BRANDS);

    results = [...sortObjetcByKey(results, "name")];
    setToLocal("Products", results);
    return results;
  }

  function setToLocal(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }

  function getFromLocal(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * * Capitalize the first letter of each word of a given string
   * * Usage: 'capItalezE aLl fIrSt leTTers'.capitalize()
   */
  String.prototype.capitalize = function () {
    try {
      return this.split(" ")
        .filter((value) => value)
        .reduce(
          (text, word) =>
            text + " " + word[0].toUpperCase() + word.substr(1).toLowerCase(),
          ""
        ); // Reduce
    } catch (error) {
      console.info(`Error: '${this}'.capitalize()'`);
      return this;
    }
  };
</script>

<style>
  main {
    height: 100vh;
    color: var(--color-5);
    font-size: 1em;
  }
  .noProducts {
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .noProducts h2 {
    font-size: 1.5rem;
  }
</style>

<main>
  <Header />

  <!-- {#if (location.host = '0.0.0.0:8080')}
    <Icon iconName="close" title="Click" stroke="orangered" fill="orangered" />
  {/if} -->

  {#if PRODUCTS_SHOWED}
    {#if PRODUCTS_SHOWED.length}
      <ProductList {PRODUCTS} {PRODUCTS_SHOWED} {ONLINE} bind:QUERY />
    {:else}
      <div class="noProducts">
        <h2>No hay productos con esa descripción :(</h2>
      </div>
    {/if}
    <Aside {PRODUCTS_TYPES} {BRANDS} bind:QUERY />
    <Footer bind:QUERY bind:LAST_SEARCH />
  {/if}
</main>
