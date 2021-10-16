//-------------------------Secccion de productos------------------------------------------

const items = document.getElementById("items")
const templateCard = document.getElementById("template-card").content
const fragment = document.createDocumentFragment()
let cargaDatos


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
            if(contadorMensajeObjetoEnCarrito == 0){
                contadorMensajeObjetoEnCarrito = 1
                $("#mensajeObjetoEnCarrito").fadeIn(1500)
                $("#mensajeObjetoEnCarrito").fadeOut(1500, function(){
                    contadorMensajeObjetoEnCarrito = 0
                })
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

function renderizarCarrito(){
    // Para mostrar carrito solo una vez
    if(carrito.length !== 0){
        limpiarCarrito()
    }
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

    // Funcion para sumar elementos al carrito

    let botonesCantidad = document.getElementsByClassName("cantidadCarrito");

    console.log(botonesCantidad);
    for(let el of botonesCantidad) {
        el.addEventListener("click",(e)=>{
            if(e.target.classList.contains("suma")){
                let idSumaProductos = parseInt(e.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.id)
                let cantidadSumaProductos = parseInt(e.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.textContent)
    
                console.log("primero",e.target.parentNode);
                
                cantidadSumaProductos = cantidadSumaProductos + 1
                e.target.parentNode.firstChild.nextSibling.nextSibling.nextSibling.textContent = cantidadSumaProductos
    
                console.log("segundo",e.target.parentNode);
    
                for(let x = 0; x < carrito.length ; x++){
                    if(carrito[x].id == idSumaProductos){
                        carrito[x].cantidad = cantidadSumaProductos
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
                        }
                    }
                    guardarLocalStorage()
                }
            }
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



