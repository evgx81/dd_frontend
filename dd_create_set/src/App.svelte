<script>
  import { fade } from "svelte/transition";
  import Popup from "./lib/Popup.svelte";
  import Header from "./lib/Header.svelte";
  import CreateSet from "./lib/CreateSet.svelte";
  import ProductCatalog from "./lib/ProductCatalog.svelte";
  import {
    cached_general_categories_products,
    chosen_set_type_id,
    chosen_slots,
    curr_chosen_slot_num,
    products,
    show_products_catalog,
    show_render_results_sliders,
    similar_product_sets,
  } from "./lib/stores";
  import VideoSlider from "./lib/VideoSlider.svelte";
  import Sequence360Slider from "./lib/Sequence360Slider.svelte";
  import Footer from "./lib/Footer.svelte";
  import MoreLikeThis from "./lib/MoreLikeThis.svelte";
  import MobilePreview from "./lib/MobilePreview.svelte";

  let popup_visible = true;
  let show_page = false;

  /**
   * Обработка события, отправляемого из компонента Popup, когда пользователь
   * выбирает тип сета
   * @param {object} event Событие, отправляемое компоненом
   */
  function handlePopupClick(event) {
    popup_visible = false;
    chosen_set_type_id.set(event.detail.set_type_id);
  }

  /** @type Promise<any> */
  let products_promise;

  /**
   * Идентификатор общей категории, выбранной пользователем
   * @type {string}
   */
  let general_category_id;

  /**
   * Наименование общей категории, выбранной пользователем
   * @type {string}
   */
  let general_category_name;

  function updateIsAddedToSet(products) {
    products.forEach((product) => {
      // Находим слот, на который кликнул пользователь
      let curr_clicked_slot = $chosen_slots.find(
        (slot) => slot.order_num === $curr_chosen_slot_num,
      );

      product.is_added_to_set = product.sku === curr_clicked_slot.sku;
    });

    return products;
  }

  /**
   * Получает все товары выбранной укрупненной категории
   * @param {string} general_category_id Идентификатор укрупненной категории
   */
  async function getProductsForCategory(general_category_id) {
    return fetch(
      "/products/products/products_catalog?" +
        new URLSearchParams({
          category__general_categories__id: general_category_id,
        }).toString(),
    )
      .then(async (r) => await r.json())
      .then((r) => {
        $products.data = [...r];

        // При первом получении товаров добавляем каждому товару свойство, что он не добавлен в сет
        $products.data.forEach((product) => {
          product.is_added_to_set = false;
        });

        // Запоминаем в кеш идентификатор укрупненной категории и соответсвущие ей товары
        $cached_general_categories_products.set(
          general_category_id,
          $products.data,
        );
      });

    // .then((r) => $products.data = [...$products.data, ...r]);

    // if (res.ok) {
    //   return await res.json();
    // } else {
    //   throw new Error("Products data fetch failed!");
    // }
  }

  let general_category_products;
  function setProductsCatalog(general_category_id) {
    // Получаем из кеша все товары текущей укрупненной категории
    general_category_products =
      $cached_general_categories_products.get(general_category_id);

    // Если в кеше есть товары укрупненной категории, то получаем их.
    // Иначе - делаем GET-запрос получения товаров по идентификатору укрупненной категории
    if (general_category_products !== undefined) {
      // Получаем из кеша товары, соответсвующие выбранной категории
      let curr_cached_products =
        $cached_general_categories_products.get(general_category_id);

      // Обновляем текущий каталог товаров, помечая товары, которые добавлены в сет
      $products.data = updateIsAddedToSet(curr_cached_products);
    } else {
      products_promise = getProductsForCategory(general_category_id);
    }
  }

  async function handleChosenSetComponent(event) {
    general_category_id = event.detail.general_category_id;
    general_category_name = event.detail.general_category_name;

    setProductsCatalog(event.detail.general_category_id);
  }
</script>

<main>
  {#if popup_visible}
    <div
      transition:fade={{ duration: 2000 }}
      on:outroend={() => (show_page = true)}
    >
      <Popup on:message={handlePopupClick} />
      <MobilePreview />
    </div>
  {/if}
  {#if show_page}
    <div
      class="section-wrapper"
      data-name="default-sections-parent"
      transition:fade={{ duration: 2000 }}
    >
      <Header />
      <CreateSet on:message={handleChosenSetComponent} />
    </div>

    {#if $show_products_catalog}
      {#if general_category_products !== undefined}
        <div transition:fade={{ duration: 500 }}>
          <ProductCatalog {general_category_name} />
        </div>
      {:else}
        {#await products_promise}
          <span>Waiting data...</span>
        {:then}
          <div transition:fade={{ duration: 2000 }}>
            <ProductCatalog {general_category_name} />
          </div>
        {/await}
      {/if}
    {/if}
<!-- 
    {#if $show_render_results_sliders}
      <div
        class="section-wrapper"
        data-name="default-sections-parent"
        transition:fade={{ duration: 2000 }}
      >
        <VideoSlider />
        <Sequence360Slider />
      </div>
      {#if $similar_product_sets.length > 0}
        <div
          class="section-wrapper-additional js--active"
          data-name="additional-sections-parent"
          transition:fade={{ duration: 2000 }}
        >
          <MoreLikeThis />
        </div>
      {/if}
    {/if} -->
    <!-- {#if $show_render_results_sliders} -->
      <div
        class={`section-wrapper ${$show_render_results_sliders ? "" : "js--hidden"}`}
        data-name="default-sections-parent"
      >
        <VideoSlider />
        <Sequence360Slider />
      </div>
      {#if $show_render_results_sliders && $similar_product_sets.length > 0}
        <div
          class="section-wrapper-additional js--active"
          data-name="additional-sections-parent"
          transition:fade={{ duration: 2000 }}
        >
          <MoreLikeThis />
        </div>
      {/if}
    <!-- {/if} -->

    <Footer />
    <MobilePreview />
  {/if}
</main>
