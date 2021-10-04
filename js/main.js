//------------------------------ Modo oscuro ----------------------------------------------

const botonSwitch = document.querySelector("#switch")

$(() => {
    $("#switch").click(()=> {
        document.body.classList.toggle("dark")
        botonSwitch.classList.toggle("active")
    
            // Guardo en local storage
        if (document.body.classList.contains("dark")) {
            localStorage.setItem("dark_mode","true")
        } else{
            localStorage.setItem("dark_mode","false")
        }
    })   
})

// Pregunto por eleccion del modo

if (localStorage.getItem("dark_mode") === "true") {
    document.body.classList.add("dark")
    botonSwitch.classList.add("active")
}else{
    document.body.classList.remove("dark")
    botonSwitch.classList.remove("active")
}