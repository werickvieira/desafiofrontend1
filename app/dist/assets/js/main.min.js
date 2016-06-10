var APP = (function(){

	var urlSlide   = "slide.json";
	var urlNoticia = "noticias.json"; 

	// Globais Slide

    var $slideContainer =  $(".slide"); 
    var slideIndex = 0;
    var $itemSlide = $slideContainer.find(".slide__item");
	var $paginacao = $(".slide__pagination ol");
	var $next = $(".slide__control--next");
	var $prev = $(".slide__control--prev");


	// Globais Editorial

    var $data  = []; // retorno request 
    var $dados = [];
	var $noticiaContainer = $(".noticia__content");
	var $itemNoticia 	  = $noticiaContainer.find(".noticia__item");
	var $filtroEditoria   = $("select[name=filtrar]"); 
	var $ordenarData      = $("select[name=ordenar]");   



	// Método Útil
	var getDados = function( url , callback ){

	    $.ajax({
	      url: url,
	      dataType: 'json'
      	})
      	.success( function( data ){ 
      	  callback.sucesso( data );
      	})
      	.fail( function( xhr, err){ 
          callback.erro( xhr, err );
        });
    };


	var normalizaData = function( e ){
	  	var d = e.split("-");
	  	return new Date(d[2]+"/"+d[1]+"/"+d[0]);
	}


    var preencherElementos = function( data ){
        $dados = data[0]['Editorias'];
  		var _editoria = data[0].Editorias;
  		var _template = "";

  		// Preence a combo editoria
    	$.each( _editoria, function( i, item ){

    		$filtroEditoria.append("<option value="+item['Id']+">"+ item['Editoria'] +"</option>");

    		$.each( item['Notícias'], function( index, elemento ){

				_template += "<div class='noticia__item "+ item['Editoria'] +" '>";
				_template +=  "<div class='f-left noticia__item--imagem'>";
				_template += 	"<img src=/assets/img/noticias/"+elemento['Foto']+">";
				_template +=  "</div>";
				_template +=  "<div class='f-left noticia__item--conteudo'>";
				_template += 	"<h2 class='font-2'>"+elemento['Título']+"</h2>";
				_template += 	"<p>"+elemento['Texto']+"</p>";
				_template +=  "</div>";
				_template +=  "<div class='f-left noticia__item--seta'>&#10095;</div>";
				_template += "</div>";
    		});

    		$noticiaContainer.html( _template );
    	});
    }


    var filtroEditoria = function( data , valor ){
  
    	data.forEach(function( item ){
 			if( item.Id === valor ){
			  preencheFiltroEditoria( item.Notícias );
 			}
    	});
    	
    }


    var preencheFiltroEditoria = function( el ){
    	var _htmlElemente = "";

		$.each( el, function( i, item ){
			_htmlElemente += "<div class='noticia__item'>";
			_htmlElemente +=  "<div class='f-left noticia__item--imagem'>";
			_htmlElemente += 	"<img src=/assets/img/noticias/"+item['Foto']+">";
			_htmlElemente +=  "</div>";
			_htmlElemente +=  "<div class='f-left noticia__item--conteudo'>";
			_htmlElemente += 	"<h2 class='font-2'>"+item['Título']+"</h2>";
			_htmlElemente += 	"<p>"+item['Texto']+"</p>";
			_htmlElemente +=  "</div>";
			_htmlElemente +=  "<div class='f-left noticia__item--seta'>&#10095;</div>";
			_htmlElemente += "</div>";
		});

		$noticiaContainer.html( _htmlElemente );
    } 

 //    var compare = function (a, b) {
	//   if (a > b) return 1
	//   else if (a < b) return -1
	//   else return 0
	// } 
	
	

 //    var preencherOrdenado = function( data ){
 //    	var noticias = [];
 //    	var novaData = [];
 //   	    var novo = [];

 //    	data.forEach(function( item ){
 //    		item.Notícias.forEach(function( el ){
 //    			// console.log( el['Data de publicação']);	
 //    			noticias.push(el);
 //    		})
 //    	});
    	
    	
 //    	noticias.forEach(function( c ){
 //    		novaData.push( normalizaData(c['Data de publicação']) );
 //    	});

 //  

 //    	console.log( novo );


	// }


 //    // Ordernar data
 //    $ordenarData.on("change", function(){
 //    	var that = $(this).val();
 //    	$noticiaContainer.html("");
 //    	preencherOrdenado( $dados )
 //    });




    // Carrega as imagens e a paginacao 
    var carregarSlide = function( el, arr ){
    	el.each(function(i, item){

    		$(this).append( $("<img src='assets/img/slide/"+arr[i]+"'  />") );
    		$(this).attr( "data-index", i );
    		$paginacao.append("<li data-index='"+i+"' "+(i === 0 ? "class='active'" : "")+" ></li>");
    	});
    };


	var _Slider = function( dir ){ 

	   	var _liItem = $paginacao.find("li");
	   	var _slideAtual = $(".slide__item").siblings(".active"); 

	   	// next
	   	( dir == "next" ? _next( _slideAtual, _liItem ) : "");

		//prev
		( dir == "prev" ? _prev( _slideAtual, _liItem ) : "");

		_Marcador( _liItem )
	}

	var _next = function( slide, item ){

	   	if( slide.next().length ){
	    	slide.removeClass("active").next().addClass("active");
	    	slideIndex = slide.next().attr("data-index");
	    	item.removeClass("active");
	    	item.eq( slideIndex ).addClass("active");
		}else{			
			slide.removeClass("active");
			slideIndex = 0;
			$itemSlide.eq( slideIndex  ).addClass("active"); // 0
			item.removeClass("active");
			item.eq( slideIndex ).addClass("active");
		} 
	} 

	var _prev = function( slide, item ){
	   	if( slide.index() > 0 ){
	    	slide.removeClass("active").prev().addClass("active");
	    	slideIndex = slide.prev().attr("data-index");
	    	item.removeClass("active");
	    	item.eq( slideIndex ).addClass("active");
		}else{			
			slide.removeClass("active");
			slideIndex = $itemSlide.last().attr("data-index");
			$itemSlide.eq( slideIndex  ).addClass("active"); // 0
			item.removeClass("active");
			item.eq( slideIndex ).addClass("active");
		}

	} 


	var _Marcador = function( event ){

		event.on("click", function(){
			if(!$(this).hasClass("active")){
				var index = $(this).attr("data-index");
				$itemSlide.removeClass("active");
				event.removeClass("active");
				$itemSlide.eq( index  ).addClass("active"); // 0
				event.eq( index  ).addClass("active"); // 0
			};
		});
	}

    
	$next.on("click", function(){;
		var direcao = $(this).attr("data-direcao");
		_Slider( direcao );
	});

	$prev.on("click", function(){
		var direcao = $(this).attr("data-direcao");
		_Slider( direcao );
	});

	// start slide
	var rotate = setInterval( 
		function(){
			$next.click()}
	, 3000);

	// pause slide and start
	$slideContainer.hover(function(){
		clearInterval( rotate );
	},
	function(){
		rotate = setInterval(function(){
			$next.click()
		},3000);
	});


	// Filtro Editoria 
    $filtroEditoria.on("change", function(){
    	var that = $(this);
    	var valor = that.val();

    	if ( valor !== "" && valor !== undefined && valor !== null ){
	    	$noticiaContainer.html("");
	    	filtroEditoria( $dados , valor );
    	}else{
    		preencherElementos( $data ); // Mostra todos novamente 
    	}
    });



	return{
		init : function(){
			getDados( urlSlide, {
				sucesso:function( data ){
					carregarSlide( $itemSlide, data[0].imagens );
				},
				erro : function( xhr, err ){
					//console.log( xhr );
					//console.log( err );
				}
			}),

			getDados( urlNoticia, {
				sucesso : function( data ){
					preencherElementos( data );
					$data = data;
				},
				erro : function( xhr, err ){
					// console.log( xhr );
					// console.log( err );
				}
			});
		}
	}
}());


