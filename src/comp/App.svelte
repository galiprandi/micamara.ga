<script>
  console.clear();
  import { sortObjetcByKey } from "../js/t&u";
  import { onMount } from "svelte";
  import {
    Query,
    showProducts,
    Products,
    ProductsTypes,
    Categories,
    Brands,
    Menu,
  } from "../js/stores.js";

  // Components imports
  import Header from "./Header.svelte";
  import ProductList from "./ProductList.svelte";
  import Footer from "./Footer.svelte";
  import Aside from "./Aside.svelte";

  const limitOfResultToShow = 100;
  const urlOfData =
    "https://spreadsheets.google.com/feeds/list/1FjerBKgvNepZfQkPaUbd9DMy5-SMr-XxEKeNsZhcPM4/od6/public/values?alt=json";

  $: $Query, $Products, searchOnList();

  onMount(async () => {
    $Products = await updateProducts();
  });

  // ------------------------------------
  // Update list of product from source
  // ------------------------------------
  async function updateProducts() {
    try {
      const data = await fechingData(urlOfData);
      const dataparse = await parseData(data);
      return dataparse;
    } catch (error) {
      console.error(error);
    }
  }
  // ------------------------------------
  // Search $Query on list to be displayed
  // ------------------------------------
  function searchOnList() {
    if (!$Products) return;
    let results;
    // Search products match
    if (!!$Query) {
      results = $Products.filter((item) => {
        const regEx = new RegExp($Query, "gi");
        return (
          item.name.match(regEx) ||
          item.brand.match(regEx) ||
          item.categorie.match(regEx) ||
          item.productType.match(regEx)
        );
      });
      // Show shuffle default results
    } else results = $Products.sort(() => Math.random() - 0.5);
    results = sortObjetcByKey(results, "name"); // Order results
    results = results.slice(0, limitOfResultToShow); // Cut results
    $showProducts = results;
    console.info(`Listing: ${$showProducts.length}  products.`);
  }

  // ------------------------------------
  // Get JSON from Google
  // ------------------------------------
  async function fechingData(url) {
    console.time("Fething data time: ");
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.timeEnd("Fething data time: ");
      return data.feed.entry;
    } catch (error) {
      console.error(error);
    }
  }

  // ------------------------------------
  // Prepare and filter data
  // ------------------------------------
  async function parseData(data) {
    let categories = [];
    let productsTypes = [];
    let brands = [];
    let results = data.reduce((accu, item, i) => {
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
      if (active && activeForWeb && stock.trim() !== "") {
        accu.push(toAdd);
        categories.push(categorie);
        productsTypes.push(productType);
        brands.push(brand);
      }
      return accu;
    }, []); // Reduce

    $Categories = [...new Set(categories)].sort();

    $ProductsTypes = [...new Set(productsTypes)].sort();

    $Brands = [...new Set(brands)].sort();

    return (results = sortObjetcByKey(results, "name"));
  }
</script>

<style>
  /* @import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap"); */
  main {
    /* font-family: "Montserrat", sans-serif; */
    height: 100vh;
    color: var(--color-5);
    font-size: 1em;
  }
</style>

<main>
  <Header />
  <ProductList />
  {#if $showProducts}
    <Aside active="false" />
    <Footer />
  {/if}
</main>
