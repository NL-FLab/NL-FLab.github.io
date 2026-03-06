/* ======================================
LOAD PROJECTS - NL F.LAB STANDARD
====================================== */

async function loadProjects() {

const grid = document.getElementById("projectGrid");
const filterBar = document.getElementById("filterBar");

try {

const res = await fetch("models/projects.json");

if (!res.ok) throw new Error("Cannot load projects.json");

const projects = await res.json();


// SORT PROJECT

projects.sort((a, b) => {

const pa = a.priority ?? -1;
const pb = b.priority ?? -1;

if (pa !== pb) return pb - pa;

return new Date(b.date) - new Date(a.date);

});


// COLLECT CATEGORIES

const categories = [...new Set(projects.flatMap(p => p.categories || []))];


// RENDER

const render = (filter) => {

grid.innerHTML = "";

let filtered = projects.filter(p =>
filter === "featured"
? p.featured
: p.categories?.includes(filter)
);

if(filter==="featured" && filtered.length===0){
filtered = projects;
}

filtered.forEach(p => {

const card = document.createElement("a");

card.className = "project-link";
card.href = `product.html?project=${p.slug}`;

card.innerHTML = `
<div class="project">
<img src="models/${p.slug}/${p.thumbnail}" loading="lazy" decoding="async" alt="${p.title}">
<div class="project-title">${p.title}</div>
</div>
`;

grid.appendChild(card);

});

};


// BUTTON HELPER

const createButton = (filter, label, active = false) => {

const btn = document.createElement("button");

btn.className = `filter-btn ${active ? "active" : ""}`;

btn.dataset.filter = filter;

btn.textContent = label;

btn.onclick = () => {

const currentActive = filterBar.querySelector(".filter-btn.active");

if (currentActive) currentActive.classList.remove("active");

btn.classList.add("active");

render(filter);

};

filterBar.appendChild(btn);

};


// INITIALIZE UI

createButton("featured", "Featured", true);

categories.sort().forEach(cat => {

const label = cat
.replace(/-/g, " ")
.replace(/\b\w/g, l => l.toUpperCase());

createButton(cat, label);

});

render("featured");

} catch (err) {

console.error("Project loading failed:", err);

}

}

loadProjects();
