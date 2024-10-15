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

function setCalciteSelectValue(selectElement, newValue) {
  // Find the option with the specified value
  const optionToSelect = Array.from(selectElement.children).find(
    (option) => option.value === newValue
  );

  if (optionToSelect) {
    // Set the 'selected' attribute on the option
    optionToSelect.setAttribute('selected', '');

    // Dispatch a 'change' event to simulate user interaction
    const changeEvent = new Event('change', { bubbles: true });
    selectElement.dispatchEvent(changeEvent);
  }
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
  'esri/widgets/LayerList',
  'esri/rest/support/Query',
  'esri/form/FormTemplate',
  'esri/widgets/FeatureForm/FeatureFormViewModel',
], function (
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
  WebMap,
  Expand,
  Legend,
  Editor,
  LayerList,
  Query,
  FormTemplate,
  FeatureFormVM
) {
  // Now you can use Graphic inside this callback function

  esriConfig.apiKey =
    'AAPK5915b242a27845f389e0a11a17dc46b46gXNFj09FJVdb711lVLGhgoVFJBqdW6ow3bl71N1hx2llpMyogGBeF8kgvrKm3cY';

  const subregionsLayer = new FeatureLayer({
    title: 'Workshop Area',
    url: 'https://services1.arcgis.com/taguadKoI1XFwivx/arcgis/rest/services/FallWorkshops2024_Boundaries/FeatureServer',
    renderer: subregionRenderer,
    maxScale: 0,
    visible: false,
  });

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

        menuItems.classList.toggle('active');
        // // close hamburger menu when map is selected
        // if (window.innerWidth < windowSizeSmall) {
        //   toggleMenu();
        // }
      });

      return this.menuItem;
    }

    onSelectMenu() {
      console.log('onSelectMenu');
      let area;

      const providedURL = window.location;
      const newURL = new URL(providedURL);
      if (newURL.searchParams.toString() !== '') {
        const { searchParams } = newURL;
        area = searchParams.get('area');
      }

      // Create a new WebMap instance using the provided ID
      var webmap = new WebMap({
        portalItem: {
          id: this.agolMapId,
        },
      });

      // add the subregions layer
      webmap.add(subregionsLayer);

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
            labelsToggle: false,
          },
        });

        // format editor text
        this.editor.when(() => {
          if (window.innerWidth < windowSizeSmall) {
            this.editor.messages.widgetLabel = null;
          } else {
            this.editor.messages.widgetLabel = 'Submit a Comment';
          }
        });

        this.layerList = new LayerList({
          view: mapView,
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

        // add the area selector
        const workshopSelect = document.getElementById('workshopSelect');
        let workshopAreas = [];
        const query = new Query();
        query.where = '1=1';
        query.outFields = ['Name'];
        (query.returnGeometry = false),
          (query.returnDistinctValues = true),
          subregionsLayer.queryFeatures(query).then((results) => {
            const features = results.features;
            for (let i = 0; i < features.length; i++) {
              workshopAreas.push(features[i].attributes.Name);
            }

            // create workshop selection items
            workshopAreas.forEach(function (option) {
              // console.log(option)
              var newOption = document.createElement('calcite-option');
              newOption.value = option;
              newOption.text = option;
              newOption.label = option;
              workshopSelect.appendChild(newOption);
            });

            if (area !== 'None' && area) {
              // workshopSelect.value = area;
              setCalciteSelectValue(workshopSelect, area);

              // make the sub region boundary visible and relocate
              subregionsLayer.definitionExpression = `Name = '${area}'`;
              subregionsLayer.visible = true;
              const query = new Query();
              query.where = `Name = '${area}'`;
              subregionsLayer.queryExtent(query).then((results) => {
                mapView.goTo(results.extent);
              });
            } else {
              workshopSelect.value = area;
              subregionsLayer.definitionExpression = null;
              subregionsLayer.visible = false;
            }
          });
        // console.log(area)
        workshopSelect.addEventListener('calciteSelectChange', () => {
          area = workshopSelect.value;
          console.log(workshopSelect.value);

          if (workshopSelect.value !== 'None') {
            // set url parameters
            newURL.searchParams.set('area', area);
            window.history.replaceState(
              { additionalInformation: 'Updated the URL with JS' },
              '',
              newURL
            );

            // make the sub region boundary visible and relocate
            subregionsLayer.definitionExpression = `Name = '${area}'`;
            subregionsLayer.visible = true;
            const query = new Query();
            query.where = `Name = '${area}'`;
            subregionsLayer.queryExtent(query).then((results) => {
              mapView.goTo(results.extent);
            });
          }
          if (workshopSelect.value === 'None') {
            subregionsLayer.visible = false;

            // delete url parameters
            newURL.searchParams.delete('area');
            window.history.replaceState(
              { additionalInformation: 'Updated the URL with JS' },
              '',
              newURL
            );
          }
        });

        const workshopDiv = document.getElementById('workshopDiv');

        workshopDiv.style.display = 'block';
        mapView.ui.add(workshopDiv, 'bottom-left');

        // Add the Expand widget to the view
        mapView.ui.add(this.expandSketchPanel, 'top-right');
        mapView.ui.add(this.expandLegend, 'top-right');
        mapView.ui.add(this.expandLayerList, 'top-right');

        // updates the workshop area filed in the editor form according to the dropdown selection
        var editorVM = this.editor.viewModel;
        editorVM.watch(
          [
            'state',
            'featureFormViewModel.feature',
            'featureFormViewModel.state',
          ],
          () => {
            if (area !== 'None') {
              if (
                editorVM.state == 'creating-features' &&
                editorVM.featureFormViewModel.feature &&
                editorVM.featureFormViewModel.state == 'ready'
              ) {
                window.setTimeout(function () {
                  editorVM.featureFormViewModel.setValue('Workshop_Area', area);
                }, 200);
              }
            }
          }
        );
      });
    }
  }

  // Export ModelEntity to the global scope
  // Exporting to Global Scope (Not recommended but works): If you want to make the ModelEntity class globally accessible (not a good practice but will solve the immediate issue):
  window.SketchMap = SketchMap;
});
