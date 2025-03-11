<script>
    import BrandFilter from "./Filters/BrandFilter.svelte";
    import SearchFavouriteSets from "./Filters/SearchFavouriteSets.svelte";
    import SetTypeFilter from "./Filters/SetTypeFilter.svelte";
    import SortFilter from "./Filters/SortFilter.svelte";
    import ProductSet from "./ProductSet.svelte";
    import {
        is_search_results_page,
        search_results_sets,
        sets_filtered,
    } from "./stores";
    import { afterUpdate } from "svelte";

    const initialSliders = () => {
        const buildSwiperSlider = (swiperSliderElement) => {
            const swiperSlider = swiperSliderElement;
            if (!swiperSlider) return;

            const currentSwiper = new Swiper(swiperSlider, {
                effect: "fade",
                fadeEffect: {
                    crossFade: true,
                },
                pagination: {
                    el: swiperSlider.querySelector(".swiper-pagination"),
                    clickable: true,
                },
            });

            swiperSlider.addEventListener("mousemove", (event) => {
                const rect = swiperSlider.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const width = rect.width;

                const numberOfSlides = currentSwiper.slides.length;
                const partWidth = width / numberOfSlides;
                const slideIndex = Math.floor(x / partWidth);

                currentSwiper.slideTo(slideIndex);
            });

            // В момент ухода курсора со слайдера, отображаем первое изображение на слайдере
            swiperSlider.addEventListener("mouseleave", () =>
                currentSwiper.slideTo(0),
            );
        };

        // Находим все слайдеры с товарами и сетами, похожими на данный товар и инициализируем их
        const slidersParents = document.querySelectorAll(
            '[data-name="slider-parent"]',
        );

        slidersParents.forEach((slidersParent) => {
            const swiperSliders = slidersParent.querySelectorAll(".swiper");
            swiperSliders.forEach((swiperSlider) =>
                buildSwiperSlider(swiperSlider),
            );
        });
    };

    /**
     * Количество выводимых товаров при нажатии кнопки "Load more"
     * @type {number}
     */
    let currentProducts = 9;

    afterUpdate(() => {
        initialSliders();
        console.log($is_search_results_page);
    });
</script>

<section class="section">
    <div class="container">
        {#if $is_search_results_page}
            <div
                class="catalog-sliders catalog-sliders--six-set"
                data-name="slider-parent"
            >
                {#each $search_results_sets.slice(0, currentProducts) as product_set}
                    <ProductSet {product_set} />
                {/each}
            </div>

            {#if currentProducts < $search_results_sets.length}
                <div class="button-wrapper">
                    <button
                        class="button"
                        on:click={() => (currentProducts = currentProducts + 9)}
                        >Load more</button
                    >
                </div>
            {/if}
        {:else}
            <div class="create-set__catalog-buttons">
                <SetTypeFilter />
                <BrandFilter />
                <SearchFavouriteSets />
                <SortFilter />
            </div>
            <div
                class="catalog-sliders catalog-sliders--six-set"
                data-name="slider-parent"
            >
                {#each $sets_filtered
                    .filter((set) => set.is_liked)
                    .slice(0, currentProducts) as product_set}
                    <ProductSet {product_set} />
                {/each}
            </div>

            {#if currentProducts < $sets_filtered.filter((set) => set.is_liked).length}
                <div class="button-wrapper">
                    <button
                        class="button"
                        on:click={() => (currentProducts = currentProducts + 9)}
                        >Load more</button
                    >
                </div>
            {/if}
        {/if}
    </div>
</section>
