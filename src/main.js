const header = document.querySelector(".header");
const toggleClass = "is-sticky";
const menuButton = document.querySelector(".header_menu__button");
const headerNav = document.querySelector(".header_nav");
const navLink = document.querySelectorAll(".header_nav__link");

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 180) {
        header.classList.add("is-sticky");
    } else {
        header.classList.remove("is-sticky");
    }
})

menuButton.addEventListener("click", mobileMenu);
navLink.forEach(n => n.addEventListener("click", closeMobileMenu));

function mobileMenu() {
    menuButton.classList.toggle("active");
    headerNav.classList.toggle("active");
}

function closeMobileMenu() {
    menuButton.classList.remove("active");
    headerNav.classList.remove("active");
}