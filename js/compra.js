// Declaro variables

let verificadorCompra = 0
let verificadorError = 0
let elegirMetodoDePago
let elegirUnidades
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
            productoCompra.querySelector('h2').id = item.id
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
        elegirMetodoDePago = document.getElementById("elegirMetodoDePago").value
        elegirUnidades = document.getElementById("elegirUnidades").value
        precio = document.getElementById("precio").textContent
        producto = document.querySelector(".contenidoProductos h2").textContent
        if(elegirMetodoDePago !== "" && elegirUnidades !== ""){

            $(".divDatos").remove()

            // Uso el verificador para mostrar los datos solo 1 vez
            if(verificadorCompra == 0){
                document.getElementById("ventanaEmergente").style.display = "block"
                let divCompra = document.createElement("div")
                divCompra.className = 'divCompra'
                divCompra.innerHTML +=     `
                <p> Articulo: ${producto} </p>
                <p> Precio: ${precio} </p>
                <p> Unidades: ${elegirUnidades} </p>
                <p> Metodo de pago: ${elegirMetodoDePago} </p>
                <button id="finalizarCompra" class="btn btn-dark">Finalizar Compra</button><br>
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
            $("#mensajeCarroAbierto").fadeIn(1500, function(){
                contadorMensajeCarrito = 0
            })
            $("#mensajeCarroAbierto").fadeOut(1500)
        }
    }
    
}

function obtenerDatos(producto) {
    // Construyo el objeto para guardarlo en array
    let datosProducto = {
        articulo: producto.querySelector("h2").textContent,
        precio: producto.querySelector("p").textContent,
        imagen: producto.querySelector("img").src,
        id: producto.querySelector("h2").id,
        cantidad: 1,
    }
    //Verifico si el producto ya esta en el carrito de compras
    let contadorMensajeObjetoEnCarrito = 0
    let noAgregarObjeto = 0
    for(let x = 0; x < carrito.length ; x++){
        if(carrito[x].id == datosProducto.id){
            if(contadorMensajeObjetoEnCarrito == 0){
                contadorMensajeObjetoEnCarrito = 1
                $("#mensajeObjetoEnCarrito").fadeIn(1500,function(){
                    contadorMensajeObjetoEnCarrito = 0
                })
                $("#mensajeObjetoEnCarrito").fadeOut(1500)
            }
            noAgregarObjeto = 1
        }
    }
    if(noAgregarObjeto == 0){
        // Pusheamos el carrito
        carrito.push(datosProducto)
        guardarLocalStorage()
    }
    noAgregarObjeto = 0
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

function limpiarCarrito(){
    while (contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

function mostrarElementos(){
    // Para mostrar carrito solo una vez
    limpiarCarrito()
    carrito.forEach(producto => {
        const divCarro = document.createElement("div")
        divCarro.classList.add("row")
        divCarro.classList.add("productoCarrito")

        divCarro.innerHTML += `
            <div class="col-lg-1">
                <p class="eliminarUnProducto">x</p>
            </div>
            <div class="col-lg-4">
                <img src=${producto.imagen}>
            </div>
            <div class="col-lg-5">
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
}

function botonVaciarCarrito(){
    // Agrego boton para vaciar carrito

    contenedorCarrito.innerHTML += `
        <div class="col-lg-2 textoCarrito">
            <button class="btn btn-dark vaciarCarrito" id="vaciarCarrito"><i class="fas fa-trash-alt"></i></button>
            <p>Total:</p><p class="precioCarrito">precio</p>
            <button class="btn btn-dark finalizarCompra" id="finalizarCompra">Comprar</button>
        </div>
    `
}

function eliminarUnElemento(){
    let borrarProducto = document.getElementsByClassName("eliminarUnProducto")

    for(let elementos of borrarProducto) {
        elementos.addEventListener("click",(e)=>{
            let idProducto = elementos.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.firstChild.nextSibling.nextSibling.nextSibling.id

            // Elimino producto visualmente
            elementos.parentElement.parentElement.remove()

            // Elimino producto del carrito
            for(let x = 0; x < carrito.length ; x++){
                if(carrito[x].id == idProducto){
                    carrito.splice(x, 1)
                    guardarLocalStorage()
                    sumarPrecioTotal()
                }
            }
            if(carrito.length == 0){
                localStorage.removeItem("carrito")
                muestroCarrito ()
            }
        })
    }
}

function vaciarCarrito(){
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

function agregarElementosAlCarrito(){
    // Funcion para sumar elementos al carrito

    let botonesCantidad = document.getElementsByClassName("cantidadCarrito")

    for(let el of botonesCantidad) {
        el.addEventListener("click",(e)=>{
            if(e.target.classList.contains("suma")){
                let idSumaProductos = parseInt(e.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.id)
                let cantidadSumaProductos = parseInt(e.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.textContent)
                
                cantidadSumaProductos = cantidadSumaProductos + 1
                e.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.textContent = cantidadSumaProductos
    
                for(let x = 0; x < carrito.length ; x++){
                    if(carrito[x].id == idSumaProductos){
                        carrito[x].cantidad = cantidadSumaProductos
                        sumarPrecioTotal()
                    }
                }
                guardarLocalStorage()
            }
            if(e.target.classList.contains("resta")){
                let idRestaProductos = parseInt(e.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.id)
                let cantidadRestaProductos = parseInt(e.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.textContent)
                if(cantidadRestaProductos > 1){
                    cantidadRestaProductos = cantidadRestaProductos - 1
                    e.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.textContent = cantidadRestaProductos
                    for(let x = 0; x < carrito.length ; x++){
                        if(carrito[x].id == idRestaProductos){
                            carrito[x].cantidad = cantidadRestaProductos
                            sumarPrecioTotal()
                        }
                    }
                    guardarLocalStorage()
                }
            }
        })    
    }
}

function sumarPrecioTotal(){
    let precioTotal = 0
    let precioUnitarioProducto = 0

    for(let x = 0; x < carrito.length ; x++){
        precioUnitarioProducto = carrito[x].precio * carrito[x].cantidad
        precioTotal = precioTotal + precioUnitarioProducto
        document.querySelector(".precioCarrito").textContent = "$"+(new Intl.NumberFormat('de-DE').format(precioTotal))
    }
}

function finalizarCompra(){
    let botonFinalizarCompra = document.getElementById("finalizarCompra")
    let nombreProductos = ""
    let cantidadArticulos = 0
    let costo = 0

    botonFinalizarCompra.addEventListener("click", (e) =>{

        // Recorro carrito para obtener datos
        for(let x = 0; x < carrito.length ; x++){
            costo = costo + parseInt(carrito[x].precio * carrito[x].cantidad)
            nombreProductos = " " + nombreProductos + carrito[x].articulo + "<br>"
            cantidadArticulos = cantidadArticulos + parseInt(carrito[x].cantidad)
        }

        // Uso el verificador para mostrar los datos solo 1 vez
        if(verificadorCompra == 0){
            document.getElementById("ventanaFinalizarCompra").style.display = "block"
            document.getElementById("ventanaCarro").style.display = "none"
            let divCompraCarrito = document.createElement("div")
            divCompraCarrito.className = 'divCompraCarrito'
            divCompraCarrito.innerHTML +=     `
            <div class="articulos"> Articulos:<p class="listaProductos">${nombreProductos}</p></div>
            <p> Total a pagar:$${costo}</p>
            <p> Unidades: ${cantidadArticulos}</p>
            <ul>
                <li>
                    Método de pago:
                    <select name="Metodo de pago" class="btn btn-dark">
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta de debito">Tarjeta de debito</option>
                        <option value="Tarjeta de credito">Tarjeta de credito</option>
                    </select>
                </li>
            </ul>
            <button id="finalizarCompraCarrito" class="btn btn-dark">Finalizar Compra</button>
            `
            document.getElementById("ventanaFinalizarCompra").appendChild(divCompraCarrito)
            verificadorCompra = 1

            // Evento que espera click el boton de finalizar compra
            $("#finalizarCompraCarrito").click(()=>{
                document.getElementById("ventanaCompraCarritoFinalizada").style.display = "block"
            })
        }
    })
}

function renderizarCarrito(){

    mostrarElementos()

    botonVaciarCarrito()

    eliminarUnElemento()

    vaciarCarrito()

    agregarElementosAlCarrito()

    sumarPrecioTotal()

    finalizarCompra()
}

// Evento que espera click el boton de finalizar compra
$("#cerrarCompraCarritoFinalizada").click(()=>{
    carrito.splice(0, carrito.length)
    localStorage.removeItem("carrito")
    document.getElementById("ventanaCompraCarritoFinalizada").style.display = "none"
    document.getElementById("ventanaFinalizarCompra").style.display = "none"
})

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

    //Evento para cerrar ventana de finalizar compra

    $("#cerrarVentanaFinalizarCompra").click(()=>{
        document.getElementById("ventanaFinalizarCompra").style.display = "none"
        verificadorCompra = 0
        document.querySelector(".divCompraCarrito").remove()
    })
})