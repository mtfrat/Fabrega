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
                <p> Articulo: ${producto} </p>
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
                <p>Por favor, completá todos los campos!</p>
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

const botonCarrito = document.querySelector("#agregar-carrito")

// Carrito de compras
botonCarrito.addEventListener("click",agregarAlCarrito)

// Creamos un arrray vacio en caso de que no haya nada cargado
let carrito = JSON.parse(localStorage.getItem("carrito"))|| []

// Indicador para mostrar le mensaje una sola vez
let contadorMensajeCarrito = 0



// Se recibe el evento de click con sus datos
function agregarAlCarrito(e){
    if(document.getElementById("ventanaCarro").style.display !== "block"){
        // Llamo a esta funcion para tener datos del producto
        obtenerDatos(productoCompra)
    }else{
        if(contadorMensajeCarrito == 0){
            contadorMensajeCarrito = 1
            $("#mensajeCarroAbierto").fadeIn(1500)
            $("#mensajeCarroAbierto").fadeOut(1500, function(){
                contadorMensajeCarrito = 0
            })
        }
    }
    
}

console.log(productoCompra);

function obtenerDatos(producto) {
    // Construyo el objeto para guardarlo en array
    let datosProducto = {
        articulo: producto.querySelector("h2").textContent,
        precio: producto.querySelector("p").textContent,
        imagen: producto.querySelector("img").src,
        // id: producto.querySelector(".comprar").id,
    }
    console.log(datosProducto);

    // Pusheamos el carrito
    carrito.push(datosProducto)
    guardarLocalStorage()
}

// Guardo los datos en local storage
function guardarLocalStorage(){
    localStorage.setItem("carrito",JSON.stringify(carrito))
}


// Se crea el carrito

const contenedorCarrito = document.querySelector("#carrito") //Div donde voy a agregar los productos
const mostrarCarrito = document.querySelector("#mostrar-carrito") //Boton para mostrar el carrito

if(mostrarCarrito){
    mostrarCarrito.addEventListener("click",muestroCarrito)
}

function muestroCarrito (){
    if(!localStorage.getItem("carrito")){
        // Para mostrar mensaje solo una vez
        limpiarCarritoVacio()
        const carroVacio = document.createElement("p")
        carroVacio.innerHTML = "Carrito vacio"
        contenedorCarrito.appendChild(carroVacio)
    }else{
        renderizarCarrito()
    }
}

function limpiarCarritoVacio(){
    while (contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

function renderizarCarrito(){
    // Para mostrar carrito solo una vez
    limpiarCarrito()
    carrito.forEach(producto => {
        const divCarro = document.createElement("div")
        divCarro.classList.add("row")
        divCarro.classList.add("productoCarrito")

        divCarro.innerHTML += `
            <div class="col-lg-4">
                <img src=${producto.imagen}>
            </div>
            <div class="col-lg-6">
                <h2>${producto.articulo}</h2>
                <h3>${producto.precio}</h3>
            </div>
            <div class="col-lg-2 cantidadCarrito">
                <button class="btn btn-dark resta">-</button>
                <p type="text" id="${producto.id}" name="producto">${producto.cantidad}</p>
                <button class="btn btn-dark suma" id="suma">+</button>
            </div>
        `
        contenedorCarrito.appendChild(divCarro)
    })

    // Agrego boton para vaciar carrito

    contenedorCarrito.innerHTML += `
        <div class="col-lg-2">
            <button class="btn btn-dark vaciarCarrito" id="vaciarCarrito"><i class="fas fa-trash-alt"></i></button>
        </div>
    `

    // Si el usuario quiere vaciar completamente el carrito, elimino todo su contenido

    const vacioCarrito = document.getElementById("vaciarCarrito")

    if(vacioCarrito){
        vacioCarrito.addEventListener("click",()=>{
            carrito.splice(0, carrito.length)
            localStorage.removeItem("carrito")
            muestroCarrito ()
        })
    }
}

function limpiarCarrito(){
    while (contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}



$(() => {
    // Evento que recibe cuando se da click en el boton mostrar carrito
    $("#mostrar-carrito").click(()=> {
        if(document.getElementById("ventanaCarro").style.display == "block"){
            document.getElementById("ventanaCarro").style.display = "none"
        }
        else{
            document.getElementById("ventanaCarro").style.display = "block"
        }
    })
})