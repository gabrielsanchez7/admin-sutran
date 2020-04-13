window.onload = async () => {

	const currentPage = $('body').attr('id')
	
	if(currentPage != 'login-page') {

		$('aside').html(await getContentHtml('aside'))
		$('header').html(await getContentHtml('header'))

	}

	focusInput()
	changeCheckbox()
	showPassword()
	
	switch(currentPage) {
		case 'dashboard-page' : setMenuActive('.menu-dashboard'); break;
		case 'usuarios-page' : setMenuActive('.menu-usuarios'); break;
		case 'base-datos-page' : setMenuActive('.menu-base'); break;
		default : setMenuActive('.menu-dashboard');
	}
	
}

let getContentHtml = async (html) => {

	const content = await fetch(`../views/${html}.html`)
	return await content.text()

}

let focusInput = () => {

	$('input:text, input:password').on('input', e => {
		const t = $(e.target)
		const container = t.closest('label')

		if(t.val() == '') { container.removeClass('edited') }
		else { container.addClass('edited') }
	})

	$('input:text, input:password').focusin(e => {
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
	$(menuSelector).addClass('active').siblings('.menu-item').removeClass('active');
}