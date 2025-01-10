<script>
    import { afterUpdate } from "svelte";
    import {
        is_authenticated,
        similar_product_sets,
        getUserNumberFavouriteSets,
        getCookie,
    } from "./stores";

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
        initialSliders();
    });

    /**
     * Обработка события, когда пользователь нажимает на лайк у сета с изображением
     * @param {string} set_id - идентификатор сета
     * @param {boolean} set_id - показывает лайкнут ли сет или нет
     */
    async function handleLikeClick(set_id, is_set_liked) {
        // Получаем значение токена пользователя из куки
        let token = getCookie("token");

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
                let curr_chosen_set = $similar_product_sets.find(
                    (set) => set.id === set_id,
                );
                curr_chosen_set.is_liked = true;
                similar_product_sets.set($similar_product_sets);
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
                let curr_chosen_set = $similar_product_sets.find(
                    (set) => set.id === set_id,
                );
                curr_chosen_set.is_liked = false;
                similar_product_sets.set($similar_product_sets);
            }
        }

        // Получаем обновленное количество лайкнутых сетов
        await getUserNumberFavouriteSets(token);
    }
</script>

<section class="section section-quote">
    <div class="section-quote__text">More like this</div>
</section>
<section class="section section-pad-bot">
    <div class="container">
        <div
            class="catalog-sliders catalog-sliders--six-set"
            data-name="slider-parent"
        >
            <!-- 6 шт -->
            {#each $similar_product_sets.slice(0, 6) as product_set}
                <div id={product_set.id} class="catalogs__set-free-img-wrapper">
                    <div class="catalogs__set-free-img swiper">
                        <div class="swiper-wrapper">
                            {#each product_set.images as image}
                                <img
                                    class="swiper-slide"
                                    src={image}
                                    alt="image"
                                    width="45px"
                                    height="45px"
                                />
                            {/each}
                        </div>
                        <div
                            class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
                        >
                            <span
                                class="swiper-pagination-bullet swiper-pagination-bullet-active"
                                aria-current="true"
                            ></span>
                            {#each product_set.images as _}
                                <span class="swiper-pagination-bullet"
                                ></span>{/each}
                        </div>
                        <span
                            class="swiper-notification"
                            aria-live="assertive"
                            aria-atomic="true"
                        ></span>
                    </div>
                    <div class="set-options" data-name="set-options">
                        <div class="set-options__wrapper">
                            <div
                                class="set-options__inner set-options__inner--three"
                            >
                                {#each product_set.products as product}
                                    <div class="set-options__item">
                                        <img
                                            src={product.image}
                                            alt="image"
                                            class="set-options__img"
                                            width="45px"
                                            height="45px"
                                        />
                                        <div class="set-options__price">
                                            $ {product.price}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                            <div class="set-options__footer">
                                <button
                                    class="set-options__button button--accent"
                                    >Modify</button
                                >
                                <button class="set-options__button button--dark"
                                    >See more</button
                                >
                                <div class="set-options__text-wrapper">
                                    <div class="set-options__text">
                                        $ {product_set.total_price}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    {#if $is_authenticated}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            class={`like ${product_set.is_liked ? "js--active" : ""}`}
                            data-name="like"
                            on:click={() =>
                                handleLikeClick(
                                    product_set.id,
                                    product_set.is_liked,
                                )}
                        >
                            <div class="like__inner">
                                {#if product_set.is_liked}
                                    <img
                                        src="/static/images/like-active.svg"
                                        alt="like"
                                        class="like__img like__img--active"
                                    />
                                {:else}
                                    <img
                                        src="/static/images/like.svg"
                                        alt="like"
                                        class="like__img"
                                    />
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>
<section class="section section-pad-top section-index-1">
    <div class="container">
        <div
            class="catalog-sliders catalog-sliders--three-set-reverse"
            data-name="slider-parent"
        >
            {#each $similar_product_sets.slice(6, 9) as product_set, idx}
                <div id={product_set.id} class="catalogs__set-free-img-wrapper">
                    <div class="catalogs__set-free-img swiper">
                        <div class="swiper-wrapper">
                            {#each product_set.images as product_set_image}
                                <img
                                    class="swiper-slide"
                                    src={product_set_image}
                                    alt="image"
                                    width="45px"
                                    height="45px"
                                />
                            {/each}
                        </div>
                        <div
                            class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
                        >
                            <span
                                class="swiper-pagination-bullet swiper-pagination-bullet-active"
                                aria-current="true"
                            ></span>
                            {#each product_set.images as _}
                                <span class="swiper-pagination-bullet"></span>
                            {/each}
                        </div>
                        <span
                            class="swiper-notification"
                            aria-live="assertive"
                            aria-atomic="true"
                        ></span>
                    </div>
                    <div class="set-options" data-name="set-options">
                        <div
                            class="set-options__wrapper set-options__wrapper--height-min"
                        >
                            <div
                                class={`${idx === 0 ? "set-options__inner set-options__inner--six" : "set-options__inner set-options__inner--three"} `}
                            >
                                {#each product_set.products as product}
                                    <div class="set-options__item">
                                        <img
                                            src={product.image}
                                            alt="image"
                                            class="set-options__img"
                                            width="45px"
                                            height="45px"
                                        />
                                        <div class="set-options__price">
                                            $ {product.price}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                            <div class="set-options__footer">
                                <button
                                    class="set-options__button button--accent"
                                    >Modify</button
                                >
                                <button class="set-options__button button--dark"
                                    >See more</button
                                >
                                <div class="set-options__text-wrapper">
                                    <div class="set-options__text">
                                        $ {product_set.total_price}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {#if $is_authenticated}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div
                            class={`like ${product_set.is_liked ? "js--active" : ""}`}
                            data-name="like"
                            on:click={() =>
                                handleLikeClick(
                                    product_set.id,
                                    product_set.is_liked,
                                )}
                        >
                            <div class="like__inner">
                                {#if product_set.is_liked}
                                    <img
                                        src="/static/images/like-active.svg"
                                        alt="like"
                                        class="like__img like__img--active"
                                    />
                                {:else}
                                    <img
                                        src="/static/images/like.svg"
                                        alt="like"
                                        class="like__img"
                                    />
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>
