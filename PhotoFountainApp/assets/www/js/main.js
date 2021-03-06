var configs = {};

var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
var db;
// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);
document.addEventListener("load",onDeviceReady,false);

function onDeviceReady() {
	var share = new Share();
	share.show({
	    subject: 'I like turtles',
	    text: 'http://www.mndaily.com'},
	    function(yay) {alert('Share Success' + yay)}, // Success function
	    function(err) {alert('Share failed' + err)} // Failure function
	);
	Page_Load();
}
$(function() {
	//alert('this runs in phonegap too.')
	//onDeviceReady();
});


function Page_Load() {
	Configs_Load();
	
	if (configs["img_src"] != null) {
		//Load Image Source and Enable Links to Filters
		Message("img_src is not null");
		$("#SelectedPhotoImg").attr("src",configs["img_src"]);
	}
	
	if ((configs["pf_imgid"] <= 0)&&(configs["img_src"] == null)) {
		capturePhotoEdit();
	}
	
	
	 if ((configs["saved_img_src_1"] != null) || (configs["saved_img_src_2"] != null) || (configs["saved_img_src_3"] != null)) {
		//Show Share Page
		//Show all of the saved images.
		//Allow "share".
	 }
	 else if (configs["pf_imgid"] > 0) {
		// Image Should Be Uploaded and we should have a imgid=? back from the server.
		LoadFilterScreen();
		//Enable Save/Share button
	}
}

function addToFilterSelector(filterID) {
	
	if (( filterID > 0 )&&( configs["pf_imgid"] > 0 ))
	{
		var previewImage = "";
		//previewImage += "<label>";
		//previewImage += "	<input type=\"checkbox\" name=\"checkbox-" + filterID + "\" />";
		//previewImage += "	<img data-type=\"horizontal\" src=\"http://danfolkes.com/photofountain/wsi/getpic.php?id=" + configs["pf_imgid"] + "&width=300&filter=" + filterID + "\" />";
		//previewImage += "</label>";
		previewImage += "<div><input value=\"" + filterID + "\" onChange=\"SaveAndShareSelector_Change(this)\" type=\"checkbox\" name=\"checkbox-" + filterID + "\" id=\"checkbox-" + filterID + "\" data-role=\"none\" />";
		previewImage += "<label for=\"checkbox-" + filterID + "\" data-role=\"none\"><img src=\"http://danfolkes.com/photofountain/wsi/getpic.php?id=" + configs["pf_imgid"] + "&width=300&filter=" + filterID + "\" width=\"100%\" data-role=\"none\"/></label>";
		previewImage += "</div>";
		
		$("#SaveAndShareSelector").html($("#SaveAndShareSelector").html() + previewImage);
	}
}

function Configs_Load() {
	if (configs["pf_imgid"] == undefined) {
		//try and load from cookies
		try {
			configs = JSON.parse($.Storage.get("configs"));
		}
		catch (ex) {
			configs = {};
		}
		
		if (configs == null) configs = {};
		if (configs["pf_imgid"] == undefined) {
			//no, then get from db
			
			try {
				var db = window.openDatabase("PhotoFountainDB", "1.0", "PhotoFountainDB", 200000);
				db.transaction(function(tx) {
				    tx.executeSql('SELECT * FROM PhotoFountainTable', [], function(tx, results) {
				    	console.log("Returned rows = " + results.rows.length);
				    	for (var i=0; i<len; i++){
				    		Message("<br />Row = " + i + " Data =  " + results.rows.item(i).data);
				    		configs = JSON.parse(results.rows.item(i).data);
				        }
		    		}, function(err) {
					    Message("<br />Error processing SQL: "+err.code);
					});
				}, function(err) {
				    Message("<br />Error processing SQL: "+err.code);
				});	
			}
			catch (ex) {
				Message(ex);
			}

			//LoadDBUp();
			if (configs["pf_imgid"] == undefined) {
				//no, then load defaults:
				//alert ("loading defaults");
				
				var numRand = Math.random();
				
				configs = {};
				configs["key"]="value"; 
				configs["pf_imgid"]=-1; 
				configs["filterid_1"]=1; 
				configs["filterid_2"]=3; 
				configs["filterid_3"]=2; 
				configs["img_src"]=null; 
				configs["numRand"]=numRand;
				configs["saved_img_paths"] = "";
				configs["saved_img_src_1"] = null;
				configs["saved_img_src_2"] = null;
				configs["saved_img_src_3"] = null;
				configs["saved_img_src"] = [];
				
			}
		}
	}
}
function Configs_Reset() {
	// save configs to db
	$.Storage.remove("configs");
	Configs_Load();
}

