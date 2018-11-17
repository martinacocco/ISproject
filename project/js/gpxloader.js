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
  clearMap();
  var url = gpxFiles[i];
  new L.GPX(url,{async: true}).on('loaded', function(e) {
    mymap.fitBounds(e.target.getBounds());
  }).addTo(mymap);
}

function clearMap() {
  mymap.eachLayer(function (layer) {
    if(layer instanceof L.Marker) {
      mymap.removeLayer(layer);
    }
    if (layer instanceof L.Polyline){
      mymap.removeLayer(layer);
    }
  });
}

function uploadXML() {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.gpx)$/;
    //Checks whether the file is a valid xml file
    if (regex.test($("#xmlFile").val())) {
        //Checks whether the browser supports HTML5
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var xmlDoc = e.target.result;
                clearMap();
                new L.GPX(xmlDoc,{async: true}).on('loaded', function(e) {
                  mymap.fitBounds(e.target.getBounds());
                }).addTo(mymap);
                return xmlDoc;
            }
            reader.readAsText($("#xmlFile")[0].files[0]);

        } else {
            alert("Sorry! Your browser does not support HTML5!");
        }
    } else {
        alert("Please upload a valid XML file!");
    }
}


// Main Function From where to execute all js code
$(function(){
    initMap();

    $(".tours-list").click(function(){
        var id = $(this).attr("id");
        var index = parseInt(id.replace("tour-", ""),10);

        displayGPX(index);

        $(this).next().slideToggle(300);
        for(var i = 0; i < gpxFiles.length; i++){
            if(i != index && $("#tour-" + i + "-Description").is(":visible")){
                $("#tour-" + i + "-Description").slideToggle(300);
            }
        }

    });

    $('#xmlForm').submit(function (event) {
        event.preventDefault();
        var xmlDoc = uploadXML();
        console.log(xmlDoc);
    });

});
