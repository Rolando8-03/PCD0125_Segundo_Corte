// Script mejorado para el sitio: año dinámico, formulario simulado, navegación activa y menú móvil
document.addEventListener('DOMContentLoaded', function(){
	// 1) Insertar año en todos los pies de página
	var years = document.querySelectorAll('#year, #year-h, #year-l, #year-g, #year-c');
	years.forEach(function(el){ if(el) el.textContent = new Date().getFullYear(); });

	/* ----------------------- Theme / Modo oscuro -----------------------
	   - Apply user's saved theme (localStorage 'site_theme') if present.
	   - Otherwise respect OS preference (prefers-color-scheme).
	   - Provide an accessible toggle button appended to the header container.
	*/
	(function(){
		var themeKey = 'site_theme';
		function applyTheme(t){
			if(t === 'dark') document.documentElement.setAttribute('data-theme','dark');
			else document.documentElement.removeAttribute('data-theme');
		}

		// Initialize theme from localStorage or OS preference
		var saved = null;
		try{ saved = localStorage.getItem(themeKey); }catch(e){ /* ignore */ }
		if(saved){ applyTheme(saved); }
		else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){ applyTheme('dark'); }

		// Create theme toggle button and insert into header (or body if header not found)
		var container = document.querySelector('.site-header .container') || document.body;
		var btn = document.createElement('button');
		btn.className = 'theme-toggle';
		btn.type = 'button';
		function updateBtn(){
			var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
			btn.innerHTML = isDark ? '☀️' : '🌙';
			btn.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
			btn.setAttribute('aria-pressed', String(isDark));
		}
		updateBtn();
		container.appendChild(btn);

		btn.addEventListener('click', function(){
			var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
			if(isDark){ applyTheme('light'); try{ localStorage.removeItem(themeKey); }catch(e){} }
			else { applyTheme('dark'); try{ localStorage.setItem(themeKey,'dark'); }catch(e){} }
			updateBtn();
		});

		// If user has no explicit choice, listen to OS theme changes and adapt
		if(window.matchMedia){
			var mq = window.matchMedia('(prefers-color-scheme: dark)');
			var mqHandler = function(e){ if(!localStorage.getItem(themeKey)){ applyTheme(e.matches ? 'dark' : 'light'); updateBtn(); } };
			if(typeof mq.addEventListener === 'function') mq.addEventListener('change', mqHandler);
			else if(typeof mq.addListener === 'function') mq.addListener(mqHandler);
		}
	})();

	// 2) Formulario de contacto (envío simulado y validación ligera)
	var form = document.getElementById('contact-form');
	if(form){
		form.addEventListener('submit', function(e){
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
			try{
				var store = JSON.parse(localStorage.getItem('contact_messages') || '[]');
				store.push({name:name,email:email,message:message,created:new Date().toISOString()});
				localStorage.setItem('contact_messages', JSON.stringify(store));
			}catch(e){ console.warn('No se pudo guardar en localStorage', e); }
			status.textContent = 'Gracias, tu mensaje ha sido guardado localmente. (Simulado)';
			status.style.color = 'green';
			form.reset();
			setTimeout(function(){ if(status) status.textContent=''; },6000);
		});
	}

	// 3) Resaltar link activo en la navegación (coincidencia por href)
	var navLinks = document.querySelectorAll('.main-nav a');
	var current = location.pathname.split('/').pop() || 'index.html';
	navLinks.forEach(function(a){
		var href = a.getAttribute('href');
		if(!href) return;
		if(href === current || (href === 'index.html' && current === '')){
			a.classList.add('active');
			a.setAttribute('aria-current','page');
		} else {
			a.classList.remove('active');
			a.removeAttribute('aria-current');
		}
	});

	// 4) Smooth scroll para anclas internas
	document.documentElement.style.scrollBehavior = 'smooth';

	// 5) Menú móvil simple: crear toggle si se desea (no intrusivo)
	var nav = document.querySelector('.main-nav');
	if(nav){
		var btn = document.createElement('button');
		btn.className = 'nav-toggle';
		btn.setAttribute('aria-expanded','false');
		btn.setAttribute('aria-label','Abrir menú');
		btn.innerHTML = '\u2630'; // icono hamburguesa simple
		btn.style.border = '0';
		btn.style.background = 'transparent';
		btn.style.fontSize = '1.1rem';
		btn.style.cursor = 'pointer';
		// insertar antes del nav
		nav.parentNode.insertBefore(btn, nav);

		btn.addEventListener('click', function(){
			var expanded = btn.getAttribute('aria-expanded') === 'true';
			btn.setAttribute('aria-expanded', String(!expanded));
			if(!expanded){
				nav.style.display = 'block';
				btn.setAttribute('aria-label','Cerrar menú');
			} else {
				nav.style.display = '';
				btn.setAttribute('aria-label','Abrir menú');
			}
		});

		// Ajustes responsivos mínimos: ocultar botón en pantallas grandes
		function applyNavResponsive(){
			if(window.innerWidth < 900){
				btn.style.display = 'inline-block';
				nav.style.display = 'none';
			} else {
				btn.style.display = 'none';
				nav.style.display = '';
				btn.setAttribute('aria-expanded','false');
			}
		}
		applyNavResponsive();
		window.addEventListener('resize', applyNavResponsive);
	}

	// 6) Lightbox handling: if page has .btn-open (some pages include a small inline script), provide fallback
	var openButtons = document.querySelectorAll('.btn-open');
	if(openButtons.length){
		var lightbox = document.getElementById('lightbox');
		var lbImg = lightbox ? document.getElementById('lightbox-img') : null;
		var lbTitle = lightbox ? document.getElementById('lightbox-title') : null;
		var lbDesc = lightbox ? document.getElementById('lightbox-desc') : null;
		function open(src, title, desc, alt){
			if(!lightbox) return;
			if(lbImg) { lbImg.src = src || ''; lbImg.alt = alt || title || ''; }
			if(lbTitle) lbTitle.textContent = title || '';
			if(lbDesc) lbDesc.textContent = desc || '';
			lightbox.setAttribute('aria-hidden','false');
			document.body.style.overflow = 'hidden';
		}
		function close(){ if(!lightbox) return; lightbox.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; if(lbImg) lbImg.src=''; }
		openButtons.forEach(function(btn){ btn.addEventListener('click', function(){ open(btn.dataset.image, btn.dataset.title, btn.dataset.desc, btn.dataset.alt); }); });
		var closeBtns = document.querySelectorAll('.lightbox-close'); closeBtns.forEach(function(b){ b.addEventListener('click', close); });
		if(lightbox) lightbox.addEventListener('click', function(e){ if(e.target === lightbox) close(); });
		document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
	}

	// 7) Mensajes page: renderizar mensajes guardados y permitir borrado
	if(document.getElementById('messages-list')){
		try{
			var messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
		}catch(e){ messages = []; }
		var list = document.getElementById('messages-list');
		if(!messages || messages.length === 0){
			list.innerHTML = '<div class="card muted-small">No hay mensajes guardados.</div>'; 
		} else {
			list.innerHTML = messages.map(function(m,idx){
				return '<div class="card" style="margin-bottom:.6rem"><strong>'+escapeHtml(m.name)+'</strong> <span class="muted-small" style="margin-left:.5rem">'+new Date(m.created).toLocaleString()+'</span><p class="muted-small" style="margin-top:.3rem">'+escapeHtml(m.message)+'</p><a class="muted-small" style="font-size:.85rem;color:var(--accent);" href="mailto:'+encodeURI(m.email)+'">'+escapeHtml(m.email)+'</a></div>';
			}).join('');
		}

		var clearBtn = document.getElementById('clear-messages');
		if(clearBtn){
			clearBtn.addEventListener('click', function(){
				if(!confirm('¿Borrar todos los mensajes guardados en este navegador?')) return;
				localStorage.removeItem('contact_messages');
				list.innerHTML = '<div class="card muted-small">No hay mensajes guardados.</div>';
			});
		}
	}

	// pequeña utilidad para evitar inyección mínima al mostrar texto
	function escapeHtml(str){
		if(!str) return '';
		return String(str).replace(/[&"'<>]/g, function (s) { return ({'&':'&amp;','"':'&quot;',"'":"&#39;","<":"&lt;",">":"&gt;"})[s]; });
	}
});

