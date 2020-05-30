/**
 * * Sort Object by Key
 *
 * @param {object} ObjectsToSort Object than contain data to sort
 * @param {string} KeyToSearch Key to sort data
 *
 * TODO: More Robust Validation
 */
export function sortObjetcByKey(ObjectsToSort, KeyToSearch) {
  if (Array.isArray(ObjectsToSort) && KeyToSearch) {
    const OrderObj = ObjectsToSort.sort((a, b) =>
      a[KeyToSearch].toLowerCase().trim() > b[KeyToSearch].toLowerCase().trim()
        ? 1
        : -1
    );
    return OrderObj;
  } else return false;
}

/**
 * * Generate tree of Categories and Sub
 *  TODO: Robust Validation
 * @param {Array} productList Array of de products
 */
export function generateTreeFromProducts(productList) {
  productList = productList || false;
  const results = productList.reduce((accu, item) => {
    const el = [item.categorie, item.productType];
    accu[el[0]] = accu[el[0]] || [];
    accu[el[0]].push(el[1]);
    accu[el[0]] = [...new Set(accu[el[0]])].sort();
    return accu;
  }, {});
  console.log("generateUlTreeFromProductsList -> results", results);
}
