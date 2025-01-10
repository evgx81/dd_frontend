<script>
    import { afterUpdate, createEventDispatcher, onMount } from "svelte";
    import {
        chosen_slots,
        product_images,
        total_amount_of_products,
        total_price,
        show_product_images,
        products,
        curr_chosen_slot_num,
        render_in_progress,
        show_products_catalog,
        filters,
        render_task_results,
        show_render_results_sliders,
    } from "./stores";

    /**
     * Данные выбранного слота для заполнения
     * @type {{order_num: number, is_chosen: boolean, show_delete_button: boolean, show_modify_button: boolean, clicked_modify_button: boolean, clicked_delete_button: boolean, is_optional: boolean, sku: string, images: Array.<string>, brand: string, name: string, length: number, width: number, height: number, color: string, price: number}}
     */
    export let filled_slot;

    export let general_category_id;

    export let general_category_name;

    // let display_product_name_of_filled_slot;
    // let display_product_colors_of_filled_slot;

    // Количество выводимых символов считается в зависимости от того, нужно ли отображать кнопку "Delete" или "Modify"
    // afterUpdate(() => {
    //     // Определяем количество символов для обязательных слотов
    //     // let symbols_number_for_not_optional_slot =
    //     //     filled_slot.show_modify_button ? 25 : 45;

    //     // // Определяем количество символов для опциональных слотов
    //     // let symbols_number_for_optional_slot = filled_slot.show_delete_button
    //     //     ? filled_slot.show_modify_button
    //     //         ? 14
    //     //         : 30
    //     //     : 45;

    //     console.log(symbols_number_for_optional_slot);

    //     display_product_name_of_filled_slot = getProductDisplayName(
    //         filled_slot.name,
    //         symbols_number_for_not_optional_slot,
    //         symbols_number_for_optional_slot,
    //     );

    //     display_product_colors_of_filled_slot = getColorName(
    //         filled_slot.color,
    //         filled_slot.show_delete_button,
    //         filled_slot.show_modify_button,
    //     );
    // });

    // function getProductDisplayName(
    //     filled_slot_product_name,
    //     symbols_number_for_not_optional_slot,
    //     symbols_number_for_optional_slot,
    // ) {
    //     if (
    //         !filled_slot.is_optional &&
    //         filled_slot.name.length > symbols_number_for_not_optional_slot
    //     ) {
    //         // Условие для обязательных слотов
    //         return (
    //             filled_slot.name.slice(
    //                 0,
    //                 symbols_number_for_not_optional_slot,
    //             ) + "..."
    //         );
    //     } else if (
    //         filled_slot.is_optional &&
    //         filled_slot.name.length > symbols_number_for_optional_slot
    //     ) {
    //         // Условие для необязательных слотов
    //         return (
    //             filled_slot_product_name.slice(
    //                 0,
    //                 symbols_number_for_optional_slot,
    //             ) + "..."
    //         );
    //     }

    //     return filled_slot_product_name;
    // }

    // function getColorName(
    //     filled_slot_color,
    //     show_delete_button,
    //     show_modify_button,
    // ) {
    //     return show_delete_button &&
    //         show_modify_button &&
    //         filled_slot_color.length > 5
    //         ? filled_slot.color.slice(0, 5) + "..."
    //         : filled_slot.color.slice(0, 45);
    // }

    /**
     * Возвращает количество символов наименования выбранного товара, отображаемое на слоте
     * @param {{order_num: number, is_chosen: boolean, show_delete_button: boolean, show_modify_button: boolean, clicked_modify_button: boolean, clicked_delete_button: boolean, is_optional: boolean, sku: string, images: Array.<string>, brand: string, name: string, length: number, width: number, height: number, color: string, price: number}} curr_chosen_slot
     */
    function getNumberOfSymbolsOfName(curr_chosen_slot) {
        if (curr_chosen_slot.is_optional === false) {
            return curr_chosen_slot.show_modify_button ? 20 : 30;
        } else {
            return curr_chosen_slot.show_delete_button &&
                curr_chosen_slot.show_modify_button
                ? 8
                : 30;
        }
    }

    /**
     * Возвращает количество символов цвета выбранного товара, отображаемое на слоте
     * @param {{order_num: number, is_chosen: boolean, show_delete_button: boolean, show_modify_button: boolean, clicked_modify_button: boolean, clicked_delete_button: boolean, is_optional: boolean, sku: string, images: Array.<string>, brand: string, name: string, length: number, width: number, height: number, color: string, price: number}} curr_chosen_slot
     */
    function getNumberOfSymbolsForSizeAndColor(curr_chosen_slot) {
        if (curr_chosen_slot.is_optional === false) {
            return curr_chosen_slot.show_modify_button ? 5 : 30;
        } else {
            return curr_chosen_slot.show_delete_button &&
                curr_chosen_slot.show_modify_button
                ? 10
                : 30;
        }
    }

    let number_of_name_symbols;
    let number_of_color_name_symbols;
    afterUpdate(() => {
        // Определяем количество символов наименования товара, которое будет отображаться на слоте
        number_of_name_symbols = getNumberOfSymbolsOfName(filled_slot);

        // console.log(number_of_name_symbols);

        // Определяем количество символов наименования товара, которое будет отображаться на слоте
        number_of_color_name_symbols =
            getNumberOfSymbolsForSizeAndColor(filled_slot);

        // console.log(number_of_color_name_symbols);
    });

    const dispatch = createEventDispatcher();

    /**
     * Обрабатывает нажатие на заполненный слот сета
     */
    function handleFilledSlotClick() {
        // Если идет рендеринг, то при нажатии на заполненный слот ничего не происходит

        if ($render_in_progress) {
            return;
        }

        // При нажатии на заполненный слот скрываем каталог товаров
        show_products_catalog.set(false);

        curr_chosen_slot_num.set(filled_slot.order_num);

        // Если уже получили результаты рендеринга изображений, но нажали заполненный слот,
        // то результаты рендеринга не показываем и в заполненном слоте отображаем кнопки "Modify" и "Delete".

        // При повторном нажатии кнопки "Modify" и "Delete" скрываются, вновь отображаются изображения сета,
        // но последовательности и видео остаются.
        // if ($render_task_results.images.length > 0) {
        //     // При нажатии на кнопку "Modify" сначала работает обработчик "handleModifyClick", а потом - "handleFilledSlotClick"

        //     filled_slot.show_modify_button = !filled_slot.show_modify_button;
        //     if (filled_slot.is_optional) {
        //         filled_slot.show_delete_button =
        //             !filled_slot.show_delete_button;
        //     }

        //     // Отображаются изображения сета или изображения товара
        //     $show_product_images = !$show_product_images;
        // } else {
        // Сценарий, когда результаты рендеринга еще не получены

        // // На заполненном слоте всегда выводим кнопку "Modify"
        // filled_slot.show_modify_button = true;

        // // При повторном нажатии на заполненный слот выводим кнопку "Delete" у необязателльных слотов
        // if (filled_slot.is_optional) {
        //     filled_slot.show_delete_button = true;
        // }

        // // Показываем изображения товара на слайдере изображений сета
        // $show_product_images = true;

        //     // Убираем все выбранные фильтры
        //     $filters = {
        //         brands: [],
        //         colors: [],
        //         materials: [],
        //         sizes: [],
        //         decor_categories: [],
        //         price_asc: false,
        //         price_desc: false,
        //         most_popular: false,
        //         size_asc: false,
        //         size_desc: false,
        //     };
        // }

        $chosen_slots.forEach((slot) => {
            if (slot != filled_slot) {
                slot.show_delete_button = false;
                slot.show_modify_button = false;
                slot.clicked_modify_button = false;
                slot.clicked_delete_button = false;
            }
        });
        chosen_slots.set($chosen_slots);

        // Убираем все выбранные ранее фильтры
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

        // Запоминаем изображения товаров, которые будут выводиться на слайдере
        $product_images = filled_slot.images;

        if ($render_task_results.images.length > 0) {
            if (!filled_slot.clicked_modify_button) {
                filled_slot.show_modify_button =
                    !filled_slot.show_modify_button;

                if (filled_slot.is_optional) {
                    filled_slot.show_delete_button =
                        !filled_slot.show_delete_button;
                }
                chosen_slots.set($chosen_slots);

                if (
                    filled_slot.show_modify_button ||
                    filled_slot.show_delete_button
                ) {
                    $show_product_images = true;
                } else {
                    $show_product_images = false;
                }
                $show_render_results_sliders = true;
            }
        } else {
            if (!filled_slot.clicked_modify_button) {
                filled_slot.show_modify_button =
                    !filled_slot.show_modify_button;

                if (filled_slot.is_optional) {
                    filled_slot.show_delete_button =
                        !filled_slot.show_delete_button;
                }
                chosen_slots.set($chosen_slots);

                if (
                    filled_slot.show_modify_button ||
                    filled_slot.show_delete_button
                ) {
                    $show_product_images = true;
                    $show_render_results_sliders = false;
                } else {
                    $show_product_images = false;
                    $show_render_results_sliders = true;
                }
            }
        }

        if (filled_slot.clicked_modify_button) {
            show_products_catalog.set(true);
            show_render_results_sliders.set(false);

            filled_slot.clicked_modify_button = false;
            chosen_slots.set($chosen_slots);
        }

        // filled_slot.number_of_clicks_on_filled_slot += 1;

        // if (
        //     filled_slot.clicked_modify_button ||
        //     filled_slot.clicked_delete_button
        // ) {
        //     return;
        // }

        // show_product_images.set(true);

        // Если не кликнута кнопка "Modify" или "Delete", то не меняем показ кнопок на слоте

        // if (
        //     !filled_slot.clicked_modify_button &&
        //     !filled_slot.clicked_delete_button
        // ) {
        // console.log(!filled_slot.clicked_modify_button);

        // console.log($render_task_results.images.length > 0);

        // if (
        //     !filled_slot.clicked_modify_button
        // ) {
        //     filled_slot.show_modify_button = !filled_slot.show_modify_button;

        //     if (filled_slot.is_optional) {
        //         filled_slot.show_delete_button =
        //             !filled_slot.show_delete_button;
        //     }
        //     chosen_slots.set($chosen_slots);

        //     if (filled_slot.show_modify_button || filled_slot.show_delete_button) {
        //         $show_product_images = true;
        //         $show_render_results_sliders = false;
        //     }
        //     else {
        //         $show_product_images = false;
        //         $show_render_results_sliders = true;
        //     }

        //     // Убираем все выбранные ранее фильтры
        //     $filters = {
        //         brands: [],
        //         colors: [],
        //         materials: [],
        //         sizes: [],
        //         decor_categories: [],
        //         price_asc: false,
        //         price_desc: false,
        //         most_popular: false,
        //         size_asc: false,
        //         size_desc: false,
        //     };
        // }

        // // console.log($show_products_catalog);

        // // if (filled_slot.show_modify_button || filled_slot.show_delete_button) {
        // //     show_render_results_sliders.set(false);
        // // }
        // // else {
        // //     show_render_results_sliders.set(true);
        // // }

        // if (filled_slot.clicked_modify_button) {
        //     show_products_catalog.set(true);
        //     show_render_results_sliders.set(false);
        // }

        // if (filled_slot.clicked_delete_button) {
        //     console.log("Nenm");
        //     show_product_images.set(false);
        //     show_products_catalog.set(false);
        //     show_render_results_sliders.set(true);
        // }

        // else {
        //     // if ($show_products_catalog) {
        //     //     show_render_results_sliders.set(false);
        //     // } else {
        //     //     show_render_results_sliders.set(true);
        //     // }
        //     show_render_results_sliders.set(true);
        // }

        // if (filled_slot.clicked_modify_button && $show_products_catalog) {
        //     show_render_results_sliders.set(false);
        // } else {
        //     show_render_results_sliders.set(true);
        // }

        // console.log($show_render_results_sliders);

        // if (
        //     filled_slot.number_of_clicks_on_filled_slot % 2 === 0 // &&
        //     // (!filled_slot.clicked_modify_button &&
        //     //     !filled_slot.clicked_delete_button)
        // ) {
        //     show_render_results_sliders.set(false);
        //     show_product_images.set(true);
        // } else {
        //     show_render_results_sliders.set(true);
        //     show_product_images.set(false);
        //     show_products_catalog.set(false);
        // }

        // $show_products_catalog = !$show_products_catalog;

        // show_products_catalog.set(false);

        // if (
        //     !filled_slot.clicked_modify_button &&
        //     !filled_slot.clicked_delete_button
        // ) {
        //     filled_slot.show_modify_button = !filled_slot.show_modify_button;

        //     if (filled_slot.is_optional) {
        //         filled_slot.show_delete_button =
        //             !filled_slot.show_delete_button;
        //     }

        //     chosen_slots.set($chosen_slots);
        //     $show_product_images = !$show_product_images;
        //     show_products_catalog.set(false);
        //     show_render_results_sliders.set(true);
        // } else {
        //     show_product_images.set(true);
        // }

        // Сценарий при повторном нажатии на заполненный слот, если ни одна из кнопок не была нажата

        // if (
        //     !filled_slot.clicked_modify_button &&
        //     !filled_slot.clicked_delete_button
        // ) {
        //     filled_slot.number_of_clicks_on_filled_slot += 1;
        //     // filled_slot.show_modify_button = !filled_slot.show_modify_button;

        //     // if (filled_slot.is_optional) {
        //     //     filled_slot.show_delete_button =
        //     //         !filled_slot.show_delete_button;
        //     // }

        //     console.log(filled_slot.number_of_clicks_on_filled_slot);

        //     // if (filled_slot.number_of_clicks_on_filled_slot % 2 === 0) {
        //     //     show_product_images.set(false);
        //     //     show_render_results_sliders.set(true);
        //     // } else {
        //     //     show_product_images.set(true);
        //     //     show_render_results_sliders.set(false);
        //     // }
        // }

        // chosen_slots.set($chosen_slots);

        // console.log(show_product_images);

        // // $show_product_images = !show_product_images;
        // // $show_render_results_sliders = !$show_render_results_sliders;

        // console.log(show_product_images);

        // if (
        //     !filled_slot.clicked_modify_button ||
        //     !filled_slot.clicked_delete_button
        // ) {
        //     return;
        // }

        // show_products_catalog.set(false);
        // show_render_results_sliders.set(true);
        // }

        // show_products_catalog.set(false);

        // Отображаются изображения сета или изображения товара
        // $show_product_images = !$show_product_images;

        // dispatch("message", {
        //     general_category_id: general_category_id,
        //     general_category_name: general_category_name,
        // });

        // Кнопки "Modify" и "Delete" отображаются только у одного заполненнего слота
        // При нажатии на заполненный слот выводим кнопки "Modify" и "Delete" и убираем показ этих кнопок для других слотов
        // $chosen_slots.forEach((slot) => {
        //     if (slot != filled_slot) {
        //         slot.show_delete_button = false;
        //         slot.show_modify_button = false;
        //         slot.clicked_modify_button = false;
        //         slot.clicked_delete_button = false;
        //     }
        // });
    }

    function handleDeleteFilledSlot() {
        // Уменьшаем цену и количество выбранных товаров для создания сета
        $total_amount_of_products -= 1;
        $total_price -= filled_slot.price;

        // Получаем товары укрупненной категории слота
        dispatch("message", {
            general_category_id: general_category_id,
            general_category_name: general_category_name,
        });

        // При удалении данных слота ищем товар и убираем у него признак, что он добавлен в сет
        let product = $products.data.find(
            (product) => product.sku === filled_slot.sku,
        );

        // Помечаем новый товар, как выбранный
        product.is_added_to_set = false;

        // Обновляем список товаров
        products.set($products);

        // Убираем у текущего слота все данные товара и делаем его пустым
        filled_slot.is_chosen = false;
        filled_slot.clicked_delete_button = true;
        filled_slot.images = [];
        filled_slot.sku = "";
        filled_slot.brand = "";
        filled_slot.name = "";
        filled_slot.length = 0;
        filled_slot.width = 0;
        filled_slot.height = 0;
        filled_slot.color = "";
        filled_slot.price = 0;

        chosen_slots.set($chosen_slots);

        show_product_images.set(false);
        show_products_catalog.set(false);
        show_render_results_sliders.set(true);
    }

    function handleModifyFilledSlot() {

        dispatch("message", {
            general_category_id: general_category_id,
            general_category_name: general_category_name,
        });

        // Помечаем, что на данном слоте была нажата кнопка "Modify"
        filled_slot.clicked_modify_button = true;

        chosen_slots.set($chosen_slots);
    }

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
        // Помечаем, что изображения на слайдере создания сета пагинируются
        initialSliders();
    });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<li
    data-name="open-buttons"
    class="catalog-list-item-wrapper"
    on:click={handleFilledSlotClick}
