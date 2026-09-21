import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.179.1/examples/jsm/loaders/OBJLoader.js";

const contenedor = document.getElementById("modelo3D");
if (contenedor && window.WebGLRenderingContext) {
  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(32, 1, 0.1, 1000);
  camara.position.set(0, 0, 4.4);

  const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
  renderizador.outputColorSpace = THREE.SRGBColorSpace;
  renderizador.toneMapping = THREE.ACESFilmicToneMapping;
  renderizador.toneMappingExposure = 1.15;
  contenedor.appendChild(renderizador.domElement);

  escena.add(new THREE.HemisphereLight(0xc9ced6, 0x080808, 1.5));
  const luzPrincipal = new THREE.DirectionalLight(0xffffff, 3.2);
  luzPrincipal.position.set(2, 3, 4);
  escena.add(luzPrincipal);
  const luzRoja = new THREE.PointLight(0xb32424, 18, 7);
  luzRoja.position.set(-2, -1, 2);
  escena.add(luzRoja);

  const grupo = new THREE.Group();
  escena.add(grupo);

  const loader = new OBJLoader();
  loader.load("models/medallon.obj", (objeto) => {
    objeto.traverse((parte) => {
      if (parte.isMesh) {
        parte.material = new THREE.MeshStandardMaterial({
          color: 0xc9ced6,
          metalness: 0.88,
          roughness: 0.28
        });
      }
    });

    const caja = new THREE.Box3().setFromObject(objeto);
    const centro = caja.getCenter(new THREE.Vector3());
    const tamano = caja.getSize(new THREE.Vector3());
    const escala = 2.55 / Math.max(tamano.x, tamano.y, tamano.z);
    objeto.scale.setScalar(escala);
    objeto.position.set(-centro.x * escala, -centro.y * escala, -centro.z * escala);
    grupo.add(objeto);
    objeto.rotation.x = -0.10;
    objeto.rotation.z = 0.02;
  }, undefined, (error) => {
    console.error("No se pudo cargar el modelo 3D:", error);
    contenedor.classList.add("modelo-error");
  });

  let objetivoX = 0;
  let objetivoY = 0;
  window.addEventListener("pointermove", (evento) => {
    objetivoY = (evento.clientX / window.innerWidth - 0.5) * 0.35;
    objetivoX = (evento.clientY / window.innerHeight - 0.5) * 0.18;
  }, { passive: true });

  function ajustar() {
    const ancho = contenedor.clientWidth;
    const alto = contenedor.clientHeight;
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
    renderizador.setSize(ancho, alto, false);
  }
  window.addEventListener("resize", ajustar);
  ajustar();

  let rotacionBase = 0;
  function animar() {
    requestAnimationFrame(animar);
    rotacionBase += 0.0012;
    grupo.rotation.y = rotacionBase + objetivoY;
    grupo.rotation.x += (objetivoX - grupo.rotation.x) * 0.025;
    renderizador.render(escena, camara);
  }
  animar();
}
