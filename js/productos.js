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
const carrito = JSON.parse(localStorage.getItem("carrito"))|| []

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
    }
    console.log(datosProducto);

    // Pusheamos el carrito
    carrito.push(datosProducto)
    console.log(carrito)
    guardarLocalStorage()
}

// Guardo los datos en local storage
function guardarLocalStorage(){
    localStorage.setItem("carrito",JSON.stringify(carrito))
}


// Se crea el carrito

const contenedorCarrito = document.querySelector("#carrito")
const mostrarCarrito = document.querySelector("#mostrar-carrito")
let acumuladorCarrito = 0

if(mostrarCarrito){
    mostrarCarrito.addEventListener("click",muestroCarrito)
}

function muestroCarrito (){
    if(!localStorage.getItem("carrito") && acumuladorCarrito ==0){
        const carroVacio = document.createElement("p")
        carroVacio.innerHTML = "Carrito vacio"
        contenedorCarrito.appendChild(carroVacio)
        acumuladorCarrito = 1
    }else{
        renderizarCarrito()
    }
}

function renderizarCarrito(){
    // Para mostrar carrito solo una vez
    limpiarCarrito()
    carrito.forEach(producto => {
        const row = document.createElement("div")
        row.classList.add("row")

        row.innerHTML += `
            <div class="col-lg-4">
                <img class="w-50" src=${producto.imagen}>
            </div>
            <div class="col-lg-6">
                <h2>${producto.nombre}</h2>
                <h3>${producto.precio}</h3>
            </div>
            <div class="col-lg-2">
                <button>+</button>
                <button>-</button>
            </div>
            <hr/>
        `
        contenedorCarrito.appendChild(row)
    })
}

function limpiarCarrito(){
    while (contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}