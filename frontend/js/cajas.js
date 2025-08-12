const opcionesEditor = {
  theme: "ace/theme/monokai",
  fontSize: "14px",
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true
};

const editorHTML = ace.edit("editor-html", { mode: "ace/mode/html", ...opcionesEditor });
const editorCSS = ace.edit("editor-css", { mode: "ace/mode/css", ...opcionesEditor });
const editorJS = ace.edit("editor-js", { mode: "ace/mode/javascript", ...opcionesEditor });

function actualizarVistaPrevia() {
  const html = editorHTML.getValue();
  const css = `<style>${editorCSS.getValue()}</style>`;
  const js = `<script>${editorJS.getValue()}<\/script>`;

  const iframe = document.getElementById("iframe-previo");
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(html + css + js);
  doc.close();
}

editorHTML.session.on('change', actualizarVistaPrevia);
editorCSS.session.on('change', actualizarVistaPrevia);
editorJS.session.on('change', actualizarVistaPrevia);


actualizarVistaPrevia();

const contenedorPrincipal = document.getElementById("contenedor-principal");
const btnCambiarVista = document.getElementById("btn-cambiar-vista");

const vistas = ["vista-horizontal", "vista-horizontal-inversa", "vista-vertical", "vista-vertical-inversa"];
let indiceVista = 0;

btnCambiarVista.addEventListener("click", () => {
  vistas.forEach(v => contenedorPrincipal.classList.remove(v));
  
  indiceVista = (indiceVista + 1) % vistas.length;
  contenedorPrincipal.classList.add(vistas[indiceVista]);
});
