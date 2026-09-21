/* ==========================================================
   THE WITCHER - Páginas de videojuegos (witcher1, witcher2, witcher3)
   JavaScript vanilla. Se carga junto con script.js.
   Índice:
   1. Botones que bajan a otra sección
   2. Carrusel (usado en las tres páginas)
   3. Animaciones de aparición al hacer scroll
   4. Hero de Witcher 3: parallax y desvanecido
   5. Hero de Witcher 3: brasas flotando
   ========================================================== */

// Permite que el CSS oculte los elementos "reveal" solo si JavaScript funciona
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  iniciarBotonesScroll();
  iniciarCarruseles();
  iniciarReveal();
  iniciarHeroWitcher3();
});

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Botones que bajan a otra sección ---------- */
function iniciarBotonesScroll() {
  const scrollButtons = document.querySelectorAll("[data-scroll]");

  scrollButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const destino = document.getElementById(button.dataset.scroll);
      if (destino) {
        destino.scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "start" });
      }
    });
  });
}

/* ---------- 2. Carrusel ---------- */
function iniciarCarruseles() {
  document.querySelectorAll("[data-carrusel]").forEach(iniciarCarrusel);
}

function iniciarCarrusel(carrusel) {
  const slides = Array.from(carrusel.querySelectorAll("[data-slide]"));
  const prevButton = carrusel.querySelector("[data-prev]");
  const nextButton = carrusel.querySelector("[data-next]");
  const dots = Array.from(carrusel.querySelectorAll("[data-dot]"));
  const counter = carrusel.querySelector("[data-contador]");
  const tiempo = reducirMovimiento ? 0 : parseInt(carrusel.dataset.autoplay || "0", 10);

  if (slides.length === 0) return;

  let indiceActual = 0;
  let temporizador = null;
  let visible = false;
  let pausado = false;

  function dosDigitos(numero) {
    return numero < 10 ? "0" + numero : String(numero);
  }

  function mostrarSlide(indice) {
    indiceActual = (indice + slides.length) % slides.length;

    slides.forEach(function (slide, posicion) {
      const activo = posicion === indiceActual;
      slide.classList.toggle("activo", activo);
      slide.setAttribute("aria-hidden", activo ? "false" : "true");
    });

    dots.forEach(function (dot, posicion) {
      const activo = posicion === indiceActual;
      dot.classList.remove("activo");
      if (activo) {
        // Se fuerza un reflow para reiniciar la barra de progreso
        void dot.offsetWidth;
        dot.classList.add("activo");
      }
      dot.setAttribute("aria-current", activo ? "true" : "false");
    });

    if (counter) {
      counter.textContent = dosDigitos(indiceActual + 1) + " / " + dosDigitos(slides.length);
    }

    programarSiguiente();
  }

  function programarSiguiente() {
    clearTimeout(temporizador);
    if (tiempo > 0 && visible && !pausado) {
      temporizador = setTimeout(function () {
        mostrarSlide(indiceActual + 1);
      }, tiempo);
    }
  }

  if (tiempo > 0) {
    carrusel.style.setProperty("--duracion", tiempo + "ms");
  } else {
    carrusel.classList.add("sin-autoplay");
  }

  if (prevButton) {
    prevButton.addEventListener("click", function () {
      mostrarSlide(indiceActual - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      mostrarSlide(indiceActual + 1);
    });
  }

  dots.forEach(function (dot, posicion) {
    dot.addEventListener("click", function () {
      mostrarSlide(posicion);
    });
  });

  // Pausa el autoplay mientras el mouse o el foco están sobre el carrusel
  function pausar() {
    pausado = true;
    carrusel.classList.add("pausado");
    clearTimeout(temporizador);
  }

  function reanudar() {
    pausado = false;
    carrusel.classList.remove("pausado");
    mostrarSlide(indiceActual);
  }

  if (tiempo > 0) {
    carrusel.addEventListener("mouseenter", pausar);
    carrusel.addEventListener("mouseleave", reanudar);
    carrusel.addEventListener("focusin", pausar);
    carrusel.addEventListener("focusout", reanudar);
  }

  // Solo se mueve con el teclado y con autoplay cuando el carrusel está en pantalla
  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(function (entradas) {
      visible = entradas[0].isIntersecting;
      if (visible) {
        mostrarSlide(indiceActual);
      } else {
        clearTimeout(temporizador);
      }
    }, { threshold: 0.5 });
    observador.observe(carrusel);
  } else {
    visible = true;
  }

  document.addEventListener("keydown", function (event) {
    if (!visible) return;
    if (event.key === "ArrowLeft") mostrarSlide(indiceActual - 1);
    if (event.key === "ArrowRight") mostrarSlide(indiceActual + 1);
  });

  // Gesto de deslizar en pantallas táctiles
  let inicioX = 0;
  carrusel.addEventListener("touchstart", function (event) {
    inicioX = event.changedTouches[0].clientX;
  }, { passive: true });

  carrusel.addEventListener("touchend", function (event) {
    const diferencia = event.changedTouches[0].clientX - inicioX;
    if (Math.abs(diferencia) > 50) {
      mostrarSlide(diferencia > 0 ? indiceActual - 1 : indiceActual + 1);
    }
  }, { passive: true });

  mostrarSlide(0);
}

