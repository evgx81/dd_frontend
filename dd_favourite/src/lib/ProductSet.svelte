<script>
    export let set;

    import { favourite_sets, getCookie, getUserNumberFavouriteSets } from "./store";

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
                let curr_chosen_set = $favourite_sets.find(
                    (set) => set.id === set_id,
                );
                curr_chosen_set.is_liked = true;
                favourite_sets.set($favourite_sets);
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
                let curr_chosen_set = $favourite_sets.find(
                    (set) => set.id === set_id,
                );
                curr_chosen_set.is_liked = false;
                favourite_sets.set($favourite_sets);
            }
        }

        // Получаем обновленное количество лайкнутых сетов
        await getUserNumberFavouriteSets(token);
    }
</script>

<div id={set.id} class="catalogs__set-free-img-wrapper">
    <div class="catalogs__set-free-img swiper">
        <div class="swiper-wrapper">
            {#each set.images as set_image}
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
            {#each set.images as _}
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
        <div class="set-options__wrapper">
            <div class="set-options__inner set-options__inner--three">
                {#each set.products as product}
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
                <button class="set-options__button button--accent"
                    >Modify</button
                >
                <button class="set-options__button button--dark"
                    >See more</button
                >
                <div class="set-options__text-wrapper">
                    <div class="set-options__text">
                        $ {set.total_price}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class={`like ${set.is_liked ? "js--active" : ""}`}
        data-name="like"
        on:click={() => handleLikeClick(set.id, set.is_liked)}
    >
        <div class="like__inner">
            {#if set.is_liked}
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
</div>
