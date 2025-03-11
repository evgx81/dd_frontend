<script>
    import { filters } from "../stores";

    document.addEventListener("click", clickOnSearchInput, false);
    function clickOnSearchInput(event) {
        let search_input = document.getElementById("search_input");

        if (search_input) {
            clicked_on_search_input = search_input.contains(event.target);
        }
    }

    /**
     * Показывает, кликнул ли пользователь на поисковую строку избранных сетов
     * @type {boolean}
     */
    let clicked_on_search_input = false;

</script>

<div class="create-set__search">
    <div class="header-search__icon">
        <svg
            width="20"
            height="20"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M13.8343 13.0455L10.6765 9.91104C12.6455 7.5362 12.522 3.99512 10.2996 1.77013C7.94727 -0.588416 4.1166 -0.591673 1.76426 1.77013C-0.588085 4.12868 -0.588085 7.96947 1.76426 10.328C2.94043 11.5073 4.48699 12.0969 6.03031 12.0969C7.40143 12.0969 8.76929 11.6311 9.88373 10.7027L13.0415 13.8371C13.152 13.9479 13.2949 14 13.4379 14C13.5809 14 13.7238 13.9446 13.8343 13.8371C14.0552 13.6189 14.0552 13.2638 13.8343 13.0455ZM2.55703 9.53315C0.640071 7.61113 0.640071 4.48377 2.55703 2.56175C3.51552 1.60074 4.77616 1.12186 6.03356 1.12186C7.29421 1.12186 8.5516 1.60399 9.51009 2.56175C11.427 4.48377 11.427 7.61113 9.51009 9.53315C7.59312 11.4552 4.474 11.4552 2.55703 9.53315Z"
                fill="#1F2933"
            ></path>
        </svg>
    </div>
    <!--         placeholder={`${clicked_on_search_input ? "Start typing the product name" : "Search"}`} -->
    <input
        id="search_input"
        type="text"
        class="create-search__input"
        placeholder={`${clicked_on_search_input ? "Start typing the product name" : "Search"}`}
        data-name="search-input"
        bind:value={$filters.search_input}
    />
</div>
