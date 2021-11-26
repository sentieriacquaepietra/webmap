// intial map settings
var mymap = L.map('map',
	{
		zoomControl:false,//custom zoom control
		minZoom: 10,
    maxZoom: 18,
		maxBounds: [[41.15, 13], [42.5, 15]],
}).setView([41.55518701, 14.087], 11);

// custom zoom control
L.control.zoom({
    position:'topright'// default is topleft
}).addTo(mymap);

L.control.scale().addTo(mymap); // add scale bar

// custom full screen control
mymap.addControl(new L.Control.Fullscreen({
	position:'topright'
}));

// custom attribution
mymap.attributionControl.addAttribution('powered by<a href="http://www.naturagis.it" target="_blank"> <img src ="https://www.naturagis.it/wp-content/uploads/2021/10/NG-minimini.png" width = "15px"> naturagis</a>');

// loading some basemaps
var IGM = L.tileLayer('https://ludovico85.github.io/custom_XYZ_tiles/IGM_cisav/{z}/{x}/{-y}.png', {
    tms: true,
	opacity: 1,
	attribution: '<a href="https://github.com/ludovico85/custom_XYZ_tiles">IGM</a>'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(mymap);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var CyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var baseMaps = {
	"Esri World Imagery": Esri_WorldImagery,
	"Estratto IGM 1:25.000": IGM,
	"OpenStreetMap": OpenStreetMap_Mapnik,
	"CyclOSM": CyclOSM,
};

// loading geoJson
// custom icon for poi acquedotto
var custom_icon = new L.ExtraMarkers.icon ({
	icon: 'fa-tint',
	prefix: 'fa',
	shape: 'circle',
	markerColor: 'orange-dark'
});

// function for categorized symbols
// presidio
function presidio_style(feature, latlng) {
	switch(feature.properties["presidio"]){
		case "Fontana":
			var fontanaIcon = new L.ExtraMarkers.icon ({
				icon: 'fa-faucet',
				prefix: 'fa',
    		markerColor: 'cyan',
			});
			return L.marker(latlng, {icon: fontanaIcon});
		case "Sorgente":
			var sorgenteIcon = new L.ExtraMarkers.icon ({
				icon: 'fa-tint',
				prefix: 'fa',
    		markerColor: 'blue-dark',
			});
			return L.marker(latlng, {icon: sorgenteIcon});
		case "Opere idrauliche":
			var opereIcon = new L.ExtraMarkers.icon ({
				icon: 'fa-tint-slash',
				prefix: 'fa',
    			markerColor: 'purple'
			});
			return L.marker(latlng, {icon: opereIcon});
		case "Corso d'acqua":
			var corsoIcon = new L.ExtraMarkers.icon ({
				icon: 'fa-stream',
				iconColor: '#1e91d3',
				prefix: 'fa',
    		markerColor: 'white',
			});
			return L.marker(latlng, {icon: corsoIcon});
		};
	};
	// function for categorized symbols
	// descriptio
	function descriptio_style(feature, latlng) {
		switch(feature.properties["descriptio"]){
			case "Tabella informativa":
				var tabellaIcon = new L.ExtraMarkers.icon ({
					icon: 'fa-info',
					prefix: 'fas',
	    		markerColor: 'green',
					shape: 'square',
				});
				return L.marker(latlng, {icon: tabellaIcon});
			case "Punti d'interesse":
				var poiIcon = new L.ExtraMarkers.icon ({
					icon: 'fa-map-marker-alt',
					prefix: 'fas',
	    		markerColor: 'blue-dark',
					shape: 'square',
				});
				return L.marker(latlng, {icon: poiIcon});
			case "Murales":
				var muralesIcon = new L.ExtraMarkers.icon ({
					icon: 'fa-dragon',
					prefix: 'fas',
	    		markerColor: 'green-light',
					shape: 'square',
				});
				return L.marker(latlng, {icon: muralesIcon});
			case "Fontana della memoria":
				var memoriaIcon = new L.ExtraMarkers.icon ({
					icon: 'fa-comment-dots',
					prefix: 'fas',
	    		markerColor: 'green-dark',
					shape: 'square',
				});
				return L.marker(latlng, {icon: memoriaIcon});
			};
		};

// loading poi_acquedotto geoJson
var poi_acquedotto = new L.geoJson(poi_acquedotto, {
	pointToLayer: function (feature, layer) {
    return L.marker(layer, {icon: custom_icon});},
	onEachFeature: function (feature, layer) {
	layer.bindPopup('<table class="table"><tbody><tr><td>Località</td><td>'+feature.properties.Localita+'</td></tr><tr><td>Comune</td><td>'+feature.properties.Comune+'</td></tr><tr><td colspan="2"><img src=' + feature.properties.Foto_low +' " width=100%/></td></tr><tr><td colspan = "2">'+feature.properties.Credits+'</td></tr><tr><td>Descrizione</td><td>'+feature.properties.Descrizione+'</td></tr><tr><tr class="text-center"><td colspan="2"><a href="'+feature.properties.href+'" class="btn btn-primary btn-sm" role="button" target="_blank">Mostra a schermo intero</a></td></tr></tbody></table>')}
}).addTo(mymap);

// filter cisav point based on presidio attribute
var cisav_sorgenti = new L.geoJson(cisav_acque, {
	filter: function (feature, layer) {
	return (feature.properties.presidio === "Sorgente")},
	pointToLayer: presidio_style,
	style: presidio_style,
	onEachFeature: function (feature, layer) {
	layer.bindPopup('<table class="table"><tbody><tr><td>Denominazione</td><td>'+feature.properties.Denominazione+'</td></tr><tr><td>Comune</td><td>'+feature.properties.Comune+'</td></tr><tr><td>Tipo di presidio</td><td>'+feature.properties.presidio+'</td></tr></tr><tr><td>Quota m s.l.m.</td><td>'+feature.properties.Quota+'</td></tr><tr><td>Descrizione</td><td>'+feature.properties.Descrizione+'</td></tr><tr><td>Fonte dati</td><td>'+feature.properties.Fonte+'</td></tr><tr><tr class="text-center"><td colspan="2">'+feature.properties.link_button+'</td></tr></tbody></table>')}
}).addTo(mymap);

var cisav_fontane = new L.geoJson(cisav_acque, {
	filter: function (feature, layer) {
	return (feature.properties.presidio === "Fontana")},
	pointToLayer: presidio_style,
	style: presidio_style,
	onEachFeature: function (feature, layer) {
	layer.bindPopup('<table class="table"><tbody><tr><td>Denominazione</td><td>'+feature.properties.Denominazione+'</td></tr><tr><td>Comune</td><td>'+feature.properties.Comune+'</td></tr><tr><td>Tipo di presidio</td><td>'+feature.properties.presidio+'</td></tr></tr><tr><td>Quota m s.l.m.</td><td>'+feature.properties.Quota+'</td></tr><tr><td>Descrizione</td><td>'+feature.properties.Descrizione+'</td></tr><tr><td>Fonte dati</td><td>'+feature.properties.Fonte+'</td></tr><tr><tr class="text-center"><td colspan="2">'+feature.properties.link_button+'</td></tr></tbody></table>')}
}).addTo(mymap);

var cisav_opere_idrauliche = new L.geoJson(cisav_acque, {
	filter: function (feature, layer) {
	return (feature.properties.presidio === "Opere idrauliche")},
	pointToLayer: presidio_style,
	style: presidio_style,
	onEachFeature: function (feature, layer) {
		layer.bindPopup('<table class="table"><tbody><tr><td>Denominazione</td><td>'+feature.properties.Denominazione+'</td></tr><tr><td>Comune</td><td>'+feature.properties.Comune+'</td></tr><tr><td>Tipo di presidio</td><td>'+feature.properties.presidio+'</td></tr></tr><tr><td>Quota m s.l.m.</td><td>'+feature.properties.Quota+'</td></tr><tr><td>Descrizione</td><td>'+feature.properties.Descrizione+'</td></tr><tr><td>Fonte dati</td><td>'+feature.properties.Fonte+'</td></tr><tr><tr class="text-center"><td colspan="2">'+feature.properties.link_button+'</td></tr></tbody></table>')}
}).addTo(mymap);

var cisav_corso_acqua = new L.geoJson(cisav_acque, {
	filter: function (feature, layer) {
	return (feature.properties.presidio === "Corso d'acqua")},
	pointToLayer: presidio_style,
	style: presidio_style,
	onEachFeature: function (feature, layer) {
		layer.bindPopup('<table class="table"><tbody><tr><td>Denominazione</td><td>'+feature.properties.Denominazione+'</td></tr><tr><td>Comune</td><td>'+feature.properties.Comune+'</td></tr><tr><td>Tipo di presidio</td><td>'+feature.properties.presidio+'</td></tr></tr><tr><td>Quota m s.l.m.</td><td>'+feature.properties.Quota+'</td></tr><tr><td>Descrizione</td><td>'+feature.properties.Descrizione+'</td></tr><tr><td>Fonte dati</td><td>'+feature.properties.Fonte+'</td></tr><tr><tr class="text-center"><td colspan="2">'+feature.properties.link_button+'</td></tr></tbody></table>')}
}).addTo(mymap);


// filter mancini point based on presidio descriptio
var table = new L.geoJson(mancini, {
	filter: function (feature, layer) {
	return (feature.properties.descriptio === "Tabella informativa")},
	pointToLayer: descriptio_style,
	style: descriptio_style,
	onEachFeature: function (feature, layer) {
	layer.bindPopup('<table class="table"><tbody><tr><td>Denominazione</td><td>'+feature.properties.Name+'</td></tr><tr><td>Descrizione</td><td>'+feature.properties.descriptio+'</td></tr><tbody></table>')}
}).addTo(mymap);

var murales = new L.geoJson(mancini, {
	filter: function (feature, layer) {
	return (feature.properties.descriptio === "Murales")},
	pointToLayer: descriptio_style,
	style: descriptio_style,
	onEachFeature: function (feature, layer) {
	layer.bindPopup('<table class="table"><tbody><tr><td>Denominazione</td><td>'+feature.properties.Name+'</td></tr><tr><td>Descrizione</td><td>'+feature.properties.descriptio+'</td></tr><tbody></table>')}
}).addTo(mymap);

var memoria = new L.geoJson(mancini, {
	filter: function (feature, layer) {
	return (feature.properties.descriptio === "Fontana della memoria")},
	pointToLayer: descriptio_style,
	style: descriptio_style,
	onEachFeature: function (feature, layer) {
	layer.bindPopup('<table class="table"><tbody><tr><td>Denominazione</td><td>'+feature.properties.Name+'</td></tr><tr><td>Descrizione</td><td>'+feature.properties.descriptio+'</td></tr><tbody></table>')}
}).addTo(mymap);

var infopoint = new L.geoJson(mancini, {
	filter: function (feature, layer) {
	return (feature.properties.descriptio === "Punti d'interesse")},
	pointToLayer: descriptio_style,
	style: descriptio_style,
	onEachFeature: function (feature, layer) {
	layer.bindPopup('<table class="table"><tbody><tr><td>Denominazione</td><td>'+feature.properties.Name+'</td></tr><tr><td>Descrizione</td><td>'+feature.properties.descriptio+'</td></tr><tbody></table>')}
});


// load sentieri
var fiume_volturno = new L.geoJson(fiume_volturno, {
	weight: 6,
  lineCap: 'round',
  color: '#0B84EE'
}).addTo(mymap);
fiume_volturno.bindTooltip("Fiume Volturno",  {sticky: true});

var dorsale_sentiero = new L.geoJson(dorsale_sentiero, {
	weight: 5,
	color: 'red',
	dashArray: '5, 10',
	onEachFeature: function(feature, layer){
        layer.bindTooltip(feature.properties.Tratto, {sticky: true})}
}).addTo(mymap);

// create overlaymaps for L.control.layers with custom icons
//var overlayMaps = {
//    '<img src = ico/fontane.png width="25px">Fontane': cisav_fontane,
//    '<img src = ico/sorgenti.png width="25px">Sorgenti': cisav_sorgenti,
//		'<img src = ico/corso_acqua.png width="25px">Corsi d&#8217acqua':cisav_corso_acqua,
//		'<img src = ico/opere_idrauliche.png width="25px">Opere idrauliche':cisav_opere_idrauliche,
//		'<img src = ico/poi.png width="25px">POI Acquedotto romano di Venafro':poi_acquedotto,
//};

// create grouped overlaymaps for L.control.groupedLayers with custom icons
var groupedOverlays = {
	"Sentiero di Acqua e Pietra:<br>Il racconto delle comunità" : {
		'<img src = ico/fontane.png width="25px">Fontane': cisav_fontane,
    '<img src = ico/sorgenti.png width="25px">Sorgenti': cisav_sorgenti,
		'<img src = ico/corso_acqua.png width="25px">Corsi d&#8217acqua':cisav_corso_acqua,
		'<img src = ico/opere_idrauliche.png width="25px">Opere idrauliche':cisav_opere_idrauliche,
	},
	"Sentiero di Acqua e Pietra:<br>Camminare nell’Acqua e nella Pietra":{
		'<img src = ico/table.png width="25px">Tabella informativa': table,
    '<img src = ico/murales.png width="25px">Murales': murales,
		'<img src = ico/memoria.png width="25px">Fontana della memoria':memoria,
	},
	"Sentiero di Acqua e Pietra:<br>L'acquedotto romano tra passato e futuro":{
		'<img src = ico/poi.png width="25px">POI Acquedotto romano di Venafro':poi_acquedotto,
	},
	"Rete dei sentieri":{
		'<i class="fas fa-wave-square fa-2x" style="color:#0B84EE"></i> Fiume Volturno':fiume_volturno,
		'<i class="fas fa-wave-square fa-2x" style="color:red"></i> Sentiero':dorsale_sentiero,
	},
};

//L.control.layers(baseMaps, overlayMaps, {collapsed: true}).addTo(mymap);
L.control.groupedLayers(baseMaps, groupedOverlays, {collapsed: false}).addTo(mymap);

// sidebar
// create the sidebar instance and add it to the map
var sidebar = L.control.sidebar({container:'sidebar'}).addTo(mymap).open('home');
// add panels dynamically to the sidebar

// be notified when a panel is opened
sidebar.on('content', function (ev) {
switch (ev.id) {
case 'autopan':
sidebar.options.autopan = true;
break;
default: sidebar.options.autopan = false;
}
});
