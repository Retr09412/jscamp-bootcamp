//const bot = document.querySelectorAll(".button-apply-job")
//
//bot.forEach(boton => {
//    boton.addEventListener("click", function(){
//        boton.classList.add("is-applied")
//        boton.textContent = ("¡Aplicado!")
//    })
//})

const pr = document.querySelector(".jobs-search")
pr.addEventListener("click", function(event){
    
    const element = event.target
    if(element.classList.contains("button-apply-job")){
        element.classList.add("is-applied")
        element.textContent = ("¡Aplicado!")
    }
})