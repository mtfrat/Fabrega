let divContacto = document.getElementById("divContacto")
let verificador = 0

$(()=>{
    //Evento que se activa despues de darle click al boton ver sucursales 
    document.getElementById("botonContacto").addEventListener("click", () => {
        // Leo datos del json
        $.get("../json/sucursales.json", (respuesta,estado) => {
            if (estado === "success") {
                // Si ya mostre los datos, no vuelvo a mostrarlos
                while(verificador !==1){
                    divContacto.innerHTML += `<h2>Encontranos en:</h2>`
                    for (sucursal of respuesta) {
                        divContacto.innerHTML += `
                            <div class="sucursales"> 
                                <p>Dirección: ${sucursal.address} </p>
                                <p>Mail: ${sucursal.email} </p>
                                <p>Teléfono: ${sucursal.phone} </p>
                            </div>
                        ` 
                    }
                    verificador = 1
                }
            }
        })
    })
})