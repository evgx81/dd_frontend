<script>
    import { got_all_render_task_results, render_task_results } from "./stores";

    /**
     * Показывает, нажата ли кнопка "Approve the set"
     * @type {boolean}
     */
    let is_set_approved = false;

    /**
     * Активирует или дизактивирует показ сета на главной странице и в каталогах сетов
     */
    async function handleApproveSetClick() {
        if (is_set_approved) {
            const resp = await fetch(
                "/products/product_sets/unset_active?" +
                    new URLSearchParams({
                        set_id: $render_task_results.product_set_id,
                    }).toString(),
            );

            if (!resp.ok) {
                throw new Error(`Error: ${resp.status}`);
            }

            is_set_approved = false;

        } else {
            const resp = await fetch(
                "/products/product_sets/set_active?" +
                    new URLSearchParams({
                        set_id: $render_task_results.product_set_id,
                    }).toString(),
            );

            if (!resp.ok) {
                throw new Error(`Error: ${resp.status}`);
            }

            is_set_approved = true;
        }
        console.log(is_set_approved);
    }
</script>

<!-- Если получены все результаты рендеринга пока не получены, то кнопка "Approve the set" недоступна и помечена серым цветом-->
<button
    style={`${$got_all_render_task_results ? "" : "background: #808080"}`}
    class={`${is_set_approved ? "approve_set__button__approved" : "approve_set__button__approve_the_set"}`}
    disabled={!$got_all_render_task_results}
    on:click={() => handleApproveSetClick()}
>
    {#if is_set_approved}
        Approved
    {:else}
        Approve the set
    {/if}
</button>
