(function(){
    var apiKey = "44bc1c89c13a0743511d56b1cdd03502";
    var apiUrl = "http://api.flickr.com/services/rest/?format=json&api_key=" + apiKey + "&nojsoncallback=1&method=";
    var getPhotoSetUrl = apiUrl + "flickr.photosets.getPhotos&photoset_id=";
    var getPhotoUrl = apiUrl + "flickr.photos.getSizes&photo_id=";
    var photos = [];
    var totalCount = 0;
    var loadedCount = 0;

    function getPhotoSet(id) {
        $("#loading").show();
        $("#load").hide();
        $.ajax({
            url: getPhotoSetUrl + id,
            dataType: "json",
            async: false,
            success: function(data) {
                var ps = data.photoset.photo;
                totalCount = ps.length;
                $.each(ps, function(i, p){
                    getPhoto(p.id);
                });
            }
        });
    }

    function getPhoto(photoId) {
        $.ajax({
            url: getPhotoUrl + photoId,
            dataType : "json",
            success: function(pd) {
                photos.push(pd.sizes.size);
                if (++loadedCount == totalCount){
                    $("#loading").hide();
                    $("#load").show();
                }
                if (!sizeRadioShow) {
                    showSizeRadios(pd.sizes.size);
                }
            }
        });
    }


    var sizeRadioShow = false;

    function showSizeRadios (photo) {
        sizeRadioShow = true;
        $.each(photo, function(index, p){
            var li = $("<li>");
            $("<input>").attr({
                "type": "radio",
                "name": "size",
                "class": "size",
                "value": index
            }).appendTo(li); 
            var text = p.label + " - " + p.width + "x" + p.height;
            $("<span>").text(text).appendTo(li);
            li.appendTo($("#sizes"));
        });
    }
    $(function(){
        $("#load").click(function(){
            getPhotoSet($("#setId").val());
        });
        $("#sizes").on("click", ".size", function(){
            var urls = "";
            var t = this;
            $.each(photos, function(i, p){
                urls += p[t.value].source + "\n";
            });
            $("#urls").val(urls);
        });
    });
})();
