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
], function (
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
  WebMap,
  Expand,
  Legend,
  Editor
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
      this.menuItem = document.createElement('li');
    }

    createMenuItemElement() {
      console.log('onSelectMenu');
      const button = document.createElement('button');
      button.textContent = this.title;

      const menuItemInstance = this;
      button.addEventListener('click', function () {
        console.log('this.menuItem:click');
        menuItemInstance.onSelectMenu();

        // close hamburger menu when map is selected
        if (window.innerWidth < windowSizeSmall) {
          toggleMenu();
        }
      });
      this.menuItem.appendChild(button);

      return this.menuItem;
    }

    onSelectMenu() {
      console.log('onSelectMenu');

    //   const points = new FeatureLayer({
    //     outFields: ['*'],
    //     url: 'https://services1.arcgis.com/taguadKoI1XFwivx/arcgis/rest/services/WS_Editable_Features/FeatureServer/1',
    //     // renderer: pclRendererType,
    //     maxScale: 0,
    //     visible: true,
    //     // popupTemplate: parcelPopupTemplate,
    //   });

    //   const lines = new FeatureLayer({
    //     outFields: ['*'],
    //     url: 'https://services1.arcgis.com/taguadKoI1XFwivx/arcgis/rest/services/WS_Editable_Features/FeatureServer/0',
    //     // renderer: pclRendererType,
    //     maxScale: 0,
    //     visible: true,
    //     // popupTemplate: parcelPopupTemplate,
    //   });

    //   const polygons = new FeatureLayer({
    //     outFields: ['*'],
    //     url: 'https://services1.arcgis.com/taguadKoI1XFwivx/arcgis/rest/services/WS_Editable_Features/FeatureServer/2',
    //     // renderer: pclRendererType,
    //     maxScale: 0,
    //     visible: true,
    //     // popupTemplate: parcelPopupTemplate,
    //   });

      // Create a new WebMap instance using the provided ID
      var webmap = new WebMap({
        portalItem: {
          id: this.agolMapId,
        },
      });

      // [points, lines, polygons].forEach((layer) => webmap.add(layer));

      // Create a MapView instance to display the WebMap
      var mapView = new MapView({
        container: 'mainMapView', // Reference to the DOM node that will contain the view
        map: webmap, // The WebMap instance created above
        zoom: 10, // Optional: Set an initial zoom level
      });

      // CREATE SIDE PANEL
      mapView.when(() => {
        const editor = new Editor({
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

        
        editor.when(() => {
            if (window.innerWidth < windowSizeSmall) {
                editor.messages.widgetLabel = null;
            }else{
                editor.messages.widgetLabel = 'Submit a Comment'; 
            }

        });

        // Create the Expand widget
        this.expandSketchPanel = new Expand({
          view: mapView,
          content: editor,
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

        // Add the Expand widget to the view
        mapView.ui.add(this.expandSketchPanel, 'top-right');
        // mapView.ui.add(editor, "top-right");

        // Add the Expand widget to the view
        mapView.ui.add(this.expandLegend, 'top-right');

        
      });
    }
  }

  // Export ModelEntity to the global scope
  // Exporting to Global Scope (Not recommended but works): If you want to make the ModelEntity class globally accessible (not a good practice but will solve the immediate issue):
  window.SketchMap = SketchMap;
});
