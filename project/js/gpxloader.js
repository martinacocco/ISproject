function gpxLoader(){
    var gpxFiles = ["https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/bartour.gpx",
    "https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/citycentremuseumtour.gpx",
    "https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/glasgowmust.gpx",
    "https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/westendtour.gpx"];

    var gpxResult = {"fail":false, "results": []};

    for(var i = 0; i < gpxFiles.length; i++){
        $.get(gpxFiles[i], function( data ) {
            gpxResult["results"].push(data);
        }).fail(function() {
            gpxResult["fail"] = true;
        });
    }
    return gpxFiles;
}
var mymap;
function initMap(){
  mymap = L.map('map').setView([55.86515, -4.25763], 13);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
  }).addTo(mymap);
}

function displayGPX(i){
  var result = gpxLoader();
  var url = result[i];
  new L.GPX(url,{async: true}).on('loaded', function(e) {
    mymap.fitBounds(e.target.getBounds());
  }).addTo(mymap);
}
