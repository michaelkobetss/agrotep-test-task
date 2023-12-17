// Assuming constants.js and your other JavaScript file are in the same directory

window.onload = function () {
    const themeSwitch = document.getElementById("themeSwitch");
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem("theme") || LIGHT_THEME;
  
    htmlElement.setAttribute("data-bs-theme", savedTheme);
    themeSwitch.checked = savedTheme === DARK_THEME;
    document.body.style.display = "block";
};

//function to switch theme
function switchTheme() {
    const htmlElement = document.documentElement;
    const themeSwitch = document.getElementById("themeSwitch");
    const newTheme =
      htmlElement.getAttribute("data-bs-theme") === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  
    htmlElement.setAttribute("data-bs-theme", newTheme);
    themeSwitch.checked = newTheme === DARK_THEME;
    localStorage.setItem("theme", newTheme);
};
