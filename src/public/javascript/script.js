document.addEventListener("DOMContentLoaded", () => {
    const allBtns = document.querySelectorAll(".searchBtn");
    const searchBar = document.querySelector(".searchBar");
    const searchInput = document.getElementById("searchInput");
    const searchClose = document.getElementById("searchClose");

    allBtns.forEach(item => {
        item.addEventListener("click", function() {
            searchBar.style.visibility = "visible";
            searchBar.classList.add("open");
            this.setAttribute("aria-expanded", "true");
            searchInput.focus();
        });

        searchClose.addEventListener("click", function() {
            searchBar.style.visibility = "hidden";
            searchBar.classList.remove("open");
            this.setAttribute("aria-expanded", "false");
        });
    });

    try {
        const signInContent = document.getElementById("signin-text");
        
        if (signInContent) {
            const logoutBtn = document.querySelector(".header__button");
            logoutBtn.style.display = "none";
        }
    
    } catch (error) {
        console.error("No element found: ", error);
    }

});