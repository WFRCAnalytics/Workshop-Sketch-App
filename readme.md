# App Setup

1. Clone or download this repository from Github
  
2. Setup ArcGIS Online Web maps
	- Create  Web Maps using Map Viewer (Classic version)
	- Add any relevant supporting layers and basemaps
	- Ensure the Web Map and included layers are shared with 'Everyone (public)'
	- Save the map
  	
3. Add any of the workshop features ('WS Points', 'WS Lines', 'WS Polygons') to the map to record comments
	1. To add a field:
		- navigate to the feature layer's 'Details' page, then click the 'Data' tab
		- click the 'Fields' button
		- click the '+ Add' button
		- create the field by providing a field name and data type
		- to add domains to the field:
			- click the field name in the list
			- click 'Create List' button
			- add values as needed
			- click the 'Save' button
	2. Create symbology for the feature(s)
		- if domains were added to the feature, the symbology can be generated based off the provided values
		- if domains were <ins>not</ins> created, dummy features with the desired attributes will need to be created
			- these should be placed outside of the study area and labled accordingly in the 'Notes' field
			- once the dummy features are created, you can assign symbols to those provided field values using the symbology editor
		- Once the symbology has been created/applied, click the 'Edit' button. You should be able to add features with the new symbols
		- click the 'Save' button
	3. Create a Form for the feature layer
		- click the app button (3x3 dots icon) in the top-right of the menu bar
		- select 'Field Maps Designer'
		- select the Web Map
		- underneath 'Layers', click the feature to be included in the editor widget 
		- using the 'Form builder' panel on the right, add the fields that the user will populate using the web app
			- if desired, the field can be setup with a dropdown selector or radio buttons
		- save the form by clicking the small 'Save to map' button in middle of the menu bar
		
4. Record the web map ID from the 'Details' section of the Web Map's 'Details' page
  
5. In a text editor, open config.json
	- to change the title of the app, edit the 'title' section
	- to add a sketchMap
		- copy and paste a sketchMap object code snippet and paste into the list of existing sketchMaps
		- Change the name of the sketchMap by updating the 'title' text
		- update the agolMapId  with the new Web Map ID
	- save the file and upload to the server
		
	
	