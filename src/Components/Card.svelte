<script>
  const imgPath = "/products_images/";

  let active = false;

  const isShare = navigator.share;

  export let QUERY, ONLINE, item;

  // Open / Close Card
  function clickOnCard() {
    const className = "active";
    if (this.classList.contains(className)) {
      this.classList.remove(className);
      location.hash = QUERY.replace(/( )/g, "_");
    } else {
      location.hash = this.dataset.name.replace(/( )/g, "_");
      this.classList.add(className);
    }
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
    width: 100%;
    max-width: 500px;
    height: 100%;
    padding: 1em;
  }

  .card-body {
    font-size: 14px;
    line-height: 1.5rem;
    text-align: center;
  }

  .card-body > * {
    margin-top: 1rem;
  }

  .card-body .card-price {
    display: inline;
    font-size: 1.2rem;
    line-height: 1.2rem;
  }

  .card-body .feeds {
    outline: 0;
    border: 0;
    padding-right: 5px;
    font-size: 14px;
    font-family: inherit;
    background-color: inherit;
  }

  .card-body .card-flag {
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
    color: var(--color-3);
  }
  .card-description {
    display: none;
    padding: 1rem 0 5rem 0;
  }

  /* ============== .acive ======================= */
  .card.active {
    position: fixed;
    max-height: 100vh;
    width: 100%;
    height: 100vh;
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
    display: block;
    max-width: 80ch;
    margin: auto;
  }
</style>

<!-- on:click={(e) => cardClick(item.id)} -->
<div
  on:click={clickOnCard}
  class="card"
  class:outStock={item.stock < 1}
  class:active
  data-name={item.name}
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
        src="site/images/no-image.png"
        alt={item.name}
        loading="lazy"
        class="image" />
    {/if}
  </div>
  <div class="card-body">
    <h1 class="card-title">{item.name}</h1>
    {#if ONLINE}
      <div>
        <h1
          class="card-price"
          on:click|stopPropagation={() => window.copyToClipboard(`${item.name} ${item.price}`)}>
          {item.price}
        </h1>
        <!-- Credit Card -->
        {#if item.feeValue}
          <!-- <span class="fee">{item.feeAmount} cuotas de {item.feeValue}</span> -->
          <select
            on:blur|stopPropagation={() => window.copyToClipboard(`${item.name}    ${item.price}\n💳  ` + item.feeValue.join('\n💳  '))}
            name="feeds"
            id="feeds"
            class="feeds">
            {#each item.feeValue as item}
              <option value={item} selected>{item}</option>
            {/each}
          </select>
        {/if}
      </div>
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
