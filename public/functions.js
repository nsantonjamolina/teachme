/* INICIALIZACIÓN DE TODA PÁGINA*/

$(document).ready(
	function(){
		var user = firebase.auth().currentUser;
		firebase.auth().onAuthStateChanged(function(user) {
			if (user !== null) {
				console.log(user.email)
				$("#intranetButton").show();
				$("#logoutButton").show();
				$("#profesorButton").show();
				$("#areaProfesorButton").hide();
				$("#logoutButton").show();
				$("#logginButton").hide();
				$("#registrateButton").hide();
			} else {
				console.log("Sorry, no hay user");	
				$("#tablaContrataClase").hide();	
				$("#intranetButton").hide();
				$("#logoutButton").hide();
				$("#areaProfesorButton").hide();
				$("#logginButton").show();
				$("#registrateButton").show();
				$("#profesorButton").show();
				$("#logoutButton").click();	
			}
		})
	}
);


var u;

// TO-DO: ESTO VALE PARA ALGO???

function crearDesdeRegistro(email, password){
		
		
		var email = email;
		var password = password;
		
		if (email != "" & password != ""){
			
			
			firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
       			u = firebase.auth().currentUser;
				if(u){
										
					$("#loginbutton").hide();
					$("#registrateButton").hide();
					// Esto va bien
					$("#logginButton").hide();
					
					$("#loginProgress").show();
					$("#intranetButton").show();
					$("#logoutButton").show();
					
					
				}
			}).catch(function(error) {
				// Handle Errors here.
				$("#loginError").show().text(error.message);	
				var errorCode = error.code;
  				var errorMessage = error.message;
  				console.log(errorCode);
				console.log(errorMessage);
			});
		}
	
};




/*
		BOTONES
*/


/* MODAL LOGIN */


$("#logginButton").click(
	function(){
		
		var user = firebase.auth().currentUser;
		firebase.auth().onAuthStateChanged(function(user) {
			if (user !== null) {
				
    	// User is signed in.	  
	  	$(".login-cover").hide();
	  		
		var dialog = document.querySelector('#loginDialog');
  		if (! dialog.showModal) {
      		dialogPolyfill.registerDialog(dialog);
    	}
				
		dialog.close();
				
	  
			} else {

    	// No user is signed in.
		$(".login-cover").show();
	  
		var dialog = document.querySelector('#loginDialog');
  		if (! dialog.showModal) {
      		dialogPolyfill.registerDialog(dialog);
    	}
			$("#loginProgress").hide();
			$("#loginbutton").show();		
		dialog.showModal();
  
  }
});
}
);

/* LOGIN PROCESS */
var u;

$("#loginbutton").click(function(){
		
		var email = $("#loginemail").val();
		var password = $("#loginpassword").val();
		
		if (email != "" & password != ""){
			
			
			firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
				
       			u = firebase.auth().currentUser;
				if(u){
										
					$("#loginbutton").hide();
					$("#registrateButton").hide();
					// Esto va bien
					$("#logginButton").hide();
					$("#loginProgress").show();
					$("#intranetButton").show();
					$("#logoutButton").show();
					var checkedValue = null; 
					// Tomo el valor
					var inputElements = document.getElementById('eprofesorcb');
					// Tomo el valor
						if(inputElements.checked && inputElements.value == "on"){
           					$("#areaProfesorButton").show();
							//console.log("pulsado? "+inputElements.value);
							//pulsado? on
      					}
				}
		
				}
			).catch(function(error) {
				// Handle Errors here.
				$("#loginError").show().text(error.message);	
				var errorCode = error.code;
  				var errorMessage = error.message;
  				console.log(errorCode);
				console.log(errorMessage);
			});
			
		
}});


/* LOGOUT PROCESS */

$("#logoutButton").click(
	function(){
		firebase.auth().signOut().then(function() {
  			// Sign-out successful.
			$("#logginButton").show();
			$("#registrateButton").show();
			$("#intranetButton").hide();
			$("#logoutButton").hide();
		
		}, function(error) {
			
  		// An error happened.
			alert(error.text);
		})
	}	
);

/* RECOVER PASSWORD*/

