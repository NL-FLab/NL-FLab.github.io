async function loadProjects(){

const grid = document.getElementById("projectGrid")
const filterBar = document.getElementById("filterBar")

try{

const response = await fetch("models/projects.json")
const projects = await response.json()

// ==========================
// SORT
// ==========================

projects.sort((a,b)=>{

if(a.priority && b.priority){
return b.priority - a.priority
}

if(a.priority) return -1
if(b.priority) return 1

return new Date(b.date) - new Date(a.date)

})

// ==========================
// CATEGORY LIST
// ==========================

const categories = new Set()

projects.forEach(p=>{
p.categories?.forEach(c=>categories.add(c))
})

// ==========================
// CREATE FILTER BUTTON
// ==========================

const featuredBtn = document.createElement("button")
featuredBtn.className="filter-btn active"
featuredBtn.dataset.filter="featured"
featuredBtn.textContent="Featured"

filterBar.appendChild(featuredBtn)

categories.forEach(cat=>{

const btn=document.createElement("button")

btn.className="filter-btn"
btn.dataset.filter=cat
btn.textContent=cat

filterBar.appendChild(btn)

})

// ==========================
// RENDER FUNCTION
// ==========================

function renderProjects(filter){

grid.innerHTML=""

projects.forEach(project=>{

// filter logic
if(filter==="featured" && !project.featured) return
if(filter!=="featured" && !project.categories?.includes(filter)) return

const item=document.createElement("a")

item.href=`product.html?project=${project.slug}`

item.innerHTML=`

<div class="project">

<img src="models/${project.slug}/${project.thumbnail}" loading="lazy">

<div class="project-title">
${project.title}
</div>

</div>

`

grid.appendChild(item)

})

}

// ==========================
// FILTER CLICK
// ==========================

document.querySelectorAll(".filter-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".filter-btn")
.forEach(b=>b.classList.remove("active"))

btn.classList.add("active")

renderProjects(btn.dataset.filter)

})

})

// ==========================
// INITIAL RENDER
// ==========================

renderProjects("featured")

}catch(err){

console.error("Loading failed",err)

}

}

loadProjects()
