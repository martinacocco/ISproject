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
    return gpxResult;
}
