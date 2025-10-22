// Script básico para el sitio (sin confeti)
document.addEventListener('DOMContentLoaded',function(){
	// Insertar año en todos los pies de página
	var years = document.querySelectorAll('#year, #year-h, #year-l, #year-g, #year-c');
	years.forEach(function(el){ if(el) el.textContent = new Date().getFullYear(); });

	// Prevenir envío real en formulario de contacto (placeholder)
	var form = document.getElementById('contact-form');
	if(form){
		form.addEventListener('submit',function(e){
			e.preventDefault();
			alert('Formulario de contacto simulado. Aquí se implementará el envío.');
			form.reset();
		});
	}
    
	// Resaltar link activo en la navegación según data-link
	var links = document.querySelectorAll('.main-nav .nav-link');
	links.forEach(function(a){
		try{
			if(a.dataset.link && window.location.href.indexOf(a.getAttribute('href')) !== -1){
				a.classList.add('active');
				a.setAttribute('aria-current','page');
			}
		}catch(e){/* ignore */}
	});

	// Scroll suave para anclas internas
	document.documentElement.style.scrollBehavior = 'smooth';
});

