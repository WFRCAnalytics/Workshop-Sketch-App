class SketchOption {
    constructor(data) {
        this.id       = data.id
        this.title    = data.title;
        this.htmlCode = data.htmlCode;
        this.fontSize = data.fontSize;
        this.color    = data.color;
    }
}




require([
    'esri/config',
    "esri/Map",
    "esri/views/MapView",
    'esri/layers/FeatureLayer',
    "esri/WebMap",
    "esri/widgets/Expand",
    "esri/widgets/Legend",
    "esri/widgets/Editor"
  ], function(esriConfig, Map, MapView,FeatureLayer, WebMap, Expand, Legend, Editor) {
    // Now you can use Graphic inside this callback function
    
    esriConfig.apiKey = 'AAPK5915b242a27845f389e0a11a17dc46b46gXNFj09FJVdb711lVLGhgoVFJBqdW6ow3bl71N1hx2llpMyogGBeF8kgvrKm3cY';

    class SketchMap {
        constructor(data) {
            this.title         = data.title;
            this.agolMapId     = data.agolMapId;
            this.icon          = data.icon;
            this.active        = data.active || false;
            this.sketchOptions = (data.sketchOptions || []).map(sketchOption => new SketchOption(sketchOption));
            // this.menuItem      = document.createElement('calcite-menu-item');
            this.menuItem      = document.createElement('li');

        }

        createMenuItemElement() {

            console.log('onSelectMenu');
            const button = document.createElement('button');
            button.textContent = this.title;

            const menuItemInstance = this;
            button.addEventListener('click', function() {
                console.log('this.menuItem:click');
                menuItemInstance.onSelectMenu();
            });
            this.menuItem.appendChild(button);
        
            return this.menuItem;
        }

        onSelectMenu() {
            console.log('onSelectMenu');

            const points = new FeatureLayer({
                outFields: ['*'],
                url: 'https://services1.arcgis.com/taguadKoI1XFwivx/arcgis/rest/services/WS_Editable_Features/FeatureServer/1',
                // renderer: pclRendererType,
                maxScale: 0,
                visible: true,
                // popupTemplate: parcelPopupTemplate,
            });

            const lines = new FeatureLayer({
                outFields: ['*'],
                url: 'https://services1.arcgis.com/taguadKoI1XFwivx/arcgis/rest/services/WS_Editable_Features/FeatureServer/0',
                // renderer: pclRendererType,
                maxScale: 0,
                visible: true,
                // popupTemplate: parcelPopupTemplate,
            });

            const polygons = new FeatureLayer({
                outFields: ['*'],
                url: 'https://services1.arcgis.com/taguadKoI1XFwivx/arcgis/rest/services/WS_Editable_Features/FeatureServer/2',
                // renderer: pclRendererType,
                maxScale: 0,
                visible: true,
                // popupTemplate: parcelPopupTemplate,
            });
        

            // Create a new WebMap instance using the provided ID
            var webmap = new WebMap({
                portalItem: {
                id: this.agolMapId
                }
            });

            // [points, lines, polygons].forEach((layer) => webmap.add(layer));
        
            // Create a MapView instance to display the WebMap
            var mapView = new MapView({
                container: "mainMapView",  // Reference to the DOM node that will contain the view
                map: webmap,           // The WebMap instance created above
                zoom: 10               // Optional: Set an initial zoom level
            });
        

            // CREATE SIDE PANEL
            mapView.when(() => {
                const editor = new Editor({
                  view: mapView,
                  enabled: true,
                  visibleElements: {
                    snappingControls: false,
                    editFeaturesSection : false,
                    settingsMenu: false,
                  }
                });

                editor.when(() => {
                    editor.messages.widgetLabel = "Submit a Comment"; 
                  })

        

            // Create the Expand widget
            const expandSketchPanel = new Expand({
                view: mapView,
                content: editor,
                expandIcon: "pencil",
                expanded: true,
                expandTooltip: 'Draw Features',
                group: "top-right"
            });

            // Add the Expand widget to the view
            mapView.ui.add(expandSketchPanel, "top-right");
            
        
            // Add the widget to the view
            // mapView.ui.add(editor, "top-right");
            });
            // // Create a container for the widget content
            // const contentContainer = document.createElement('div');
            // contentContainer.className = 'side-panel-container';


            // Add some descriptive text
            // const sketchOptionDialogText = document.createElement('div');
            // sketchOptionDialogText.innerHTML = '<h1>Sketch Options<h1>';

            // const table = document.createElement('table');
            // table.border = '1';
            // table.id = 'sketchTable';


            // // Create table header
            // const header = table.createTHead();
            // const headerRow = header.insertRow();
            // // const headers = ['Symbol Title', 'Symbol', 'Color'];
            // // headers.forEach(headerText => {
            // //     const th = document.createElement('th');
            // //     th.textContent = headerText;
            // //     headerRow.appendChild(th);
            // // });
            // // Create table body
            // const tbody = table.createTBody();

            // var data = this.sketchOptions;

            // // Iterate over each sketchMap and its sketchOptions
            // data.forEach(option => {
                
            //         const row = tbody.insertRow();


            //         // Symbol Column (use innerHTML to display the symbol)
            //         const symbolCell = row.insertCell();
            //         // symbolCell.innerHTML = option.htmlCode;
            //         symbolCell.innerHTML = `<span style="color: ${option.color || 'black'}; font-size: ${option.fontSize || '100%'}; display: block; text-align: center;">${option.htmlCode}</span>`;


            //         // Optional: Add a click event to each row
            //         symbolCell.addEventListener('click', () => {
            //             alert(`You clicked on ${option.title}`);
            //         });
            //     });
    





            // let tableHTML = '<table width="100%">';
            
            // // First row for htmlCode
            // tableHTML += '<tr>';
            // for (let i = 0; i < this.sketchOptions.length; i += 3) {
            //     for (let j = 0; j < 3; j++) {
            //         if (i + j < this.sketchOptions.length) {
            //             let option = this.sketchOptions[i + j];
            //             tableHTML += `<td width="33%" align="center">
            //                 <span id=${option.id} style="font-size:${option.fontSize};color:${option.color};">${option.htmlCode}</span>
            //             </td>`;
            //             // optionElement = document.getElementById(option.id)
                        
            //         } else {
            //             tableHTML += '<td width="33%" align="center"></td>'; // Empty cell if fewer than 3 items in this row
            //         }
            //     }
            //     tableHTML += '</tr>';
                
            //     // Second row for title
            //     tableHTML += '<tr>';
            //     for (let j = 0; j < 3; j++) {
            //         if (i + j < this.sketchOptions.length) {
            //             let option = this.sketchOptions[i + j];
            //             tableHTML += `<td width="33%" align="center">
            //                 <span>${option.title}</span>
            //             </td>`;
            //         } else {
            //             tableHTML += '<td width="33%" align="center"></td>'; // Empty cell if fewer than 3 items in this row
            //         }
                    
            //     }
                

            //     tableHTML += '</tr>';
            // }
    
            // tableHTML += '</table>';

            // sketchOptionDialogText.innerHTML += tableHTML;

            // contentContainer.appendChild(sketchOptionDialogText);

            
            
            

            

            // this.legend = new Legend({
            //     view: mapView
            // });

            //mapView.ui.add(this.legend, "bottom-right");
              
        //     // Create the Expand widget
        //     this.expandLegend = new Expand({
        //         view: mapView,
        //         content: this.legend,
        //         expandIcon: "legend",
        //         expanded: false,
        //         expandTooltip: 'Show Legend',
        //         group: "top-right"
        //     });
      
        //     // Add the Expand widget to the view
        //     mapView.ui.add(this.expandLegend, "top-right");
            
        }
        
        
    }
    
    // Export ModelEntity to the global scope
    // Exporting to Global Scope (Not recommended but works): If you want to make the ModelEntity class globally accessible (not a good practice but will solve the immediate issue):
    window.SketchMap = SketchMap;
    

});
