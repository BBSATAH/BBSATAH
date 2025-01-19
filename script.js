document.addEventListener('DOMContentLoaded', () => {
  // إضافة CSS لمنع التحديد
  const style = document.createElement('style');
  style.textContent = `
      * {
          -webkit-user-select: none; /* لمنع التحديد في Chrome وSafari */
          -moz-user-select: none; /* لمنع التحديد في Firefox */
          -ms-user-select: none; /* لمنع التحديد في Internet Explorer/Edge */
          user-select: none; /* القاعدة العامة */
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

  // هنا بنحدد الرابط النشط بناءً على الصفحة اللي المستخدم عليها دلوقتي
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.top-nav a');
  navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
          // إضافة كلاس active للرابط اللي بيطابق الصفحة الحالية
          link.classList.add('active');
      }
  });

  // هنا بنقرأ حالة الوضع المظلم من localStorage
  const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

  // لو الوضع المظلم كان مفعّل قبل كده، بنضيف كلاس dark-theme للجسم
  if (isDarkMode) {
      document.body.classList.add('dark-theme');
  }

  // هنا بنضيف وظيفة لتبديل الوضع المظلم لما نضغط على الأيقونة
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

  // محرك البحث
  const searchBox = document.getElementById('search-box');
  const searchBtn = document.getElementById('search-btn');
  const searchResults = document.getElementById('search-results');

  // Collect all searchable items
  function getSearchableItems() {
      return Array.from(document.querySelectorAll('.course-card, .lesson-card, .project-card, .game-card'))
          .map(item => ({
              element: item,
              text: item.textContent.toLowerCase(),
              title: item.querySelector('h2, h3, .title')?.textContent || ''
          }));
  }

  let items = getSearchableItems();

  // Navigate to item
  function navigateToItem(element) {
      // Remove previous highlights
      document.querySelectorAll('.highlight').forEach(el =>
          el.classList.remove('highlight')
      );

      // Add highlight to selected element
      element.classList.add('highlight');

      // Scroll to element
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Hide search results
      searchResults.style.display = 'none';
      searchBox.value = '';
  }

  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
      if (!searchResults.contains(e.target) && e.target !== searchBox) {
          searchResults.style.display = 'none';
      }
  });

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
