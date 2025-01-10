<script>
    import { brands, filters } from "../store";
</script>

<div class="dropdown--js">
    <div class="dropdown__header--js">
        <button class="button button--light">Brand</button>
    </div>
    <div
        class="dropdown__content dropdown__content--js"
        data-name="dropdown-scrollbar-parent"
    >
        <div class="dropdown__body-wrapper">
            <ul class="dropdown__body" data-name="list-wrapper">
                {#each $brands as brand, idx}
                    <li class="dropdown__list-item">
                        <label for="brand-0{idx}">
                            <span class="dropdown__link-text">{brand}</span>
                            <input
                                id="brand-0{idx}"
                                type="checkbox"
                                name="brand"
                                bind:group={$filters.brands}
                                value={brand}
                            />
                            <div class="dropdown-checkbox">
                                <div class="dropdown-checkbox__mark"></div>
                            </div>
                        </label>
                    </li>
                {/each}
            </ul>
            <div class="catalog-scrollbar">
                <div class="catalog-scrollbar__track">
                    <div
                        class="catalog-scrollbar__track-inner"
                        data-name-scrollbar="track"
                    >
                        <div
                            class="catalog-scrollbar__thumb"
                            data-name-scrollbar="thumb"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
