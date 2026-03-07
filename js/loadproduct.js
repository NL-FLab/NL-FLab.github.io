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

        // SORT
        projects.sort((a, b) => {
            const pa = a.priority ?? -1;
            const pb = b.priority ?? -1;
            if (pa !== pb) return pb - pa;
            return new Date(b.date) - new Date(a.date);
        });

        const categories = [...new Set(projects.flatMap(p => p.categories || []))];

        // RENDER
        const render = (filter) => {
            grid.innerHTML = "";
            
            let filtered = projects.filter(p =>
                filter === "featured" ? p.featured : p.categories?.includes(filter)
            );

            if(filter === "featured" && filtered.length === 0) filtered = projects;

            filtered.forEach(p => {
                // Tạo thẻ <a> bao ngoài
                const card = document.createElement("a");
                card.className = "project-link";
                card.href = `product.html?project=${p.slug}`;
                card.style.textDecoration = "none";
                card.style.display = "block"; // Đảm bảo thẻ link bao trọn khối

                // Cấu trúc bên trong khớp với CSS Masonry
                card.innerHTML = `
                    <div class="project">
                        <img src="models/${p.slug}/${p.thumbnail}" 
                             loading="lazy" 
                             style="width:100%; display:block;" 
                             alt="${p.title}">
                        <div class="project-title" style="padding:15px; color:#fff; font-size:12px; text-transform:uppercase; letter-spacing:1px;">
                            ${p.title}
                        </div>
                    </div>
                `;

                grid.appendChild(card);
            });
        };

        // UI BUTTONS
        const createButton = (filter, label, active = false) => {
            const btn = document.createElement("button");
            btn.className = `filter-btn ${active ? "active" : ""}`;
            btn.textContent = label;
            btn.onclick = () => {
                filterBar.querySelector(".filter-btn.active")?.classList.remove("active");
                btn.classList.add("active");
                render(filter);
            };
            filterBar.appendChild(btn);
        };

        createButton("featured", "Featured", true);
        categories.sort().forEach(cat => {
            const label = cat.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            createButton(cat, label);
        });

        render("featured");

    } catch (err) {
        console.error("Failed:", err);
    }
}

loadProjects();
