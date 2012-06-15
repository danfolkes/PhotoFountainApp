
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 
    var db;
    // Wait for Cordova to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);
    
    // Cordova is ready to be used!
    //
    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(populateDB, onFail, successCB);
        
        capturePhoto();
    }
    
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM DEMO', [], querySuccess, onFail);
    }
    
    // Populate the database 
    //
    function populateDB(tx) {
         tx.executeSql('DROP TABLE IF EXISTS DEMO');
         tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
         tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
         tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    }

    function successCB() {
    	db.transaction(queryDB, onFail);
    }
    function querySuccess(tx, results) {
    	var element = document.getElementById('errormessage');
        element.innerHTML += '<br />querySuccess:';
        var len = results.rows.length;
        element.innerHTML += '<br />DEMO table: ' + len + ' rows found.';
        for (var i=0; i<len; i++){
            console.log();
            element.innerHTML += "<br />Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data;
        }
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64 encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
      onFail("Sending Image...");
      $.post( "http://danfolkes.com/etc/aaa/im/pic.php?imgid=1&size=med", { s: imageData },
    	      function( data ) {
    	  			//this should just return an ID.
    	  			//then:
    	  			//smallImage2.src = http://danfolkes.com/etc/aaa/im/pic.php?imgid=1&savedFilterID=88
    	  			$("smallImage2").attr("src","http://danfolkes.com/etc/aaa/im/pic.php?imgid=1&size=sml");
    	          //onFail("data:" + data);
    	      }
    	    );
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
    	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
    	var element = document.getElementById('errormessage');
        element.innerHTML += '<br />Error message: '           + message             + '';
    }
    


    // onSuccess Geolocation
    //
    function onSuccess(position) {
        var element = document.getElementById('message');
        element.innerHTML += 'Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />' +
                            'Altitude: '           + position.coords.altitude              + '<br />' +
                            'Accuracy: '           + position.coords.accuracy              + '<br />' +
                            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                            'Heading: '            + position.coords.heading               + '<br />' +
                            'Speed: '              + position.coords.speed                 + '<br />' +
                            'Timestamp: '          + new Date(position.timestamp)          + '<br />';
    }
    
 	// onError Callback receives a PositionError object
    function onError(error) {
    	var element = document.getElementById('errormessage');
        element.innerHTML +='Error code: '           + error.code              		+ '<br />' +
        					'Error message: '        + error.message             	+ '<br />';

    }