import { derived, writable } from "svelte/store";
import _, { orderBy } from 'lodash';


/**
 * Хранит данные о типах сета в хедере
 * @type {import("svelte/store").Writable<Array.<{id: string, image: string}>>}
 */
export const page_header_data = writable([])

/**
 * Хранит о данные о сетах пользователя
 * @type {import("svelte/store").Writable<{id: string, email: string, first_name: string, last_name: string}>}
 */
export const user_data = writable({ id: "", email: "", first_name: "", last_name: "" });

/**
* Показывает, авторизован ли пользователь
* @type {import("svelte/store").Readable<boolean>}
*/
export const is_authenticated = derived(user_data, ($user_data) => {
    return $user_data.email !== "";
});


/**
* Количество сетов лайкнутых пользователем
* @type {import("svelte/store").Writable<{number_of_favourite_sets: number}>}
*/
export const number_of_favourite_sets_data = writable({ number_of_favourite_sets: 0 });

/**
 * Получает значение ключа из куки
 * @param {string} name - значение ключа
 */
export const getCookie = (name) => {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=')
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '')
}

/**
 * Хранит данные лайкнутых сетов пользователем
 * @type {import("svelte/store").Writable<Array.<{id: string, set_type: string, not_optional_product_brand: string, images: Array.<string>, total_price: number, products: Array.<{image:string, price: number}>, is_liked: boolean, completed_at: string}>>}
 */
export const favourite_sets = writable([])

/**
 * Получает количество лайкнутых сетов пользователем
 * @param {string} token - значение токена пользователя
 */
export async function getUserNumberFavouriteSets(token) {
    try {
        const resp = await fetch("/users/user/favourite_sets/", {
            headers: {
                Authorization: token,
            },
        });
        if (!resp.ok) {
            throw new Error(`Response status: ${resp.status}`);
        }

        const data = await resp.json();
        number_of_favourite_sets_data.set(data);
    } catch (error) {
        console.error(error.message);
    }
}


function filterSets(sets, filters) {
    let filtered_sets = [...sets];

    // Фильтруем по типу сета
    if (filters.set_types.length > 0) {
        filtered_sets = filtered_sets.filter((set) =>
            filters.set_types.includes(set.set_type),
        );
    }

    // Фильтруем по бренду
    if (filters.brands.length > 0) {
        filtered_sets = filtered_sets.filter((set) =>
            filters.brands.includes(set.not_optional_product_brand),
        );
    }

    if (filters.price_asc) {
        // Сортируем в порядке увеличения цены товаров
        filtered_sets = _.orderBy(filtered_sets, "total_price");
    } else if (filters.price_desc) {
        // Сортируем в порядке уменьшения цены товаров
        filtered_sets = _.orderBy(filtered_sets, "total_price", "desc");
    }
    else if (filters.newest) {
        // Сортируем в порядке увеличения даты завершения задачи на рендеринг
        filtered_sets = _.orderBy(filtered_sets, "completed_at", "desc");
    }
    else if (filters.oldest) {
        // Сортируем в порядке уменьшения даты завершения задачи на рендеринг
        filtered_sets = _.orderBy(filtered_sets, "completed_at");
    }
    //  else if (filters.most_popular) {
    //     // Сортируем в порядке уменьшения популярности товаров
    //     filtered_sets = _.orderBy(
    //         filtered_sets,
    //         "amount_in_sets",
    //         "desc",
    //     ).map(({ amount_in_sets }) => amount_in_sets);
    // } else if (filters.size_asc) {
    //     // Сортируем в порядке увеличения размера товаров
    //     filtered_sets = _.orderBy(
    //         filtered_sets,
    //         "size_category",
    //     ).map(({ size_category }) => size_category);
    // } else if (filters.size_desc) {
    //     // Сортируем в порядке уменьшения размера товаров
    //     filtered_sets = _.orderBy(
    //         filtered_sets,
    //         "size_category",
    //         "desc",
    //     ).map(({ size_category }) => size_category);
    // }

    return filtered_sets;
}

/**
 * Хранит фильтры сетов, выбранные пользователем
 */
export const filters = writable({ set_types: [], brands: [], price_asc: false, price_desc: false, newest: false, oldest: false });

/**
 * Хранит отфильтрованные товары
 * @type {import("svelte/store").Readable<Array.<{id: string, set_type: string, not_optional_product_brand: string, images: Array.<string>, total_price: number, products: Array.<{image:string, price: number}>, is_liked: boolean, completed_at: string}>>}
 */
export const sets_filtered = derived([favourite_sets, filters], ([$favourite_sets, $filters]) => filterSets($favourite_sets, $filters));


/**
 * Данные типов сетов
 * @type {import("svelte/store").Readable<Array.<string>>}
 */
export const set_types = derived(favourite_sets, ($favourite_sets) => Array.from(new Set($favourite_sets.filter(set => set.is_liked).map(set => set.set_type))));

/**
 * Данные брендов обязательных товаров сетов
 * @type {import("svelte/store").Readable<Array.<string>>}
 */
export const brands = derived(favourite_sets, ($favourite_sets) => Array.from(new Set($favourite_sets.filter(set => set.is_liked).map(set => set.not_optional_product_brand))));


