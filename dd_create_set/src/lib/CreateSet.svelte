<script>
    import { onMount } from "svelte";
    import CreateSetSlider from "./CreateSetSlider.svelte";
    import SetTotalInfo from "./SetTotalInfo.svelte";
    import {
        chosen_set_type_id,
        slots,
        chosen_slots,
        is_admin_user,
    } from "./stores";
    import Scrollbar from "./Scrollbar.svelte";
    import EmptySetSlot from "./EmptySetSlot.svelte";
    import FilledSetSlot from "./FilledSetSlot.svelte";
    import StylumButton from "./StylumButton.svelte";
    import SceneInput from "./SceneInput.svelte";
    import ApproveSetButton from "./ApproveSetButton.svelte";
    

    const createSetScrollbar = (parent) => {
        const track = parent.querySelector('[data-name-scrollbar="track"]');
        if (track) {
            const inner = parent.querySelector('[data-name="list-wrapper"]');
            const buttonUp = parent.querySelector(
                '[data-name-scrollbar="button-up"]',
            );
            const buttonDown = parent.querySelector(
                '[data-name-scrollbar="button-down"]',
            );
            const thumb = parent.querySelector('[data-name-scrollbar="thumb"]');

            // Установка начальной высоты скроллбара
            thumb.style.height = "54.0773%";
            thumb.style.transform = "translateY(0px)";

            let isDragging = false;
            let startY;
            let startScrollTop;
            let scrollInterval;
            let scrollSpeed = 5; // Начальная скорость прокрутки
            let acceleration = 1; // Фактор ускорения
            let scrollDirection = 0; // 1 для вниз, -1 для вверх

            function scrollBy(amount) {
                inner.scrollBy({ top: amount });
                updateScrollbar();
            }

            function updateScrollbar() {
                const innerHeight = inner.scrollHeight;
                const visibleHeight = inner.clientHeight;
                const scrollRatio = visibleHeight / innerHeight;
                thumb.style.height = `${scrollRatio * 100}%`;

                const thumbHeight = thumb.clientHeight;
                const trackHeight = track.clientHeight;
                thumb.style.transform = `translateY(${(inner.scrollTop / (innerHeight - visibleHeight)) * (trackHeight - thumbHeight)}px)`;
            }

            function onThumbMouseDown(e) {
                isDragging = true;
                startY = e.clientY;
                startScrollTop = inner.scrollTop;
                document.addEventListener("mousemove", onThumbMouseMove);
                document.addEventListener("mouseup", onThumbMouseUp);
            }

            function onThumbMouseMove(e) {
                if (!isDragging) return;
                const deltaY = e.clientY - startY;
                const trackHeight = track.clientHeight;
                const thumbHeight = thumb.clientHeight;
                const scrollableHeight =
                    inner.scrollHeight - inner.clientHeight;
                const thumbPosition =
                    (deltaY / (trackHeight - thumbHeight)) * scrollableHeight;
                inner.scrollTop = startScrollTop + thumbPosition;
                updateScrollbar();
            }

            function onThumbMouseUp() {
                isDragging = false;
                document.removeEventListener("mousemove", onThumbMouseMove);
                document.removeEventListener("mouseup", onThumbMouseUp);
            }

            function startScroll(direction) {
                scrollDirection = direction;
                scrollInterval = setInterval(() => {
                    scrollBy(scrollDirection * scrollSpeed);
                    scrollSpeed += acceleration; // Увеличиваем скорость
                }, 20); // Интервал в миллисекундах
            }

            function stopScroll() {
                clearInterval(scrollInterval);
                scrollSpeed = 10; // Сброс скорости после остановки
                scrollDirection = 0;
            }

            buttonUp?.addEventListener("mousedown", () => startScroll(-1));
            buttonDown?.addEventListener("mousedown", () => startScroll(1));
            buttonUp?.addEventListener("mouseup", stopScroll);
            buttonDown?.addEventListener("mouseup", stopScroll);
            buttonUp?.addEventListener("mouseleave", stopScroll);
            buttonDown?.addEventListener("mouseleave", stopScroll);

            inner.addEventListener("scroll", updateScrollbar);
            updateScrollbar();
            thumb.addEventListener("mousedown", onThumbMouseDown);
        }
    };

    onMount(() => {
        // Запрашиваем из БД все, что касается типа сета
        fetch(
            "/products/products/set_type_categories?" +
                new URLSearchParams({
                    set_type_id: $chosen_set_type_id,
                }).toString(),
        )
            .then((resp) => resp.json())
            .then((data) => {
                // Сохраняем в стор состояние элементов сета
                slots.set(data);
                // Инициализируем массив выбранных элементов сета
                $slots.forEach((element) => {
                    $chosen_slots.push({
                        order_num: element.order_num,
                        is_chosen: false,
                        is_optional: element.is_optional,
                        show_delete_button: false,
                        show_modify_button: false,
                        clicked_modify_button: false,
                        clicked_delete_button: false,
                        images: [],
                        sku: "",
                        brand: "",
                        name: "",
                        length: 0,
                        width: 0,
                        height: 0,
                        color: "",
                        price: 0,
                    });
                });
            })
            .catch((error) => {
                console.log(error);
                slots.set([]);
            });

        // Создаем scrollbar
        const blockSettings = document.querySelector(
            '[data-name="custom-scrollbar-parent"]',
        );

        if (blockSettings) {
            createSetScrollbar(blockSettings);
        }
    });

