//-------------------------Secccion de productos------------------------------------------

const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
let cargaDatos


// Evento donde se espera que se cargue completamente el HTML
document.addEventListener('DOMContentLoaded', e => { fetchData() })

// Utilizo fetch para mostar los productos que se encuentran en el json
const fetchData = async () => {
    const res = await fetch('../json/productos.json')
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
        templateCard.querySelector('h5').textContent = item.producto
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').src = item.src
        templateCard.querySelector('a').href = item.href
        templateCard.querySelector('button').classList.add(item.class)
        templateCard.querySelector('button').id = item.id 
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}

function guardarId(){
    let botonesCompra = document.getElementsByClassName("botonCompra")
    for(let i = 0;i < botonesCompra.length;i++){
        botonesCompra[i].addEventListener('click',function(){
            let idBoton = this.id
            console.log(idBoton)
            localStorage.setItem("ID", idBoton)
        })
    }
}
