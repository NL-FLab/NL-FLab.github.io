/* ======================================
AUTO LOAD PROJECTS
====================================== */

async function loadProjects(){

const grid = document.getElementById("projectGrid")

try{

const response = await fetch("models/projects.json")

if(!response.ok) throw new Error("Cannot load projects.json")

const projects = await response.json()


const projectDataPromises = projects.map(async(project)=>{

try{

const infoRes = await fetch(`models/${project.slug}/info.json`)

if(!infoRes.ok) return null

const data = await infoRes.json()

return {...project,...data}

}catch(err){

console.error(`Error loading ${project.slug}`,err)

return null

}

})


const results = await Promise.all(projectDataPromises)

// =============================
// LẤY DANH SÁCH CATEGORY
// =============================

const categories = new Set()

results.forEach(project=>{
if(project){
categories.add(project.info.category)
}
})

// =============================
// TẠO FILTER BUTTON
// =============================

const filterBar = document.getElementById("filterBar")

// nút ALL
const allBtn = document.createElement("button")
allBtn.className = "filter-btn active"
allBtn.dataset.filter = "all"
allBtn.textContent = "All"

filterBar.appendChild(allBtn)

// các category
categories.forEach(cat => {

const btn = document.createElement("button")

btn.className = "filter-btn"
btn.dataset.filter = cat
btn.textContent = cat

filterBar.appendChild(btn)

})

results.forEach(project=>{

if(!project) return

const item = document.createElement("a")

item.className="project-link"

item.href=`product.html?project=${project.slug}`


item.innerHTML=`

<div class="project">

<img src="models/${project.slug}/${project.media.thumbnail}" loading="lazy">

<div class="project-title">

${project.info.title}

</div>

</div>

`

grid.appendChild(item)

})

}catch(error){

console.error("Project loading failed",error)

}

}


loadProjects()
