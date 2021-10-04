//-------------------------Secccion de productos------------------------------------------

const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()


// Evento donde se espera que se cargue completamente el HTML
document.addEventListener('DOMContentLoaded', e => { fetchData() })

// Utilizo fetch para mostar los productos que se encuentran en el json
const fetchData = async () => {
    const res = await fetch('../json/productos.json')
    const data = await res.json()
    console.log(data)
    mostrarProductos(data)
}

// Muestro las tarjetas
const mostrarProductos = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.producto
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').src = item.src
        templateCard.querySelector('a').href = item.href
        templateCard.querySelector('button').dataset.id = item.id 
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}

