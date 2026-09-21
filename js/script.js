/* ==========================================================
   THE WITCHER - Sitio informativo
   JavaScript vanilla
   Índice:
   1. Header con efecto al hacer scroll
   2. Menú responsive y submenú desplegable
   3. Galería con lightbox
   4. Formulario de contacto con validaciones
   5. Año actual en el footer
   6. Videos de YouTube que se cargan al hacer click
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  iniciarHeader();
  iniciarMenu();
  iniciarGaleria();
  iniciarFormulario();
  iniciarAnio();
  iniciarVolverInicio();
  iniciarVideos();
});

/* ---------- 1. Header con efecto al hacer scroll ---------- */
function iniciarHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  function actualizarHeader() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", actualizarHeader, { passive: true });
  actualizarHeader();
}

/* ---------- Botón global: volver al inicio ---------- */
function iniciarVolverInicio() {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "volver-inicio";
  boton.setAttribute("aria-label", "Volver al inicio de la página");
  boton.setAttribute("title", "Volver al inicio");

  // Medallón del Lobo (WebP con fondo transparente). Para cambiarlo, reemplaza el archivo img/medallon.webp.
  const imagen = document.createElement("img");
  imagen.src = "img/medallon.webp";
  imagen.alt = "";
  imagen.width = 48;
  imagen.height = 48;

  boton.appendChild(imagen);
  document.body.appendChild(boton);

  function actualizarVisibilidad() {
    boton.classList.toggle("visible", window.scrollY > 280);
  }

  boton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", actualizarVisibilidad, { passive: true });
  actualizarVisibilidad();
}

/* ---------- 2. Menú responsive y submenú ---------- */
function iniciarMenu() {
  const menuButton = document.getElementById("menuButton");
  const nav = document.getElementById("nav");
  const submenuButtons = document.querySelectorAll(".submenu-toggle");
  if (!menuButton || !nav) return;

  // Fondo oscuro detrás del menú lateral
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  function abrirMenu() {
    nav.classList.add("abierto");
    overlay.classList.add("visible");
    menuButton.classList.add("abierto");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Cerrar menú");
    document.body.classList.add("menu-abierto");
  }

  function cerrarMenu() {
    nav.classList.remove("abierto");
    overlay.classList.remove("visible");
    menuButton.classList.remove("abierto");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-abierto");
  }

  menuButton.addEventListener("click", function () {
    if (nav.classList.contains("abierto")) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  });

  overlay.addEventListener("click", cerrarMenu);

  // Submenú en móvil: se abre y se cierra con el botón de flecha
  submenuButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const item = button.parentElement;
      const estaAbierto = item.classList.toggle("abierto");
      button.setAttribute("aria-expanded", estaAbierto ? "true" : "false");
    });
  });

  // En móvil, tocar el texto "Videojuegos" también abre y cierra el submenú
  document.querySelectorAll(".menu-parent").forEach(function (parent) {
    function alternarSubmenu() {
      if (window.innerWidth <= 900) {
        parent.parentElement.querySelector(".submenu-toggle").click();
      }
    }

    parent.addEventListener("click", alternarSubmenu);
    parent.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        alternarSubmenu();
      }
    });
  });

  // Al elegir una opción, el menú lateral se cierra
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", cerrarMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("abierto")) {
      cerrarMenu();
      menuButton.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      cerrarMenu();
      submenuButtons.forEach(function (button) {
        button.parentElement.classList.remove("abierto");
        button.setAttribute("aria-expanded", "false");
      });
    }
  });
}

/* ---------- 3. Galería con lightbox ---------- */
function iniciarGaleria() {
  const galeriaItems = document.querySelectorAll(".galeria-item");
  const lightbox = document.getElementById("lightbox");
  if (galeriaItems.length === 0 || !lightbox) return;

  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const closeButton = document.getElementById("lightboxClose");
  const prevButton = document.getElementById("lightboxPrev");
  const nextButton = document.getElementById("lightboxNext");

  let indiceActual = 0;
  let elementoAnterior = null;

  function mostrarImagen(indice) {
    const total = galeriaItems.length;
    indiceActual = (indice + total) % total;

    const imagen = galeriaItems[indiceActual].querySelector("img");
    const titulo = galeriaItems[indiceActual].dataset.titulo || imagen.alt;

    lightboxImage.src = imagen.src;
    lightboxImage.alt = imagen.alt;
    lightboxCaption.firstChild.textContent = titulo;
    lightboxCounter.textContent = indiceActual + 1 + " de " + total;
  }

  function abrirLightbox(indice) {
    elementoAnterior = document.activeElement;
    mostrarImagen(indice);
    lightbox.classList.add("abierto");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-abierto");
    closeButton.focus();
  }

  function cerrarLightbox() {
    lightbox.classList.remove("abierto");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-abierto");
    if (elementoAnterior) elementoAnterior.focus();
  }

  galeriaItems.forEach(function (item, indice) {
    item.addEventListener("click", function () {
      abrirLightbox(indice);
    });
  });

  closeButton.addEventListener("click", cerrarLightbox);
  prevButton.addEventListener("click", function () {
    mostrarImagen(indiceActual - 1);
  });
  nextButton.addEventListener("click", function () {
    mostrarImagen(indiceActual + 1);
  });

  // Click en el fondo oscuro cierra el lightbox
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) cerrarLightbox();
  });

  // Teclado: Escape, flechas y Tab dentro del lightbox
  document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("abierto")) return;

    if (event.key === "Escape") {
      cerrarLightbox();
    } else if (event.key === "ArrowLeft") {
      mostrarImagen(indiceActual - 1);
    } else if (event.key === "ArrowRight") {
      mostrarImagen(indiceActual + 1);
    } else if (event.key === "Tab") {
      const botones = [closeButton, prevButton, nextButton];
      const primero = botones[0];
      const ultimo = botones[botones.length - 1];
      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero.focus();
      }
    }
  });

  // Gesto de deslizar en pantallas táctiles
  let inicioX = 0;
  lightbox.addEventListener("touchstart", function (event) {
    inicioX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", function (event) {
    const diferencia = event.changedTouches[0].clientX - inicioX;
    if (Math.abs(diferencia) > 60) {
      mostrarImagen(diferencia > 0 ? indiceActual - 1 : indiceActual + 1);
    }
  }, { passive: true });
}

