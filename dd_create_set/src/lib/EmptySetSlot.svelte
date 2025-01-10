<script>
    import { createEventDispatcher } from "svelte";
    import {
        curr_chosen_slot_num,
        chosen_slots,
        filters,
        product_images,
        render_in_progress,
        show_product_images,
        show_products_catalog,
        show_render_results_sliders,
    } from "./stores";

    /**
     * Хранит данные о компоненте сета
     * @type {{general_category_name: string, general_category_display_name: string, general_category_id: string, image_url: string, is_optional: boolean, order_num: number}}
     */
    export let slot;

    /**
     * Хранит номер слота, выбранный пользователем
     * @type {number}
     */
    export let order_num;

    const dispatch = createEventDispatcher();

    /**
     * Обрабатывает нажатие на пустой слот сета
     */
    function handleSlotClick() {
        // Если идет рендеринг, то при нажатии на незаполненный слот ничего не происходит
        if ($render_in_progress) {
            return;
        }

        // Запоминаем номер строки таблицы, на которую кликнули
        curr_chosen_slot_num.set(order_num);

        // Помечаем, что кликнув на пустой слот, картинки выводится не будут
        show_product_images.set(false);

        dispatch("message", {
            general_category_id: slot.general_category_id,
            general_category_name: slot.general_category_name,
        });

        // Убираем показ кнопок "Modify" или "Delete" у других слотов при нажатии на пустой слот
        $chosen_slots.forEach((slot) => {
            slot.show_delete_button = false;
            slot.show_modify_button = false;
            slot.clicked_modify_button = false;
            slot.clicked_delete_button = false;
        });

        chosen_slots.set($chosen_slots);

        $filters = {
            brands: [],
            colors: [],
            materials: [],
            sizes: [],
            decor_categories: [],
            price_asc: false,
            price_desc: false,
            most_popular: false,
            size_asc: false,
            size_desc: false,
        };

        // При нажатии на пустой слот, показываем каталог товаров
        show_products_catalog.set(true);
        show_render_results_sliders.set(false);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
    data-name="catalog-set-item"
    class="catalog-list-item"
    on:click={() => handleSlotClick()}
>
    <img
        src={slot.image_url}
        alt="furniture"
        class="catalog-list-item__img"
    />

    <div class="catalog-list-item__info">
        <h4 class="catalog-list-item__title">
            Please choose {slot.general_category_display_name}
            {#if slot.is_optional}
                {@html `<span>(optional)</span>`}{/if}
        </h4>
    </div>
</li>

<style>
    li {
        transition: box-shadow 0.3s;
    }
    li:hover {
        /* box-shadow: 0px 0px 10px 0px rgba(36, 36, 36, 0.5); */
        /* filter: drop-shadow(0px 0px 5px rgba(36, 36, 36, 0.5)); */
        box-shadow:
            0px 0px 5px 0px rgba(36, 36, 36, 0.5),
            0px 0px 20px 0px rgba(36, 36, 36, 0.5);
    }
</style>