</script>

<section class="set-card-hero section-pad-bot section-index-3">
    <div class="container">
        <div
            class="catalog-sliders catalog-slider--settings catalog-slider--settings-create-set"
            data-name="slider-parent"
        >
            <CreateSetSlider />
            <div class="catalog-list" data-name="custom-scrollbar-parent">
                <div class="catalog-list__wrapper" data-name="list-wrapper">
                    <ul class="catalog-list__inner">
                        <!-- Выводим обязательные слоты -->
                        {#each $chosen_slots.filter((curr_slot) => !curr_slot.is_optional) as curr_slot (curr_slot.order_num)}
                            {#if curr_slot.is_chosen}
                                <FilledSetSlot
                                    filled_slot={curr_slot}
                                    general_category_id={$slots.find(
                                        (slot) =>
                                            slot.order_num ===
                                            curr_slot.order_num,
                                    ).general_category_id}
                                    general_category_name={$slots.find(
                                        (slot) =>
                                            slot.order_num ===
                                            curr_slot.order_num,
                                    ).general_category_name}
                                    on:message
                                />
                            {:else}
                                <EmptySetSlot
                                    order_num={curr_slot.order_num}
                                    slot={$slots.find(
                                        (slot) =>
                                            slot.order_num ===
                                            curr_slot.order_num,
                                    )}
                                    on:message
                                />
                            {/if}
                        {/each}

                        <!-- Выводим заполненные выбранные необязательные слоты -->
                        {#each $chosen_slots.filter((curr_slot) => curr_slot.is_chosen === true && curr_slot.is_optional) as curr_slot (curr_slot.order_num)}
                            <FilledSetSlot
                                filled_slot={curr_slot}
                                general_category_id={$slots.find(
                                    (slot) =>
                                        slot.order_num === curr_slot.order_num,
                                ).general_category_id}
                                general_category_name={$slots.find(
                                    (slot) =>
                                        slot.order_num === curr_slot.order_num,
                                ).general_category_name}
                                on:message
                            />
                        {/each}

                        <!-- Выводим незаполненные необязательные слоты -->
                        {#each $chosen_slots.filter((curr_slot) => curr_slot.is_chosen === false && curr_slot.is_optional) as curr_slot (curr_slot.order_num)}
                            <EmptySetSlot
                                order_num={curr_slot.order_num}
                                slot={$slots.find(
                                    (slot) =>
                                        slot.order_num === curr_slot.order_num,
                                )}
                                on:message
                            />
                        {/each}
                    </ul>
                </div>
                <Scrollbar />
            </div>
        </div>
        <div class="catalog-price-total-wrapper">
            {#if $is_admin_user}
                <div class="catalog-price__box__admin">
                    <StylumButton />
                    <ApproveSetButton />
                </div>
            {:else}
                <div class="catalog-price__box">
                    <StylumButton />
                    <SetTotalInfo />
                </div>
            {/if}
        </div>

        {#if $is_admin_user}
            <SceneInput />
        {/if}
    </div>
</section>
