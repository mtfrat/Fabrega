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
            console.log(idBoton)
            localStorage.setItem("ID", idBoton)
        })
    }
}

// Carrito de compras
items.addEventListener("click",agregarAlCarrito)

// Creamos un arrray vacio en caso de que no haya nada cargado
let carrito = JSON.parse(localStorage.getItem("carrito"))|| []

// Agrego event listener


// Se recibe el evento de click con sus datos
function agregarAlCarrito(e){


    // Se localiza el click
    if(e.target.classList.contains("agregar-carrito")){
        // Guardo dentro de productoSeleccionado la tarjeta
        let productoSeleccionado = e.target.parentNode
        console.log(productoSeleccionado)

        // Llamo a esta funcion para tener datos del producto
        obtenerDatos(productoSeleccionado)
    }
}

function obtenerDatos(producto) {
    // Construyo el objeto para guardarlo en array
    let datosProducto = {
        nombre: producto.querySelector("h5").textContent,
        precio: producto.querySelector("p").textContent,
        imagen: producto.querySelector("img").src,
        id: producto.querySelector(".comprar").id,
    }

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
        contenedorCarrito.removeChild(contenedorCarrito.lastElementChild)
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
                <h2>${producto.nombre}</h2>
                <h3>${producto.precio}</h3>
            </div>
            <div class="col-lg-2 cantidadCarrito">
                <button>-</button>
                <input type="text" id="${producto.id}" name="producto">
                <button>+</button>
            </div>
        `
        contenedorCarrito.appendChild(divCarro)
    })
        // const botonVaciarCarrito = document.querySelector(".productoCarrito")
        // botonVaciarCarrito.innerHTML += `
        //     <div class="col-lg-2">
        //         <button class="btn btn-dark vaciarCarrito" id="vaciarCarrito">Vaciar carrito</button>
        //     </div>
        // `

        // contenedorCarrito.appendChild(botonVaciarCarrito)
}

function limpiarCarrito(){
    while (contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

// Hasta aca funciona

const vacioCarrito = document.getElementById("vaciarCarrito")

console.log(vacioCarrito);

if(vacioCarrito){
    console.log("entre")
    vacioCarrito.addEventListener("click",()=>{
        carrito = {}
        renderizarCarrito()
    })
}

// Si el usuario quiere vaciar completamente el carrito, elimino todo su contenido

$(() => {
    // Evento que recibe cuando se da click en el boton mostrar carrito
    $("#mostrar-carrito").click(()=> {
        document.getElementById("ventanaCarro").style.display = "block"
    })

    // Evento que espera click en la x
    $("#cerrarVentanaCarro").click(()=> {
        document.getElementById("ventanaCarro").style.display = "none"
    })
})