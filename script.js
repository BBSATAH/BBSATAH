
document.addEventListener('DOMContentLoaded', () => {
    // إضافة CSS لمنع التحديد والظل الأزرق عند النقر
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none; /* لمنع التحديد في Chrome وSafari */
            -moz-user-select: none; /* لمنع التحديد في Firefox */
            -ms-user-select: none; /* لمنع التحديد في Internet Explorer/Edge */
            user-select: none; /* القاعدة العامة */
            -webkit-tap-highlight-color: transparent; /* إزالة الظل الأزرق عند النقر */
            tap-highlight-color: transparent; /* إصدار بديل للخاصية */
        }
  
        /* السماح بالتحديد في حقول الإدخال والنصوص القابلة للتحديد */
        input, textarea, .allow-select {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
        }
    `;
    document.head.appendChild(style);
  
    // تحديد الرابط النشط بناءً على الصفحة الحالية
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.top-nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            // إضافة كلاس active للرابط الذي يطابق الصفحة الحالية
            link.classList.add('active');
        }
    });

    // التعامل مع الوضع المظلم
    // إضافة وظيفة لتبديل الوضع المظلم عند الضغط على الأيقونة
    const darkModeIcon = document.getElementById('toggle-dark-mode');
    darkModeIcon.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        // حفظ حالة الوضع المظلم في localStorage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
  
    // قراءة حالة الوضع المظلم من localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
  
    // إذا كان الوضع المظلم مفعلًا سابقًا، نضيف كلاس dark-theme للجسم
    if (isDarkMode) {
        document.body.classList.add('dark-theme');
    }
  
    // تبديل القائمة عند الضغط على زر القائمة
    const menuIcon = document.getElementById('menu-icon');
    menuIcon.addEventListener('click', () => {
        const nav = document.getElementById('top-nav');
        nav.classList.toggle('active');
        menuIcon.classList.toggle('change');
        document.addEventListener('click', (event) => {
            if (!menuIcon.contains(event.target) && !nav.contains(event.target)) {
                nav.classList.remove('active');
                menuIcon.classList.remove('change');
            }
        });
    });
});

