<script>
  import { afterUpdate, onMount } from "svelte";
  import { favourite_sets, getCookie } from "./lib/store";
  import Header from "./lib/Header.svelte";
  import Footer from "./lib/Footer.svelte";
  import FavouriteSetsCatalog from "./lib/FavouriteSetsCatalog.svelte";
  import MobilePreview from "./lib/MobilePreview.svelte";

  async function getFavouriteSetsData() {
    // Получаем значение токена из куки, если его нет, то не получаем данные пользователя
    let token = getCookie("token");

    const resp_favourite_sets = await fetch(
      "/products/product_sets/favourite/",
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );

    if (!resp_favourite_sets.ok) {
      throw new Error(`Error: ${resp_favourite_sets.status}`);
    }

    if (resp_favourite_sets.status == 200) {
      const data = await resp_favourite_sets.json();

      favourite_sets.set(data);
    }
  }

  let favourite_product_sets_promise;

  onMount(async () => {
    favourite_product_sets_promise = getFavouriteSetsData();
  });

  afterUpdate(() => {
    console.log($favourite_sets.every((set) => set.is_liked === false));
  });
</script>

<!-- <main>
  <div class="section-wrapper" data-nmae="default-search-section">
    <section class="section section-quote section-quote--sm">
      <div class="section-quote__text section-quote__text--sm">
        Here are the sets that you have marked <br />as favorites or created
        yourself
      </div>
    </section>
    
  </div>
  <section
    class="section section-quote section--hidden section-search"
    data-nmae="result-search-section"
  >
    <div class="section-quote__text">Oops... we didn't find anything</div>
  </section> 
</main> -->

<main>
  <Header />

  {#await favourite_product_sets_promise}
    <span>Waiting data...</span>
  {:then}
    {#if $favourite_sets.every((set) => set.is_liked === false) || $favourite_sets.length === 0}
      <section
        class="section section-quote section-search"
        data-nmae="result-search-section"
      >
        <div class="section-quote__text">Oops... we didn't find anything</div>
      </section>
    {:else}
      <div class="section-wrapper" data-name="default-search-section">
        <section class="section section-quote section-quote--sm">
          <div class="section-quote__text section-quote__text--sm">
            Here are the sets that you have marked <br />as favorites or created
            yourself
          </div>
        </section>
        <FavouriteSetsCatalog />
      </div>
    {/if}
  {/await}

  <Footer />
  <MobilePreview />
</main>
