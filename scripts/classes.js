class SketchOption {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.htmlCode = data.htmlCode;
    this.fontSize = data.fontSize;
    this.color = data.color;
  }
}

// initialize variable for setting expand widget visibility on load
const windowSizeSmall = 640; // from tailwind recommendation
if (window.innerWidth < windowSizeSmall) {
  expanded = false;
} else {
  expanded = true;
}

require([
  'esri/config',
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/WebMap',
  'esri/widgets/Expand',
  'esri/widgets/Legend',
  'esri/widgets/Editor',
  'esri/widgets/LayerList'
], function (
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
  WebMap,
  Expand,
  Legend,
  Editor,
  LayerList
) {
  // Now you can use Graphic inside this callback function

  esriConfig.apiKey =
    'AAPK5915b242a27845f389e0a11a17dc46b46gXNFj09FJVdb711lVLGhgoVFJBqdW6ow3bl71N1hx2llpMyogGBeF8kgvrKm3cY';

  class SketchMap {
    constructor(data) {
      this.title = data.title;
      this.agolMapId = data.agolMapId;
      this.icon = data.icon;
      this.active = data.active || false;
      this.sketchOptions = (data.sketchOptions || []).map(
        (sketchOption) => new SketchOption(sketchOption)
      );
      // this.menuItem      = document.createElement('calcite-menu-item');
      this.menuItem = document.createElement('div');
    }

    createMenuItemElement() {
      console.log('onSelectMenu');
      this.menuItem.textContent = this.title;

      const menuItemInstance = this;
      this.menuItem.addEventListener('click', function () {
        console.log('this.menuItem:click');
        menuItemInstance.onSelectMenu();
        var menuItems = document.getElementById('menuItems');

        menuItems.classList.toggle("active");
        // // close hamburger menu when map is selected
        // if (window.innerWidth < windowSizeSmall) {
        //   toggleMenu();
        // }
      });

      return this.menuItem;
    }

    onSelectMenu() {
      console.log('onSelectMenu');

      // Create a new WebMap instance using the provided ID
      var webmap = new WebMap({
        portalItem: {
          id: this.agolMapId,
        },
      });

      // Create a MapView instance to display the WebMap
      var mapView = new MapView({
        container: 'mainMapView', // Reference to the DOM node that will contain the view
        map: webmap, // The WebMap instance created above
        zoom: 10, // Optional: Set an initial zoom level
      });

      // CREATE SIDE PANEL
      mapView.when(() => {
        
        this.editor = new Editor({
          view: mapView,
          enabled: true,
          icon: 'pencil',
          label: 'Submit a Comment',
          visibleElements: {
            snappingControls: false,
            editFeaturesSection: false,
            settingsMenu: false,
            labelsToggle :false
          },
        });

        // format editor text
        this.editor.when(() => {
            if (window.innerWidth < windowSizeSmall) {
              this.editor.messages.widgetLabel = null;
            }else{
              this.editor.messages.widgetLabel = 'Submit a Comment'; 
            }
        });

        this.layerList = new LayerList({
          view: mapView
        });

        // Create the Expand widget
        this.expandSketchPanel = new Expand({
          view: mapView,
          content: this.editor,
          expandIcon: 'pencil',
          expanded: expanded,
          expandTooltip: 'Draw Features',
          group: 'top-right',
        });

        this.legend = new Legend({
          view: mapView,
        });

        // Create the Expand widget
        this.expandLegend = new Expand({
          view: mapView,
          content: this.legend,
          expandIcon: 'legend',
          expanded: false,
          expandTooltip: 'Show Legend',
          group: 'top-right',
        });

        // Create the Expand widget
        this.expandLayerList = new Expand({
          view: mapView,
          content: this.layerList,
          expandIcon: 'layers',
          expanded: false,
          expandTooltip: 'Toggle Layers',
          group: 'top-right',
        });


        // Add the Expand widget to the view
        mapView.ui.add(this.expandSketchPanel, 'top-right');
        mapView.ui.add(this.expandLegend, 'top-right');
        mapView.ui.add(this.expandLayerList, 'top-right');

        
      });
    }
  }

  // Export ModelEntity to the global scope
  // Exporting to Global Scope (Not recommended but works): If you want to make the ModelEntity class globally accessible (not a good practice but will solve the immediate issue):
  window.SketchMap = SketchMap;
});