/* ---------- 3. Animaciones de aparición al hacer scroll ---------- */
function iniciarReveal() {
  const revealItems = document.querySelectorAll(".reveal, .reveal-izq");
  if (revealItems.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });
    return;
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach(function (item) {
    const retraso = item.dataset.retraso;
    if (retraso) item.style.transitionDelay = retraso + "ms";
    observador.observe(item);
  });
}

/* ---------- 4 y 5. Hero de Witcher 3 ---------- */
function iniciarHeroWitcher3() {
  const hero = document.getElementById("w3-hero");
  if (!hero) return;

  const fondo = hero.querySelector("[data-parallax]");
  const contenido = hero.querySelector("[data-desvanecer]");
  const canvas = hero.querySelector(".w3-brasas");
  let heroVisible = true;

  // Parallax y desvanecido del título al bajar
  if (!reducirMovimiento) {
    let esperando = false;

    function actualizarScroll() {
      const desplazamiento = window.scrollY;
      const alto = hero.offsetHeight;
      if (desplazamiento <= alto) {
        fondo.style.setProperty("--py", desplazamiento * 0.25 + "px");
        const opacidad = Math.max(0, 1 - desplazamiento / (alto * 0.55));
        contenido.style.opacity = opacidad;
        contenido.style.transform = "translateY(" + desplazamiento * 0.15 + "px)";
      }
      esperando = false;
    }

    window.addEventListener("scroll", function () {
      if (!esperando) {
        esperando = true;
        requestAnimationFrame(actualizarScroll);
      }
    }, { passive: true });
  }

  if (!canvas || reducirMovimiento) return;

  // Brasas flotando
  const contexto = canvas.getContext("2d");
  if (!contexto) return;
  let ancho = 0;
  let alto = 0;
  const brasas = [];
  const cantidad = window.innerWidth < 700 ? 35 : 80;

  function ajustarCanvas() {
    ancho = canvas.width = hero.offsetWidth;
    alto = canvas.height = hero.offsetHeight;
  }

  function crearBrasa(desdeAbajo) {
    return {
      x: Math.random() * ancho,
      y: desdeAbajo ? alto + 10 : Math.random() * alto,
      radio: 0.8 + Math.random() * 2.2,
      velocidad: 0.25 + Math.random() * 0.9,
      deriva: (Math.random() - 0.5) * 0.5,
      fase: Math.random() * Math.PI * 2,
      brillo: 0.35 + Math.random() * 0.65
    };
  }

  function dibujar() {
    if (heroVisible) {
      contexto.clearRect(0, 0, ancho, alto);
      brasas.forEach(function (brasa, indice) {
        brasa.y -= brasa.velocidad;
        brasa.fase += 0.02;
        brasa.x += brasa.deriva + Math.sin(brasa.fase) * 0.35;

        if (brasa.y < -10) brasas[indice] = crearBrasa(true);

        const desvanecido = Math.min(1, brasa.y / (alto * 0.4));
        contexto.beginPath();
        contexto.fillStyle = "rgba(255, 170, 90, " + (brasa.brillo * 0.16 * desvanecido) + ")";
        contexto.arc(brasa.x, brasa.y, brasa.radio * 4, 0, Math.PI * 2);
        contexto.fill();

        contexto.beginPath();
        contexto.fillStyle = "rgba(255, 226, 176, " + (brasa.brillo * desvanecido) + ")";
        contexto.arc(brasa.x, brasa.y, brasa.radio, 0, Math.PI * 2);
        contexto.fill();
      });
    }
    requestAnimationFrame(dibujar);
  }

  ajustarCanvas();
  for (let i = 0; i < cantidad; i++) brasas.push(crearBrasa(false));
  window.addEventListener("resize", ajustarCanvas);

  // Se detiene el dibujo cuando el hero sale de pantalla
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entradas) {
      heroVisible = entradas[0].isIntersecting;
    }).observe(hero);
  }

  dibujar();
}
