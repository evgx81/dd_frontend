<script>
    import BrandFilter from "./Filters/BrandFilter.svelte";
    import SearchSets from "./Filters/SearchSets.svelte";
    import SetTypeFilter from "./Filters/SetTypeFilter.svelte";
    import SortFilter from "./Filters/SortFilter.svelte";
    import ProductSet from "./ProductSet.svelte";
    import { sets_filtered } from "./store";
    import { afterUpdate } from "svelte";

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

    /**
     * Количество выводимых товаров при нажатии кнопки "Load more"
     * @type {number}
     */
    let currentProducts = 9;

    afterUpdate(() => {
        console.log($sets_filtered);
        initialSliders();
    });
</script>

<section class="section">
    <div class="container">
        <div class="create-set__catalog-buttons">
            <SetTypeFilter />
            <BrandFilter />
            <SearchSets />
            <SortFilter />
        </div>
        <div
            class="catalog-sliders catalog-sliders--six-set"
            data-name="slider-parent"
        >
            {#each $sets_filtered.slice(0, currentProducts) as set}
                {#if set.is_liked}
                    <ProductSet {set} />
                {/if}
            {/each}
        </div>

        {#if currentProducts < $sets_filtered.length}
            <div class="button-wrapper">
                <button
                    class="button"
                    on:click={() => (currentProducts = currentProducts + 9)}
                    >Load more</button
                >
            </div>
        {/if}
    </div>
</section>
