
var app = angular.module('myApp', ["checklist-model"]);


//Mis Variables
let body 	= document.body;
let onePage = document.getElementById("page-one");
let twoPage = document.getElementById("page-two");
let footer 	= document.getElementById("footer");
	
app.controller('jsCtrl', function ($scope, $interval, $http) {


    //Este metodo organiza un arreglo de manera aleatoria
    $scope.shuffleArray = function (array) {
        var m = array.length, t, i;

        // While there remain elements to shuffle
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }


    $scope.logicabotonJugar = function()
    {
        $scope.preguntasRepository = $scope.buscarPreguntas();
    };

    //Este metodo busca todas las preguntas en el repositorio de preguntas y a las organiza aleatoreamente, tambien organiza las respuestas de cada pregunta aleatoriamente
	$scope.buscarPreguntas = function() {
			
			return $http.get("https://raw.githubusercontent.com/ukkanes/QuizBiblico/master/preguntas.js").then(function(response) {
					
                $scope.preguntasRepository = response.data;

            }).then(function () {
                
                $scope.preguntasRepository = $scope.shuffleArray($scope.preguntasRepository);

                angular.forEach($scope.preguntasRepository, function (preguntas, index) {

                    $scope.preguntasRepository[index].Respuestas = $scope.shuffleArray($scope.preguntasRepository[index].Respuestas);

                });

            });
  		};
		
	$scope.deshabilitarBotonCancelarPregunta = false;
    $scope.cantidadRondas = 2;
    $scope.cantidadPreguntasPorRonda = 2; 
    $scope.participantes = ["Juan Mitchell","Carlos Pineda"];
    $scope.preguntasRepository = [];
    $scope.rondas =[];
	$scope.cantidadSegundosResponder = 30;
	$scope.cantidadSegundosResponderReinicio;
	$scope.reporteEstado = []; //estimar si eliminar esta variable
    $scope.resultadoParticipantes = [];
    $scope.librosBiblia =
        [
            { id: 1, nombre: 'Genesis', testamento: 'A' },
            { id: 2, nombre: 'Exodo', testamento: 'A' },
            { id: 3, nombre: 'Levitico', testamento: 'A' },
            { id: 4, nombre: 'Libro nuevo testamento', testamento: 'N' }
        ];

    $scope.letras = [
        { letra: "A" },
        { letra: "B" },
        { letra: "C" },
        { letra: "D" }
    ]

    $scope.librosBibliaSeleccionados = [];
	
	//indicadores
	$scope.mostrarCitaBiblica;
	$scope.mostrarRepuestaCorrecta;
	//
	var intervalo;
	
	//$scope.preguntasRepository = $scope.buscarPreguntas();
	
    $scope.comodines = 
    [
    	{id : 1, nombre : '50/50', utilizado : false},
        {id : 2, nombre : 'Biblia', utilizado : false},
		{id : 3, nombre : 'Ayuda', utilizado : false}
    ]
    
	
	
	
	$scope.validarCantidadPreguntas = function(){
	
			
			var validacion = false;
			
			
				var cantidadPreguntasParticipantesRondas = $scope.cantidadPreguntasPorRonda * $scope.participantes.length * $scope.cantidadRondas;
				
				var cantidadPreguntas = $scope.preguntasRepository.length;
										
				if (cantidadPreguntasParticipantesRondas <= cantidadPreguntas)
				{
					$scope.mensaje = '';
					return true;
				}
				else 
				{ 
					$scope.mensaje = 'LA CANTIDAD DE PREGUNTAS PROPORCIONADAS EXCEDE LA CANTIDAD DE PREGUNTAS DISPONIBLES. FAVOR AMPLIAR LOS LIBROS (SI FUERON SELECCIONADOS) O REDUCIR LA CANTIDAD DE PREGUNTAS, EQUIPOS O RONDAS.'; 
					return false;
				}
			
			
			
			
		};
		
	$scope.validarExistenMasRondas = function(rondas)
		{
				var resultado = false;
				angular.forEach(rondas, function (ron, index) {
				
					if (ron.rondaProcesada == false)
					{
						resultado = true;
					}
				});
				return resultado;
		}
				
	$scope.armarExtructuraJuego = function (){
		
		for (var i=0; i< $scope.cantidadRondas; i++) {
        
        	 $scope.rondas.push(
             	{	
               		ordenRonda : i+1,
					rondaProcesada : false,
					rondaVigente : false,
                    participantes :[]
             	});
                
                angular.forEach($scope.participantes, function(value, key) 
                  {
                    $scope.rondas[i].participantes.push
                    ({
                    	nombre :value,
						iniciarRonda : false,
						esMiTurno :false,
						comodines: [],
                    	//comodines : $scope.comodines,
						participanteFinalizoEstaRonda : false,
						participanteActual : false,
                        preguntas : []
                    });
                    
					angular.forEach($scope.comodines, function(valueComodin, key2) 
					{					
						$scope.rondas[i].participantes[key].comodines.push(
						{
							id : valueComodin.id, nombre : valueComodin.nombre, utilizado : false
						});					
					});
					
                    for (var ii=0; ii<$scope.cantidadPreguntasPorRonda; ii++) 
                    {                  

						$scope.rondas[i].participantes[key].preguntas.push
						({
							pregunta : $scope.preguntasRepository[0].Descripcion,
							tiempoRestanteParaContestar : $scope.cantidadSegundosResponder,
							esPreguntaActual : false,
							cita : $scope.preguntasRepository[0].citaBiblica,
							respuestas : $scope.preguntasRepository[0].Respuestas,							
							contestada : false,
							contestadaCorrectamente : false
						});	
						
						//aqui borro la primera pregunta del array
						$scope.preguntasRepository.shift();                     
                	};                  
                  });
            // $scope.rondas.push(rondas);
              
            }
	
	}
  			
	$scope.conteoRegresivo = function()
	{		
		$scope.pararConteoRegresivo();
		
		$scope.cantidadSegundosResponder = $scope.cantidadSegundosResponderReinicio;
		
		intervalo = $interval(function(){
		
		if ($scope.cantidadSegundosResponder != 0)
        {
            $scope.cantidadSegundosResponder--;
		}
		else{
			$scope.pararConteoRegresivo(); 
		}
		},1000,0);
	}
	
	$scope.pararConteoRegresivo = function() {
      $interval.cancel(intervalo);
    };
		
	$scope.validarRespuesta = function(esCorrecta, usuario, ronda)
	{
		if (esCorrecta)
		{
			$scope.reporteEstado. push({
				usuario : usuario,
				ronda : ronda,
				contestadaCorrectamente : true
			});
		}
		
    }

    //Este metodo filtra del repositorio de preguntas, todas las preguntas relacionadas a libros seleccionados
    $scope.filtrarPreguntasPorLibro = function ()
    {
        
        //Solo se seleccionaron libros, el sistema filtrara por libros de lo contrario el sistema usara todas las preguntas de la biblia
        if ($scope.librosBibliaSeleccionados.length > 0)
        {
            var preguntasFiltradas = [];
            angular.forEach($scope.preguntasRepository, function (preg, index) {

                angular.forEach($scope.librosBibliaSeleccionados, function (libroId, index) {

                    if (preg.Libro == libroId) {
                        preguntasFiltradas.push(preg);

                    }

                });

            });

            $scope.preguntasRepository = preguntasFiltradas;
        }


    }
        

	
	$scope.iniciarJuego = function(valor) 
	{

        //Cuando no sea provisto un valor de cantidad de segundos preguntas, el sistema tomará como valor por defecto: 30.
        if ($scope.cantidadSegundosResponder <= 0)
        {
            $scope.cantidadSegundosResponder = 30;
        }

            $scope.filtrarPreguntasPorLibro();

		    $scope.cantidadSegundosResponderReinicio = $scope.cantidadSegundosResponder;
		
			$scope.rondas = [];


			if ($scope.validarCantidadPreguntas())
			{
				
				$scope.armarExtructuraJuego();
				
				//muestro la ronda 1 
                $scope.rondas[0].rondaVigente = true;

                //ocultar la pantalla principal
                body.style.backgroundColor = "#fff";
                onePage.style.display = "none";
                footer.style.display = "none";

                //presentar la pantalla secundaria
                twoPage.style.display = "block"
                
            }
            else
            {
                
            }
			
			
				
        };
    	
    $scope.logicaComodin = function(id, pregunta, comodin)
	{
		comodin.utilizado = true;
		if (id == 1) // logica comodin 5050
        {
				var contador = 0;				
                angular.forEach(pregunta.respuestas, function (resp, index) {
				
					if (!resp.esLaCorrecta && contador !=2)
					{
						resp.visible = false;
						contador++;
					}
				})
		
			
		}
		
		if (id == 2) // logica comodin biblia
		{
			$scope.mostrarCitaBiblica = true;
		}
		
	}
	
	
    $scope.logicaBotonCancelarPregunta = function (index, preguntaActual, preguntasRondaParticipante, ordenRondaParam, participante, participantesRondas)
	{
		//Cuando se seleccione el botón de Cancelar Pregunta:
		//El sistema requerirá la confirmación del usuario.
		var confirmacionusuario = confirm("Esta seguro que desea cancelar la pregunta");
		
		//El sistema pasará a la siguiente pregunta, sin tener un resultado de la pregunta actual.
		if (confirmacionusuario == true)
		{
            //El sistema actualizará la pregunta como Procesada.
            preguntaActual.contestada = true;

            //validar si existen preguntas pendientes 
            if ($scope.validaExistenMasPreguntasPorRealizarPorParticipanteRonda(preguntasRondaParticipante)) {

                $scope.pasarSiguientePregunta(preguntaActual, preguntasRondaParticipante);
            }
            else // si no existen tengo que terminar la ronda 
            {
                $scope.retirarParticipante(ordenRondaParam, participante, participantesRondas);
            }

            
					
		}
		
		
	}
	
	$scope.validaExistenMasPreguntasPorRealizarPorParticipanteRonda = function(preguntasParticipanteRonda)
	{
		var resultado = false;
		angular.forEach(preguntasParticipanteRonda, function (preg, index) {
		
			if (preg.contestada == false)
			{
				resultado = true;
			}
		});
		
		return resultado;
	}
	
	$scope.buscarIndiceSiguientePreguntaPorRondaPorUusuario = function(preguntasParticipanteRonda)
    {      
		var indiceSiguientePregunta = 0;
		angular.forEach(preguntasParticipanteRonda, function (preg, index) {
		
			if (preg.contestada == false)
            {
				indiceSiguientePregunta = index;
            }

		});
		return indiceSiguientePregunta;
	}
	
	$scope.guardarResultadoParticipante = function(ordenRondaParam, nombreParticipanteParam, cantidadRespuestasCorrectasParam)
	{				
				$scope.resultadoParticipantes.push({
					//ID
					//Partida:  Número único que representa la partida; es decir, todas las rondas.  
					ordenRonda : ordenRondaParam, //Ronda: Número de Orden de la Ronda procesada.
					Participante : nombreParticipanteParam, //Participante: Nombre del participante proporcionado.
					cantidadPreguntasPorRonda : $scope.cantidadPreguntasPorRonda, //Cantidad de Preguntas: Cantidad de preguntas por Rondas provista por parámetros.
					cantidadRespuestasCorrectas : cantidadRespuestasCorrectasParam, //Cantidad de Respuestas correctas: Cantidad de respuestas correctas seleccionadas.
					porcentajeAciertos : ((cantidadRespuestasCorrectasParam/$scope.cantidadPreguntasPorRonda)*100) //Porcentaje de aciertos: Cantidad de Respuestas Acertadas entre la cantidad de preguntas realizadas, entre 100.
				});
				
	}
	
	$scope.validarExistenMasParticipantesParaRondaActual = function(participantesRonda)
	{	
		var existen = false;
				
		angular.forEach(participantesRonda, function (part, index) {
			if (part.participanteFinalizoEstaRonda == false)
			{
				if (existen == false)
				{
					existen = true
				}
			}
		});
		return existen;		
	}
	
	$scope.buscarIndiceProximoParticipantesParaRondaActual = function(participantesRondas)
	{	
		var indice = 0;
		angular.forEach(participantesRondas, function (part, index) {
			if (part.participanteFinalizoEstaRonda == false)
			{
				indice = index
			}
		});	
		return indice;
	}
	
	$scope.buscarCantidadPreguntasCorrectasPorParticipanteRonda = function(preguntasParticipante)
	{
		var cantidadPreguntasContestadasCorrectamente = 0;
		
		angular.forEach(preguntasParticipante, function (preg, index) {
		
			if (preg.contestadaCorrectamente == true)
			{
				cantidadPreguntasContestadasCorrectamente++;
			}
		});
		return cantidadPreguntasContestadasCorrectamente;
	}

	$scope.pasarSiguientePregunta = function(preguntaActual, preguntasParticipante)
    {
		$scope.deshabilitarBotonCancelarPregunta = false;
        $scope.mostrarRepuestaCorrecta = false;
		$scope.mostrarCitaBiblica = false;
		preguntaActual.esPreguntaActual = false;
		$scope.conteoRegresivo();
				
        preguntaActual.esPreguntaActual = false;
		
        preguntasParticipante[$scope.buscarIndiceSiguientePreguntaPorRondaPorUusuario(preguntasParticipante)].esPreguntaActual = true;
        
	}
	
	$scope.logicaBotonSiguiente = function(preguntaActual, participante, ordenRondaParam, participantesRondas)
	{		
		var existenPreguntasSinContestar = false;
		var estaSeguroQueDeseaContinuar = false;
		var indiceSiguientePregunta;
		
		//El sistema valida si existen más preguntas por realizar, según la cantidad de preguntas a realizar por participante provistas por parámetro, y la cantidad de preguntas realizadas.
		var validaExistenMasPreguntasPorRealizarPorParticipanteRonda = $scope.validaExistenMasPreguntasPorRealizarPorParticipanteRonda(participante.preguntas);
	
		//Cuando existan más preguntas por realizar: 
		if (validaExistenMasPreguntasPorRealizarPorParticipanteRonda)
		{
			//Cuando el usuario no haya seleccionado una respuesta, el sistema requerirá la confirmación del usuario.
			if (!preguntaActual.contestada)
			{
				estaSeguroQueDeseaContinuar = confirm("Esta seguro que desea continuar");
				//estaSeguroQueDeseaContinuar = bootbox.confirm("Esta seguro que desea continuar", function(result){ console.log('This was logged in the callback: ' + result); });

				//Si el usuario indica que está seguro de pasar la pregunta sin respuesta:
				if (estaSeguroQueDeseaContinuar)
				{
					//El sistema actualiza la pregunta actual indicando que se encuentra Disponible.
                    preguntaActual.contestada = false;

					//El sistema pasa a la siguiente pregunta.
					$scope.pasarSiguientePregunta(preguntaActual, participante.preguntas);
					
				}
				else //Si el usuario indica que NO está seguro de pasar la pregunta sin respuesta, el sistema no realiza ninguna acción.
				{
				
				}
			}
			else
            {
				//Si la pregunta actual fue contestada y la misma fue contestada incorrectamente, entonces el sistema debe sacar el participante de la ronda actual
				if(preguntaActual.contestada && !preguntaActual.contestadaCorrectamente)
				{
				    $scope.retirarParticipante(ordenRondaParam,participante, participantesRondas);
				}
				
				//El sistema pasa a la siguiente pregunta.
				$scope.pasarSiguientePregunta(preguntaActual, participante.preguntas);
			}
		}
		else  //Al finalizar la cantidad de preguntas por participantes, o al presionar el botón de “Retirar Participante” el sistema realizará lo siguiente:
		{
		
			$scope.retirarParticipante(ordenRondaParam,participante, participantesRondas);
		}
		
	}
	
	//Este metodo cancela la ronda en curso
	$scope.cancelarRonda = function(ordenRondaParam)
	{
				//Cuando NO existan más participantes, el sistema da por terminada la primera ronda (mensaje por pantalla)
				alert("Ronda finalizada");
				$scope.rondas[ordenRondaParam-1].rondaProcesada = true;
				$scope.rondas[ordenRondaParam-1].rondaVigente = false;
				
				//El sistema valida si existen más rondas por procesar, calculando la cantidad de rondas proporcionadas, menos las rondas procesadas.
				var validacion = $scope.validarExistenMasRondas($scope.rondas);
				
				if (validacion)
				{
					//Cuando existan rondas por procesar, El sistema reinicia la pantalla, para mostrar las preguntas a realizar al primer participante para la siguiente ronda
					$scope.rondas[ordenRondaParam].rondaVigente = true;
					
				}
				else //Cuando NO existan más rondas disponibles, según la cantidad de rondas proporcionadas, el sistema realizará lo siguiente:
				{
                    //alert("Muestra una pantalla con el resultado de cada participante por rondas ordenado en orden Descendente por la Cantidad de Respuestas Acertadas (9-1).  Los datos a mostrar serán los siguientes:");
                    alert(JSON.stringify($scope.resultadoParticipantes));
				}
	}
	
	
	
	$scope.retirarParticipante = function(ordenRondaParam,participante, participantesRondas)
    {
			$scope.deshabilitarBotonCancelarPregunta = false;
            $scope.mostrarRepuestaCorrecta = false;
			$scope.mostrarCitaBiblica = false;
		    //El sistema muestra un mensaje de finalización al usuario.
            alert("Usuario finalizo su ronda");
			participante.participanteFinalizoEstaRonda = true;
			participante.participanteActual = false;
			//participanteFinalizoEstaRonda
			//El sistema guarda un registro en el repositorio Resultado Participantes, conteniendo los siguientes datos:
			$scope.guardarResultadoParticipante(ordenRondaParam,participante.nombre, $scope.buscarCantidadPreguntasCorrectasPorParticipanteRonda(participante.preguntas));
			
			//El sistema valida si existen más participantes para la ronda actual:			
			if ($scope.validarExistenMasParticipantesParaRondaActual(participantesRondas))
			{
				//Cuando existan más participantes para la ronda actual, El sistema reinicia la pantalla, para mostrar las preguntas a realizar al siguiente participante para la misma ronda, considerando lo siguiente:
				participantesRondas[$scope.buscarIndiceProximoParticipantesParaRondaActual(participantesRondas)].participanteActual = true;
				
			}
			else //El sistema valida si existen más rondas por procesar, calculando la cantidad de rondas proporcionadas, menos las rondas procesadas.
			{
				
				$scope.cancelarRonda(ordenRondaParam);
				
				/*
				//Cuando NO existan más participantes, el sistema da por terminada la primera ronda (mensaje por pantalla)
				alert("Ronda finalizada");
				$scope.rondas[ordenRondaParam-1].rondaProcesada = true;
				$scope.rondas[ordenRondaParam-1].rondaVigente = false;
				
				//El sistema valida si existen más rondas por procesar, calculando la cantidad de rondas proporcionadas, menos las rondas procesadas.
				var validacion = $scope.validarExistenMasRondas($scope.rondas);
				
				if (validacion)
				{
					//Cuando existan rondas por procesar, El sistema reinicia la pantalla, para mostrar las preguntas a realizar al primer participante para la siguiente ronda
					$scope.rondas[ordenRondaParam].rondaVigente = true;
					
				}
				else //Cuando NO existan más rondas disponibles, según la cantidad de rondas proporcionadas, el sistema realizará lo siguiente:
				{
                    //alert("Muestra una pantalla con el resultado de cada participante por rondas ordenado en orden Descendente por la Cantidad de Respuestas Acertadas (9-1).  Los datos a mostrar serán los siguientes:");
                    alert(JSON.stringify($scope.resultadoParticipantes));
				}
				*/
			}
	}
	
	$scope.logicaBotonRetirarParticipante = function(ordenRondaParam,participante, participantesRondas)
	{
		//El sistema no prosigue con las preguntas faltantes
		$scope.retirarParticipante(ordenRondaParam,participante, participantesRondas);
	}
	
	$scope.logicaBotonCancelarRonda = function(ordenRondaParam)
	{
		$scope.cancelarRonda(ordenRondaParam);
	}

    $scope.logicaBotonRespuesta = function (preguntaActual, respuestas, participante, ronda)
    {
		$scope.deshabilitarBotonCancelarPregunta = true;
        preguntaActual.contestada = true;
        $scope.mostrarRepuestaCorrecta = true;
        preguntaActual.contestadaCorrectamente = respuestas.esLaCorrecta;
        preguntaActual.rondaPreguntasRespondidas = true;
        $scope.validarRespuesta(respuestas.esLaCorrecta,participante.nombre, ronda.ordenRonda);
        $scope.mostrarCitaBiblica = true;
        $scope.pararConteoRegresivo();
    }

	//Agregar participantes a la lista
	$scope.addParticipante = function() {
		
		$scope.participantes.push(
		//{'nombre': $scope.nuevoParticipante, 'hecho':false}
			$scope.nuevoParticipante
		);
		$scope.nuevoParticipante = '';
		console.log($scope.participantes);
	}

	$scope.deleteParticipante = function(index) {	
		$scope.participantes.splice(index, 1);
	
	} 
	
	// Update the current slider value (each time you drag the slider handle)
	var slider = document.getElementById("myRange");
	var output = document.getElementById("showRange");
	output.innerHTML = slider.value; // Display the default slider value
	slider.oninput = function() {
		output.innerHTML = this.value;
	}
	
	
	

	
	
	
});

