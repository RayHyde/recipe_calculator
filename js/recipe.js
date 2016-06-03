$(document).ready(function () {
	
	/*** FUNCTIONS ***/
	
	function setStorage() {
		qtys = [],
		types = [],
		descs = [];
		ing.find('.qty').each(function () {
			qtys.push($(this).val());
		});
		ing.find('.type').each(function () {
			types.push($(this).val());
		});
		ing.find('.desc').each(function () {
			descs.push($(this).val());
		});
		localStorage['qtys'] = qtys;
		localStorage['types'] = types;
		localStorage['descs'] = descs;
		localStorage['orgQty'] = $('#orgQty').val();
		localStorage['orgType'] = $('#orgType').val();
		localStorage['newQty'] = $('#newQty').val();
		localStorage['recipeTitle'] = $('#recipe-title').val();
	}
	
	function clearStorage() {		
		localStorage['qtys'] = '';
		localStorage['types'] = '';
		localStorage['descs'] = '';
		localStorage['orgQty'] = '';
		localStorage['orgType'] = '';
		localStorage['newQty'] = '';
		localStorage['recipeTitle'] = '';
	}
	
	function appendInputs() {
		ing.find('ul').append('<li><div class="row"><div class="col-xs-2"><input type="text" placeholder="qty." id="qty-'+i+'" class="qty" name="qty" value="'+ qtys[i] +'"></div><div class="col-xs-2"><input type="text" placeholder="e.g. gr" id="type-'+i+'" class="type" name="type" value="'+types[i]+'"></div><div class="col-xs-7"><input type="text" placeholder="e.g. flour" id="desc-'+i+'" class="desc" name="desc" value="'+descs[i]+'"></div><div class="col-xs-1"><button title="Remove this ingredient" alt="Remove this ingredient" class="btn btn-default btn-sm del"><span class="glyphicon glyphicon-remove"></span></button></div></div></li>');
	}
	
	function showCrunch() {		
		if ( $('#orgQty').val() != '' && $('#newQty').val() != '' && $('#ingredients .qty').eq( $('#ingredients .qty').length -1 ).val() != '') {
			$('#crunch').fadeIn();
		}		
	}
	
	function crunchAll() {
		ratio = $('#newQty').val() / $('#orgQty').val();
		$('#crunch').add(ing.find('#add')).fadeOut();
		$('#crunched ul, .print-text ul').remove();
		ing.find('ul').clone()
			.find('li').each(function () {
				$(this).find('.qty').each(function () {
					var val = parseInt($(this).val() * ratio);
					$(this).val(val);
				});
				$(this).find('.del').remove();
			})
			.closest('ul').appendTo('.print-text');

		$('#crunched .print-header h3').text('Quantity: ' + $('#newQty').val() + ' ' + $('#orgType').val());

		$('#crunched').addClass('active');
	}
	

	/*** INITIALS ***/
	
	var which, id, l, ratio, $this,
			ing = $('#ingredients'),	
			qtys = [],
			types = [],
			descs = [];
	
	if (localStorage) {
		if (localStorage.qtys) {
			$('#orgQty').val(localStorage['orgQty']);
			$('#orgType').val(localStorage['orgType']);
			$('#newQty').val(localStorage['newQty']);
			$('#recipe-title').val(localStorage['recipeTitle']);
			ing.find('ul li:last-child').remove();
			qtys = localStorage.qtys.split(',');
			types = localStorage.types.split(',');
			descs = localStorage.descs.split(',');
			for ( var i=0;i< qtys.length;i++ ) {
				appendInputs();
				
			}
			showCrunch();
		}
	}	
	
	/*** ACTIONS ***/
	
	$('#add').click(function() {
		which = parseInt(ing.find('li:last-child .qty').attr('id').slice(-1));
		ing.find('li:last-child').clone().css({
				opacity: 0
			})
			.find('input').each(function () {
				$(this).val('');
			})
			.closest('li')
			.appendTo(ing.find('ul'));
		ing.find('li:last-child input').each(function () {
			id = $(this).attr('id').split('-')[0];
			$(this).attr('id', id + '-' + (which + 1));
		})
		ing.find('li').eq(ing.find('li').length - 1).animate({
			'opacity': 1
		});
		return false;
	});

	ing.on('click', '.del', function() {
		l = ing.find('li').length;

		if (l == 2) {
			ing.find('input').value('');
			ing.find('input.qty').attr('id', 'qty-0');
			ing.find('input.type').attr('id', 'type-0');
			ing.find('input.desc').attr('id', 'desc-0');
		} else {
			$(this).closest('li').animate({
				opacity: 0
			}, 1000, function () {
				$(this).remove();
			});
		}
		return false;
	});

	$('#crunch').click(function() {		
		crunchAll();
		return false;
	});

	$('#reset').click(function(){
		$('#crunched').animate({
			'opacity': 0
		}, 300, function(){
			$(this).removeClass('active').css('opacity', '1');
			$('#crunched ul, .print-text ul').remove();			
			ing.find('input').val('');
			clearStorage();
		});
		
    var run = setInterval(loop, 200); 

		function loop(){ 			
			if ( ing.find('.qty').length > 1 ) {
				ing.find('.qty').eq($('#ingredients .qty').length -1 ).animate({
					'opacity': 0
				}, 300, function() {
					ing.find('li').eq($('#ingredients li').length -1 ).remove();
				});
			}
		}
		
	});
	
	$('#orgQty, #newQty, #ingredients input').on('keyup', function(){
		showCrunch();
	});	
	
	$('.container').on('click', '#print', function() {
		$('#modalBck, #modal').addClass('active');
		return false;
	});

	$('#modal #print-cont').click(function() {
		window.print();
		return false;
	});

	$('.save, #print-cont, #crunch').click(function() {
		if (localStorage) {
			setStorage();
		}
		return false;
	});

	$('#modal .close').click(function () {
		$('#modalBck, #modal').removeClass('active');
	});
});