<script>
    import { filters } from "../store";
</script>

<div class="dropdown--js">
    <div class="dropdown__header--js">
        <button class="button button--light">Sort</button>
    </div>
    <div class="dropdown__content dropdown__content--js">
        <div class="dropdown__body-wrapper">
            <ul class="dropdown__body">
                <li class="dropdown__list-item">
                    <label for="sort-01">
                        <span class="dropdown__link-text"
                            >Price: low to high</span
                        >
                        <input
                            id="sort-01"
                            type="checkbox"
                            name="sort-01"
                            on:click={() => {
                                $filters.price_desc = false;
                                $filters.newest = false;
                                $filters.oldest = false;
                            }}
                            bind:value={$filters.price_asc}
                            checked={$filters.price_asc}
                        />
                        <div class="dropdown-checkbox">
                            <div class="dropdown-checkbox__mark"></div>
                        </div>
                    </label>
                </li>
                <li class="dropdown__list-item">
                    <label for="sort-02">
                        <span class="dropdown__link-text"
                            >Price: high to low</span
                        >
                        <input
                            id="sort-02"
                            type="checkbox"
                            name="sort-02"
                            on:click={() => {
                                $filters.price_asc = false;
                                $filters.newest = false;
                                $filters.oldest = false;
                            }}
                            bind:value={$filters.price_desc}
                            checked={$filters.price_desc}
                        />
                        <div class="dropdown-checkbox">
                            <div class="dropdown-checkbox__mark"></div>
                        </div>
                    </label>
                </li>
                <li class="dropdown__list-item">
                    <label for="sort-05">
                        <span class="dropdown__link-text"
                            >Newest</span
                        >
                        <input
                            id="sort-05"
                            type="checkbox"
                            name="sort-05"
                            on:click={() => {
                                $filters.price_asc = false;
                                $filters.price_desc = false;
                                $filters.oldest = false;
                            }}
                            bind:value={$filters.newest}
                            checked={$filters.newest}
                        />
                        <div class="dropdown-checkbox">
                            <div class="dropdown-checkbox__mark"></div>
                        </div>
                    </label>
                </li>
                <li class="dropdown__list-item">
                    <label for="sort-06">
                        <span class="dropdown__link-text"
                            >Oldest</span
                        >
                        <input
                            id="sort-06"
                            type="checkbox"
                            name="sort-06"
                            on:click={() => {
                                $filters.price_asc = false;
                                $filters.price_desc = false;
                                $filters.newest = false;
                            }}
                            bind:value={$filters.oldest}
                            checked={$filters.oldest}
                        />
                        <div class="dropdown-checkbox">
                            <div class="dropdown-checkbox__mark"></div>
                        </div>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</div>