$("#recoverPassword").click(
	function(){
		var actionCodeSettings = {
  		
			};
		
		var email = $("#loginemail").val();		
			
			firebase.auth().sendPasswordResetEmail(
    			email).then(function() {
      		// Password reset email sent.
				alert("Se ha enviado un correo electrónico a "+email+" para recuperar la contraseña");
    		}).catch(function(error) {
				alert("Ha habido algún problema con la recuperación de su contraseña. Contacte con el administrador");
			});
	});		


/* SIGNUP PROCESS */

$("#registrateButton").click(
	function() {
		console.log("entro en el signupDialog");
  		var dialog = document.querySelector('#signupDialog');
  		if (! dialog.showModal) {
      		dialogPolyfill.registerDialog(dialog);
    	}
		$("#signupProgress").hide();
		dialog.showModal();	
	}
);

/* SIGN UP */

$("#signupbutton").click(
	function(){
		var nombre = $("#signupName").val();
		var email = $("#signupEmail").val();
		var password = $("#signupPassword").val();
		var password2 = $("#signupPassword2").val();	
		if (password == password2 && password != ""){
			firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
				$("#signupProgress").show();
				
				altaEnBD(nombre,email);
				alert("El usuario se ha creado correctamente");
				
				
				// TO-DO: ESTO VALE PARA ALGO???
				//crearDesdeRegistro(email, password);
				
				$("#closesignupbutton").click();
			}).catch(function(error) {
				$("#signupProgress").hide();
  				// Handle Errors here.
  				var errorCode = error.code;
  				var errorMessage = error.message;
				alert(errorCode);
				alert(errorMessage);		
			});
		}
	}
);	



$("#closesignupbutton").click(
	function(){
		var dialog = document.querySelector('#signupDialog');
		dialog.close();
	}
);


 /* Método para registrar en la base de datos a un alumno cuando este se registra en la web*/

function altaEnBD(alumnoNombre, alumnoEmail){
	var user = firebase.auth().currentUser;  	
	firebase.database().ref('alumno/'+user.uid).set({
		alumnoNombre : alumnoNombre,
		alumnoEmail : alumnoEmail
	});
}



/* CONNECT WITH FIREBASE TO BRING USER'S SEARCH BY TOPIC*/
	
$("#btnBusca").click(
	
	function(event){
		event.preventDefault();
		var user = firebase.auth().currentUser;
		if (user != null){
			
			var buscadorText = ($("#buscadorText").val()).toLowerCase();
			var buscadorSelect = $("#buscadorSelect").val();
			var contador = 0;
			
			var rootRef = firebase.database().ref().child("prof");
			//Improve: Don't retrieve all the data!	
			
			
			rootRef.on('child_added', function(snapshot){
				var key = snapshot.key;
				var name = snapshot.child("name").val();
				var teach = snapshot.child("teach").val();
				var idioma = snapshot.child("lang").val();
				var materia = snapshot.child("materia").val();
				var foto = snapshot.child("foto").val();
				
				
					
				if(buscadorText == teach | buscadorSelect == materia ){	
				contador++;	

				var keykey = key.concat(key);
					
				traeFoto(keykey);
					
					
				$("#tabla").append("<tr><td id="+key+" onClick="+"clickFilaProfesor(this.id)"+" class='patata mdl-data-table__cell--non-numeric' style='text-align: center;'><h6>"+name+"</h6></td><td id="+"trteach"+" class='mdl-data-table__cell--non-numeric' style='text-align: center;'><h6>"+teach+"</h6></td><td class='mdl-data-table__cell--non-numeric' style='text-align: center;'>"+idioma+"</td><td class='mdl-data-table__cell--non-numeric'><img id="+keykey+" height='42' width='42'></img></td></tr>");
				}
				
			}); 	
		
			if(contador == 0 ){
				//Estoy hay que arreglarlo
				//alert("¡Lo siento, actualmente no disponemos de ningún profesor de "+teach+"!");	
			}else{
				$("#displayClassesOut").show();
			}
		} else {
			// Nos alerta y nos lanza el diálogo de login
			alert("¡Debes ingresar para poder contratar tu clase!");
		}
});

