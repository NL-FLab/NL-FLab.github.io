/* ======================================
   PRODUCT PAGE SCRIPT - NL F.LAB
   ====================================== */


/* ======================================
   GET PROJECT SLUG FROM URL
   ====================================== */

const params = new URLSearchParams(window.location.search)
const projectSlug = params.get("project")


/* ======================================
   LOAD PRODUCT INFO
   ====================================== */

async function loadProductInfo(){

try{

const res = await fetch(`models/${projectSlug}/info.json`)

if(!res.ok) throw new Error("info.json not found")

const data = await res.json()


// TITLE

const title = document.getElementById("productTitle")
if(title) title.textContent = data.info.title


// DESCRIPTION

const desc = document.getElementById("productDescription")
if(desc) desc.textContent = data.info.description


}catch(err){

console.error("Product info loading failed:",err)

}

}



/* ======================================
   LOAD GALLERY
   ====================================== */

async function loadGallery(){

const gallery = document.getElementById("gallery")

if(!gallery) return

try{

const res = await fetch("models/gallery_config.json")

if(!res.ok) throw new Error("gallery_config.json not found")

const config = await res.json()

const basePath = `models/${projectSlug}/images/`


// LOOP IMAGE LIST

config.order.forEach(name=>{

const img = new Image()

img.src = basePath + name


// CHỈ ADD KHI ẢNH TỒN TẠI

img.onload = ()=>{

const item = document.createElement("img")

item.src = img.src
item.className = "gallery-img"
item.loading = "lazy"
item.decoding = "async"

gallery.appendChild(item)

}

})

}catch(err){

console.error("Gallery loading failed:",err)

}

}



/* ======================================
   INIT PAGE
   ====================================== */

function initProductPage(){

if(!projectSlug){

console.error("Project slug missing in URL")

return

}

loadProductInfo()

loadGallery()

}


// RUN

initProductPage()
