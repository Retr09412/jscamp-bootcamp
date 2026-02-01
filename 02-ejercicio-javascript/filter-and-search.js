//FILTER V1      const filter_tecnology = document.querySelector("#search-tecnology");
//const trabajos = document.querySelectorAll("#contenedor-trabajos li");
//filter_tecnology.addEventListener("change", function() {
//    const eleccion = filter_tecnology.value;
//    console.log(" Lo que escogi:",eleccion);    
//    trabajos.forEach(trabajo => {
//        const datoTarjeta = trabajo.dataset.tecnologia;
//        console.log("Lo que tiene la tarjeta:",datoTarjeta);
//        if (eleccion === "tecnologia") {
//             trabajo.style.display = "block";
//        } 
//        else if (datoTarjeta === eleccion) {
//             trabajo.style.display = "block";
//        } 
//        else {
//             trabajo.style.display = "none";
//        }
//    });
//});


//const filter_ubi = document.querySelector("#search-ubi");
//const lugares = document.querySelectorAll("#contenedor-trabajos li");
//filter_ubi.addEventListener("change", function() {
//    const eleccion = filter_ubi.value;
//    console.log(" Lo que escogi:",eleccion);    
//    lugares.forEach(lugar => {
//        const datoTarjeta = lugar.dataset.ubi;
//        console.log("Lo que tiene la tarjeta:",datoTarjeta);
//        if (eleccion === "all") {
//             lugar.style.display = "block";
//        } 
//        else if (datoTarjeta === eleccion) {
//             lugar.style.display = "block";
//        } 
//        else {
//             lugar.style.display = "none";
//        }
//    });
//})

//SEARCH V1
//const inputBuscador = document.querySelector("#search-input");
//
//inputBuscador.addEventListener("input", function(evento) {
//    
//    const textoUsuario = evento.target.value.toLowerCase();
//    const tarjetas = document.querySelectorAll("#contenedor-trabajos article");
//    tarjetas.forEach(tarjeta => {
//        const tituloTrabajo = tarjeta.querySelector("h3").textContent.toLowerCase();
//        if (tituloTrabajo.includes(textoUsuario)) {
//            tarjeta.classList.remove("is-hidden");
//        } else {
//            tarjeta.classList.add("is-hidden");
//        }
//    });
//});

//FILTER AND SEARCH V1 (Union de filter y search) -->


const inputBuscador = document.querySelector("#search-input");      // Input de texto
const selectTecnologia = document.querySelector("#search-tecnology"); // Select Tecnología
const selectUbicacion = document.querySelector("#search-ubi");      // Select Ubicación
const selectNivel = document.querySelector("#search-nivel");        // Select Nivel

function filtrarTrabajos() {
    const textoBusqueda = inputBuscador.value.toLowerCase().trim(); // .trim() para eliminar espacios en blanco al inicio y al final
    const filtroTec = selectTecnologia.value.toLowerCase();
    const filtroUbi = selectUbicacion.value.toLowerCase(); // .toLowerCase() simplemente para asegurarnos que el valor sea en minúsculas 
    const filtroNivel = selectNivel.value.toLowerCase(); // .toLowerCase() simplemente para asegurarnos que el valor sea en minúsculas
    const tarjetas = document.querySelectorAll(".jobs-listings article");
    tarjetas.forEach(tarjeta => {
        console.log('[tecnology]', tarjeta.dataset.technology);
        const titulo = tarjeta.querySelector("h3").textContent.toLowerCase();
        const dataTec = tarjeta.dataset.technology.toLowerCase().split(","); // "react,node,js" -> ["react", "node", "js"] -> Hacemos que sea una lista, esto es mejor por lo siguiente:
        // imagina que el usuario pone como tecnología `java` y la lista tiene "java,javascript". Si comparamos por string [dataTec.includes(filtroTec)], el resultado puede ser incorrecto porque javascript incluye el texto `java`. Y lo que queremos es que solo filtre `java` y no `javascript` 
        const dataUbi = tarjeta.dataset.ubi;
        const dataNivel = tarjeta.dataset.nivel;

        // 1. Buscador de Texto (Título)
        const cumpleTexto = titulo.includes(textoBusqueda);

        // 2. Tecnología
        const cumpleTec = (filtroTec === "") || (dataTec.includes(filtroTec));

        // 3. Ubicación
        const cumpleUbi = (filtroUbi === "") || (dataUbi === filtroUbi);

        // 4. Nivel
        const cumpleNivel = (filtroNivel === "") || (dataNivel === filtroNivel);

        if (cumpleTexto && cumpleTec && cumpleUbi && cumpleNivel) {
            tarjeta.classList.remove("is-hidden"); 
        } else {
            tarjeta.classList.add("is-hidden");
        }
    });
}

// Para reactivar el filtrado cada vez que el usuario interactúe
inputBuscador.addEventListener("input", filtrarTrabajos);
selectTecnologia.addEventListener("change", filtrarTrabajos);
selectUbicacion.addEventListener("change", filtrarTrabajos);
selectNivel.addEventListener("change", filtrarTrabajos);

