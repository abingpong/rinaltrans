// --- 1. Logika WhatsApp Redirect ---
function pesanWhatsApp(namaMobil, hargaMobil) {
    const nomorWA = "6287850691995"; 
    
    let pesan = "";
    if (hargaMobil === "") {
        pesan = `Halo Admin RINAL TRANS, saya ingin bertanya lebih lanjut mengenai layanan rental mobil Anda.`;
    } else {
        pesan = `Halo Admin RINAL TRANS, saya tertarik untuk menyewa mobil *${namaMobil}* dengan harga Rp ${hargaMobil}/hari. Apakah jadwalnya tersedia?`;
    }
    
    const urlWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWA, '_blank');
}

// --- 2. Logika Mobile Menu (Hamburger) ---
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function(e) {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        e.stopPropagation(); 
    });

    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    navLinks.querySelectorAll('.btn-nav').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// --- 3. Logika Navbar Auto-Hide on Scroll ---
let idleTimer;
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

function handleNavbarVisibility() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (navLinks.classList.contains('active')) {
        navbar.style.transform = "translateY(0)";
        return; 
    }

    navbar.style.transform = "translateY(0)";
    clearTimeout(idleTimer);
    
    idleTimer = setTimeout(() => {
        if (scrollTop > 100 && !navLinks.classList.contains('active')) {
            navbar.style.transform = "translateY(-100%)";
        }
    }, 4000);
}

window.addEventListener('scroll', handleNavbarVisibility);
window.addEventListener('mousemove', handleNavbarVisibility);

// --- 4. Animasi Scroll (Intersection Observer) ---
document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.fade-up');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    handleNavbarVisibility();
});

// --- 5. Tombol Scroll ke Atas & WA Melayang (Progress Melingkar) ---
const scrollTopBtn = document.getElementById("scrollTopBtn");
const circle = document.querySelector('.progress-ring__circle');
const floatingWa = document.querySelector('.floating-wa'); // Tangkap elemen WA

if (scrollTopBtn && circle) {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    window.addEventListener("scroll", () => {
        let scrollY = window.scrollY || window.pageYOffset;

        // Tampilkan ScrollTop & WA saat discroll lebih dari 300px
        if (scrollY > 300) {
            scrollTopBtn.classList.add("show");
            if (floatingWa) floatingWa.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
            if (floatingWa) floatingWa.classList.remove("show");
        }

        // Kalkulasi persentase scroll
        let scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrollPercentage = scrollTotal > 0 ? (scrollY / scrollTotal) : 0;
        
        // FIX BUG MOBILE: Paksa persentase jadi 0 jika sudah mendekati puncak (Toleransi 10px)
        if (scrollY <= 10) {
            scrollPercentage = 0;
        }
        
        const offset = circumference - (scrollPercentage * circumference);
        circle.style.strokeDashoffset = offset;
    });

    scrollTopBtn.addEventListener("click", () => {
        // Gulir ke atas
        window.scrollTo({
            top: 0,
            behavior: "smooth" 
        });
        
        // FIX BUG MOBILE: Paksa reset lingkaran emas secara manual setelah animasi scroll selesai (sekitar 800ms)
        setTimeout(() => {
            circle.style.strokeDashoffset = circumference;
        }, 800);
    });
}

// --- FIX: Efek Bintang Silver Full Page ---
function createStars() {
    // Hapus wadah bintang lama jika ada untuk mencegah penumpukan
    const oldStars = document.getElementById('stars-container');
    if(oldStars) oldStars.remove();

    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars-container';
    document.body.prepend(starsContainer);

    // Hitung total tinggi website dari ujung atas sampai ujung bawah
    const docHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight
    );
    
    // Terapkan tinggi dokumen ke wadah bintang
    starsContainer.style.height = `${docHeight}px`;

    const starCount = 200; // Jumlah bintang diperbanyak agar cukup untuk seluruh halaman

    for (let i = 0; i < starCount; i++) {
        let star = document.createElement('div');
        star.classList.add('star');
        
        let size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.left = `${Math.random() * 100}vw`;
        // Bintang disebar secara acak dari pixel ke-0 sampai pixel terbawah website
        star.style.top = `${Math.random() * docHeight}px`; 
        
        star.style.animationDuration = `${Math.random() * 4 + 2}s`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        
        starsContainer.appendChild(star);
    }
}

