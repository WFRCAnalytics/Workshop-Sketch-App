function myFunction() {
  var menuItems = document.getElementById('menuItems');

    menuItems.classList.toggle("active");

  
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

  

 

  async function loadSketchMaps() {
    console.log('loadSketchMaps');


    const menuBar = document.getElementById('menuItems');
    // Clear existing menu items
    menuBar.innerHTML = '';

    menuItems = jsonConfig.sketchMaps.map(
      (sketchMap) => new SketchMap(sketchMap)
    );

    // Render each menu item and log (or insert into the DOM)
    menuItems.forEach((menuItem) => {
      menuBar.appendChild(menuItem.createMenuItemElement());
    });

    menuItems[0].onSelectMenu();
    console.log(menuItems)
    menuItems[0].menuItem.className = 'active'
  }

  async function init() {
    jsonConfig = await fetchConfig();

    // set the title
    const titleDiv = document.getElementById('titleDiv2');
    title = jsonConfig.title
    titleDiv.innerHTML = title;
    // await loadAndDisplaySplash(jsonConfig.splashDialog);
    // Set the title and version in the Esri object
    // const logoElement = document.querySelector('calcite-navigation-logo');
    // logoElement.setAttribute('heading', jsonConfig.title || "Workshop Sketch App");
    // logoElement.setAttribute('description', jsonConfig.subtitle || "v1 beta");

    await loadSketchMaps();
    
  }

  init();
});
