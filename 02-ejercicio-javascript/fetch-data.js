const container = document.querySelector(".jobs-listings")
fetch("./data.json")
    .then((response) =>{
        return response.json();
    })
    .then((jobs) => {
        console.log(jobs)
        jobs.forEach(job => {
            const article = document.createElement("article");
            article.className = `job-listing-card`
            article.dataset.ubi = job.data.modalidad
            article.dataset.technology = job.data.technology
            article.dataset.nivel = job.data.nivel;
            console.log("ff",article.dataset.technology)

            article.innerHTML = ` <div>
            <h3>${job.titulo}</h3>
            <small>${job.empresa} | ${job.ubicacion}</small>
            <p>${job.descripcion}</p>
            </div>
            <button class = "button-apply-job" >Aplicar</button>`

                container.appendChild(article)
            
        })
    });