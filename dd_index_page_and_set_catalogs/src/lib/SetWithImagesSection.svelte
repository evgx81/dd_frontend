<script>
    import { afterUpdate, onMount } from "svelte";
    import ProductSet from "./ProductSet.svelte";

    export let sets_with_images;

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

    afterUpdate(() => {
        if (sets_with_images.length > 0) {
            initialSliders();
        }
    });
</script>

<div class="container">
    <div
        class={`${sets_with_images.length == 6 ? "catalog-sliders catalog-sliders--six-set" : "catalog-sliders catalog-sliders--three-set-reverse"}`}
        data-name="slider-parent"
    >
        {#each sets_with_images as set_with_images, idx}
            <ProductSet
                curr_set={set_with_images}
                curr_set_num={idx}
                sets_with_images_length={sets_with_images.length}
                on:message
            />
        {/each}
    </div>
</div>
