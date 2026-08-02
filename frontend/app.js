const input= document.getElementById("inputTarea");
const btn = document.getElementById("btnAgregar");
const lista = document.getElementById("listaTareas");

const seccionAuth = document.getElementById("seccionAuth");
const seccionTareas = document.getElementById("seccionTareas");
const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");
const mensajeError = document.getElementById("mensajeError");

const irARegistro = document.getElementById("irARegistro");
const irALogin = document.getElementById("irALogin");
const btnLogin = document.getElementById("btnLogin");
const btnRegistro = document.getElementById("btnRegistro");
const btnLogout = document.getElementById("btnLogout");

const API_AUTH = "http://localhost:3000/auth";
const API_URL = "http://localhost:3000/tareas";

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const respuesta = await fetch(`${API_AUTH}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    mensajeError.textContent = datos.error;
    return;
  }

  localStorage.setItem("token", datos.token);
  mostrarSeccionTareas();
}

async function registro() {
  const nombre = document.getElementById("registroNombre").value;
  const email = document.getElementById("registroEmail").value;
  const password = document.getElementById("registroPassword").value;

  const respuesta = await fetch(`${API_AUTH}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password })
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    mensajeError.textContent = datos.error;
    return;
  }

  mensajeError.textContent = "Cuenta creada, ahora inicia sesión";
  formRegistro.style.display = "none";
  formLogin.style.display = "block";
}

btnLogin.addEventListener("click", login);
btnRegistro.addEventListener("click", registro);








irARegistro.addEventListener("click", function (e) {
  e.preventDefault();
  formLogin.style.display = "none";
  formRegistro.style.display = "block";
  mensajeError.textContent = "";
});

irALogin.addEventListener("click", function (e) {
  e.preventDefault();
  formRegistro.style.display = "none";
  formLogin.style.display = "block";
  mensajeError.textContent = "";
});

function mostrarSeccionTareas() {
  seccionAuth.style.display = "none";
  seccionTareas.style.display = "block";
  cargarTareas();
}

function mostrarSeccionAuth() {
  seccionAuth.style.display = "block";
  seccionTareas.style.display = "none";
}

btnLogout.addEventListener("click", function () {
  localStorage.removeItem("token");
  mostrarSeccionAuth();
});

if (localStorage.getItem("token")) {
  mostrarSeccionTareas();
} else {
  mostrarSeccionAuth();
}



function crearElementoTarea(tarea) {
  const nueva = document.createElement("li");
  const span = document.createElement("span");
  const check = document.createElement("input");

  check.type = "checkbox";
  check.checked = tarea.completada === 1;
  span.textContent = tarea.texto;
  span.style.textDecoration = tarea.completada === 1 ? "line-through" : "none";

  nueva.appendChild(check);
  nueva.appendChild(span);

  const nboton = document.createElement("button");
  nboton.textContent = "eliminar";
  nueva.appendChild(nboton);

  lista.appendChild(nueva);

 check.addEventListener("change", async function () {
    const nuevoEstado = check.checked ? 1 : 0;
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/${tarea.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ completada: nuevoEstado })
    });

    span.style.textDecoration = nuevoEstado === 1 ? "line-through" : "none";
    tarea.completada = nuevoEstado; 
  });

  nboton.addEventListener("click", async function () {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/${tarea.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    nueva.remove();
  });
}

async function cargarTareas() {
  const token = localStorage.getItem("token");

  const respuesta = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const tareas = await respuesta.json();
  lista.innerHTML = "";
  tareas.forEach(crearElementoTarea);
}




async function agregarTarea() {
  if (input.value === "") {
    return;
  }

  const token = localStorage.getItem("token");

  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ texto: input.value })
  });

  const tareaCreada = await respuesta.json();
  crearElementoTarea(tareaCreada);
  input.value = "";
}

btn.addEventListener("click", agregarTarea);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    agregarTarea();
  }
});







