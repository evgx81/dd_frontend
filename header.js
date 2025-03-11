const componentElement = document.querySelector('[data-component-id="the-header"]');
const buttonElement = componentElement.querySelector('[data-role="menu-button"]');

let headerHeight = componentElement.clientHeight;
let scrollYLast = window.scrollY;
let isHeaderScrolled = false;
let isHeaderHidden = false;
let isMenuOpened = false;

const openMenu = () => {
    isMenuOpened = true;
    componentElement.classList.add(CLASSES.OPEN);
};
const closeMenu = () => {
    isMenuOpened = false;
    componentElement.classList.remove(CLASSES.OPEN);
};

const hideHeader = () => {
    isHeaderHidden = true;
    componentElement.classList.add(CLASSES.HIDDEN);
};
const showHeader = () => {
    isHeaderHidden = false;
    componentElement.classList.remove(CLASSES.HIDDEN);
};

const setHeaderScrolled = () => {
    isHeaderScrolled = true;
    componentElement.classList.add(CLASSES.SCROLLED);
}
const removeHeaderScrolled = () => {
    isHeaderScrolled = false;
    componentElement.classList.remove(CLASSES.SCROLLED);
};

const onScroll = () => {
    const { scrollY } = window;

    if (!isHeaderScrolled && scrollY > headerHeight) setHeaderScrolled();
    else if (isHeaderScrolled && scrollY < headerHeight) removeHeaderScrolled();

    if (!isMenuOpened && !isHeaderHidden && scrollYLast < scrollY && scrollYLast !== 0) hideHeader();
    else if (isHeaderHidden && scrollYLast > scrollY) showHeader();

    if (scrollY < 200)  showHeader();

    scrollYLast = scrollY;
};

const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
        const { blockSize } = entry.borderBoxSize[0];
        if (headerHeight !== blockSize) headerHeight = blockSize;
    });
});

// resizeObserver.observe(componentElement);
// window.addEventListener('scroll', onScroll);

const initActionMenu = () => {
    const menuButton = document.querySelector('[data-name="menu-intro"]');
    const menuContent = document.querySelector('[data-name="menu-content"]');
    const actionMenu = () => {
        menuContent.classList.toggle(CLASSES.ACTIVE);
        menuButton.classList.toggle(CLASSES.ACTIVE);
    };

    menuButton.addEventListener('click', actionMenu);
};
initActionMenu();

const toggleDropdowns = () => {
    const dropdowns = document.querySelectorAll('.dropdown--js');

    const openDropdown = (dropdown) => {
        const content = dropdown.querySelector('.dropdown__content--js');
        dropdown.classList.add(CLASSES.ACTIVE);
        content.style.maxHeight = content.scrollHeight + "px";
        dropdowns.forEach((element) => {
            if(element !== dropdown) {
                element.classList.remove(CLASSES.ACTIVE);
                const content = element.querySelector('.dropdown__content--js');
                content.style.maxHeight = null;
            }
        });
    };

    const closeDropdown = (dropdown) => {
        dropdown.classList.remove(CLASSES.ACTIVE);
        const content = dropdown.querySelector('.dropdown__content--js');
        content.style.maxHeight = null;
    };

    const closeDropdowns = () => {
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove(CLASSES.ACTIVE);
            const content = dropdown.querySelector('.dropdown__content--js');
            content.style.maxHeight = null;
        });

    };

    const updateMaxHeight = (content) => {
        content.style.maxHeight = content.scrollHeight + "px";
    };

    dropdowns.forEach((dropdown) => {
        const header = dropdown.querySelector('.dropdown__header--js');
        const content = dropdown.querySelector('.dropdown__content--js');

        dropdown.addEventListener('mouseenter',(event) => {
            if (window.innerWidth > 1280) {
                if (event.target.tagName.toLowerCase() === 'button') {
                    event.stopPropagation();
                } else {
                    if (content.style.maxHeight) {
                        closeDropdown(dropdown);
                    } else {
                        openDropdown(dropdown);
                    }
                }
            }
        });
        header.addEventListener('click',(event) => {
            if (event.target.tagName.toLowerCase() === 'button') {
                event.stopPropagation();
            } else {
                if (content.style.maxHeight) {
                    closeDropdown(dropdown);
                } else {
                    openDropdown(dropdown);
                }
            }
        });
        dropdown.addEventListener('mouseleave',(event) => {
            if (window.innerWidth > 1280) {
                closeDropdown(dropdown);
            }
        });
        const clickableElements = content.querySelectorAll('*');
        clickableElements.forEach(element => {
            element.onclick = () => updateMaxHeight(content);
        });
    });
    const closeDropdownByOutClick = (event) => {
        if(!event.target.closest('.dropdown--js')) {
            closeDropdowns();
        }
    };
    document.addEventListener('click', closeDropdownByOutClick)
};
toggleDropdowns();