function Configs_Save() {
	// save configs to db
	try {
		$.Storage.set("configs", JSON.stringify(configs));
	}
	catch (ex) {
		Message("Storage Fail:" + ex);
	}
	try {
		var db = window.openDatabase("PhotoFountainDB", "1.0", "PhotoFountainDB", 200000);
		db.transaction(function(tx) {
			 tx.executeSql('DROP TABLE IF EXISTS PhotoFountainTable ');
		     tx.executeSql('CREATE TABLE IF NOT EXISTS PhotoFountainTable (data)');
		     //if rows = 0;
		     tx.executeSql('INSERT INTO PhotoFountainTable (data) VALUES ("' + JSON.stringify(configs) + '")');
		}, function(err) {
		    Message("Error processing SQL: "+err.code);
		}, function() {
		    //alert("success!");
			Message("DB Configs_Save");
		});
	}
	catch (ex) {
		Message("DB Fail:" + ex);
	}
	
	return true;
}

function capturePhotoEdit() {
	try {
		pictureSource=navigator.camera.PictureSourceType;
		destinationType=navigator.camera.DestinationType;
		// Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
		navigator.camera.getPicture(function onPhotoDataSuccess(imageData) {
			configs["img_src"]=imageData;
			Message("<br/>capturePhotoEdit:" + configs["img_src"]);
			$("#main_image_selected").show();
			$("#main_image_not_selected").hide();
			$("#SelectedPhotoImg").attr("src","" + imageData);
	    }, function onFail(message) {
	    	Message('Error message: ' + message + '');
	    }, { quality: 10, allowEdit: true, destinationType: destinationType.FILE_URI });
	}
	catch (err) {
		// Could not load anything.
		Message(err);
	}
}

function getPhotoFromLIBRARY() {
    // Retrieve image file location from specified source
	try {
		navigator.camera.getPicture(function onPhotoDataSuccess(imageData) {
			configs["img_src"]=imageData;
			$("#main_image_selected").show();
			$("#main_image_not_selected").hide();
	    	$("#SelectedPhotoImg").attr("src","" + imageData);
	    }, function onFail(message) {
	    	Message('Error message: ' + message + '');
	    }, { quality: 10, destinationType: destinationType.FILE_URI, sourceType: pictureSource.PHOTOLIBRARY });
	}
	catch (err) {
		// Load with bull crap:
		Message(err);
		var imagePath = "images/4806075532_c52d727856_b.jpg";
		configs["img_src"]=imageData;
		$("#SelectedPhotoImg").attr("src",imagePath);
		$("#main_image_selected").show();
		$("#main_image_not_selected").hide();
		Configs_Save();
	}
  }
function LoadFilterScreen() {
	alert("LoadFilterScreen...");
	//$('#message').append(configs["pf_imgid"]);
	
	$("#SaveAndShareSelector").html("<legend>Check Items to Save and Share:</legend>");
	alert("configs[filterid_1]:" + configs["filterid_1"]);
	addToFilterSelector(configs["filterid_1"]);
	addToFilterSelector(configs["filterid_2"]);
	addToFilterSelector(configs["filterid_3"]);
	$.mobile.changePage( "#filter");
	//$("#SaveAndShareSelector input[type='checkbox']").checkboxradio("refresh"); 
	$("#upload a").hide();
	Configs_Save();
	
}

