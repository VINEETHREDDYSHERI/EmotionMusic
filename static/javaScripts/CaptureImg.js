// The buttons to open WEBCAM and to take the photo
var webcamBtn = document.getElementById( "openCamBtn" );
var photoCaptureBtn = document.getElementById( "takePhotoBtn" );

var stream = document.getElementById( "stream" );
var capture = document.getElementById( "capture" );
var snapshot = null;
var cameraStream = null;

// Adding EventListeners
webcamBtn.addEventListener( "click", openWebcam );
photoCaptureBtn.addEventListener( "click", captureSnapshot );

// Opening WEBCAM
function openWebcam() {
	var mediaSupport = 'mediaDevices' in navigator;

	if( mediaSupport && cameraStream == null ) {

		navigator.mediaDevices.getUserMedia( { video: true } )
		.then( function( mediaStream ) {
			cameraStream = mediaStream;
			stream.srcObject = mediaStream;
			stream.play();
		})
		.catch( function( err ) {
			console.log( "There is an issue while accessing the Camera: " + err );
		});
		document.getElementById('photo').classList.add("hidden");
        document.getElementById('cam').classList.remove("hidden");
        document.getElementById('openCamBtn').classList.add("hidden");
        document.getElementById('takePhotoBtn').classList.remove("hidden");
        document.getElementById('submitCaptureImg').classList.add("hidden");
	}
	else {
		alert( "The browser doesn't support media devices." );
		return;
	}
}

// To stop WEBCAM
function closeWebcam() {
	if(cameraStream) {
		var cameraTrack = cameraStream.getTracks()[0];
		cameraTrack.stop();
		stream.load();
		cameraStream = null;
	}
}

// To Take the photo
function captureSnapshot() {

	if(cameraStream) {
		var ctx = capture.getContext( '2d' );
		var img = new Image();
		ctx.drawImage( stream, 0, 0, capture.width, capture.height );
		img.src = capture.toDataURL( "image/png" );
		img.width = 240;
		snapshot = capture.toDataURL( "image/png" );
		closeWebcam();
		document.getElementById('cam').classList.add("hidden");
        document.getElementById('photo').classList.remove("hidden");
        document.getElementById('takePhotoBtn').classList.add("hidden");
        document.getElementById('openCamBtn').classList.remove("hidden");
        document.getElementById('submitCaptureImg').classList.remove("hidden");
	}
}

function submitImg()
{
    var request = new XMLHttpRequest();
    request.open( "POST", "/getEmotion", true );
    var data	= new FormData();
    var dataURI	= snapshot;
    var imageData   = dataURItoBlob( dataURI );
    data.append( "fileUpload", imageData);

    request.onreadystatechange = function() {
      if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
        console.log("123",request.response)
        window.location.href = '/result';
      }
    }
    request.send( data );
}

function dataURItoBlob( dataURI ) {
	var byteString = atob( dataURI.split( ',' )[ 1 ] );
	var mimeString = dataURI.split( ',' )[ 0 ].split( ':' )[ 1 ].split( ';' )[ 0 ];
	var buffer	= new ArrayBuffer( byteString.length );
	var data	= new DataView( buffer );
	for( var i = 0; i < byteString.length; i++ ) {
		data.setUint8( i, byteString.charCodeAt( i ) );
	}
	return new Blob( [ buffer ], { type: mimeString } );
}