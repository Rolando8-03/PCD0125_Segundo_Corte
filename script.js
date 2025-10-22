// Script básico para el sitio
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
});

