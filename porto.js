document.addEventListener("DOMContentLoaded", function () {

    // 1. MENU NAVIGASI MOBILE
    const menu = document.querySelector("#menu");
    const daftarMenu = menu.querySelector("ul");

    const tombolMenu = document.createElement("button");

    tombolMenu.className = "menu-toggle";
    tombolMenu.type = "button";
    tombolMenu.textContent = "☰";
    tombolMenu.setAttribute("aria-label", "Buka menu navigasi");
    tombolMenu.setAttribute("aria-expanded", "false");
    tombolMenu.setAttribute("aria-controls", "daftar-navigasi");

    daftarMenu.id = "daftar-navigasi";

    menu.insertBefore(tombolMenu, daftarMenu);

    function aturMenuMobile(terbuka) {
        daftarMenu.classList.toggle("menu-terbuka", terbuka);

        tombolMenu.textContent = terbuka ? "✕" : "☰";

        tombolMenu.setAttribute(
            "aria-expanded",
            String(terbuka)
        );

        tombolMenu.setAttribute(
            "aria-label",
            terbuka ? "Tutup menu navigasi" : "Buka menu navigasi"
        );
    }

    tombolMenu.addEventListener("click", function () {
        const terbuka =
            daftarMenu.classList.contains("menu-terbuka");

        aturMenuMobile(!terbuka);
    });

    const tautanMenu = daftarMenu.querySelectorAll("a");

    tautanMenu.forEach(function (tautan) {
        tautan.addEventListener("click", function () {
            aturMenuMobile(false);
        });
    });

    // 2. PENANDA MENU AKTIF
    const semuaSection = document.querySelectorAll(
        "main section[id]"
    );

    function perbaruiMenuAktif() {
        let sectionAktif = "beranda";
        const batasAktif = 160;

        semuaSection.forEach(function (section) {
            const posisi = section.getBoundingClientRect();

            if (
                posisi.top <= batasAktif &&
                posisi.bottom > batasAktif
            ) {
                sectionAktif = section.id;
            }
        });

        // Pastikan section terakhir aktif saat mencapai
        // bagian paling bawah halaman.
        const sampaiBawah =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 5;

        if (sampaiBawah && semuaSection.length > 0) {
            sectionAktif = semuaSection[semuaSection.length - 1].id;
        }

        tautanMenu.forEach(function (tautan) {
            const aktif =
                tautan.getAttribute("href") === "#" + sectionAktif;

            tautan.classList.toggle("aktif", aktif);

            if (aktif) {
                tautan.setAttribute("aria-current", "location");
            } else {
                tautan.removeAttribute("aria-current");
            }
        });
    }

    let jadwalScroll = false;

    function saatScroll() {
        if (jadwalScroll) return;

        jadwalScroll = true;

        window.requestAnimationFrame(function () {
            perbaruiMenuAktif();
            jadwalScroll = false;
        });
    }

    window.addEventListener("scroll", saatScroll, {
        passive: true
    });

    window.addEventListener("resize", perbaruiMenuAktif);

    perbaruiMenuAktif();

    // 3. ANIMASI SAAT SCROLL
    const elemenAnimasi = document.querySelectorAll(
        "#saya, #ahli, #proyek, .kartu-proyek, " +
        "#kontak, .kotak-kontak"
    );

    const minimAnimasi = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        "IntersectionObserver" in window &&
        !minimAnimasi
    ) {
        const pengamat = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("terlihat");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        elemenAnimasi.forEach(function (elemen) {
            elemen.classList.add("animasi-scroll");
            pengamat.observe(elemen);
        });
    } else {
        elemenAnimasi.forEach(function (elemen) {
            elemen.classList.add("terlihat");
        });
    }

    // 4. DATA DETAIL PROYEK
    // Urutan harus sama dengan kartu pada HTML.
    const dataProyek = [
        {
            nama: "Music Streaming App",
            kategori: "Group Project",
            deskripsi:
                "Proyek kolaborasi tim untuk merancang konsep " +
                "aplikasi streaming musik yang berfokus pada " +
                "pengalaman pengguna dan navigasi yang intuitif. " +
                "Proses desain meliputi wireframing, penyusunan " +
                "design system, serta pembuatan prototipe interaktif.",
            tools: "Figma, Wireframing, Prototyping"
        },
        {
            nama: "Card E-Commerce Korean Lily Bento Cake",
            kategori: "Personal Project",
            deskripsi:
                "Eksplorasi desain product card untuk Korean Lily " +
                "Bento Cake. Desain berfokus pada estetika pastel, " +
                "informasi produk yang jelas, konsistensi visual, " +
                "dan tombol Call-to-Action (CTA) yang mudah ditemukan.",
            tools: "Figma"
        },
        {
            nama: "FloristClub",
            kategori: "Personal Project",
            deskripsi:
                "Perancangan website katalog buket bunga dengan " +
                "tampilan responsif untuk desktop dan mobile. " +
                "Konsep website memudahkan pengguna menjelajahi " +
                "produk dan melakukan pemesanan melalui WhatsApp.",
            tools: "Figma"
        }
    ];

    // 5. MEMBUAT MODAL DETAIL PROYEK
    const modal = document.createElement("div");

    modal.className = "modal-proyek";
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
        <div
            class="modal-isi"
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-modal"
            aria-describedby="deskripsi-modal"
            tabindex="-1"
        >
            <button
                class="modal-tutup"
                type="button"
                aria-label="Tutup detail proyek"
            >&times;</button>

            <h2 id="judul-modal"></h2>
            <p id="kategori-modal"></p>
            <p id="peran-modal"></p>
            <p id="deskripsi-modal"></p>
            <p id="tools-modal"></p>
        </div>
    `;

    document.body.appendChild(modal);

    const isiModal = modal.querySelector(".modal-isi");
    const tombolTutup = modal.querySelector(".modal-tutup");
    const judulModal = modal.querySelector("#judul-modal");
    const kategoriModal = modal.querySelector("#kategori-modal");
    const peranModal = modal.querySelector("#peran-modal");
    const deskripsiModal = modal.querySelector("#deskripsi-modal");
    const toolsModal = modal.querySelector("#tools-modal");

    let elemenSebelumnya = null;

    function bukaModal(proyek, tombolPemicu) {
        elemenSebelumnya = tombolPemicu;

        judulModal.textContent = proyek.nama;
        kategoriModal.textContent = "Kategori: " + proyek.kategori;
        peranModal.textContent = "Peran: " + proyek.peran;
        deskripsiModal.textContent = proyek.deskripsi;
        toolsModal.textContent = "Tools: " + proyek.tools;

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        tombolTutup.focus();
    }

    function tutupModal() {
        if (modal.hidden) return;

        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        if (
            elemenSebelumnya &&
            document.contains(elemenSebelumnya)
        ) {
            elemenSebelumnya.focus();
        }
    }

    const tombolDetail = document.querySelectorAll(
        ".kartu-proyek button"
    );

    tombolDetail.forEach(function (tombol, indeks) {
        tombol.addEventListener("click", function () {
            const proyek = dataProyek[indeks];

            if (!proyek) {
                return;
            }

            bukaModal(proyek, tombol);
        });
    });

    // Menutup dengan tombol silang
    tombolTutup.addEventListener("click", tutupModal);

    // Menutup saat area luar modal diklik
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            tutupModal();
        }
    });

    // Menutup dengan tombol Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            tutupModal();
        }

        // Menjaga fokus keyboard tetap di dalam modal.
        if (event.key === "Tab" && !modal.hidden) {
            const elemenFokus = [
                tombolTutup
            ];

            const pertama = elemenFokus[0];

            if (
                event.shiftKey &&
                document.activeElement === pertama
            ) {
                event.preventDefault();
                isiModal.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === isiModal
            ) {
                event.preventDefault();
                pertama.focus();
            }
        }
    });

    // 6. TAHUN FOOTER OTOMATIS
    const teksFooter = document.querySelector("footer p");

    if (teksFooter) {
        teksFooter.textContent =
            "\u00A9 Ni Putu Aristyawati " +
            new Date().getFullYear();
    }

});
