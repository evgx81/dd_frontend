<script>
    import { afterUpdate, onMount } from "svelte";
    import Product from "./Product.svelte";
    import { products_filtered } from "./stores";
    import BrandFilter from "./Filters/BrandFilter.svelte";
    import ColorFilter from "./Filters/ColorFilter.svelte";
    import MaterialFilter from "./Filters/MaterialFilter.svelte";
    import SizeFilter from "./Filters/SizeFilter.svelte";
    import SortFilter from "./Filters/SortFilter.svelte";
    import DecorFilter from "./Filters/DecorFilter.svelte";

    /**
     * Наименование общей категории, выбранной пользователем
     * @type {string}
     */
    export let general_category_name;

    /**
     * Количество выводимых товаров при нажатии кнопки "Load more"
     * @type {number}
     */
    let currentProducts = 30;

    const initialSliders = () => {
        const buildSwiperSlider = (swiperSliderElement) => {
            const swiperSlider = swiperSliderElement;
            const swiperPagination =
                swiperSlider.querySelector(".swiper-pagination");
            if (!swiperSlider) return;

            const currentSwiper = new Swiper(swiperSlider, {
                effect: "fade",
                fadeEffect: {
                    crossFade: true,
                },
                pagination: {
                    el: swiperPagination,
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
        };

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

    onMount(() => {
        // Делаем слайдер картинок после фильтрации
        initialSliders();
    });

    afterUpdate(() => {
        // Делаем слайдер картинок после фильтрации
        initialSliders();
    });
</script>

<section class="section" data-name="catalog-set-section">
    <div class="container">
        <div class="create-set__catalog">
            <div class="create-set__catalog-header">
                <svg
                    width="15"
                    height="11"
                    viewBox="0 0 15 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5.86795 9.69593L1.23552 3.15603C0.297326 1.83152 1.24444 0 2.86757 0H12.1324C13.7556 0 14.7027 1.83152 13.7645 3.15603L9.13205 9.69593C8.33497 10.8212 6.66503 10.8212 5.86795 9.69593Z"
                        fill="#1F2933"
                    />
                </svg>
                <div class="create-set__catalog-title">
                    Please select a new {general_category_name} below
                </div>
                <svg
                    width="15"
                    height="11"
                    viewBox="0 0 15 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5.86795 9.69593L1.23552 3.15603C0.297326 1.83152 1.24444 0 2.86757 0H12.1324C13.7556 0 14.7027 1.83152 13.7645 3.15603L9.13205 9.69593C8.33497 10.8212 6.66503 10.8212 5.86795 9.69593Z"
                        fill="#1F2933"
                    />
                </svg>
            </div>
            <div class="create-set__catalog-body">
                <div class="create-set__catalog-buttons">
                    <BrandFilter />
                    <ColorFilter />
                    <MaterialFilter />
                    {#if general_category_name === "decor"}
                        <DecorFilter />
                    {:else}
                        <SizeFilter />
                    {/if}
                    <SortFilter />
                </div>

                <div
                    class="catalog-sliders catalog-sliders--six-set"
                    data-name="slider-parent"
                >
                    {#each $products_filtered.slice(0, currentProducts) as product}
                        <Product {product} on:message />
                    {/each}
                </div>
            </div>

            {#if currentProducts < $products_filtered.length}
                <div class="button-wrapper">
                    <button
                        class="button"
                        on:click={() =>
                            (currentProducts = currentProducts + 30)}
                        >Load more</button
                    >
                </div>
            {/if}
        </div>
    </div>
</section>
