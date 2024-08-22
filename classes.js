class SketchOption {
    constructor(data) {
        this.title    = data.title;
        this.htmlCode = data.htmlCode;
        this.fontSize = data.fontSize;
        this.color    = data.color;
    }
}


require([
    "esri/Map",
    "esri/views/MapView",
    "esri/WebMap",
    "esri/widgets/Expand",
    "esri/widgets/Legend"
  ], function(Map, MapView, WebMap, Expand, Legend) {
    // Now you can use Graphic inside this callback function
  
    class SketchMap {
        constructor(data) {
            this.title         = data.title;
            this.agolMapId     = data.agolMapId;
            this.icon          = data.icon;
            this.active        = data.active || false;
            this.sketchOptions = (data.sketchOptions || []).map(sketchOption => new SketchOption(sketchOption));
            this.menuItem      = document.createElement('calcite-menu-item');

        }

        createMenuItemElement() {

            console.log('onSelectMenu');

            this.menuItem.setAttribute('id', this.id);
            this.menuItem.setAttribute('text', this.title);
            this.menuItem.setAttribute('icon-start', this.icon);
            if (this.active) {
                this.menuItem.setAttribute('active', '')
            }
        
            const menuItemInstance = this;

            this.menuItem.addEventListener('click', function() {
                console.log('this.menuItem:click');


                //let menuItems = document.querySelectorAll('calcite-menu-item');
                //menuItems.forEach(item2 => {
                //if(item2.text === menuItemInstance.menuText) {  // Use the saved instance context here
                //    item2.active = true;
                //} else {
                //    item2.active = false;
                //}
                //});


                menuItemInstance.onSelectMenu();
            });
            return this.menuItem;
        }

        onSelectMenu() {
            console.log('onSelectMenu');

            // Create a new WebMap instance using the provided ID
            var webmap = new WebMap({
                portalItem: {
                id: this.agolMapId
                }
            });
        
            // Create a MapView instance to display the WebMap
            var mapView = new MapView({
                container: "mainMapView",  // Reference to the DOM node that will contain the view
                map: webmap,           // The WebMap instance created above
                zoom: 10               // Optional: Set an initial zoom level
            });
        

            // CREATE SIDE PANEL

            // Create a container for the widget content
            const contentContainer = document.createElement('div');
            contentContainer.className = 'side-panel-container';
            
            // Add some descriptive text
            const sketchOptionDialogText = document.createElement('div');
            sketchOptionDialogText.innerHTML = '<h1>Sketch Options<h1>';

            let tableHTML = '<table width="100%">';

            // First row for htmlCode
            tableHTML += '<tr>';
            for (let i = 0; i < this.sketchOptions.length; i += 3) {
                for (let j = 0; j < 3; j++) {
                    if (i + j < this.sketchOptions.length) {
                        let option = this.sketchOptions[i + j];
                        tableHTML += `<td width="33%" align="center">
                            <span style="font-size:${option.fontSize};color:${option.color};">${option.htmlCode}</span>
                        </td>`;
                    } else {
                        tableHTML += '<td width="33%" align="center"></td>'; // Empty cell if fewer than 3 items in this row
                    }
                }
                tableHTML += '</tr>';
                
                // Second row for title
                tableHTML += '<tr>';
                for (let j = 0; j < 3; j++) {
                    if (i + j < this.sketchOptions.length) {
                        let option = this.sketchOptions[i + j];
                        tableHTML += `<td width="33%" align="center">
                            <span>${option.title}</span>
                        </td>`;
                    } else {
                        tableHTML += '<td width="33%" align="center"></td>'; // Empty cell if fewer than 3 items in this row
                    }
                }
                tableHTML += '</tr>';
            }
    
            tableHTML += '</table>';

            sketchOptionDialogText.innerHTML += tableHTML;

            contentContainer.appendChild(sketchOptionDialogText);

            
            // Create the Expand widget
            const expandSketchPanel = new Expand({
                view: mapView,
                content: contentContainer,
                expandIcon: "pencil",
                expanded: true,
                expandTooltip: 'Scenario Selector',
                group: "top-right"
            });

            // Add the Expand widget to the view
            mapView.ui.add(expandSketchPanel, "top-right");

            this.legend = new Legend({
                view: mapView
            });

            //mapView.ui.add(this.legend, "bottom-right");
              
            // Create the Expand widget
            this.expandLengend = new Expand({
                view: mapView,
                content: this.legend,
                expandIcon: "legend",
                expanded: false,
                expandTooltip: 'Show Legend',
                group: "top-right"
            });
      
            // Add the Expand widget to the view
            mapView.ui.add(this.expandLengend, "top-right");

        }
    }

    // Export ModelEntity to the global scope
    // Exporting to Global Scope (Not recommended but works): If you want to make the ModelEntity class globally accessible (not a good practice but will solve the immediate issue):
    window.SketchMap = SketchMap;


});