APP.init();





//  Gráfico

var dados = [
	{ editoria : "Política" , quantidade : 600 },
	{ editoria : "Economia" , quantidade : 500 },
	{ editoria : "Ciência" , quantidade : 400 },
	{ editoria : "Brasil" , quantidade : 300 },
	{ editoria : "Mundo" , quantidade : 200 },
	{ editoria : "Cultura" , quantidade : 100 },
];

var width = 600,
    barHeight = 30;


var grafico = d3.select(".grafico__item")
    .attr("width", width)
    .attr("height", "200");
   
var bar = grafico.selectAll("g")

    .data(dados)
    .enter().append("g")
  	.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  	bar.append("rect")
    .attr("height", barHeight - 1)
    .style("width", function(d) { return d.quantidade * 1 + "px"; });

    bar.append("text")
    .attr("class","text")
    .attr("x", function(d, i) { return d.quantidade / 2 + "px";  })
    .attr("y", "15")
    .attr("dy", ".35em")
    .text(function(d) { return d.quantidade; });



// Mapa

function initMap() {
  	var myLatLng = {lat: -25.363, lng: 131.044};
    var elemento = document.querySelector(".localizacao");
    var map = new google.maps.Map(elemento, {
      center: myLatLng,
      zoom: 8
    });


  var image = './assets/img/marcador.png';
  var beachMarker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: image
  });
}






(function(){

	initMap();

}());
