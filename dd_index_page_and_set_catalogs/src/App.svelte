<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import SetWithVideoSection from "./lib/SetWithVideoSection.svelte";
  import {
    getCookie,
    // sets_with_images,
    // sets_with_videos,
    getUserNumberFavouriteSets,
    is_index_page,
    catalog_title,
    product_sets,
  } from "./lib/stores";
  import Header from "./lib/Header.svelte";
  import Footer from "./lib/Footer.svelte";
  import SetWithImagesSection from "./lib/SetWithImagesSection.svelte";
  import MobilePreview from "./lib/MobilePreview.svelte";
  import ButtonTop from "./lib/ButtonTop.svelte";
    import LoadingData from "./lib/LoadingData.svelte";

  /**
   * Обработка события, когда пользователь нажимает на лайк у сета
   */
  async function handleLikeClick(event) {
    // Получаем значение токена пользователя из куки
    let token = getCookie("token");

    // Идентификатор сета, на котором кликнули кнопку "Лайк"
    let set_id = event.detail.set_id;

    // Показывает, активирована ли кнопка "Лайк" на сете
    let is_set_liked = event.detail.is_set_liked;

    // Определяем тип сета, который получили (если значение 1, то сет с изображениями, иначе - сет с видео)
    // let is_set_with_images = event.detail.is_set_with_images;

    if (is_set_liked === false) {
      const resp = await fetch(
        "/products/product_sets/preference/set_like?" +
          new URLSearchParams({ set_id: set_id }).toString(),
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!resp.ok) {
        throw new Error(`Error: ${resp.status}`);
      }

      // Если удалось поставить лайк, то в зависимости от вида полученного сета, ищем в выбранный сет по идентификатору и меняем значение поля "is_liked"
      if (resp.status == 201) {
        // let curr_chosen_set = is_set_with_images
        //   ? $sets_with_images.find((set) => set.id === set_id)
        //   : $sets_with_videos.find((set) => set.id === set_id);
        let curr_chosen_set = $product_sets.find((set) => set.id === set_id);
        curr_chosen_set.is_liked = true;
      }
    } else {
      const resp = await fetch(
        "/products/product_sets/preference/unset_like?" +
          new URLSearchParams({ set_id: set_id }).toString(),
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!resp.ok) {
        throw new Error(`Error: ${resp.status}`);
      }

      // Если удалось убрать лайк, то в зависимости от вида полученного сета, ищем в выбранный сет по идентификатору и меняем значение поля "is_liked"
      if (resp.status == 204) {
        // let curr_chosen_set = is_set_with_images
        //   ? $sets_with_images.find((set) => set.id === set_id)
        //   : $sets_with_videos.find((set) => set.id === set_id);

        let curr_chosen_set = $product_sets.find((set) => set.id === set_id);
        curr_chosen_set.is_liked = false;
      }
    }

    product_sets.set($product_sets);

    // if (is_set_with_images) {
    //   $sets_with_images = [...$sets_with_images];
    // } else {
    //   $sets_with_videos = [...$sets_with_videos];
    // }

    // console.log($sets_with_images);

    // Получаем обновленное количество лайкнутых сетов
    await getUserNumberFavouriteSets(token);
  }

  async function getCatalogTitleData(set_type_id) {
    const resp_videos = await fetch(
      "/products/product_sets/catalog_title?" +
        new URLSearchParams({ set_type_id: set_type_id }).toString(),
    );

    if (!resp_videos.ok) {
      throw new Error(`Error: ${resp_videos.status}`);
    }

    if (resp_videos.status == 200) {
      const data = await resp_videos.json();

      catalog_title.set(data);
    }

    console.log($catalog_title);
  }

  // async function getProductSetsWithVideoData(set_type_id) {
  //   let videos_url = $is_index_page
  //     ? "/products/product_sets/sets_with_video/"
  //     : "/products/product_sets/sets_with_video?" +
  //       new URLSearchParams({ set_type_id: set_type_id }).toString();

  //   const resp_videos = await fetch(videos_url);

  //   if (!resp_videos.ok) {
  //     throw new Error(`Error: ${resp_videos.status}`);
  //   }

  //   if (resp_videos.status == 200) {
  //     const data = await resp_videos.json();
  //     sets_with_videos.set(data);
  //   }

  //   console.log($sets_with_videos);
  // }

  // async function getProductSetsWithImagesData(set_type_id) {
  //   let images_url = $is_index_page
  //     ? "/products/product_sets/sets_with_images/"
  //     : "/products/product_sets/sets_with_images?" +
  //       new URLSearchParams({ set_type_id: set_type_id }).toString();

  //   const resp_images = await fetch(images_url);

  //   if (!resp_images.ok) {
  //     throw new Error(`Error: ${resp_images.status}`);
  //   }

  //   if (resp_images.status == 200) {
  //     const data = await resp_images.json();
  //     sets_with_images.set(data);
  //   }
  //   console.log($sets_with_images);
  // }

  async function getProductSetsData(set_type_id) {
    let videos_url = $is_index_page
      ? "/products/product_sets/product_sets"
      : "/products/product_sets/product_sets?" +
        new URLSearchParams({ set_type_id: set_type_id }).toString();

    const resp_videos = await fetch(videos_url);

    if (!resp_videos.ok) {
      throw new Error(`Error: ${resp_videos.status}`);
    }

    if (resp_videos.status == 200) {
      const data = await resp_videos.json();
      product_sets.set(data);
    }
  }

  // let product_sets_with_videos_promise;

  let product_sets_promise;

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

    let url_elements = location.pathname.split("/");

    // Если путь к текущей странице, разделенный по "/", состоит из двух элементов, то путь имеет вид "/",
    // в противном случае - пользователь перешел в каталог товаров
    $is_index_page = url_elements.length === 2;

    if ($is_index_page) {
      // product_sets_with_videos_promise = getProductSetsWithVideoData();
      product_sets_promise = getProductSetsData();
      // await getProductSetsWithImagesData();
    } else {
      let set_type_id = url_elements[2];
      await getCatalogTitleData(set_type_id);
      product_sets_promise = getProductSetsData(set_type_id);
      // await getProductSetsWithImagesData();
      // console.log(set_type_id);

      // product_sets_with_videos_promise =
      //   getProductSetsWithVideoData(set_type_id);
      // await getProductSetsWithImagesData(set_type_id);
    }
  });
  
