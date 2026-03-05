/* ======================================
AUTO LOAD PROJECTS
====================================== */

fetch("models/projects.json")

.then(response => response.json())

.then(projects => {

const grid = document.getElementById("projectGrid")

projects.forEach(project => {

fetch(`models/${project.slug}/info.json`)

.then(response => response.json())

.then(data => {

const item = document.createElement("a")

item.href = `product.html?project=${project.slug}`

item.innerHTML = `

<div class="project">

<img src="models/${project.slug}/${data.media.thumbnail}">

<div class="overlay"></div>

<div class="project-title">
${data.info.title}
</div>

</div>

`

grid.appendChild(item)

})

})

})