/* INICIALIZACIÓN */



$(document).ready(
	function(){
		var user = firebase.auth().currentUser;
		if (user !== null) {
		console.log(user.email)
		} else {
			
		console.log("Sorry, no hay user");	
		$("#tablaContrataClase").hide();	
		$("#intranetButton").hide();
		$("#logoutButton").hide
		// Cuando cargo, si no tengo user...cierro el modal
		$("#logoutButton").click();	
		}
	}
	

);

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

$("#loginbutton").click(
	function(){
		
		
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
	
	}
);

var u;


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
		var email = $("#signupEmail").val();
		var password = $("#signupPassword").val();
		var password2 = $("#signupPassword2").val();	
		if (password == password2 && password != ""){
			firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
				$("#signupProgress").show();
				alert("El usuario se ha creado correctamente");
				// Si todo ha ido bien, cierra el diálogo
				crearDesdeRegistro(email, password);
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

/* CONNECT WITH FIREBASE TO BRING USER'S SEARCH BY TOPIC*/
	
$("#btnBusca").click(
	
	function(event){
		event.preventDefault();
		var user = firebase.auth().currentUser;
		if (user != null){
			
			var buscadorText = ($("#buscadorText").val()).toLowerCase();
			var buscadorSelect = ($("#buscadorSelect").val()).toLowerCase();
			
			console.log()
			var rootRef = firebase.database().ref().child("prof");
			//Improve: Don't retrieve all the data!	
			
			
			rootRef.on('child_added', function(snapshot){
				var key = snapshot.key;
				var name = snapshot.child("name").val();
				var teach = snapshot.child("teach").val();
				var idioma = snapshot.child("lang").val();
				var materia = snapshot.child("materia").val();
				var foto = snapshot.child("foto").val();	
				if(buscadorText == teach | buscadorText == "any" | buscadorSelect == materia ){	
					

					
				$("#tabla").append("<tr><td id="+key+" onClick="+"clickFilaProfesor(this.id)"+" class='patata mdl-data-table__cell--non-numeric' style='text-align: center;'><h6>"+name+"</h6></td><td id="+"trteach"+" class='mdl-data-table__cell--non-numeric' style='text-align: center;'><h6>"+teach+"</h6></td><td class='mdl-data-table__cell--non-numeric' style='text-align: center;'>"+idioma+"</td><td class='mdl-data-table__cell--non-numeric'>"+foto+"</img></td></tr>");
				}
		
			}); 	
		
			$("#displayClassesOut").show();
			
		} else {
			// Nos alerta y nos lanza el diálogo de login
			alert("¡Debes ingresar para poder contratar tu clase!");
		}
	
});

/* Pone la primera letra en mayúsculas */

function capitalizeFirstLetter(string) {
    		return string.charAt(0).toUpperCase() + string.slice(1);
		}

/* CONNECT WITH FIREBASE TO BRING INFO FROM SELECTED*/

function setNameProf(id){
	return firebase.database().ref('/prof/' + id).once('value').then(function(snapshot) {
  	var lang = snapshot.val().idioma;
	var name = snapshot.val().name;
	var teach = snapshot.val().teach;
	videourl = snapshot.val().videourl;
	// Falta la foto	
			
	console.log(lang+" "+name+" "+teach+" "+videourl);	
	document.getElementById("nameProf").innerHTML = name;
	document.getElementById("langProf").innerHTML = lang;
	document.getElementById("teachProf").innerHTML = teach;
	
	});
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
	videourl : videourl,
	precio: precio,
	mediaclase: mediaclase,	
  	};
	addTeacherFoto(foto)  

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
	


/* ADD TEACHER'S PHOTO */

function addTeacherFoto(foto){
	
	var file = new File([result], "", {type: "image"})
	// Create a root reference
	var storageRef = firebase.storage().ref();
	// Create a reference to 'mountains.jpg'
	var mountainsRef = storageRef.child('foto.jpg');
	// Create a reference to 'images/mountains.jpg'
	var mountainImagesRef = storageRef.child('images/foto.jpg');

// While the file names are the same, the references point to different files
console.log(mountainsRef.name === mountainImagesRef.name);            // true
console.log(mountainsRef.fullPath === mountainImagesRef.fullPath);    // false

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
		
		

		return firebase.auth().onAuthStateChanged(function(user) {
  			if (user) {
				var displayName = user.displayName;
    			var email = user.email;
				var uid = user.uid;
    			window.location.href = "contrataClase.html?id="+id;		
  			} else {
    			alert("Debes estar registrado");
  			}
		});
	});
}

 