/* INICIALIZACIÓN */



$(document).ready(
	function(){
		var user = firebase.auth().currentUser;
		if (user !== null) {
		console.log(user.email)
		} else {
			
		console.log("Sorry, no hay user");	
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
		$("#signupProgress").show();
		$("#signupbutton").hide();
		var email = $("#signupEmail").val();
		var password = $("#signupPassword").val();
		var password2 = $("#signupPassword2").val();	
		if (password == password2 && password != ""){
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  				// Handle Errors here.
  			var errorCode = error.code;
  			var errorMessage = error.message;
			alert(errorCode);
			alert(errorMessage);	
			});
		}
		alert("OK!");		
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
			
			var teachin = $("#buscadorIn").val();
			var rootRef = firebase.database().ref().child("prof");
			//Improve: Don't retrieve all the data!	
			
			
			rootRef.on('child_added', function(snapshot){
				var name = snapshot.key;
				var teach = snapshot.child("teach").val();
				var idioma = snapshot.child("idioma").val();
				var foto = snapshot.child("foto").val();	
				if(teachin == teach | teachin == "any" ){	

				// $('#div1-wrapper').load(url + ' #div1'); //note: the space before #div1 is very important
					
				$("#meteloaqui").append("<tr><td id="+"trname"+" class='patata mdl-data-table__cell--non-numeric'>"+name+"</td><td id="+"trteach"+" class='mdl-data-table__cell--non-numeric'>"+teach+"</td><td class='mdl-data-table__cell--non-numeric'>"+idioma+"</td><td class='mdl-data-table__cell--non-numeric'><img id="+"img"+" src="+"http://joaquinafernandez.com/wp-content/uploads/2010/09/avatar114.jpg"+"></img></td></tr>");
				}
		
			}); 	
		
			$("#displayClassesOut").show();
			
		} else {
			// Nos alerta y nos lanza el diálogo de login
			alert("¡Debes ingresar para poder contratar tu clase!");
	//		$("#logginButton").click();
		}
	
	});

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

function addTeacher(name, teach, lang, videourl, email, password, password2, foto, precio, mediaclase, skype, descripcion) {
	
  	
	// A post entry.
  	var postData = {
    name: name,
    teach: teach,
    idioma: lang,
	password: password, 
	videourl : videourl,
	precio: precio,
	mediaclase: mediaclase,
	descripcion: descripcion	
  	};
	addTeacherFoto(foto)  

  	// Get a key for a new Post.
  	var newPostKey = firebase.database().ref().child('prof').push().key;

	console.log("newPostKey "+newPostKey);	

  // Write the new post's data simultaneously in the posts list and the user's post list.
  	var updates = {};
  	updates['/prof/' + newPostKey] = postData;

  	return firebase.database().ref().update(updates);
	alert("Enhorabuena, tu perfil ha sido creado correctamente!");
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

$(document).ready(function(){
	
	$("#t").delegate("td.patata", "click", function(){
		var id = $("#trname").text();
		window.location.href = "contrataClase.html?id="+id;
		
		
	});
})


function contratarClasefunctions(fecha,idProfesor){
	
	// Antes de reservar la clase veo si esa clase ya está reservada...Esto cuando le mostremos el usuario correcto al usuario no tiene mucho sentido....¿He perdido la mañana?
	var reservada = 0;
	
	var ref = firebase.database().ref('clases/' + idProfesor); 
	ref.once('value').
	then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
      	// key will be "ada" the first time and "alan" the second time
      	var key = childSnapshot.key;
      	// childData will be the actual contents of the child
      	var childData = childSnapshot.val();
			console.log(childData == fecha);
			console.log(childData +","+ fecha);
			if(childData == fecha) {reservada = 1;}
  	})
		console.log("reservada " + reservada)				   
		if (reservada == 0){
		// Get a key for a new Post.
  		var newPostKey = firebase.database().ref().child('clases/').push().key;
		console.log("newPostKey "+newPostKey);	

  		// Write the new post's data simultaneously in the posts list and the user's post list.
  		var updates = {};
  		updates['clases/'+idProfesor+'/' + newPostKey] = fecha;
		console.log('clases/'+idProfesor+'/' + newPostKey);

  		return firebase.database().ref().update(updates);
	} else {
		alert("La fecha introducida ya está reservada");
	}
	});
	
			
};
	

