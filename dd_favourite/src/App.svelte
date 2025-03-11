<script>
  import { onMount } from "svelte";
  import {
    favourite_sets,
    getCookie,
    is_search_results_page,
    search_results_sets,
    sets_filtered,
  } from "./lib/stores";
  import Header from "./lib/Header.svelte";
  import Footer from "./lib/Footer.svelte";
  import FavouriteSetsCatalog from "./lib/ProductSetsCatalog.svelte";
  import MobilePreview from "./lib/MobilePreview.svelte";
  import ButtonTop from "./lib/ButtonTop.svelte";
  import LoadingData from "./lib/LoadingData.svelte";

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

    const data = await resp_favourite_sets.json();

    favourite_sets.set(data);

    // Помечаем, что каждый сет лайкнут пользователем
    $favourite_sets.forEach((product_set) => {
      product_set.is_liked = true;
    });
  }

  async function getSearchResultsData() {
    const resp_search_results_sets = await fetch(
      `/products/product_sets/search_results${location.search}`,
    );

    if (!resp_search_results_sets.ok) {
      throw new Error(`Error: ${resp_search_results_sets.status}`);
    }

    const data = await resp_search_results_sets.json();

    search_results_sets.set(data);
  }

  let favourite_product_sets_promise;

  let search_results_promise;

  /**
   * Определяет, нужно ли показывать кнопку "Вверх"
   * @type {boolean}
   */
  let show_top_button = false;

  onMount(async () => {
    // Отображаем кнопку "Вверх" при прокрутке страницы
    window.onscroll = () => {
      show_top_button = window.scrollY !== 0;
    };

    // Проверяем, является ли страница на которую перешел пользователь страницей результатов глобального поиска сетов
    $is_search_results_page = location.pathname.includes("/search_results");
    if ($is_search_results_page) {
      search_results_promise = getSearchResultsData();
    } else {
      favourite_product_sets_promise = getFavouriteSetsData();
    }
  });
</script>

<main>
  <Header />

  {#if show_top_button}
    <ButtonTop />
  {/if}

  <div class="section-wrapper" data-name="default-search-section">
    {#if $is_search_results_page}
      {#await search_results_promise}
        <!-- <span>Waiting data...</span> -->
        <LoadingData />
      {:then}
        <section class="section section-quote section-quote--sm">
          <div class="section-quote__text section-quote__text--sm">
            {#if $search_results_sets.length === 0}
              Oops... we didn't find anything
            {:else}
              Here are the search results
            {/if}
          </div>
        </section>

        <FavouriteSetsCatalog />
      {/await}
    {:else}
      {#await favourite_product_sets_promise}
        <!-- <span>Waiting data...</span> -->
        <LoadingData />
      {:then}
        <section class="section section-quote section-quote--sm">
          <div class="section-quote__text section-quote__text--sm">
            {#if $favourite_sets.filter((set) => set.is_liked).length === 0}
              You have no favorite sets
            {:else if $sets_filtered.filter((set) => set.is_liked).length === 0}
              Oops... we didn't find anything
            {:else}
              Here are the sets that you have marked <br />as favorites or
              created yourself
            {/if}
          </div>
        </section>
        <FavouriteSetsCatalog />
      {/await}
    {/if}
  </div>
  <Footer />
  <MobilePreview />
</main>
