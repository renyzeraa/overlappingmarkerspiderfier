

var mapLibsReady = 0;
function mapLibReadyHandler() {
  if (++ mapLibsReady < 2) return;

  var mapElement = document.getElementById('map_element');
  var map = new google.maps.Map(mapElement, 
    { 
        center: { 
                    lat: 52, 
                    lng: -1 
                }, 
                zoom: 7 
    });
  
  var iw = new google.maps.InfoWindow();
  function iwClose() { 
    iw.close(); 
  }
  google.maps.event.addListener(map, 'click', iwClose);
  var oOptions = { 
    keepSpiderfied: 'yes',
    circleSpiralSwitchover: 50
  }
  var oms = new OverlappingMarkerSpiderfier(map, oOptions);

  oms.addListener('format', function(marker, status) {
    var iconURL = status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED ? './marker-highlight.svg' :
      status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE ? './marker-plus.svg' :
      status == OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE ? './marker.svg' : 
      null;
    var iconSize = new google.maps.Size(23, 32);
    marker.setIcon({
      url: iconURL,
      size: iconSize,
      scaledSize: iconSize  // makes SVG icons work in IE
    });
  });
      
  for (var i = 0, len = window.mapData.length; i < len; i ++) {
    (function() {  // make a closure over the marker and marker data
      var markerData = window.mapData[i];  // e.g. { lat: 50.123, lng: 0.123, text: 'XYZ' }
      var marker = new google.maps.Marker({
        position: markerData,
        optimized: ! isIE  // makes SVG icons work in IE
      });
      google.maps.event.addListener(marker, 'click', iwClose);
      oms.addMarker(marker, function(e) {
        iw.setContent(markerData.text);
        iw.open(map, marker);
      });
    })();
  }

  window['map'] = map;  // for debugging/exploratory use in console
  window['oms'] = oms;  // ditto
}

// randomize some overlapping map data -- more normally we'd load some JSON data instead
var baseJitter = 2.5;
var clusterJitterMax = 0.1;
var rnd = Math.random;
var data = [];
var clusterSizes = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 12, 18, 24];
for (var i = 0; i < clusterSizes.length; i++) {
  var baseLon = -1 - baseJitter / 2 + rnd() * baseJitter;
  var baseLat = 52 - baseJitter / 2 + rnd() * baseJitter;
  var clusterJitter = clusterJitterMax * rnd();
  for (var j = 0; j < clusterSizes[i]; j ++) data.push({
    lng:  baseLon - clusterJitter + rnd() * clusterJitter,
    lat:  baseLat - clusterJitter + rnd() * clusterJitter,
    text: Math.round(rnd() * 100) + '% happy'
  });
}

window.mapData = data;