// Panggil fungsi saat web selesai memuat susunan layout
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(createStars, 500); // Diberi jeda 0.5 detik agar tinggi halaman terhitung akurat
});

// Hitung ulang dan sebar ulang bintang jika ukuran layar HP/Desktop diubah (dimiringkan/di-resize)
window.addEventListener('resize', () => {
    setTimeout(createStars, 500);
});

// =============================================================================
// --- 8. LOGIKA DATA, PENCARIAN & PENGGANTIAN GAMBAR TEMA (REVISI PREMIUM) ---
// =============================================================================

// Data Base Mobil (Diperbarui struktur untuk menyimpan 2 gambar berbeda)
// CATATAN: Isilah tautan (URL) gambar yang sesuai di properti 'imgDark' dan 'imgLight'.
const armadaData = [
    {
        id: 1,
        name: "ALL NEW AVANZA",
        price: 600000,
        capacityText: "6 Penumpang + 1 Driver",
        // Masukkan URL gambar khusus Dark Mode (misal: mobil warna gelap)
        imgDark: "car/1.png", 
        // Masukkan URL gambar khusus Light Mode (misal: mobil warna terang)
        imgLight: "car/12.png" 
    },
    {
        id: 2,
        name: "INNOVA REBORN",
        price: 700000,
        capacityText: "7 Penumpang + 1 Driver",
        imgDark: "car/2.png",
        imgLight: "car/13.png"
    },
    {
        id: 3,
        name: "INNOVA VENTURER",
        price: 900000,
        capacityText: "6 Penumpang + 1 Driver",
        imgDark: "car/3.png",
        imgLight: "car/14.png" // Placeholder sama
    },
    {
        id: 4,
        name: "FORTUNER VRZ",
        price: "Contact for best price !",
        capacityText: "5 - 6 Penumpang + 1 Driver",
        imgDark: "car/4.png",
        imgLight: "car/15.png" // Placeholder sama
    },
    {
        id: 5,
        name: "PAJERO SPORT",
        price: "Contact for best price !",
        capacityText: "6 - 7 Penumpang + 1 Driver",
        imgDark: "car/11.png",
        imgLight: "car/22.png" // Placeholder sama
    },
    {
        id: 6,
        name: "INNOVA ZENIX",
        price: "Contact for best price !",
        capacityText: "7 Penumpang + 1 Driver",
        imgDark: "car/5.png",
        imgLight: "car/16.png" // Placeholder sama
    },
    {
        id: 7,
        name: "INNOVA ZENIX Q HYBIRD MODELLISTA",
        price: "Contact for best price !",
        capacityText: "5 - 6 Penumpang + 1 Driver",
        imgDark: "car/10.png",
        imgLight: "car/21.png" // Placeholder sama
    },
    {
        id: 8,
        name: "TOYOTA ALPHARD",
        price: "Contact for best price !",
        capacityText: "5 Penumpang + 1 Driver",
        imgDark: "car/7.png",
        imgLight: "car/18.png" // Placeholder sama
    },
    {
        id: 9,
        name: "HIACE COMMUTER",
        price: "Contact for best price !",
        capacityText: "14 Penumpang + 1 Driver",
        imgDark: "car/6.png",
        imgLight: "car/17.png" // Placeholder sama
    },
    {
        id: 10,
        name: "HIACE PREMIO",
        price: "Contact for best price !",
        capacityText: "14 Penumpang + 1 Driver",
        imgDark: "car/8.png",
        imgLight: "car/20.png" // Placeholder sama
    },
    {
        id: 11,
        name: "HIACE PREMIO LUXURY",
        price: "Contact for best price !",
        capacityText: "9 Penumpang + 1 Driver",
        imgDark: "car/9.png",
        imgLight: "car/19.png" // Placeholder sama
    }
];