var contadorFoto = 0; 

function traeFoto(key){
	
	contadorFoto++;

	
	// Create a reference with an initial file path and name
	var storage = firebase.storage();
	var pathReference = storage.ref('foto.jpg');

	// Create a reference from a Google Cloud Storage URI
	var gsReference = storage.refFromURL('https://firebasestorage.googleapis.com/v0/b/teachme-7ed11.appspot.com/o/IMG_2515.jpg?alt=media&token=97aeb6a3-4d11-418b-9ac5-331830bbcecd')

	// Get the download URL	
	gsReference.getDownloadURL().then(function(url) {
  		// Insert url into an <img> tag to "download"
		  // Or inserted into an <img> element:	
  		var img = document.getElementById(key);
  		img.src = url;
		console.log("llamada a traeFoto" +	contadorFoto + " url: " + url);
		
	}).catch(function(error) {

  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/object_not_found':
      // File doesn't exist
		  console.log('storage/object_not_found');
      break;

    case 'storage/unauthorized':
      // User doesn't have permission to access the object
		  console.log('storage/unauthorized');
      break;

    case 'storage/canceled':
      // User canceled the upload
		  console.log('storage/canceled');
      break;

    case 'storage/unknown':
      // Unknown error occurred, inspect the server response
		  console.log('storage/unknown');
      break;
  }
});	
	
}

/* Pone la primera letra en mayúsculas */

function capitalizeFirstLetter(string) {
    		return string.charAt(0).toUpperCase() + string.slice(1);
		}

	
/* ADD A TEACHER  */

function addTeacher(name, teach,  materia, lang, videourl, email, password, password2, foto, precio, mediaclase, skype) {
	
  	
	if(!videourl.includes("embed")){
		videourl = "https://www.youtube.com/embed/".concat(videourl.slice(videourl.length-11,videourl.length));
	}
		
	// A post entry.
  	var postData = {
	email: email,	
    name: name,
    teach: teach.toLowerCase(),
    lang: lang,
	materia: materia,	
	password: password,
	numClases: 0,
	rating: 0,	
	videourl : videourl,
	precio: precio,
	mediaclase: mediaclase,	
  	};
	console.log(foto);
	addTeacherFoto(foto);  
	
  	// Get a key for a new Post.
  	var newPostKey = firebase.database().ref().child('prof').push().key;

	console.log("newPostKey "+newPostKey);	

  // Write the new post's data simultaneously in the posts list and the user's post list.
  	var updates = {};
  	updates['/prof/' + newPostKey] = postData;

  	firebase.database().ref().update(updates).then(function(){
		
		console.log("entro en el signupDialog");
  		var dialog = document.querySelector('#profesorRegistrado');
  		if (! dialog.showModal) {
      		dialogPolyfill.registerDialog(dialog);
    	}
		dialog.showModal();	
	}
												   
	);		
}

$("#profesorRegistradoButton").click(function(){
		var dialog = document.querySelector('#profesorRegistrado');
  		if (! dialog.showModal) {
      		dialogPolyfill.registerDialog(dialog);
    	}
		dialog.close();
})
	
/* ADD TEACHER'S PHOTO */

function addTeacherFoto(foto){
	
	var file = new File([foto], "", {type: "image"})
	// Create a root reference
	var storageRef = firebase.storage().ref();
	// Create a reference to 'mountains.jpg'
	var mountainsRef = storageRef.child('imagenes/fotos.jpg');
	
	mountainsRef.put(file).then(function(snapshot) {
  	console.log('Uploaded a blob or file!');
});
}


/* ENCODE TEACHER'S PHOTO */

var result = [];

function encodeImageFileAsURL(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
	result = reader.result;  
    console.log('RESULT ', reader.result)
  }
  reader.readAsDataURL(file);
}

/* LAUNCH TEACHER AREA AND PASS ID*/


 // To-do: Hay que pasar también id del alumno. 

function clickFilaProfesor(clicked_id){
	$("#tablaContrataClase").delegate("td.patata", "click", function(){
		var id = clicked_id;
		console.log(id);	
		window.location.href = "contrataClase.html?id="+id;		
  	});
	
}
