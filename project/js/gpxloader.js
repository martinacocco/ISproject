var gpxFiles = ["https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/bartour.gpx",
"https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/citycentremuseumtour.gpx",
"https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/glasgowmust.gpx",
"https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/westendtour.gpx"];

var mymap;
function initMap(){
  mymap = L.map('map').setView([55.86515, -4.25763], 13);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
  }).addTo(mymap);
}

function displayGPX(i){
  var url = gpxFiles[i];
  new L.GPX(url,{async: true}).on('loaded', function(e) {
    mymap.fitBounds(e.target.getBounds());
  }).addTo(mymap);
}


// Main Function From where to execute all js code
$(function(){
    initMap();

    $(".tours-list").click(function(){
        var id = $(this).attr("id");
        var index = parseInt(id.replace("tour-", ""),10);
        displayGPX(index);
    });
});
