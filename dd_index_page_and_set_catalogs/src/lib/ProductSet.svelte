<script>
    import { createEventDispatcher } from "svelte";
    import { is_authenticated } from "./stores";

    export let curr_set;
    export let curr_set_num;
    export let sets_with_images_length;

    const dispatch = createEventDispatcher();

    /**
     * Отправляет сообщение о данных сета
     * @param {string} set_id идентификатор сета, на котором кликнули кнопку "Лайк"
     * @param {boolean} is_set_liked показывает, активирована ли кнопка "Лайк" на сете
     */
    function handleLikeClick(set_id, is_set_liked) {
        dispatch("message", {
            set_id: set_id,
            is_set_liked: is_set_liked,
            is_set_with_images: true,
        });
    }
</script>

<div id={curr_set.id} class="catalogs__set-free-img-wrapper">
    <div class="catalogs__set-free-img swiper">
        <div class="swiper-wrapper">
            {#each curr_set.images as set_image}
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
            {#each curr_set.images as _}
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
            <div
                class={`${sets_with_images_length === 3 && curr_set_num === 0 ? "set-options__inner set-options__inner--six" : "set-options__inner set-options__inner--three"} `}
            >
                {#each curr_set.products as product}
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
                        $ {curr_set.total_price}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- Если пользователь не авторизован, то не выводим сердечки у сетов -->
    {#if $is_authenticated}
        <div
            class={`like ${curr_set.is_liked ? "js--active" : ""}`}
            data-name="like"
            on:click={() => handleLikeClick(curr_set.id, curr_set.is_liked)}
        >
            <div class="like__inner">
                {#if curr_set.is_liked}
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
