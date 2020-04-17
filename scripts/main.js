window.onload = async () => {

	const currentPage = $('body').attr('id')
	
	if(currentPage != 'login-page') {

		$('aside').html(await getContentHtml('aside'))
		$('header').html(await getContentHtml('header'))

	}

	focusInput()
	changeCheckbox()
	showPassword()
	cancelEditForm()
	dropdown()
	
	switch(currentPage) {
		case 'dashboard-page' : setMenuActive('.menu-dashboard'); break;
		case 'usuarios-page' : setMenuActive('.menu-usuarios'); break;
		case 'base-datos-page' : setMenuActive('.menu-base'); break;
		case 'alertas-page' : setMenuActive('.menu-alertas'); break;
		case 'messages-page' : setMenuActive('.menu-messages'); break;
		default : setMenuActive('.menu-dashboard');
	}
	
}

let getContentHtml = async (html) => {

	const content = await fetch(`../views/${html}.html`)
	return await content.text()

}

let focusInput = () => {

	$('input:text:not([readonly]), input:password').on('input', e => {
		const t = $(e.target)
		const container = t.closest('label')

		if(t.val() == '') { container.removeClass('edited') }
		else { container.addClass('edited') }
	})

	$('input:text:not([readonly]), input:password').focusin(e => {
		const t = $(e.target)
		const container = t.closest('label')
		
		container.addClass('focus')
	})

	$('input:text, input:password').focusout(e => {
		const t = $(e.target)
		const container = t.closest('label')

		container.removeClass('focus')
	})
	
}

let changeCheckbox = () => {

	$('input:checkbox').on('change', e => {
		const t = $(e.target)
		const container = t.closest('label')
		
		if(t.is(':checked')) {
			container.addClass('checked')
			container.find('.far').attr({class: 'fas fa-check-square'})
		}
		else {
			container.removeClass('checked')
			container.find('.fas').attr({class: 'far fa-square'})
		}
	})
	
}

let showPassword = () => {

	$('.show-pwd').click(e => {
		const t = $(e.target)
		const input = t.siblings('input:password, input:text')
		const type = input.attr('type')

		console.log(type)
		if(type == 'password') {
			input.attr({type: 'text'})
			t.attr({class: 'show-pwd fas fa-eye-slash'})
		}
		else {
			input.attr({type: 'password'})
			t.attr({class: 'show-pwd fas fa-eye'})
		}
	})
	
}

let setMenuActive = (menuSelector) => {
	$(menuSelector).addClass('active').siblings('.menu-item').removeClass('active')
}

let tableDisplay = (tableSelector) => {
	const sizeContainer = $(tableSelector).closest('.box').innerWidth() - 60
	const sizeTable = $(tableSelector).find('thead').innerWidth()
	if(sizeTable < sizeContainer) {
		$(tableSelector).css({display: 'inline-table'})
	}
}

let getRowData = (e, table) => {
	let trRow = $(e).closest('tr')
	let row = table.row(trRow).data()

	const form = $(e).closest('table').attr('id').split('-table')[0]
	$(`#form-${form}`).slideDown('fast', () => {
		const scrollTop = $(`#form-${form}`).offset().top
		$('html,body').animate({scrollTop: scrollTop - 20}, 'fast')
	})

	return row
}

let editedTextfield = (formSelector) => {
	const fields = $(formSelector).find('input:text, input:password, textarea')
	$.each(fields, (index, value) => {
		const content = $(value).val()
		if(content != '') {
			$(value).closest('label').addClass('edited')
		}
	})
}

let cancelEditForm = () => {
	$('body').on('click', '.cancel-form', e => {
		const t = $(e.target)
		t.closest('form').slideUp('fast')
	})
}

let dropdown = () => {
	let open = false
	$('.dropdown input:text').click(e => {
		const t = $(e.target);
		const container = t.closest('.dropdown')
		const droplist = container.find('.droplist')

		if (!open) {
			container.addClass('open');
			droplist.show('fast');
			open = true;
		}
		else {
			droplist.hide('fast');
			container.removeClass('open');
			open = false;
		}
	});

	$('.dropdown .dropitem').click(e => {
		const t = $(e.target)
		const value = t.attr('data-value')
		const text = t.text()
		const input = t.closest('.dropdown').find('input:text')
		const inputHidden = t.closest('.dropdown').find('input:hidden')

		input.val(text)
		inputHidden.val(value)

		t.closest('.dropdown').removeClass('open')

	})
}

let launchMap = (data, selected) => {
	// Map
	var map = L.map( 'map', {
		center: [selected.latitud, selected.longitud],
		minZoom: 2,
		zoom: 15
	});

	
	L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		 subdomains: ['a','b','c']
	}).addTo( map );
	
	// var myURL = jQuery( 'script[src$="leaf-demo.js"]' ).attr( 'src' ).replace( 'leaf-demo.js', '' );
	
	var myIcon = L.icon({
		iconUrl: '../images/pin24.png',
		iconRetinaUrl: '../images/pin48.png',
		iconSize: [29, 24],
		iconAnchor: [9, 21],
		popupAnchor: [0, -14]
	});

	var markerClusters = L.markerClusterGroup();
	
	data.forEach(alerta => {
		var popup = htmlPopup(alerta)
		
		var m = L.marker( [alerta.latitud, alerta.longitud], {icon: myIcon} ).bindPopup( popup );
		markerClusters.addLayer( m );
	})
	
	map.addLayer( markerClusters );

	setTimeout(() => {
		map.invalidateSize()
		var popLocation= new L.LatLng(selected.latitud,selected.longitud);
		L.popup()
			.setLatLng(popLocation)
			.setContent(htmlPopup(selected))
			.openOn(map);
	}, 100);
}

let htmlPopup = (selected) => {
	return `
		<p><strong>Tipo de alerta:</strong> ${selected.tipo}</p>
		<p><strong>Dispositivo</strong>: ${selected.dispositivo}</p>
		<p><strong>Fecha</strong>: ${selected.fecha}</p>
		<p><strong>Latitud</strong>: ${selected.latitud}</p>
		<p><strong>Longitud</strong>: ${selected.longitud}</p>
	`
}