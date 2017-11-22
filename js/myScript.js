$(document).ready(function(){



var botonIniciar 		= document.getElementById('boton-iniciar');
var iniciarJuego 	= document.getElementById('iniciar-juego'); 
//var contenido 	= document.getElementById('contenido');
//var modalHeader 	= document.getElementById('modal-header');
//var modalBody	= document.getElementById('modal-body');

//libros de la biblia
var antiguoTestamento = [
	'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio', 'Josué',
	'Jueces', 'Ruth', 'Samiel', 'Crónicas', 'Esdras', 'Nehemías', 'Ester',
	'Job', 'Salmo', 'Proverbios', 'Eclesiastés', 'Canta de los Cantares',
	'Isaías', 'Jeremías', 'Lamentaciones', 'Daniel', 'Ezequiel', 'Osea', 'Joel',
	'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Hbacuc', 'Sofonía', 'Hageo',
	'Zacarías', 'Malaquías', 'Seleccionar Todas'
];


//add Participante a la lista

$('#plus').click(function(){
	var input = $('#Equipos').val();
	var counter = 1;
	if(input == ''){
		alert('Debes llenar todos los campos.');
	} else {
		$('#addList').append('<div id="part-' + counter +'" class="form-check form-check"><label class="form-check-label"><input class="form-check-input" type="checkbox" value="'+ input +'"> '+ input +'</label>');
		//$('#Equipos').val('');
		counter++;
	}
	$( '.equipo' ).on( 'click', function() {
		if( $(this).is(':checked') ){
			$('.equipo-label').hide('slow');
		} 
	});
	
});

//llenar los checkbox 

var formCheck_1  = $('#form-check-1');
var formCheck_2  = $('#form-check-2');

for(var i = 0; i < antiguoTestamento.length; i++){

	formCheck_1.append('<div class="form-check form-check-inline col-xs-3"><label class="form-check-label"><input class="form-check-input" type="checkbox" value=" ' + antiguoTestamento[i] +'"> '+ antiguoTestamento[i] +'</label>');
}

for(var i = 0; i < antiguoTestamento.length; i++){

	formCheck_2.append('<div class="form-check form-check-inline col-xs-3"><label class="form-check-label"><input class="form-check-input" type="checkbox" value=" ' + antiguoTestamento[i] +'"> '+ antiguoTestamento[i] +'</label>');
}


$('#testamento-1').click(function(){
	formCheck_1.toggle("slow");
});

$('#testamento-2').click(function(){
	formCheck_2.toggle("slow");
});
//============================================================================================================


var slider = document.getElementById("myRange");
var output = document.getElementById("showRange");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
} 

});