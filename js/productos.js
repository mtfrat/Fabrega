//-------------------------Secccion de productos------------------------------------------

const items = document.getElementById("items")
const templateCard = document.getElementById("template-card").content
const fragment = document.createDocumentFragment()
let cargaDatos
let verificadorCompra = 0
const contenedorCarrito = document.querySelector("#carrito") //Div donde voy a agregar los productos
const mostrarCarrito = document.querySelector("#mostrar-carrito") //Boton para mostrar el carrito

// Evento donde se espera que se cargue completamente el HTML
document.addEventListener("DOMContentLoaded", e => { fetchData() })

// Utilizo fetch para mostar los productos que se encuentran en el json
const fetchData = async () => {
    const res = await fetch("../json/productos.json")
    const data = await res.json()
    mostrarProductos(data)
    cargaDatos = res.ok
    // Funcion para guardar boton presionado en el localstorage
    if(cargaDatos == true){
        guardarId()
    }
}

// Muestro las tarjetas
const mostrarProductos = data => {
    data.forEach(item => {
        templateCard.querySelector("h5").textContent = item.producto
        templateCard.querySelector("p").textContent = item.precio
        templateCard.querySelector("img").src = item.src
        templateCard.querySelector("a").href = item.href
        templateCard.querySelector(".comprar").classList.add(item.class)
        templateCard.querySelector(".comprar").id = item.id 
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}

function guardarId(){
    let botonesCompra = document.getElementsByClassName("botonCompra")
    for(let i = 0;i < botonesCompra.length;i++){
        botonesCompra[i].addEventListener("click",function(){
            let idBoton = this.id
            localStorage.setItem("ID", idBoton)
        })
    }
}

// Carrito de compras
items.addEventListener("click",agregarAlCarrito)

// Creamos un arrray vacio en caso de que no haya nada cargado
let carrito = JSON.parse(localStorage.getItem("carrito"))|| []
// Indicador para mostrar le mensaje una sola vez
let contadorMensajeCarrito = 0

// Se recibe el evento de click con sus datos
function agregarAlCarrito(e){
    // Se localiza el click
    if(e.target.classList.contains("agregar-carrito")){
        if(document.getElementById("ventanaCarro").style.display !== "block"){
            // Guardo dentro de productoSeleccionado la tarjeta
            let productoSeleccionado = e.target.parentNode

            // Llamo a esta funcion para tener datos del producto
            obtenerDatos(productoSeleccionado)
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
}

function obtenerDatos(producto) {
    // Construyo el objeto para guardarlo en array
    let datosProducto = {
        articulo: producto.querySelector("h5").textContent,
        precio: producto.querySelector("p").textContent,
        imagen: producto.querySelector("img").src,
        id: producto.querySelector(".comprar").id,
        cantidad: 1,
    }

    //Verifico si el producto ya esta en el carrito de compras
    let contadorMensajeObjetoEnCarrito = 0
    let noAgregarObjeto = 0
    for(let x = 0; x < carrito.length ; x++){
        if(carrito[x].id == datosProducto.id){
            if(contadorMensajeObjetoEnCarrito !== 1){
                contadorMensajeObjetoEnCarrito = 1
                $("#mensajeObjetoEnCarrito").fadeIn(1500, function(){
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
    if(carrito.length !== 0){
        limpiarCarrito()
    }
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

    // Funcion para sumar o restar elementos al carrito

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

// Funcion principal que contiene el resto de las funciones
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



