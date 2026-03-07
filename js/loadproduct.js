/* ======================================
LOAD PROJECTS - NL F.LAB STANDARD (OPTIMIZED)
====================================== */

async function loadProjects() {
    const grid = document.getElementById("projectGrid");
    const filterBar = document.getElementById("filterBar");

    try {
        const res = await fetch("models/projects.json");
        if (!res.ok) throw new Error("Cannot load projects.json");
        const projects = await res.json();

        // 1. SORT PROJECT (Priority -> Date)
        projects.sort((a, b) => {
            const pa = a.priority ?? -1;
            const pb = b.priority ?? -1;
            if (pa !== pb) return pb - pa;
            return new Date(b.date) - new Date(a.date);
        });

        // 2. COLLECT CATEGORIES
        const categories = [...new Set(projects.flatMap(p => p.categories || []))];

        // 3. RENDER FUNCTION
        const render = (filter) => {
            // Giữ chiều cao hiện tại để tránh nhảy trang (Fix lỗi nháy)
            grid.style.minHeight = grid.offsetHeight + "px";
            grid.innerHTML = "";

            let filtered = projects.filter(p =>
                filter === "featured" ? p.featured : p.categories?.includes(filter)
            );

            // Nếu tab featured trống, hiện tất cả
            if (filter === "featured" && filtered.length === 0) {
                filtered = projects;
            }

            filtered.forEach(p => {
                // Tạo thẻ <a> đóng vai trò là container cho Masonry
                const card = document.createElement("a");
                card.className = "project-link project"; // Class 'project' để nhận CSS Masonry
                card.href = `product.html?project=${p.slug}`;

                card.innerHTML = `
                    <img src="models/${p.slug}/${p.thumbnail}" 
                         loading="lazy" 
                         decoding="async" 
                         alt="${p.title}"
                         onload="this.classList.add('loaded')">
                    <div class="project-title">${p.title}</div>
                `;

                grid.appendChild(card);
            });

            // Sau khi render xong, trả lại độ cao tự động sau một khoảng trễ ngắn
            setTimeout(() => {
                grid.style.minHeight = "auto";
            }, 600);
        };

        // 4. BUTTON HELPER
        const createButton = (filter, label, active = false) => {
            const btn = document.createElement("button");
            btn.className = `filter-btn ${active ? "active" : ""}`;
            btn.dataset.filter = filter;
            btn.textContent = label;

            btn.onclick = () => {
                const currentActive = filterBar.querySelector(".filter-btn.active");
                if (currentActive) currentActive.classList.remove("active");
                btn.classList.add("active");
                
                // Hiệu ứng mờ dần nhẹ nhàng khi đổi nội dung
                grid.style.opacity = "0.2";
                setTimeout(() => {
                    render(filter);
                    grid.style.opacity = "1";
                }, 250);
            };

            filterBar.appendChild(btn);
        };

        // 5. INITIALIZE UI
        // Nút Featured mặc định
        createButton("featured", "Featured", true);

        // Các nút Category từ dữ liệu JSON
        categories.sort().forEach(cat => {
            const label = cat
                .replace(/-/g, " ")
                .replace(/\b\w/g, l => l.toUpperCase());
            createButton(cat, label);
        });

        // Chạy lần đầu
        render("featured");

    } catch (err) {
        console.error("Project loading failed:", err);
    }
}

// Chạy khởi tạo hệ thống
loadProjects();
