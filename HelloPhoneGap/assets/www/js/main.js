var configs=new Array(); 





var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
var db;
// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);
document.addEventListener("load",onDeviceReady,false);

function onDeviceReady() {
	Page_Load();
}
$(function() {
	onDeviceReady();
});

function Page_Load() {
	alert("Page Load");
	Configs_Load();
	if (configs["pf_imgid"] <= 0) {
		if (configs["img_src"] != null || configs["img_Base64"] != null ) {
			//Load Image Source and Enable Links to Filters
			$("#SelectedPhotoImg").attr("src","data:image/jpeg;base64," + configs["img_Base64"]);
			// or $("#SelectedPhotoImg").attr("src",configs["img_src"]);
			
			$("#main_image_selected").show();
			$("#main_image_not_selected").hide();
		}
		else {
			// Defaut:
			//Load Camera
			$("#main_image_selected").hide();
			$("#main_image_not_selected").show();
			
			capturePhotoEdit();
			Configs_Save();
		}
	}
	else if (configs["pf_imgid"] > 0) {
		// Image Should Be Uploaded and we should have a imgid=? back from the server.
		
		//$(".modify_selector_imgs").append(previewImage1);
		//$(".modify_selector_imgs").append(previewImage2);
		//$(".modify_selector_imgs").append(previewImage3);
		//TODO: get share configs and load that up
		//Enable Save/Share button
	}
	else if (configs["saved_img_paths"].length > 0) {
		//Show Share Page
		//Show all of the saved images.
		//Allow "share".
	}
}


function Configs_Load() {
	// try and get from DB, 
	if (false) {
		
	}
	else if (configs.length == 0) {
		configs["key"]="value"; 
		configs["pf_imgid"]=-1; 
		configs["img_src"]=null; 
		configs["img_Base64"]=null; 
		configs["img_Base64"]=null; 
		var numRand = Math.random();
		configs["numRand"]=numRand;
	}
	//Check for GeoLocation.
}
function Configs_Save() {
	// save configs to db
	return true;
}

function capturePhotoEdit() {
	try {
		pictureSource=navigator.camera.PictureSourceType;
		destinationType=navigator.camera.DestinationType;
		// Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
		navigator.camera.getPicture(function onPhotoDataSuccess(imageData) {
			configs["img_Base64"]=imageData;
	    	$("#SelectedPhotoImg").attr("src","data:image/jpeg;base64," + imageData);
	    }, function onFail(message) {
	    	var element = document.getElementById('errormessage');
	        element.innerHTML += '<br />Error message: '           + message             + '';
	    }, { quality: 100, allowEdit: true, destinationType: destinationType.DATA_URL });
	}
	catch (err) {
		// Load with bull crap:
		var imageData = "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";
		configs["img_Base64"]=imageData;
		$("#SelectedPhotoImg").attr("src","data:image/jpeg;base64," + imageData);
		$("#main_image_selected").show();
		$("#main_image_not_selected").hide();
	}
}

function UploadImage() {
	   
		$.post( "http://danfolkes.com/etc/aaa/im/upload.php", { i: configs["img_Base64"], r: configs["numRand"] }, function( data) {
			
		}).complete(function() { 
			
			$.post( "http://danfolkes.com/etc/aaa/im/upload.php", { r: configs["numRand"] }, function( data ) {
				$("#upload .status").append(data.status);
				$("#upload .progress").hide();
				$('#message').append(data.id);
				var previewImage = "";
				previewImage += "<div class=\"modify_selector_img\">";
				previewImage += "<input type=\"checkbox\" />";
				previewImage += "<a onclick=\"alert('clicked');\"><img src=\"http://danfolkes.com/etc/aaa/im/i/usr/1/" + data.id + "_sml.jpg\" /></a>";
				previewImage += "<div class=\"sharebutton\" onclick=\"alert('clicked');\" >SHARE>></div>";
				previewImage += "</div>";
				$(".modify_selector_imgs").append(previewImage);
				
			}, "jsonp");
		});
		return false;
}


















