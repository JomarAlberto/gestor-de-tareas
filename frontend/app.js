const input= document.getElementById("inputTarea");
const btn = document.getElementById("btnAgregar");
const lista = document.getElementById("listaTareas");

const API_URL = "http://localhost:3000/tareas";

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

    await fetch(`${API_URL}/${tarea.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completada: nuevoEstado })
    });

    span.style.textDecoration = nuevoEstado === 1 ? "line-through" : "none";
    tarea.completada = nuevoEstado; 
  });

  nboton.addEventListener("click", async function () {
    await fetch(`${API_URL}/${tarea.id}`, {
      method: "DELETE"
    });

    nueva.remove();
  });
}

async function cargarTareas() {
  const respuesta = await fetch(API_URL);
  const tareas = await respuesta.json();
  tareas.forEach(crearElementoTarea);
}






async function agregarTarea() {
  if (input.value === "") {
    return;
  }

  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

cargarTareas();





