//-------------------------Secccion de nosotros------------------------------------------

//Creo array para guardar las opiniones de los clientes
let opinionesArray = []
let form = document.getElementById('formularioNosotros')
let verificadorNosotros = 0


$(() => {
    //Evento que espera que se envie el formulario
    $("#formularioNosotros").on("submit",(e) => {
        e.preventDefault()
        let formValues = new FormData(e.target)
        let nuevoMensaje = {nombre: formValues.get("nombreUsuario"), producto: formValues.get("productoComprado"), opinion: formValues.get("opinionUsuario")}
        form.reset()
        if(nuevoMensaje.nombre !== "" && nuevoMensaje.nombreUsuario !== ""  && nuevoMensaje.opinionUsuario !== ""){
            opinionesArray.push(nuevoMensaje)
            localStorage.setItem("Mensaje", JSON.stringify(opinionesArray))
            verificadorNosotros = 1
        }
    })

    // Evento que espera click en el boton mostrar opiniones
    $("#mostrarOpiniones").click(()=> {
    if(verificadorNosotros ==1){
        // Muestro los valores ingresados mediante evento de click
        let divOpiniones = document.createElement("div")
        divOpiniones.className = 'divOpiniones'
        for (opiniones of opinionesArray) {
            divOpiniones.innerHTML +=     `
            <p> Nombre: ${opiniones.nombre} </p>
            <p> Producto: ${opiniones.producto} </p>
            <p> Mensaje: ${opiniones.opinion} </p><br>
        `
        }
        // Uso remove para mostar 1 vez cada opinion
        $(".divOpiniones").remove()
        contenido.appendChild(divOpiniones)
        verificadorNosotros = 0
    }
    })
})