/*







    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 
    var db;
    // Wait for Cordova to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);
    
    // Cordova is ready to be used!
    //
    function onDeviceReady() {
        db = window.openDatabase("Database", "1.0", "PhotoFountain", 200000);
        
        LoadDBUp();
        
        if ($("#index-flag").length > 0)
    	{
        	capturePhotoEdit();
    	}
        else if ($("#edit-flag").length > 0)
    	{
        	
        	pictureSource=navigator.camera.PictureSourceType;
            destinationType=navigator.camera.DestinationType;
        	navigator.geolocation.getCurrentPosition(function onSuccess(position) {
                var element = document.getElementById('message');
                element.innerHTML += 'Latitude: '           + position.coords.latitude              + '<br />' +
                                    'Longitude: '          + position.coords.longitude             + '<br />' +
                                    'Altitude: '           + position.coords.altitude              + '<br />' +
                                    'Accuracy: '           + position.coords.accuracy              + '<br />' +
                                    'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                                    'Heading: '            + position.coords.heading               + '<br />' +
                                    'Speed: '              + position.coords.speed                 + '<br />' +
                                    'Timestamp: '          + new Date(position.timestamp)          + '<br />';
            }, onError);
        	uploadCapturedPhoto("imageDataFromDB");
    	}
    }
    function LoadDBUp() {
    	db.transaction(function populateDB(tx) {
            tx.executeSql('DROP TABLE IF EXISTS Configs');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Configs (id unique, key, value)');
            tx.executeSql('INSERT INTO Configs (id, key, value) VALUES (NULL, "imgpath", "")');
            tx.executeSql('INSERT INTO Configs (id, key, value) VALUES (NULL, "imgBASE64", "")');
            tx.executeSql('INSERT INTO Configs (id, key, value) VALUES (NULL, "filterids", "1")');
        }, onFail, function successCB() {
        	db.transaction(function queryDB(tx) {
                tx.executeSql('SELECT * FROM Configs', [], function querySuccess(tx, results) {
                	var element = document.getElementById('errormessage');
                    element.innerHTML += '<br />querySuccess:';
                    var len = results.rows.length;
                    element.innerHTML += '<br />Configs table: ' + len + ' rows found.';
                    for (var i=0; i<len; i++){
                        console.log();
                        element.innerHTML += "<br />Row = " + i + " ID = " + results.rows.item(i).id + " key =  " + results.rows.item(i).key+ " value =  " + results.rows.item(i).value;
                    }
                }, onFail);
            }, onFail);
        });
    }
    function uploadCapturedPhoto(imageData)
    {
    	    imageData = "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";
    	    var numRand = Math.random();
    	    
			$.post( "http://danfolkes.com/etc/aaa/im/upload.php", { i: imageData, r: numRand }, function( data ) {
				alert('hi');
				
			}).complete(function() { 
				$.post( "http://danfolkes.com/etc/aaa/im/upload.php", { r: numRand }, function( data ) {
					$('#message').append(data.id);
					var previewImage = "";
					previewImage += "<div class=\"modify_selector_img\">";
					previewImage += "<input type=\"checkbox\" />";
					previewImage += "<a onclick=\"alert('clicked');\"><img src=\"http://danfolkes.com/etc/aaa/im/i/usr/1/" + data.id + "_sml.jpg\" /></a>";
					previewImage += "<div class=\"sharebutton\" onclick=\"alert('clicked');\" >SHARE>></div>";
					previewImage += "</div>";
					$(".modify_selector_imgs").append(previewImage);
					
				}, "jsonp");
			});
    }
    
    function selectImageToModify(me) {
    	var $checkbox = $(me).find(':checkbox');
    	$checkbox.attr('checked', !$checkbox.attr('checked'));
    }
    
    

    function UpdateDBwithImageData(imageData) {
    	db.transaction(function populateDB(tx) {
            tx.executeSql('UPDATE Configs SET value="' +imageData+ '" WHERE key="imgBASE64"');
        }, onFail, function successCB() {
        	db.transaction(function queryDB(tx) {
                tx.executeSql('SELECT * FROM Configs', [], function querySuccess(tx, results) {
                	var element = document.getElementById('errormessage');
                    var len = results.rows.length;
                    element.innerHTML += '<br />2-Configs table: ' + len + ' rows found.';
                    for (var i=0; i<len; i++){
                        console.log();
                        element.innerHTML += "<br />Row = " + i + " ID = " + results.rows.item(i).id + " key =  " + results.rows.item(i).key+ " value =  " + results.rows.item(i).value;
                    }
                }, onFail);
            }, onFail);
        });
    
    }

    // Called when a photo is successfully retrieved
    //
    


    
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, 
        destinationType: destinationType.DATA_URL,
        sourceType: source });
    }
    
    function onFail(message) {
    	var element = document.getElementById('errormessage');
        element.innerHTML += '<br />Error message: '           + message             + '';
    }
    


    
 	// onError Callback receives a PositionError object
    function onError(error) {
    	var element = document.getElementById('errormessage');
        element.innerHTML +='Error code: '           + error.code              		+ '<br />' +
        					'Error message: '        + error.message             	+ '<br />';

    }

*/