import { writable } from "svelte/store";

// export const productCatalg = writable([]);

let Query = writable("");
let Products = writable(false);
let showProducts = writable(false);
let ProductsTypes = writable(false);
let Categories = writable(false);
let Brands = writable(false);
let Menu = writable(false);
let Config = writable({});

export {
  Config,
  Query,
  showProducts,
  Products,
  ProductsTypes,
  Categories,
  Brands,
  Menu,
};