</script>

<main>
  <Header />

  <section class="section section-quote section-quote--sm">
    <div class="section-quote__text section-quote__text--sm">
      {#if $is_index_page}
        Design Your Own Furniture Set With Stylum!
      {:else}
        {$catalog_title.title}
      {/if}
    </div>
  </section>

  <!-- {#await product_sets_with_videos_promise} -->
  {#await product_sets_promise}
    <!-- <span>Waiting data...</span> -->
     <LoadingData />
  {:then}
    {#if show_top_button}
      <ButtonTop />
    {/if}

    <section
      class="section-video section-pad-bot section-index-4"
      transition:fade={{ duration: 2000 }}
    >
      <SetWithVideoSection
        set_with_video={$product_sets[0]}
        on:message={handleLikeClick}
      />
    </section>
    <section class="section section-pad-top section-pad-bot section-index-3">
      <div class="container">
        <div
          class="catalog-sliders catalog-sliders--six-set"
          data-name="slider-parent"
        >
          <SetWithImagesSection
            sets_with_images={$product_sets.slice(1, 7)}
            set_with_images_order_num={1}
            on:message={handleLikeClick}
          />
        </div>
      </div>
    </section>

    <section class="section section-pad-top section-pad-bot section-index-2">
      <div class="container">
        <div
          class="catalog-sliders catalog-sliders--three-set"
          data-name="slider-parent"
        >
          <SetWithImagesSection
            sets_with_images={$product_sets.slice(7, 10)}
            set_with_images_order_num={2}
            on:message={handleLikeClick}
          />
        </div>
      </div>
    </section>

    <section class="section section-pad-top section-pad-bot section-index-1">
      <SetWithVideoSection
        set_with_video={$product_sets[10]}
        on:message={handleLikeClick}
      />
    </section>

    <section class="section section-pad-top section-pad-bot">
      <div class="container">
        <div
          class="catalog-sliders catalog-sliders--six-set"
          data-name="slider-parent"
        >
          <SetWithImagesSection
            sets_with_images={$product_sets.slice(11, 17)}
            set_with_images_order_num={3}
            on:message={handleLikeClick}
          />
        </div>
      </div>
    </section>

    <section class="section section-pad-top section-index-1">
      <div class="container">
        <div
          class="catalog-sliders catalog-sliders--three-set-reverse"
          data-name="slider-parent"
        >
          <SetWithImagesSection
            sets_with_images={$product_sets.slice(17, 20)}
            set_with_images_order_num={4}
            on:message={handleLikeClick}
          />
        </div>
      </div>
    </section>
    <!-- <SetWithVideoSection
        set_with_video={$sets_with_videos[0]}
        on:message={handleLikeClick}
      />
    </section>
    <section class="section section-pad-top section-pad-bot section-index-3">
      <div class="container">
        <div
          class="catalog-sliders catalog-sliders--six-set"
          data-name="slider-parent"
        >
          <SetWithImagesSection
            sets_with_images={$sets_with_images.slice(0, 6)}
            set_with_images_order_num={1}
            on:message={handleLikeClick}
          />
        </div>
      </div>
    </section>

    <section class="section section-pad-top section-pad-bot section-index-2">
      <div class="container">
        <div
          class="catalog-sliders catalog-sliders--three-set"
          data-name="slider-parent"
        >
          <SetWithImagesSection
            sets_with_images={$sets_with_images.slice(6, 9)}
            set_with_images_order_num={2}
            on:message={handleLikeClick}
          />
        </div>
      </div>
    </section>

    <section class="section section-pad-top section-pad-bot section-index-1">
      <SetWithVideoSection
        set_with_video={$sets_with_videos[1]}
        on:message={handleLikeClick}
      />
    </section>

    <section class="section section-pad-top section-pad-bot">
      <div class="container">
        <div
          class="catalog-sliders catalog-sliders--six-set"
          data-name="slider-parent"
        >
          <SetWithImagesSection
            sets_with_images={$sets_with_images.slice(9, 15)}
            set_with_images_order_num={3}
            on:message={handleLikeClick}
          />
        </div>
      </div>
    </section>

    <section class="section section-pad-top section-index-1">
      <div class="container">
        <div
          class="catalog-sliders catalog-sliders--three-set-reverse"
          data-name="slider-parent"
        >
          <SetWithImagesSection
            sets_with_images={$sets_with_images.slice(15, 18)}
            set_with_images_order_num={4}
            on:message={handleLikeClick}
          />
        </div>
      </div>
    </section> -->
  {/await}

  <Footer />
  <MobilePreview />
</main>
