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
			var name = document.getElementById('name').value.trim();
			var email = document.getElementById('email').value.trim();
			var message = document.getElementById('message').value.trim();
			var status = document.getElementById('contact-status');
			if(!name || !email || !message){
				status.textContent = 'Por favor completa todos los campos.';
				status.style.color = 'crimson';
				return;
			}
			// Simular guardado local
			var store = JSON.parse(localStorage.getItem('contact_messages') || '[]');
			store.push({name:name,email:email,message:message,created:new Date().toISOString()});
			localStorage.setItem('contact_messages', JSON.stringify(store));
			// Mostrar confirmación
			status.textContent = 'Gracias, tu mensaje ha sido guardado localmente. Pronto te responderemos (simulado).';
			status.style.color = 'green';
			form.reset();
			// Opcional: limpiar el mensaje después de 6s
			setTimeout(function(){ status.textContent=''; },6000);
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

