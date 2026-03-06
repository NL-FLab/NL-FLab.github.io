/* ======================================
LOAD PROJECTS
====================================== */

async function loadProjects(){

const grid = document.getElementById("projectGrid")
const filterBar = document.getElementById("filterBar")

try{

// LOAD JSON
const res = await fetch("models/projects.json")
if(!res.ok) throw new Error("Cannot load projects.json")

const projects = await res.json()


// =====================================
// SORT PROJECT
// priority → date
// =====================================

projects.sort((a,b)=>{

const pa = a.priority ?? -1
const pb = b.priority ?? -1

if(pa !== pb) return pb - pa

return new Date(b.date) - new Date(a.date)

})


// =====================================
// COLLECT CATEGORIES
// =====================================

const categories = new Set()

projects.forEach(p=>{
p.categories?.forEach(c=>categories.add(c))
})


// =====================================
// CREATE FILTER BUTTONS
// =====================================

// FEATURED

createButton("featured","Featured",true)

// CATEGORY

categories.forEach(cat=>{

const label = cat
.replace(/-/g," ")
.replace(/\b\w/g,l=>l.toUpperCase())

createButton(cat,label)

})


// =====================================
// RENDER PROJECTS
// =====================================

function render(filter){

grid.innerHTML=""

const filtered = projects.filter(p=>{

if(filter==="featured") return p.featured

return p.categories?.includes(filter)

})

filtered.forEach(p=>{

const card = document.createElement("a")

card.className="project-link"
card.href=`product.html?project=${p.slug}`

card.innerHTML=`

<div class="project">

<img src="models/${p.slug}/${p.thumbnail}" loading="lazy">

<div class="project-title">
${p.title}
</div>

</div>

`

grid.appendChild(card)

})

}


// =====================================
// BUTTON HELPER
// =====================================

function createButton(filter,label,active=false){

const btn=document.createElement("button")

btn.className="filter-btn"
if(active) btn.classList.add("active")

btn.dataset.filter=filter
btn.textContent=label

btn.onclick=()=>{

document.querySelectorAll(".filter-btn")
.forEach(b=>b.classList.remove("active"))

btn.classList.add("active")

render(filter)

}

filterBar.appendChild(btn)

}


// FIRST LOAD

render("featured")

}catch(err){

console.error("Project loading failed",err)

}

}

loadProjects()