>
    <div class="catalog-list-item">
        <img
            src={filled_slot.images[0]}
            alt="furniture"
            class="catalog-list-item__img"
        />
        <div class="catalog-list-item__info">
            <div class="catalog-list-item__subtitle">
                {#if filled_slot.brand.length > number_of_color_name_symbols}
                    {filled_slot.brand.slice(0, number_of_color_name_symbols) +
                        "..."}
                {:else}
                    {filled_slot.brand}
                {/if}
            </div>
            <h4 class="catalog-list-item__title">
                <!-- {display_product_name_of_filled_slot} -->
                {#if filled_slot.name.length > number_of_name_symbols}
                    {filled_slot.name.slice(0, number_of_name_symbols) + "..."}
                {:else}
                    {filled_slot.name}
                {/if}
            </h4>
            <div class="catalog-list-item__text">
                {#if `${filled_slot.length}х${filled_slot.height}х${filled_slot.width} cm`.length + filled_slot.color.length > number_of_color_name_symbols}
                    {filled_slot.length}х{filled_slot.height}х{filled_slot.width}
                {:else}
                    {filled_slot.length}х{filled_slot.height}х{filled_slot.width}
                    cm,
                    {filled_slot.color}
                {/if}
            </div>
        </div>
        <div class="catalog-list-item__price">$ {filled_slot.price}</div>
    </div>

    <!-- ----------------------------------------------------------------------------------------------------------- -->
    <!-- Следующий блок отвечает за правильное расположение кнопок на слоте (иначе будет некрасиво вылезать за поля) -->
    <!-- ----------------------------------------------------------------------------------------------------------- -->

    <!-- Если не получены результаты рендеринга изображений, то на слоте выводится кнопка только "Delete" (для необязательных слотов)
    {#if $render_task_results.images.length === 0}
        {#if filled_slot.show_delete_button && filled_slot.is_optional}
            <button
                class="configure__button dark"
                data-name="button-delete"
                on:click={() => handleDeleteFilledSlot()}>Delete</button
            >
        {/if}
    {:else} -->
    <!-- Если получены результаты рендеринга изображений, то на ранее заполненном слоте выводятся кнопки "Modify" и "Delete" (для необязательных слотов), -->
    <!-- Если слот был ранее пустым, но после редактирования товаров в сете стал заполненным, то у него выводтся только кнопка "Delete"                disabled={filled_slot.clicked_modify_button} -->
    <div
        class="configure__buttons"
        style={`${filled_slot.show_modify_button ? "display: flex;" : ""}`}
    >
        {#if filled_slot.is_chosen}
            <button
                class="configure__button"
                data-name="button-modify"
                on:click={() => handleModifyFilledSlot()}>Modify</button
            >
        {/if}

        {#if filled_slot.is_optional}
            <button
                class="configure__button dark"
                data-name="button-delete"
                on:click={() => handleDeleteFilledSlot()}>Delete</button
            >
        {/if}
    </div>
    <!-- {/if} -->
</li>

<style>
    li:hover {
        /* box-shadow: 0px 0px 10px 0px rgba(36, 36, 36, 0.5); */
        /* filter: drop-shadow(0px 0px 5px rgba(36, 36, 36, 0.5)); */
        box-shadow:
            0px 0px 5px 0px rgba(36, 36, 36, 0.5),
            0px 0px 20px 0px rgba(36, 36, 36, 0.5);
    }
</style>
