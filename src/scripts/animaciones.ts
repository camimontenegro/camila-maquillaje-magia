import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global {
	interface Window {
		__gsapListo?: boolean;
	}
}

// Avisa al script inline del <head> que GSAP cargó (evita el fallback que muestra todo sin animar).
window.__gsapListo = true;

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
	/* ---------- Entrada de la portada ---------- */
	const balanceo = gsap.to('.aporte', {
		rotation: 2,
		duration: 1.8,
		ease: 'sine.inOut',
		repeat: -1,
		yoyo: true,
		paused: true,
	});

	// El botón fijo tiene transición CSS en transform (hover/tap): se apaga mientras GSAP lo anima.
	gsap.set('.barra a', { transition: 'none' });

	const intro = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
	intro
		.from('.portada .logo', { autoAlpha: 0, y: -18, scale: 0.92, duration: 0.7 })
		.from('.portada .etiqueta', { autoAlpha: 0, y: 14 }, '-=0.45')
		.from('.portada h1 .palabra', { autoAlpha: 0, yPercent: 70, rotation: 4, stagger: 0.08 }, '-=0.55')
		.from(
			'.foto-marco img',
			{
				autoAlpha: 0,
				scale: 1.06,
				clipPath: 'inset(14% 10% 14% 10% round 28px)',
				duration: 1.2,
				ease: 'expo.out',
				// El clip-path recortaría la sombra de la foto: se limpia al terminar.
				clearProps: 'clipPath',
			},
			'-=0.5',
		)
		.from('.punto', { autoAlpha: 0, scale: 0, stagger: 0.09, duration: 0.6, ease: 'back.out(3)' }, '-=0.7')
		.from('.dia', { autoAlpha: 0, y: 26, stagger: 0.08 }, '-=0.6')
		.from('.aporte', { autoAlpha: 0, scale: 0.6, rotation: -14, duration: 0.7, ease: 'back.out(2.4)' }, '-=0.45')
		.from('.barra a', { autoAlpha: 0, y: 70, duration: 0.6, clearProps: 'transform,transition' }, '-=0.35')
		.add(() => balanceo.play());

	/* ---------- Parallax suave de la foto y los puntos ---------- */
	gsap.to('.foto-marco', {
		y: -36,
		ease: 'none',
		scrollTrigger: { trigger: '.foto-marco', start: 'top top', end: 'bottom top', scrub: 0.6 },
	});
	gsap.to('.punto.lima', {
		y: -70,
		ease: 'none',
		scrollTrigger: { trigger: '.foto-marco', start: 'top top', end: 'bottom top', scrub: 0.6 },
	});
	gsap.to('.punto.naranja', {
		y: 50,
		ease: 'none',
		scrollTrigger: { trigger: '.foto-marco', start: 'top top', end: 'bottom top', scrub: 0.6 },
	});

	/* ---------- Apariciones al hacer scroll ---------- */
	gsap.set('[data-reveal]', { autoAlpha: 0, y: 32 });
	gsap.set('[data-reveal="derecha"]', { y: 0, x: 70 });
	gsap.set('[data-reveal="pop"]', { y: 0, scale: 0.85 });

	ScrollTrigger.batch('[data-reveal]', {
		start: 'top 88%',
		once: true,
		onEnter: (elementos) =>
			gsap.to(elementos, {
				autoAlpha: 1,
				x: 0,
				y: 0,
				scale: 1,
				duration: 0.8,
				ease: 'power3.out',
				stagger: 0.1,
				overwrite: true,
				// Deja el transform libre para los efectos CSS de hover/tap.
				clearProps: 'transform',
			}),
	});

	// Las bolitas de cada dato "laten" al aparecer.
	gsap.utils.toArray<HTMLElement>('.dato').forEach((dato) => {
		gsap.from(dato.querySelector('.bolita'), {
			scale: 0,
			duration: 0.6,
			delay: 0.25,
			ease: 'back.out(4)',
			scrollTrigger: { trigger: dato, start: 'top 88%', once: true },
		});
	});

	// Los títulos de sección suben con un leve giro.
	gsap.utils.toArray<HTMLElement>('main h2').forEach((titulo) => {
		gsap.from(titulo, {
			yPercent: 40,
			rotation: 2,
			autoAlpha: 0,
			duration: 0.9,
			ease: 'power3.out',
			scrollTrigger: { trigger: titulo, start: 'top 90%', once: true },
		});
	});

	// Las fuentes web cambian alturas: recalcular posiciones cuando terminan de cargar.
	document.fonts?.ready.then(() => ScrollTrigger.refresh());
});
