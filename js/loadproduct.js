/* ======================================
AUTO LOAD PROJECTS
====================================== */

async function loadProjects(){

const grid = document.getElementById("projectGrid")
const filterBar = document.getElementById("filterBar")

try{

const response = await fetch("models/projects.json")

if(!response.ok) throw new Error("Cannot load projects.json")

let projects = await response.json()


/* =============================
SORT PROJECT
priority → date
============================= */

projects.sort((a,b)=>{

const pa = a.priority ?? -1
const pb = b.priority ?? -1

if(pa !== pb) return pb - pa

return new Date(b.date) - new Date(a.date)

})


/* =============================
LOAD info.json
============================= */

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

const results = (await Promise.all(projectDataPromises))
.filter(p => p !== null)



/* =============================
GET CATEGORY LIST
============================= */

const categories = new Set()

results.forEach(project=>{

if(project.categories){

project.categories.forEach(cat=>{
categories.add(cat)
})

}

})


/* =============================
CREATE FILTER BUTTONS
============================= */

// FEATURED TAB

const featuredBtn = document.createElement("button")

featuredBtn.className = "filter-btn active"
featuredBtn.dataset.filter = "featured"
featuredBtn.textContent = "Featured"

filterBar.appendChild(featuredBtn)


// CATEGORY TABS

categories.forEach(cat => {

const btn = document.createElement("button")

btn.className = "filter-btn"
btn.dataset.filter = cat

btn.textContent =
cat.charAt(0).toUpperCase() + cat.slice(1)

filterBar.appendChild(btn)

})


/* =============================
RENDER FUNCTION
============================= */

function renderProjects(filter){

grid.innerHTML = ""

let filtered = results

if(filter === "featured"){

filtered = results.filter(p => p.featured)

}else{

filtered = results.filter(p =>
p.categories && p.categories.includes(filter)
)

}

filtered.forEach(project=>{

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

}


/* =============================
FILTER CLICK EVENT
============================= */

document.querySelectorAll(".filter-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".filter-btn")
.forEach(b=>b.classList.remove("active"))

btn.classList.add("active")

renderProjects(btn.dataset.filter)

})

})


/* =============================
INITIAL RENDER
============================= */

renderProjects("featured")


}catch(error){

console.error("Project loading failed",error)

}

}


loadProjects()
