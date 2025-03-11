<script>
    import { afterUpdate, onMount } from "svelte";
    import ProductSet from "./ProductSet.svelte";

    export let sets_with_images;

    /**
     *
     * @type {number}
     */
    export let set_with_images_order_num;

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
     * Отмечает перелистываются ли слайдеры с сетами
     */
    let sliders_initialized = false;
    afterUpdate(() => {
        // Если получены сеты с изображениями, то инициализируем перелистывание изображений сетов
        if (sets_with_images.length > 0 && !sliders_initialized) {
            initialSliders();
            sliders_initialized = true;
        }

        console.log(sets_with_images);
    });
</script>

<!-- <div class="container">
    <div
        class={`${sets_with_images.length == 6 ? "catalog-sliders catalog-sliders--six-set" : "catalog-sliders catalog-sliders--three-set-reverse"}`}
        data-name="slider-parent"
    > -->
{#each sets_with_images as set_with_images, idx}
    <ProductSet
        curr_set={set_with_images}
        curr_set_num={idx + 1}
        sets_with_images_length={sets_with_images.length}
        {set_with_images_order_num}
        on:message
    />
{/each}
<!-- </div>
</div> -->
