var gpxFiles = ["https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/bartour.gpx",
    "https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/citycentremuseumtour.gpx",
    "https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/glasgowmust.gpx",
    "https://raw.githubusercontent.com/martinacocco/ISproject/master/project/GPX%20Files/westendtour.gpx"
];

var mymap;
function initMap() {
    var token ="pk.eyJ1IjoibWNvY2NvIiwiYSI6ImNqbjYwbDI1ZDE0ejEzdnJ1cG15NDJ4cXIifQ.duXi7u04FfnKiBRjlKpSIw"; // replace with your Mapbox API Access token. Create a Mabpox account and find it on https://www.mapbox.com/studio/

    mymap = L.map('map').setView([55.857161,-4.249356], 13);

    var gl = new L.mapboxGL({
        accessToken: token,
        style: 'mapbox://styles/mcocco/cjosz1lfb2o8q2skfx2mvrloa'
    }).addTo(mymap);

}

/*
 * Get a premade file from the defined list above by taking in an index
 * After retrieving the file, use the GPX library to parse it and display it on the map
 */

function displayGPX(i) {
    clearMap();
    var url = gpxFiles[i];
    new L.GPX(url, {
        async: true
    }).on('loaded', function(e) {
        mymap.fitBounds(e.target.getBounds());
        $("#tour-info-distance").text((this.get_distance() / 1000 ).toFixed(1));
        var tourSeconds = this.get_distance() / 1.4;
        var tourHours = Math.floor(tourSeconds / 3600);
        var tourMinutes = Math.floor(tourSeconds % 3600 / 60);
        $("#tour-info-time").text(tourHours.toString() + "h " + tourMinutes.toString() + "m");
    }).addTo(mymap);

}

//Gets rid of every tracks and markers
function clearMap() {
    mymap.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            mymap.removeLayer(layer);
        }
        if (layer instanceof L.Polyline) {
            mymap.removeLayer(layer);
        }
    });
}

/*
The function checks if the gpx files containes waypoints and trackpoints.
If these are missing it just returns appropriate error messages.
*/
function checkForMissingTags(target){
    numberWayPoints = $(target).find('wpt').length;
    numberTrackPoints = $(target).find('trkpt').length;

    response = []
    if(numberWayPoints == 0 && numberTrackPoints == 0){
        response.push("The map does not have markers nor pointers. Please Upload a valid tour.");
        response.push(false);
    }
    else if(numberWayPoints == 0){
        response.push("The map does not have markers. Only the path will be displayed.");
    }else if(numberTrackPoints == 0){
        response.push("The map does not have a path. Only markers will be displayed.");
    }

    return response;

}

// The function is used to display the error modal on the webpage.
function displayModal(text){
    $("#modalMessage").text(text);
    $("#errorModal").modal();
}

// The function is used upload and validate an .gpx file.
function uploadXML() {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.gpx)$/;
    //Checks whether the file is a valid xml file
    if (regex.test($("#xmlFile").val())) {
        var name = $("#xmlFile").val().replace(".gpx", "").replace("C:\\fakepath\\", "");
        //Checks whether the browser supports HTML5
        if (typeof(FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                try{
                    // Check if the xml format is valid
                    xmlDoc = $.parseXML(e.target.result);
                    // Check if the .gpx file has already been submitted.
                    if(gpxFiles.includes(e.target.result)){
                        displayModal("You have already uploaded this GPX file. Please, select another one.");
                        return;
                    }
                }catch(error){
                    displayModal("Please upload a valid GPX file.");
                    return;
                }

                // Check if the .gpx files containes all the necessary information
                // and process the response.
                var response = checkForMissingTags(xmlDoc);
                console.log(response);
                if(response.length == 2){
                    displayModal(response[0]);
                    return;
                }else if(response.length == 1){
                    displayModal(response[0]);
                }

                // If everything has been processed successfully just display
                // the gpx file and add it to the sidebar.
                gpxFiles.push(e.target.result);
                displayGPX(gpxFiles.length - 1);
                addToSidebar(gpxFiles.length - 1, name);
            }
            reader.readAsText($("#xmlFile")[0].files[0]);

        } else {
            displayModal("Sorry! Your browser does not support HTML5.");
        }

    } else {
        displayModal("Please upload a valid GPX file.");
    }
}

// The function is used to add new tours to the sidebar.
function addToSidebar(index, name) {
    $("#user-tours").append("<li id=tour-" + index + " class='list-group-item tours-list'>" + name + "</li>");
    $(".tours-list").click(function() {
        var id = $(this).attr("id");
        var index = parseInt(id.replace("tour-", ""), 10);
        displayGPX(index);
    });
}
// Main Function From where to execute all js code
$(function() {
    initMap();

    // Handle the click event. When a tour is clicked visualise it. 
    $(".tours-list").click(function() {
        var id = $(this).attr("id");
        var index = parseInt(id.replace("tour-", ""), 10);

        displayGPX(index);
        $(this).next().slideToggle(300);
        for (var i = 0; i < gpxFiles.length; i++) {
            if (i != index && $("#tour-" + i + "-Description").is(":visible")) {
                $("#tour-" + i + "-Description").slideToggle(300);
            }
        }
    });

    $('#xmlSubmitButton').click(function() {
        $("#xmlFile").click();
    });

    $("#xmlFile").change(function(){
        uploadXML();
        $("#xmlFile").val("")
    });


});
