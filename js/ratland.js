	var historico_vertedero = []
	var historico_ciudad = []
	var historico_campo = []

	$(function(){
	// vertedero - ciudad - campo
	// amarillo [0] - naranja[1] - blanco[2] - negro [3] - morado[4] - azul[5]
	var carta_1 = [[6,0,6,0,0,0],[3,3,4,0,2,0],[6,0,3,0,0,3]]; 
	var carta_2 = [[7,0,5,0,0,0],[2,3,5,2,0,0],[5,2,0,0,0,5]]; 
	var carta_3 = [[5,0,7,0,0,0],[0,5,2,2,3,0],[7,0,0,3,0,2]]; 
	var carta_4 = [[9,0,0,3,0,0],[2,3,5,0,2,0],[5,0,2,0,0,5]]; 
	var carta_5 = [[6,0,6,0,0,0],[0,6,2,2,2,0],[5,2,0,0,0,5]]; 
	var carta_6 = [[7,0,5,0,0,0],[3,4,2,0,3,0],[7,0,3,0,0,2]]; 
	var carta_7 = [[5,0,7,0,0,0],[1,6,0,2,3,0],[6,0,5,1,0,0]]; 
	var carta_8 = [[8,0,4,0,0,0],[6,2,0,3,1,0],[0,6,4,2,0,0]]; 
	var carta_9 = [[4,0,8,0,0,0],[2,4,4,2,0,0],[8,0,0,2,0,2]];

	
	var cartas = [
	carta_1,
	carta_2,
	carta_3,
	carta_4,
	carta_5,
	carta_6,
	carta_7,
	carta_8,
	carta_9
	];

	function runEffect(id) {
      // Run the effect
      //$(".sacar").attr('disabled','disabled');
      $( "#" + id ).show( 'explode', {}, 1000, callback(id) );
    };
 
    //callback function to bring a hidden box back
    function callback(id) {
      setTimeout(function() {
        $( "#"+id+":visible" ).removeAttr( "style" ).fadeOut();
        //$(".sacar").prop('disabled', false);
      }, 700 );
    };
 
 
    //$('#'+id).hide();

	$("#cartas").change(function(event) {
		var $carta_selected = $(this);
		var carta_selected = $carta_selected.find(":selected").val();
		if (carta_selected == 0) {
			return;
		}

		var combination = cartas[carta_selected-1];
		var vertedero = combination[0];
		var ciudad = combination[1];
		var campo = combination[2];

		completaUbicacion("vertedero", vertedero);
		completaUbicacion("ciudad", ciudad);
		completaUbicacion("campo", campo);


	});

	function completaUbicacion(ubicacion, combination){
		historico_vertedero = [];
		historico_ciudad = [];
		historico_campo = [];
		$("#historico_"+ubicacion).html('');
		completaColor(ubicacion, "amarillo", combination[0]); 
		completaColor(ubicacion, "naranja", combination[1]); 
		completaColor(ubicacion, "blanco", combination[2]); 
		completaColor(ubicacion, "negro", combination[3]); 
		completaColor(ubicacion, "morado", combination[4]); 
		completaColor(ubicacion, "azul", combination[5]);
	}

	function completaColor(ubicacion, color, cantidad){
		var number = $("#"+color+"_number_"+ubicacion).val(cantidad);
		var new_cantidad = cantidad;
		if (cantidad == 0) {
			new_cantidad = "-";
		} else if ($("#56jugadores").prop('checked')) {
			new_cantidad += 1; 
		}
		number.val(new_cantidad);
		number.next("h1").html(new_cantidad);
	}

	$("input[type='number']").change(function(event) {
		$number = $(this);
		$number.next("h1").html($number.val());
	});

	$(".btn").click(function(event) {
		$btn = $(this);

		if ($btn.hasClass('minus')) {
			input = $btn.next("input");
			text = input.next();
			cantidad = input.val();
			if (cantidad=="") {
				cantidad = 0
			}
			new_value = parseInt(cantidad)-1;
			if (new_value < 0) {
				return
			}
			input.val(new_value);
			if (new_value==0) {
				text.html("-");
			}else{
				text.html(new_value);

			}
		} else if ($btn.hasClass('plus')){
			text = $btn.prev();
			input = text.prev();
			var cantidad = input.val();
			if (cantidad=="") {
				cantidad = 0;
			}

			var new_value = parseInt(cantidad)+1;
			if (new_value < 0) {
				return
			}
			input.val(new_value);
			text.html(new_value);
		}
	});


	function sacarQueso(ubicacion, historico){
		var quesos = $("#"+ubicacion).find('input');
		var position = randomInteger(0,5);
		total_quesos= 0;

		if (!quedanQuesos(quesos)) {
			console.log("No quedan quesos de ningun color")
			return
		}

		console.log(position);
		total_color = quesos.eq(position);
		quesos_restante = total_color.val();

		
		if (quesos_restante < 1) {
			//console.log("No hay quesos restantes para la position: " + position);
			sacarQueso(ubicacion, historico);
		} else {
			console.log("agrego queso en historico " + ubicacion);
			historico.push(position)
			console.log(historico);
			console.log(historico_vertedero);
			total_color.val(quesos_restante - 1);
			text = total_color.next();
			actualizar_historico(ubicacion);
			text.html(quesos_restante - 1);
			queso = position + 1;
			runEffect("display_queso_"+queso);
		}

	}

	function actualizar_historico(ubicacion){
		console.log("actualizar_historico");

		base_html = '<img class="cheese_historico" src="img/quesos/queso-#.png"></img>';
		historico = eval("historico_"+ ubicacion);
		console.log(historico);
		new_html = '';
		for (var i = 0; i < historico.length; i++) {
			img = base_html.replace('#', historico[i]+1);
			new_html += img; 
		}

		$("#historico_"+ubicacion).html(new_html);
	}

	$("#sacar_vertedero").click(function(event) {
		sacarQueso("vertedero", historico_vertedero);
	});
	$("#sacar_ciudad").click(function(event) {
		sacarQueso("ciudad", historico_ciudad);
	});
	$("#sacar_campo").click(function(event) {
		sacarQueso("campo", historico_campo);
	});

	function randomInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function quedanQuesos(listQuesos){

		for (var i = 0; i < listQuesos.length; i++) {
			if (listQuesos.eq(i).val()>0){
				return true;
			}
		}
		return false;
	}

});