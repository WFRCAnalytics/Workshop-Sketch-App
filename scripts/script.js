function toggleMenu() {
  var navbarLinks = document.getElementById('navbarLinks');
  navbarLinks.classList.toggle('active');
}

function buttonClick(buttonName) {
  alert(buttonName + ' button clicked!');
}

let jsonConfig;

require([
  'esri/widgets/Editor',
  'esri/config',
  'esri/Map',
  'esri/views/MapView',
  'esri/widgets/Expand',
  'esri/widgets/BasemapToggle',
], function (editor, esriConfig, Map, MapView, Expand, BasemapToggle) {
  async function fetchConfig() {
    console.log('fetchConfig');
    try {
      const response = await fetch('config.json');

      // Check if the response status is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching config:', error);
      // You can return a default config or handle the error as needed
      return null; // or return an empty object {} or any default value
    }
  }

  // async function loadAndDisplaySplash(splashDialog) {
  //   // Check if the splashDialog should be shown
  //   if (splashDialog.on) {
  //     const modalContent = document.querySelector('#infoModal .modal-content');
  //     modalContent.innerHTML = "<h1>" + splashDialog.title + "</h1>";
  //     modalContent.innerHTML += splashDialog.textHtml;

  //     const modal = document.getElementById('infoModal');
  //     modal.style.display = 'block';

  //     const okButton = document.getElementById('okButton');
  //     okButton.onclick = function() {
  //       modal.style.display = 'none';
  //     };
  //   } else {
  //     // If the splashDialog is off, ensure the modal is not displayed
  //     const modal = document.getElementById('infoModal');
  //     modal.style.display = 'none';
  //   }
  // }

  async function loadSketchMaps() {
    console.log('loadSketchMaps');

    // const calciteMenu = document.querySelector('calcite-menu[slot="content-start"]');
    const menuBar = document.getElementById('navbarList');
    // // Clear existing menu items
    // calciteMenu.innerHTML = '';
    menuBar.innerHTML = '';

    menuItems = jsonConfig.sketchMaps.map(
      (sketchMap) => new SketchMap(sketchMap)
    );

    // Render each menu item and log (or insert into the DOM)
    menuItems.forEach((menuItem) => {
      menuBar.appendChild(menuItem.createMenuItemElement());
    });

    menuItems[0].onSelectMenu();
  }

  async function init() {
    jsonConfig = await fetchConfig();
    // await loadAndDisplaySplash(jsonConfig.splashDialog);

    // Set the title and version in the Esri object
    // const logoElement = document.querySelector('calcite-navigation-logo');
    // logoElement.setAttribute('heading', jsonConfig.title || "Workshop Sketch App");
    // logoElement.setAttribute('description', jsonConfig.subtitle || "v1 beta");

    await loadSketchMaps();
  }

  init();
});
