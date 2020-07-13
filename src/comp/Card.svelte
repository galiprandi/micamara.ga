<script>
  const imgPath = "/products_images/";

  let active = false;

  const isShare = navigator.share;

  export let QUERY, ONLINE, item;

  function cardClick(id) {
    const card = document.getElementById(id);
    if (location.hash) {
      location.hash = "";
      card.classList.remove("active");
      return;
    }

    const name = card.dataset.name;
    if (name) location.hash = name;
    card.classList.toggle("active");
  }

  function copyItemToClip(e) {
    const el = e.target;
    let text = el.previousElementSibling.textContent + " " + el.textContent;
    const q = new RegExp(/()( 12.*)/);
    text = text.replace(q, "");
    copyToClipboard(text);
  }

  function copyToClipboard(text) {
    let el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
</script>

<style>
  .card {
    height: min-content;
    border-radius: 2px;
    padding: 0.5rem;
    background-color: white;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .card-image {
    display: flex;
    place-content: center;
  }
  .card-image img {
    width: 95%;
    max-width: 500px;
    height: auto;
  }

  .card-body {
    font-size: 14px;
    line-height: 1.5rem;
    text-align: center;
  }

  .card-body > * {
    margin-top: 1rem;
  }

  .card-body h1 {
    font-size: 1.2rem;
    line-height: 1.2rem;
  }
  .card-body h1 > span {
    margin-left: 0.5rem;
    font-size: 14px;
  }
  .card-flag {
    display: block;
    text-transform: uppercase;
    color: var(--color-2);
    font-weight: 500;
  }
  .outline {
    all: unset;
    margin: 0 0.5rem;
  }

  .outline:hover {
    color: var(--Color-3);
  }
  .btn-icon.share {
    stroke: var(--color-2);
    /* margin: auto; */
    width: 25px;
    height: 25px;
  }
  .btn-icon.share:hover {
    stroke: var(--Color-3);
  }
  .card-description {
    display: none;
    padding: 1rem 0 5rem 0;
  }

  /* ============== .acive ======================= */
  .card.active {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    box-shadow: none;
    bottom: 0;
    overflow: auto;
    border-top: 1rem solid var(--color-1);
  }
  .card.active .outline {
    display: none;
  }
  .card.active .card-description {
    display: block;
  }
</style>

<div
  on:click={(e) => cardClick(item.id)}
  class="card"
  class:outStock={item.stock < 1}
  class:active
  data-name={item.name.replace(/( )/g, '_')}
  title="Click para ampliar o cerrar"
  id={item.id}>
  <div class="card-image">
    {#if item.image}
      <img
        src={imgPath + item.image}
        alt={item.name}
        loading="lazy"
        class="image" />
    {:else}
      <img
        src="//micamara.ga/images/no-image.png"
        alt={item.name}
        loading="lazy"
        class="image" />
    {/if}
  </div>
  <div class="card-body">
    <h1 class="card-title">{item.name}</h1>
    {#if ONLINE}
      <h1
        class="card-price"
        on:click|stopPropagation={(e) => copyItemToClip(e)}>
        {item.price}
        {#if item.feeValue}
          <span class="fee">{item.feeAmount} cuotas de {item.feeValue}</span>
        {/if}
      </h1>
    {/if}
    {#if item.stock > 0}
      <span class="card-flag in-stock">entrega inmediata</span>
    {/if}
    <button
      on:click|stopPropagation={() => (QUERY = item.brand)}
      class="outline">
      {item.brand}
    </button>
    <button
      on:click|stopPropagation={() => (QUERY = item.productType)}
      class="outline">
      {item.productType}
    </button>
    <div class="card-description">
      {@html item.description}
    </div>
  </div>
</div>