function Message(message, isGood) {
	var selector = "div.errormessage";
	if (isGood == true) {
		selector = "div.goodmessage";
	}
	if (message) {
		if ($(selector).html().length == 0) {
			$(selector).html($(selector).html() + "<a href='javascript:void(0);' onclick='Message(null,"+isGood+");'>Clear</a>");
		}
		$(selector).html($(selector).html() + message);
	}
	else {
		$(selector).html("");
	}
	console.log(message);
}
function SaveAndShareSelector_Change(checkbox) {
	if (checkbox.checked) {
		$(checkbox).parent().addClass("selected");
	} else {
		$(checkbox).parent().removeClass("selected");
	}
	
	
}
function UploadImage() {
	try {
		$("#upload .progress").show();
		var imageURI = configs["img_src"];
		Message(imageURI);
		var options = new FileUploadOptions();
	    options.fileKey="i";
	    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+""; 
	    //options.fileName = configs["img_src"];
	    options.mimeType="image/jpg";
	
	    var numRand = Math.random();
	    if (configs["numRand"]==undefined)
	    	configs["numRand"]=numRand;
		
	    var params = new Object();
	    params.r = configs["numRand"];
	    options.params = params;
	    
	    Message("<br/>r = " + configs["numRand"]);
	    Message("<br/>options.fileName = " + options.fileName);
	    var ft = new FileTransfer();
	    ft.upload(imageURI, encodeURI("http://danfolkes.com/photofountain/wsi/upload.php"), function(response) { 
	    	Message("<br/>Code = " + response.responseCode);
	    	Message("<br/>Response = " + response.response);
	    	Message("<br/>Sent = " + response.bytesSent);
	    	alert("POSTING...");
	    	//Must do:
	    	$.post( encodeURI("http://danfolkes.com/photofountain/wsi/upload.php"), { r: configs["numRand"] }, function( data ) {
				
				if (data.id > 0) {
		    		configs["pf_imgid"]=data.id; 
		    		alert("POSTED");
		    		$("#upload .progress").hide();
					LoadFilterScreen();
				}
				else {
					Message("FAILED: " + data.status);
					alert("FAILED: " + data.status);
				}
	    	}, "jsonp");
		}, function (error) {
	        Message("An error has occurred: Code = " + error.code);
	        Message(" | download error target " + error.target);
	        Message(" | upload error source" + error.source);
	    }, options);
	}
	catch (ex) {
		Message("<br/>Error on UploadImage: " + ex);
	}
	return false;
}
function DownloadImages() {
	alert("Downloading Images...");
	// for each selected checkbox
	//	get filterID from checkbox name
	//	download 
	$('#SaveAndShareSelector div input[type=checkbox]:checked').each(function(index) {
		var filterid = $(this).val();
	    if ( filterid > 0 )
		{
	    	//alert(filterid);
	    	
	    	var fileTransfer = new FileTransfer();
	    	var uri = encodeURI("http://danfolkes.com/photofountain/wsi/getpic.php?id=" + configs["pf_imgid"] + "&width=1000&filter=" + filterid);
	    	var localFileName = "id"+configs["pf_imgid"]+"filter"+filterid+".jpg";
	    	
	    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
	    		fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
	    			var localPath = fileEntry.fullPath;
	    			if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
	                    localPath = localPath.substring(7);
	                }
	    			
	    			fileTransfer.download(uri,localPath,
	    		    	    function(entry) {
	    		    	        console.log("download complete: " + entry.fullPath);
	    		    	        //var img = new Image();
	    		    	        var img = document.createElement('img');
	    		    	        img.src = entry.fullPath;
	    		    	        img.width = "50%";
	    		    	        //$(img).attr('src', entry.fullPath);
	    		    	        $(".imagestoshare").append(img);
	    		    	        
	    		    	        
	    		    	    },
	    		    	    function(error) {
	    		    	        console.log("download error source " + error.source);
	    		    	        console.log("download error target " + error.target);
	    		    	        console.log("upload error code" + error.code);
	    		    	    }
	    		    	);
	    		}, Message);
	    	}, Message);
		}
	});
}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}