/* ======================================
   AUTO LOAD PROJECTS - OPTIMIZED
   ====================================== */

async function loadProjects() {
    const grid = document.getElementById("projectGrid");
    
    try {
        // 1. Tải danh sách project chính
        const response = await fetch("models/projects.json")
        if (!response.ok) throw new Error("Không thể load projects.json");
        const projects = await response.json();

        // 2. Dùng Promise.all để load tất cả info.json song song nhưng vẫn giữ thứ tự
        const projectDataPromises = projects.map(async (project) => {
            try {
                const infoRes = await fetch(`/models/${project.slug}/info.json`);
                if (!infoRes.ok) return null; // Bỏ qua nếu folder project thiếu file info
                const data = await infoRes.ok ? await infoRes.json() : null;
                return { ...project, ...data };
            } catch (err) {
                console.error(`Lỗi tại project ${project.slug}:`, err);
                return null;
            }
        });

        const results = await Promise.all(projectDataPromises);

        // 3. Render ra màn hình
        results.forEach(project => {
            if (!project) return; // Bỏ qua các project bị lỗi

            const item = document.createElement("a");
            item.className = "project-link"; // Thêm class để dễ quản lý CSS
            item.href = `product.html?project=${project.slug}`;
            
            item.innerHTML = `
                <div class="project">
                    <img src="/models/${project.slug}/${project.media.thumbnail}" 
                         alt="${project.info.title}" 
                         loading="lazy">
                    <div class="project-title">
                        ${project.info.title}
                    </div>
                </div>
            `;
            grid.appendChild(item);
        });

    } catch (error) {
        console.error("Hệ thống load project thất bại:", error);
    }
}

// Chạy hàm
loadProjects();
