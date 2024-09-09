var calcular = document.getElementById("calcular");

calcular.onclick = () => {
  var actividad = document.getElementById("activi");
  var cal = document.getElementById("cal");
  var cate = document.getElementById("cate");

  if (actividad.value.trim() === "" || cal.value.trim() === "" || cate.value === "") {
    Swal.fire({ title: "ERROR", text: "Completa todos los campos", icon: "error" });
  } else {

    guardar();
    mostrarDatos();
  }
};

let totalFoodCalories = 0;
let totalExerciseCalories = 0;

function updateCaloricDifference() {
  const balance = totalFoodCalories - totalExerciseCalories;
  document.getElementById('dif').textContent = balance;
}

// Función para limpiar los campos de entrada
function clearInputs() {
  document.getElementById('activi').value = '';  
  document.getElementById('cal').value = '';     
}

function guardar() {
  const cate = document.getElementById("cate").value;
  const activi = document.getElementById("activi").value;
  const cal = parseInt(document.getElementById("cal").value);

  if (activi.trim() === "" || isNaN(cal) || cal <= 0) {
    Swal.fire({ title: "ERROR", text: "Completa todos los campos con valores válidos", icon: "error" });
    return;
  }

  const nuevoDato = {
    id: Date.now(),
    categoria: cate,
    actividad: activi,
    calorias: cal
  };

  let datosExistentes = localStorage.getItem('datos');
  let datos = datosExistentes ? JSON.parse(datosExistentes) : [];

  datos.push(nuevoDato);
  localStorage.setItem('datos', JSON.stringify(datos));

  if (cate === "Comida") {
    totalFoodCalories += cal;
    document.getElementById("calo").innerText = totalFoodCalories;
  } else if (cate === "Ejercicio") {
    totalExerciseCalories += cal;
    document.getElementById("ejer").innerText = totalExerciseCalories;
  }

  updateCaloricDifference();
  mostrarDatos();
  clearInputs();
}


function mostrarDatos() {
  var datosRecuperados = localStorage.getItem('datos');
  var actividadesDiv = document.getElementById('actividad');

  if (datosRecuperados) {
    var datos = JSON.parse(datosRecuperados);

    var textoDatos = datos.map(dato => `
      <center>
      <div class="card w-75" id="dato-${dato.id}">
        <div class="card-body">
          Categoría: ${dato.categoria}<br>
          Actividad: ${dato.actividad}<br>
          Calorías: ${dato.calorias}<br>
          <button type="button" class="btn btn-outline-success" onclick="most(${dato.id})" data-bs-toggle="modal" data-bs-target="#editar"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg></button>
          <button type="button" class="btn btn-outline-danger" onclick="borrar(${dato.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2" viewBox="0 0 16 16">
  <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
</svg></button><br><br>
        </div>
      </div>
      <br>
      </center>
    `).join('');

    actividadesDiv.innerHTML = textoDatos;
  } else {
    actividadesDiv.innerHTML = 'Aun no hay actividades o comidas';
  }
}

function borrar(id) {
  Swal.fire({
    title: "¿Estás seguro de eliminar este cálculo?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Sí, estoy seguro",
    denyButtonText: `No, no estoy seguro`
  }).then((result) => {
    if (result.isConfirmed) {
      var datosExistentes = localStorage.getItem('datos');
      var datos = datosExistentes ? JSON.parse(datosExistentes) : [];

      const datoABorrar = datos.find(dato => dato.id === id);

      if (datoABorrar.categoria === "Comida") {
        totalFoodCalories -= parseInt(datoABorrar.calorias);
        if (totalFoodCalories < 0) totalFoodCalories = 0;
        document.getElementById("calo").innerText = totalFoodCalories;
      }
      else if (datoABorrar.categoria === "Ejercicio") {
        totalExerciseCalories -= parseInt(datoABorrar.calorias);
        if (totalExerciseCalories < 0) totalExerciseCalories = 0;
        document.getElementById("ejer").innerText = totalExerciseCalories;
      }

      updateCaloricDifference();

      var datosActualizados = datos.filter(dato => dato.id !== id);
      localStorage.setItem('datos', JSON.stringify(datosActualizados));

      mostrarDatos();
      Swal.fire({ title: "ELIMINADO", text: "", icon: "success" });
    }
  });
}

let currentId = null;

const most = (id) => {
  currentId = id;

  var datosExistentes = localStorage.getItem('datos');
  var datos = datosExistentes ? JSON.parse(datosExistentes) : [];

  var indice = datos.find(dato => dato.id === id);

  if (indice) {
    document.getElementById("ecate").value = indice.categoria;
    document.getElementById("eactivi").value = indice.actividad;
    document.getElementById("ecal").value = indice.calorias;
  }
};

const actualizar = () => {
  if (currentId === null) {
    Swal.fire({ title: "ERROR", text: "No se ha seleccionado un registro para actualizar.", icon: "error" });
    return;
  }

  var datosExistentes = localStorage.getItem('datos');
  var datos = datosExistentes ? JSON.parse(datosExistentes) : [];

  var actuali = datos.find(dato => dato.id === currentId);

  if (actuali) {
    const caloriasPrevias = parseInt(actuali.calorias);
    const categoriaPrevia = actuali.categoria;

    const nuevaCategoria = document.getElementById("ecate").value;
    const nuevaActividad = document.getElementById("eactivi").value;
    const nuevasCalorias = parseInt(document.getElementById("ecal").value);

    actuali.categoria = nuevaCategoria;
    actuali.actividad = nuevaActividad;
    actuali.calorias = nuevasCalorias;

    if (categoriaPrevia === "Comida") {
      totalFoodCalories -= caloriasPrevias; 
    } else if (categoriaPrevia === "Ejercicio") {
      totalExerciseCalories -= caloriasPrevias;  
    }

    if (nuevaCategoria === "Comida") {
      totalFoodCalories += nuevasCalorias;
    } else if (nuevaCategoria === "Ejercicio") {
      totalExerciseCalories += nuevasCalorias;
    }

    if (totalFoodCalories < 0) totalFoodCalories = 0;
    if (totalExerciseCalories < 0) totalExerciseCalories = 0;

    localStorage.setItem('datos', JSON.stringify(datos));

    document.getElementById("calo").innerText = totalFoodCalories;
    document.getElementById("ejer").innerText = totalExerciseCalories;

    updateCaloricDifference();
    mostrarDatos();

    Swal.fire({ title: "ACTUALIZADO", text: "Los datos se han actualizado correctamente.", icon: "success" });
  } else {
    Swal.fire({ title: "ERROR", text: "No se encontró el registro para actualizar.", icon: "error" });
  }
};



window.onload = mostrarDatos;