/* ---------- 4. Formulario de contacto ---------- */
function iniciarFormulario() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const nameInput = document.getElementById("nombre");
  const lastNameInput = document.getElementById("apellido");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("asunto");
  const messageInput = document.getElementById("mensaje");
  const successMessage = document.getElementById("mensajeExito");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function mostrarError(input, texto) {
    const campo = input.closest(".campo");
    const error = campo.querySelector(".mensaje-error");
    campo.classList.add("con-error");
    campo.classList.remove("valido");
    input.setAttribute("aria-invalid", "true");
    error.textContent = texto;
  }

  function mostrarValido(input) {
    const campo = input.closest(".campo");
    const error = campo.querySelector(".mensaje-error");
    campo.classList.remove("con-error");
    campo.classList.add("valido");
    input.setAttribute("aria-invalid", "false");
    error.textContent = "";
  }

  // Cada función devuelve true si el campo es correcto
  function validarTexto(input, nombreCampo, minimo) {
    const valor = input.value.trim();
    if (valor === "") {
      mostrarError(input, "El campo " + nombreCampo + " es obligatorio.");
      return false;
    }
    if (valor.length < minimo) {
      mostrarError(input, "Escribe al menos " + minimo + " caracteres en " + nombreCampo + ".");
      return false;
    }
    mostrarValido(input);
    return true;
  }

  function validarEmail() {
    const valor = emailInput.value.trim();
    if (valor === "") {
      mostrarError(emailInput, "El campo email es obligatorio.");
      return false;
    }
    if (!emailRegex.test(valor)) {
      mostrarError(emailInput, "Escribe un email válido, por ejemplo: nombre@correo.com");
      return false;
    }
    mostrarValido(emailInput);
    return true;
  }

  const validaciones = [
    { input: nameInput, validar: function () { return validarTexto(nameInput, "nombre", 2); } },
    { input: lastNameInput, validar: function () { return validarTexto(lastNameInput, "apellido", 2); } },
    { input: emailInput, validar: validarEmail },
    { input: subjectInput, validar: function () { return validarTexto(subjectInput, "asunto", 3); } },
    { input: messageInput, validar: function () { return validarTexto(messageInput, "mensaje", 10); } }
  ];

  // Validación en vivo: al salir del campo y mientras se corrige un error
  validaciones.forEach(function (item) {
    item.input.addEventListener("blur", item.validar);
    item.input.addEventListener("input", function () {
      if (item.input.closest(".campo").classList.contains("con-error")) {
        item.validar();
      }
    });
  });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    successMessage.classList.remove("visible");

    let formularioValido = true;
    let primerError = null;

    validaciones.forEach(function (item) {
      const correcto = item.validar();
      if (!correcto) {
        formularioValido = false;
        if (!primerError) primerError = item.input;
      }
    });

    if (!formularioValido) {
      primerError.focus();
      return;
    }

    // No hay servidor: el envío se simula en el navegador
    const nombreCompleto = nameInput.value.trim() + " " + lastNameInput.value.trim();
    successMessage.querySelector("span").textContent =
      "Gracias, " + nombreCompleto + ". Tu mensaje fue enviado correctamente.";
    successMessage.classList.add("visible");
    successMessage.focus();

    contactForm.reset();
    contactForm.querySelectorAll(".campo").forEach(function (campo) {
      campo.classList.remove("valido", "con-error");
    });
  });
}

/* ---------- 5. Año actual en el footer ---------- */
function iniciarAnio() {
  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
}

/* ---------- 6. Videos de YouTube que se cargan al hacer click ---------- */
function iniciarVideos() {
  const videoBoxes = document.querySelectorAll(".video[data-video]");

  videoBoxes.forEach(function (box) {
    const playButton = box.querySelector(".video-play");
    if (!playButton) return;

    playButton.addEventListener("click", function () {
      const iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + box.dataset.video +
        "?autoplay=1&rel=0&playsinline=1";
      iframe.title = box.dataset.titulo || "Video de The Witcher";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";

      // Se reemplaza la miniatura por el reproductor
      playButton.replaceWith(iframe);
    });
  });
}