const armadaGrid = document.getElementById('armadaGrid');
const searchInput = document.getElementById('searchInput');

// Fungsi utama untuk mencetak kartu mobil ke HTML
function renderArmada(data) {
    armadaGrid.innerHTML = ''; 

    if(data.length === 0) {
        armadaGrid.innerHTML = `<p style="color: var(--silver); text-align: center; grid-column: 1/-1; padding: 30px;">Mobil yang Anda cari tidak ditemukan.</p>`;
        return;
    }

    // CEK TEMA SAAT INI (PENTING!)
    // Cek apakah 'body' memiliki class 'light-theme'
    const isLightTheme = document.body.classList.contains('light-theme');

    data.forEach(car => {
        let priceDisplayHTML = "";
        let waPriceValue = "";

        // Format Harga
        if (typeof car.price === "number") {
            let formattedPrice = car.price.toLocaleString('id-ID');
            priceDisplayHTML = `Rp. ${formattedPrice} <span style="font-size: 16px; font-weight: 500; color: var(--silver); text-shadow: none; letter-spacing: 0;">/day</span>`;
            waPriceValue = formattedPrice;
        } else {
            priceDisplayHTML = `<span style="font-size: 22px; color: var(--gold-bright); text-shadow: 0 0 10px var(--gold-glow);">${car.price}</span>`;
            waPriceValue = "tanya harga spesial (Best Price)";
        }
        
        // LOGIKA PEMILIHAN GAMBAR
        // Jika light theme aktif, pakai 'car.imgLight'. Jika tidak, pakai 'car.imgDark'.
        const carImageToDisplay = isLightTheme ? car.imgLight : car.imgDark;

        const cardHTML = `
            <div class="card fade-up visible">
                <div class="card-img">
                    <img src="${carImageToDisplay}" alt="${car.name}">
                </div>
                <div class="card-content">
                    <h3 class="car-title">${car.name}</h3>
                    
                    <div class="price-big" style="display: flex; align-items: center; justify-content: center; height: 40px; margin-bottom: 25px; white-space: nowrap;">
                        ${priceDisplayHTML}
                    </div>
                    
                    <button class="btn-pesan" onclick="pesanWhatsApp('${car.name}', '${waPriceValue}')">
                        <img class="wa-logo" src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA"> Pesan Sekarang
                    </button>

                    <div class="detail-fitur">
                        <h4>Detail Fitur :</h4>
                        <ul>
                            <li>Unit + Driver</li>
                            <li>Kapasitas ${car.capacityText}</li>
                            <li>Harga belum termasuk BBM, Tol, Parkir & Makan Driver</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        armadaGrid.innerHTML += cardHTML;
    });
}

// Menjalankan fitur Search (Pencarian saja)
function filterCars() {
    let searchTerm = searchInput.value.toLowerCase();
    
    let filteredCars = armadaData.filter(car => car.name.toLowerCase().includes(searchTerm));

    renderArmada(filteredCars);
}

if (searchInput) {
    // Jalankan render pertama kali saat web dibuka
    renderArmada(armadaData);

    // Pantau ketika user mengetik
    searchInput.addEventListener('input', filterCars);
}

// --- 9. LOGIKA FAQ (TANYA JAWAB) ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Tutup semua FAQ lain yang sedang terbuka
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Buka/tutup FAQ yang diklik
        item.classList.toggle('active');
    });
});

// =============================================================================
// --- 10. FITUR GANTI TEMA (DARK/LIGHT MODE) - DENGAN UPDATE GAMBAR ---
// =============================================================================
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Balikkan tema pada body
        document.body.classList.toggle('light-theme');

        // --- BARU: Pemicu Penggantian Gambar Mobil ---
        // Setelah tema berubah, kita perlu memaksa daftar mobil dicetak ulang
        // agar logika pemilihan gambar (di fungsi renderArmada) berjalan lagi.
        filterCars(); // Panggil fungsi filter (yang di dalamnya memanggil renderArmada)
    });
}
