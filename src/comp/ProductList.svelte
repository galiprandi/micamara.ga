<script>
  export let PRODUCTS, PRODUCTS_SHOWED, QUERY, ONLINE;

  import Card from "./Card.svelte";
  let listType = "";
</script>

<style>
  section {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 3em;
    justify-items: center;
    padding: 1em 1em 10em 1em;
    background-color: rgba(0, 0, 0, 0.1);
  }

  @media screen and (min-width: 1000px) {
    section {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media screen and (min-width: 1500px) {
    section {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  /* Animation Styles */
  .loading {
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    grid-column: 1 / -1;
  }
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ellipsis div {
    position: absolute;
    top: 33px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    background: var(--color-2);
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
</style>

<section>
  {#if PRODUCTS_SHOWED}
    {#each PRODUCTS_SHOWED as item}
      <Card {item} {ONLINE} bind:QUERY />
    {/each}
  {:else}
    <!-- Loading spiner -->
    <div class="loading">
      <div class="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
    <!-- Loading spiner -->
  {/if}
</section>
