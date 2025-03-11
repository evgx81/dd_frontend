<script>
    export let product_set;

    import {
        favourite_sets,
        getCookie,
        getUserNumberFavouriteSets,
        is_authenticated,
        is_search_results_page,
        search_results_sets,
    } from "./stores";

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

            // Если удалось поставить лайк, то в зависимости от текущий страницы, ищем в выбранный сет по идентификатору и меняем значение поля "is_liked"
            if (resp.status == 201) {
                let curr_chosen_set = $is_search_results_page
                    ? $search_results_sets.find((set) => set.id === set_id)
                    : $favourite_sets.find((set) => set.id === set_id);

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

            // Если удалось убрать лайк, то в зависимости от текущий страницы, ищем в выбранный сет по идентификатору и меняем значение поля "is_liked"
            if (resp.status == 204) {
                let curr_chosen_set = $is_search_results_page
                    ? $search_results_sets.find((set) => set.id === set_id)
                    : $favourite_sets.find((set) => set.id === set_id);

                curr_chosen_set.is_liked = false;
            }
        }

        // Обновляем сторы лайкнутых сетов
        $is_search_results_page
            ? search_results_sets.set($search_results_sets)
            : favourite_sets.set($favourite_sets);

        // Получаем обновленное количество лайкнутых сетов
        await getUserNumberFavouriteSets(token);
    }
</script>

<div class="catalogs__set-free-img-wrapper">
    <div class="catalogs__set-free-img swiper">
        <div class="swiper-wrapper">
            {#each product_set.images as set_image}
                <!-- svelte-ignore a11y_img_redundant_alt -->
                <img class="swiper-slide" src={set_image} alt="image" />
            {/each}
        </div>
        <div
            class="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"
        >
            <span
                class="swiper-pagination-bullet swiper-pagination-bullet-active"
                aria-current="true"
            ></span>
        </div>
        <span
            class="swiper-notification"
            aria-live="assertive"
            aria-atomic="true"
        ></span>
    </div>
    <div class="set-options" data-name="set-options">
        <div class="set-options__wrapper">
            <div class="set-options__inner set-options__inner--three">
                {#each product_set.products as product}
                    <div class="set-options__item">
                        <!-- svelte-ignore a11y_img_redundant_alt -->
                        <img
                            src={product.image}
                            alt="image"
                            class="set-options__img"
                            width="45px"
                            height="45px"
                        />
                        <!-- <div class="set-options__price">
                            $ {product.price}
                        </div> -->
                    </div>
                {/each}
            </div>
            <div class="set-options__footer">
                <div class="catalog-price-total catalog-price-total--height">
                    Total <span class="bold">
                        <span data-name="item-count">
                            {product_set.products.length}
                        </span> items</span
                    >
                    for :
                    <span class="bold size" data-name="total-price"
                        >$ {product_set.total_price}</span
                    >
                </div>
                <a
                    href={`/set_card/${product_set.id}`}
                    class="set-options__button button--dark"
                >
                    See more
                </a>
            </div>
        </div>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#if $is_authenticated}
        <div
            class={`like ${product_set.is_liked ? "js--active" : ""}`}
            data-name="like"
            on:click={() =>
                handleLikeClick(product_set.id, product_set.is_liked)}
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
