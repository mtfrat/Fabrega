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
const compra = document.getElementById('compra')
const productoCompra = document.getElementById('productoCompra').content
const fragment = document.createDocumentFragment()

let botonPresionado = localStorage.getItem("ID")

// Evento donde se espera que se cargue completamente el HTML
document.addEventListener('DOMContentLoaded', e => { fetchData() })

// Utilizo fetch para mostar los productos que se encuentran en el json
const fetchData = async () => {
    const res = await fetch('../json/productos.json')
    const data = await res.json()
    mostrarProducto(data)
}


// Muestro los datos del producto a comprar
const mostrarProducto = data => {
    data.forEach(item => {
        if(item.id == botonPresionado){
            productoCompra.querySelector('h2').textContent = item.producto
            productoCompra.querySelector('p').textContent = item.precio
            productoCompra.querySelector('img').src = item.src
            const clone = productoCompra.cloneNode(true)
            fragment.appendChild(clone)
        }
    })
    compra.appendChild(fragment)
}


$(() => {
    // Evento que recibe cuando se da click en el boton Comprar
    $("#verCompra").click(()=> {
        console.log("entre");
        // Obtengo datos de la compra
        elegirColor = document.getElementById("elegirColor").value
        elegirUnidades = document.getElementById("elegirUnidades").value
        elegirCuotas = document.getElementById("elegirCuotas").value
        precio = document.getElementById("precio").textContent
        producto = document.getElementById("producto").textContent
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
        document.getElementById("ventanaEmergente").style.display = "none"
    })
    // Evento que espera click en la x
    $("#cerrarVentana").click(()=> {
        document.getElementById("ventanaEmergente").style.display = "none"
        verificadorCompra = 0
        $(".divCompra").remove()
    })
})
