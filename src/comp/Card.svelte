<script>
  import { Query } from "../js/stores.js";

  export let item;
  let modal = false;

  const imgPath = "/products_images/";

  function cardClick() {
    const cant = document.querySelectorAll(".modal").length;
    if (cant) {
      let el = document.querySelectorAll(".modal");
      el = [...el];
      el.filter((el) => el.classList.remove("modal"));
      modal = false;
    } else modal = true;
  }
</script>

<style>
  /* |||||||| DEFAULT ||||||||||||||||| */
  article {
    display: flex;
    box-shadow: 0 2px 3px 2px rgba(10, 10, 10, 0.4);
    border-radius: 4px;
    width: 100%;
    max-width: 400px;
  }
  .image,
  .image img {
    width: 120px;
    height: 120px;
  }
  .image img {
    padding: 7px;
  }
  .aditional {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-start;
    padding: 7px;
  }
  .aditional button {
    color: var(--dark);
  }
  .name {
    font-size: 16px;
  }
  button {
    font-family: inherit;
    border: 0;
    padding: 0;
    margin-right: 10px;
    font-size: 80%;
    color: var(--color1);
    background: inherit;
    cursor: pointer;
  }
  button:hover {
    color: var(--color4);
  }
  .details {
    display: none;
  }
  .price {
    font-size: 22px;
  }
  .dues {
    font-size: 11px;
  }
  .flag {
    text-transform: uppercase;
    font-size: 80%;
    padding: 1px 4px;
    border-radius: 2px;
    color: var(--primary);
    font-weight: 600;
  }

  /* |||||||| MODAL ||||||||||||||||| */
  article.modal {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: white;
    z-index: 1;
    border: 1em solid var(--color5);
    box-shadow: 5px 5px 15px 10000px rgba(0, 0, 0, 0.6);
    border-radius: 7px;
    text-align: center;
    overflow: auto;
    margin: 1.5em auto;
  }
  article.modal:hover {
    color: inherit;
  }
  article.modal .image,
  article.modal .image img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 500px;
  }
  article.modal .aditional {
    flex-flow: column;
    align-items: center;
  }

  article.modal .name,
  article.modal .price {
    font-size: 22px;
    margin: 15px 8px;
  }
  article.modal .brand,
  article.modal .productType {
    display: none;
  }

  article.modal .dues {
    display: block;
    padding: 7px;
  }
  article.modal .flag {
    display: block;
    font-size: 14px;
    margin: 10px 0;
  }

  article.modal .details {
    display: block;
    padding: 10px;
    font-size: 14px;
    opacity: 0.8;
  }

  @media screen and (min-width: 650px) {
    article.modal {
      margin: 2em auto;
    }
  }
</style>

<article
  on:click|stopPropagation={cardClick}
  class:modal
  class="card"
  id="car-{item.id}">
  <div class="image">
    {#if item.image}
      <img src={imgPath + item.image} title="Click para ampliar" alt="" />
    {:else}
      <img
        src="//imgs.micamara.ga/gadget/no-image.png"
        title="Click para ampliar"
        alt="" />
    {/if}
  </div>
  <section class="aditional">
    <h1 class="name">{item.name}</h1>
    <div>
      <button
        on:click|stopPropagation={() => {
          $Query = item.brand;
        }}
        class="brand">
        {item.brand}
      </button>
      <button
        on:click|stopPropagation={() => {
          $Query = item.productType;
        }}
        class="productType">
        {item.productType}
      </button>
    </div>
    <div>
      <span class="price">{item.price}</span>
      {#if item.feeValue}
        <span class="dues">{item.feeAmount} cuotas de {item.feeValue}</span>
      {/if}
    </div>
    {#if item.stock > 0}
      <span class="flag">ENTREGA INMEDIATA</span>
    {:else}
      <button
        on:click|stopPropagation={(e) => window.open('https://m.me/100010196598541')}>
        CONSULTAR DIPONIBILIDAD
      </button>
    {/if}

  </section>
  <section class="details">
    {@html item.description}
  </section>
</article>
