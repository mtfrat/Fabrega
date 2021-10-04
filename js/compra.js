// Declaro variables

let verificadorCompra = 0
let verificadorError = 0
let elegirColor
let elegirUnidades
let elegirCuotas
let precio
let producto
let contenidoProductos
let divDatos

$(() => {
    // Evento que recibe cuando se da click en el boton Comprar
    $("#verCompra").click(()=> {
        // Obtengo datos de la compra
        elegirColor = document.getElementById("elegirColor").value
        elegirUnidades = document.getElementById("elegirUnidades").value
        elegirCuotas = document.getElementById("elegirCuotas").value
        let precio = document.getElementById("precio").textContent
        let producto = document.getElementById("producto").textContent
        if(elegirColor !== "" && elegirCuotas !== "" && elegirUnidades !== ""){

            $(".divDatos").remove()

            // Uso el verificador para mostrar los datos solo 1 vez
            if(verificadorCompra == 0){
                document.getElementById("ventanaEmergente").style.display = "block"
                let divCompra = document.createElement("div")
                divCompra.className = 'divCompra'
                divCompra.innerHTML +=     `
                <p> Producto: ${producto} </p>
                <p> Precio: ${precio} </p>
                <p> Cuotas: ${elegirCuotas} </p>
                <p> Unidades: ${elegirUnidades} </p>
                <p> Color: ${elegirColor} </p>
                <button id="finalizarCompra">Finalizar Compra</button><br>
                `
                ventanaEmergente.appendChild(divCompra)
                verificadorCompra = 1

                // Evento que espera click el boton de finalizar compra
                $("#finalizarCompra").click(()=>{
                    document.getElementById("ventanaCompraFinalizada").style.display = "block"
                })
            }
        }else{
            if(verificadorError == 0){
                contenidoProductos = document.getElementById("contenidoProductos")
                divDatos = document.createElement("div")
                divDatos.className = 'divDatos'
                divDatos.innerHTML +=     `
                <p>Por favor, completá todos los datos!</p>
                `
                contenidoProductos.appendChild(divDatos)
                verificadorError = 1
            }
        }
    })
    // Evento que espera click en la x
    $("#cerrarVentanaCompraFinalizada").click(()=> {
        document.getElementById("ventanaCompraFinalizada").style.display = "none"
    })
    // Evento que espera click en la x
    $("#cerrarVentana").click(()=> {
        document.getElementById("ventanaEmergente").style.display = "none"
        verificadorCompra = 0
        $(".divCompra").remove()
    })
})
