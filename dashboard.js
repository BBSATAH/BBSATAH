document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Logout Functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // إظهار تأكيد تسجيل الخروج
            if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                // حذف بيانات الجلسة
                localStorage.removeItem('userLoggedIn');
                // إضافة رسالة نجاح
                alert('تم تسجيل الخروج بنجاح');
                // التوجيه إلى صفحة تسجيل الدخول
                window.location.href = 'login.html';
            }
        });
    }

    // تهيئة التنقل بين الأقسام
    function initializeNavigation() {
        console.log('تهيئة نظام التنقل بين الأقسام');
        const navLinks = document.querySelectorAll('.dashboard-sidebar a');
        const contentSections = document.querySelectorAll('.content-section');

        console.log(`تم العثور على ${navLinks.length} روابط و ${contentSections.length} أقسام`);

        // إزالة معالجات الأحداث القديمة لتجنب التكرار
        navLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
        });

        // إعادة تحديد الروابط بعد الاستبدال
        const refreshedNavLinks = document.querySelectorAll('.dashboard-sidebar a');

        refreshedNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetSectionId = this.dataset.section;
                console.log(`تم النقر على الرابط: ${this.textContent.trim()} - القسم المستهدف: ${targetSectionId}`);

                // إزالة الفئة النشطة من جميع الروابط
                refreshedNavLinks.forEach(l => l.classList.remove('active'));

                // إضافة الفئة النشطة للرابط المحدد
                this.classList.add('active');

                // إخفاء جميع الأقسام
                contentSections.forEach(section => section.classList.remove('active'));

                // إظهار القسم المطلوب
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    console.log(`تم تنشيط القسم: ${targetSectionId}`);
                } else {
                    console.error(`لم يتم العثور على القسم المستهدف: ${targetSectionId}`);
                }
            });
        });

        console.log('تم تهيئة نظام التنقل بنجاح');
    }

    // تنفيذ تهيئة التنقل
    initializeNavigation();

    // تحميل البيانات المحفوظة من التخزين المحلي
    loadCourses();
    loadLessons();
    loadActivitiesNew();
    loadStats();
    addDefaultActivities();

    // إضافة معالجات الأحداث للأزرار
    attachCourseButtonHandlers();
    attachLessonButtonHandlers();

    // إعداد الرسوم البيانية
    const charts = setupCharts();
    console.log('تم إعداد الرسوم البيانية بنجاح');

    // دوال لإدارة التخزين المحلي
    function saveCourses() {
        const coursesData = [];
        const courseCards = document.querySelectorAll('#courses-container .item-card');

        courseCards.forEach(card => {
            const title = card.querySelector('.item-title').textContent;
            const description = card.querySelector('.item-description').textContent;
            const category = card.querySelector('.item-category').textContent;
            const level = card.querySelector('.item-level').textContent;
            const image = card.querySelector('.item-image') ? card.querySelector('.item-image').src : null;

            coursesData.push({
                title,
                description,
                category,
                level,
                image
            });
        });

        localStorage.setItem('dashboardCourses', JSON.stringify(coursesData));

        // حفظ الكورسات في الموقع الرئيسي أيضاً
        saveCourseToMainSite(coursesData);
    }

    function loadCourses() {
        const coursesContainer = document.getElementById('courses-container');
        if (!coursesContainer) return;

        const savedCoursesJSON = localStorage.getItem('dashboardCourses');
        if (savedCoursesJSON) {
            const savedCourses = JSON.parse(savedCoursesJSON);

            // مسح الحاوية أولاً
            coursesContainer.innerHTML = '';

            // إضافة الكورسات المحفوظة
            savedCourses.forEach(courseData => {
                addCourseToList(courseData, false); // false لتجنب الحفظ المتكرر
            });
        }
    }

    // Add the saveLessons function to save lessons data to localStorage and the main site
    function saveLessons() {
        const lessonsData = [];
        const lessonCards = document.querySelectorAll('#lessons-container .item-card');

        lessonCards.forEach(card => {
            const title = card.querySelector('.item-title').textContent;
            const description = card.querySelector('.item-description').textContent;
            const courseInfo = card.querySelector('.item-category').textContent;
            const courseName = courseInfo.replace('الكورس: ', '');
            const hasVideo = card.querySelector('.item-video') !== null;

            lessonsData.push({
                title,
                content: description,
                courseName,
                videoUrl: hasVideo ? 'https://example.com/video' : ''
            });
        });

        localStorage.setItem('dashboardLessons', JSON.stringify(lessonsData));

        // Save lessons to the main site as well
        saveLessonsToMainSite(lessonsData);
    }

    // Add the loadLessons function to load lessons data from localStorage
    function loadLessons() {
        const lessonsContainer = document.getElementById('lessons-container');
        if (!lessonsContainer) return;

        const savedLessonsJSON = localStorage.getItem('dashboardLessons');
        if (savedLessonsJSON) {
            const savedLessons = JSON.parse(savedLessonsJSON);

            // Clear the container first
            lessonsContainer.innerHTML = '';

            // Add the saved lessons
            savedLessons.forEach(lessonData => {
                addLessonToList(lessonData, false); // false to avoid repeated saving
            });
        }
    }

    // دالة لإضافة معالجات الأحداث لأزرار الكورسات
    function attachCourseButtonHandlers() {
        const courseCards = document.querySelectorAll('#courses-container .item-card');
        courseCards.forEach(card => {
            const editBtn = card.querySelector('.edit-btn');
            const deleteBtn = card.querySelector('.delete-btn');
            const title = card.querySelector('.item-title').textContent;

            if (editBtn) {
                // إزالة معالجات الأحداث القديمة
                const newEditBtn = editBtn.cloneNode(true);
                editBtn.parentNode.replaceChild(newEditBtn, editBtn);

                newEditBtn.addEventListener('click', function() {
                    alert('تعديل الكورس: ' + title);
                });
            }

            if (deleteBtn) {
                // إزالة معالجات الأحداث القديمة
                const newDeleteBtn = deleteBtn.cloneNode(true);
                deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

                newDeleteBtn.addEventListener('click', function() {
                    if (confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
                        card.remove();
                        addActivity(`تم حذف الكورس: ${title}`);
                        updateStats();
                        saveCourses();
                    }
                });
            }
        });
    }

    // دالة لإضافة معالجات الأحداث لأزرار الدروس
    function attachLessonButtonHandlers() {
        const lessonCards = document.querySelectorAll('#lessons-container .item-card');
        lessonCards.forEach(card => {
            const editBtn = card.querySelector('.edit-btn');
            const deleteBtn = card.querySelector('.delete-btn');
            const title = card.querySelector('.item-title').textContent;

            if (editBtn) {
                // إزالة معالجات الأحداث القديمة
                const newEditBtn = editBtn.cloneNode(true);
                editBtn.parentNode.replaceChild(newEditBtn, editBtn);

                newEditBtn.addEventListener('click', function() {
                    alert('تعديل الدرس: ' + title);
                });
            }

            if (deleteBtn) {
                // إزالة معالجات الأحداث القديمة
                const newDeleteBtn = deleteBtn.cloneNode(true);
                deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

                newDeleteBtn.addEventListener('click', function() {
                    if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
                        card.remove();
                        addActivity(`تم حذف الدرس: ${title}`);
                        updateStats();
                        saveLessons();
                    }
                });
            }
        });
    }

    // دالة لحفظ الكورسات في الموقع الرئيسي
    function saveCourseToMainSite(coursesData) {
        // هنا يمكنك إضافة كود لحفظ الكورسات في الموقع الرئيسي
        // مثلاً: إضافة الكورسات إلى صفحة الكورسات في الموقع

        // حفظ البيانات في localStorage للموقع الرئيسي
        localStorage.setItem('mainSiteCourses', JSON.stringify(coursesData));

        // إذا كنا في نفس الصفحة، قم بتحديث العرض مباشرة
        const mainCoursesContainer = document.querySelector('.sections-grid');
        if (mainCoursesContainer) {
            // تحديث محتوى الكورسات في الموقع الرئيسي
            updateMainSiteCourses(coursesData, mainCoursesContainer);
        }

        // إضافة إشعار بنجاح العملية
        addActivity(`تم تحديث الكورسات في الموقع الرئيسي`);
    }

    // دالة جديدة لتحديث عرض الكورسات في الموقع الرئيسي
    function updateMainSiteCourses(coursesData, container) {
        // نحتفظ بالكورسات الأساسية الموجودة مسبقاً
        const existingCards = Array.from(container.querySelectorAll('.section-card'));
        const basicCourses = existingCards.slice(0, 6); // الكورسات الأساسية الستة

        // نمسح المحتوى الحالي
        container.innerHTML = '';

        // نعيد إضافة الكورسات الأساسية أولاً
        basicCourses.forEach(card => {
            container.appendChild(card);
        });

        // نضيف الكورسات الجديدة
        coursesData.forEach(course => {
            // نتحقق أولاً إذا كان الكورس موجود بالفعل في الكورسات الأساسية
            const courseExists = basicCourses.some(card =>
                card.querySelector('h3') &&
                card.querySelector('h3').textContent === course.title
            );

            // إذا لم يكن موجوداً، نضيفه
            if (!courseExists) {
                const courseElement = document.createElement('div');
                courseElement.className = 'section-card';

                // إنشاء رابط للكورس
                const courseLink = document.createElement('a');
                courseLink.href = `${course.title.toLowerCase().replace(/\s+/g, '')}course.html`;

                // إضافة صورة إذا كانت متوفرة
                if (course.image) {
                    const img = document.createElement('img');
                    img.src = course.image;
                    img.alt = course.title;
                    img.setAttribute('loading', 'lazy');
                    courseLink.appendChild(img);
                }

                courseElement.appendChild(courseLink);

                // إضافة عنوان الكورس
                const title = document.createElement('h3');
                title.textContent = course.title;
                courseElement.appendChild(title);

                container.appendChild(courseElement);
            }
        });
    }

    // Add the saveLessonsToMainSite function to update lessons on the main site
    function saveLessonsToMainSite(lessonsData) {
        // حفظ الدروس في localStorage للموقع الرئيسي
        localStorage.setItem('mainSiteLessons', JSON.stringify(lessonsData));

        // إذا كنا في صفحة الدروس، قم بتحديث العرض مباشرة
        const mainLessonsContainer = document.querySelector('.sections-grid');
        if (mainLessonsContainer) {
            updateMainSiteLessons(lessonsData, mainLessonsContainer);
        }

        addActivity(`تم تحديث الدروس في الموقع الرئيسي`);
    }

    // Add the updateMainSiteLessons function to update the lessons display on the main site
    function updateMainSiteLessons(lessonsData, container) {
        // نحتفظ بالدروس الأساسية الموجودة مسبقاً
        const existingCards = Array.from(container.querySelectorAll('.section-card'));
        const basicLessons = existingCards.slice(0, 16); // الدروس الأساسية الستة عشر

        // نمسح المحتوى الحالي
        container.innerHTML = '';

        // نعيد إضافة الدروس الأساسية أولاً
        basicLessons.forEach(card => {
            container.appendChild(card);
        });

        // نضيف الدروس الجديدة
        lessonsData.forEach(lesson => {
            // نتحقق أولاً إذا كان الدرس موجود بالفعل في الدروس الأساسية
            const lessonExists = basicLessons.some(card =>
                card.querySelector('h3') &&
                card.querySelector('h3').textContent === lesson.title
            );

            // إذا لم يكن موجوداً، نضيفه
            if (!lessonExists) {
            const lessonElement = document.createElement('div');
                lessonElement.className = 'section-card';

                // إنشاء رابط للدرس
                const lessonLink = document.createElement('a');
                lessonLink.href = `${lesson.title.toLowerCase().replace(/\s+/g, '')}lesson.html`;

                // إضافة صورة إذا كانت متوفرة
                if (lesson.image) {
                    const img = document.createElement('img');
                    img.src = lesson.image;
                    img.alt = lesson.title;
                    img.setAttribute('loading', 'lazy');
                    lessonLink.appendChild(img);
                }

                lessonElement.appendChild(lessonLink);

                // إضافة عنوان الدرس
                const title = document.createElement('h3');
                title.textContent = lesson.title;
                lessonElement.appendChild(title);

                // إضافة معلومات الكورس
                if (lesson.courseName) {
                    const courseInfo = document.createElement('span');
                    courseInfo.className = 'course-name';
                    courseInfo.textContent = `الكورس: ${lesson.courseName}`;
                    lessonElement.appendChild(courseInfo);
                }

            container.appendChild(lessonElement);
            }
        });
    }

    // إدارة نماذج الكورسات
    const addCourseBtn = document.getElementById('add-course-btn');
    const courseFormContainer = document.getElementById('course-form-container');
    const cancelCourseBtn = document.getElementById('cancel-course-btn');
    const courseForm = document.getElementById('course-form');
    const courseImageInput = document.getElementById('course-image');
    const courseImagePreview = document.getElementById('course-image-preview');

    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', function() {
            courseFormContainer.style.display = 'block';
            courseForm.reset();
            courseImagePreview.innerHTML = '';
        });
    }

    if (cancelCourseBtn) {
        cancelCourseBtn.addEventListener('click', function() {
            courseFormContainer.style.display = 'none';
        });
    }

    if (courseImageInput) {
        courseImageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    courseImagePreview.innerHTML = `<img src="${e.target.result}" alt="معاينة الصورة">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (courseForm) {
        courseForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // جمع بيانات الكورس
            const courseData = {
                title: document.getElementById('course-title').value,
                description: document.getElementById('course-description').value,
                category: document.getElementById('course-category').value,
                level: document.getElementById('course-level').value,
                image: courseImageInput.files[0] ? URL.createObjectURL(courseImageInput.files[0]) : null
            };

            // إضافة الكورس إلى القائمة
            addCourseToList(courseData, true);

            // إخفاء النموذج
            courseFormContainer.style.display = 'none';

            // إضافة نشاط جديد
            addActivity(`تمت إضافة كورس جديد: ${courseData.title}`);

            // تحديث الإحصائيات
            updateStats();
        });
    }

    // إدارة نماذج الدروس
    const addLessonBtn = document.getElementById('add-lesson-btn');
    const lessonFormContainer = document.getElementById('lesson-form-container');
    const cancelLessonBtn = document.getElementById('cancel-lesson-btn');
    const lessonForm = document.getElementById('lesson-form');

    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', function() {
            lessonFormContainer.style.display = 'block';
            lessonForm.reset();

            // تحميل قائمة الكورسات في القائمة المنسدلة
            const lessonCourseSelect = document.getElementById('lesson-course');
            lessonCourseSelect.innerHTML = '';

            // استخدام الكورسات المحفوظة في localStorage
            const savedCoursesJSON = localStorage.getItem('dashboardCourses');
            let courses = [];

            if (savedCoursesJSON) {
                courses = JSON.parse(savedCoursesJSON);
            } else {
                // استخدام بيانات افتراضية إذا لم تكن هناك كورسات محفوظة
                courses = [
                    { title: 'مقدمة في البرمجة' },
                    { title: 'تطوير الويب المتقدم' }
                ];
            }

            courses.forEach((course, index) => {
                const option = document.createElement('option');
                option.value = index + 1;
                option.textContent = course.title;
                lessonCourseSelect.appendChild(option);
            });
        });
    }

    if (cancelLessonBtn) {
        cancelLessonBtn.addEventListener('click', function() {
            lessonFormContainer.style.display = 'none';
        });
    }

    if (lessonForm) {
        lessonForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // جمع بيانات الدرس
            const lessonData = {
                title: document.getElementById('lesson-title').value,
                courseId: document.getElementById('lesson-course').value,
                courseName: document.getElementById('lesson-course').options[document.getElementById('lesson-course').selectedIndex].text,
                content: document.getElementById('lesson-content').value,
                videoUrl: document.getElementById('lesson-video').value
            };

            // إضافة الدرس إلى القائمة
            addLessonToList(lessonData, true);

            // إخفاء النموذج
            lessonFormContainer.style.display = 'none';

            // إضافة نشاط جديد
            addActivity(`تمت إضافة درس جديد: ${lessonData.title}`);

            // تحديث الإحصائيات
            updateStats();
        });
    }

    // دالة لإضافة كورس إلى القائمة
    function addCourseToList(courseData, saveAfterAdd = true) {
        const coursesContainer = document.getElementById('courses-container');
        if (!coursesContainer) return;

        const courseCard = document.createElement('div');
        courseCard.className = 'item-card';

        courseCard.innerHTML = `
            ${courseData.image ? `<img src="${courseData.image}" alt="${courseData.title}" class="item-image">` : ''}
            <div class="item-content">
                <h3 class="item-title">${courseData.title}</h3>
                <p class="item-description">${courseData.description}</p>
                <div class="item-meta">
                    <span class="item-category">${courseData.category}</span>
                    <span class="item-level">${courseData.level}</span>
                </div>
                <div class="item-actions">
                    <button class="edit-btn">تعديل</button>
                    <button class="delete-btn">حذف</button>
                </div>
            </div>
        `;

        // إضافة معالجات الأحداث للأزرار
        const editBtn = courseCard.querySelector('.edit-btn');
        const deleteBtn = courseCard.querySelector('.delete-btn');

        editBtn.addEventListener('click', function() {
            // تنفيذ عملية التعديل
            alert('تعديل الكورس: ' + courseData.title);
        });

        deleteBtn.addEventListener('click', function() {
            // تنفيذ عملية الحذف
            if (confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
                courseCard.remove();
                addActivity(`تم حذف الكورس: ${courseData.title}`);
                updateStats();
                if (saveAfterAdd) saveCourses();
            }
        });

        // إضافة البطاقة إلى الحاوية
        coursesContainer.appendChild(courseCard);

        // حفظ التغييرات إذا كان مطلوباً
        if (saveAfterAdd) saveCourses();
    }

    // دالة لإضافة درس إلى القائمة
    function addLessonToList(lessonData, saveAfterAdd = true) {
        const lessonsContainer = document.getElementById('lessons-container');
        if (!lessonsContainer) return;

        const lessonCard = document.createElement('div');
        lessonCard.className = 'item-card';

        lessonCard.innerHTML = `
            <div class="item-content">
                <h3 class="item-title">${lessonData.title}</h3>
                <p class="item-description">${lessonData.content.substring(0, 150)}${lessonData.content.length > 150 ? '...' : ''}</p>
                <div class="item-meta">
                    <span class="item-category">الكورس: ${lessonData.courseName}</span>
                    ${lessonData.videoUrl ? `<span class="item-video">يحتوي على فيديو</span>` : ''}
                </div>
                <div class="item-actions">
                    <button class="edit-btn">تعديل</button>
                    <button class="delete-btn">حذف</button>
                </div>
            </div>
        `;

        // إضافة معالجات الأحداث للأزرار
        const editBtn = lessonCard.querySelector('.edit-btn');
        const deleteBtn = lessonCard.querySelector('.delete-btn');

        editBtn.addEventListener('click', function () {
            alert('تعديل الدرس: ' + lessonData.title);
        });

        deleteBtn.addEventListener('click', function () {
            if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
                lessonCard.remove();
                addActivity(`تم حذف الدرس: ${lessonData.title}`);
                updateStats();
                if (saveAfterAdd) {
                    saveLessons();
                    saveLessonsToMainSite(JSON.parse(localStorage.getItem('dashboardLessons')));
                }
            }
        });

        // إضافة البطاقة إلى الحاوية
        lessonsContainer.appendChild(lessonCard);

        // حفظ التغييرات إذا كان مطلوباً
        if (saveAfterAdd) {
            saveLessons();
            saveLessonsToMainSite(JSON.parse(localStorage.getItem('dashboardLessons')));
        }
    }

    // إضافة أنشطة افتراضية إذا لم تكن هناك أنشطة محفوظة
    function addDefaultActivities() {
        const activities = loadActivitiesNew();

        if (!activities || activities.length === 0) {
            // إضافة أنشطة افتراضية تتعلق بموقع تعليمي عربي
            addActivity("تم إضافة درس جديد: مقدمة في HTML", "course");
            addActivity("تم إنشاء خريطة تعلم: تطوير الويب", "roadmap");
            addActivity("تم إضافة كورس: أساسيات البرمجة بلغة جافا سكريبت", "course");
            addActivity("تحديث محتوى درس: CSS المتقدم", "lesson");
            addActivity("تمت إضافة مشروع جديد: تصميم موقع تعليمي", "project");
            addActivity("تم إضافة لعبة تعليمية: تحدي البرمجة", "game");
        }
    }

    // تحديث دالة إضافة النشاط
    function addActivity(text, type = "generic") {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;

        const currentTime = new Date();
        const formattedTime = formatTime(currentTime);

        // الحصول على الرمز المناسب بناءً على نوع النشاط
        let icon = "fa-info-circle";
        let iconColor = "#3498db"; // اللون الأزرق الافتراضي

        switch (type) {
            case "course":
                icon = "fa-graduation-cap";
                iconColor = "#3498db"; // أزرق
                break;
            case "lesson":
                icon = "fa-book";
                iconColor = "#2ecc71"; // أخضر
                break;
            case "game":
                icon = "fa-gamepad";
                iconColor = "#e74c3c"; // أحمر
                break;
            case "roadmap":
                icon = "fa-map";
                iconColor = "#f39c12"; // برتقالي
                break;
            case "project":
                icon = "fa-project-diagram";
                iconColor = "#9b59b6"; // بنفسجي
                break;
            case "book":
                icon = "fa-book-open";
                iconColor = "#1abc9c"; // أزرق مخضر
                break;
            default:
                icon = "fa-info-circle";
                iconColor = "#3498db"; // أزرق
        }

        const activityItem = document.createElement('li');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-content">
                <div class="activity-time">
                    <i class="fas ${icon}" style="color: ${iconColor};"></i>
                    <strong>${formattedTime}</strong>
                </div>
                <p>${text}</p>
            </div>
        `;

        // إضافة النشاط في بداية القائمة
        activityList.insertBefore(activityItem, activityList.firstChild);

        // حفظ الأنشطة في التخزين المحلي
        saveActivitiesNew();
    }

    // دالة لتنسيق الوقت
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'م' : 'ص';
        hours = hours % 12;
        hours = hours ? hours : 12; // الساعة 0 يجب أن تكون 12
        return `${hours}:${minutes} ${ampm}`;
    }

    // تحديث دالة تحميل الأنشطة
    function loadActivitiesNew() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return [];

        const savedActivitiesJSON = localStorage.getItem('dashboardActivities');
        if (savedActivitiesJSON) {
            try {
                const savedActivities = JSON.parse(savedActivitiesJSON);

                // مسح القائمة أولاً
                activityList.innerHTML = '';

                // إضافة الأنشطة المحفوظة بترتيب عكسي (الأحدث أولاً)
                savedActivities.forEach(activity => {
                    const activityItem = document.createElement('li');
                    activityItem.className = 'activity-item';
                    activityItem.innerHTML = activity.html;
                    activityList.appendChild(activityItem);
                });

                return savedActivities;
            } catch (error) {
                console.error('خطأ في تحميل الأنشطة:', error);
                return [];
            }
        }
        return [];
    }

    // تحديث الإحصائيات
    function updateStats() {
        const coursesCount = document.getElementById('courses-container') ? document.getElementById('courses-container').children.length : 0;
        const lessonsCount = document.getElementById('lessons-container') ? document.getElementById('lessons-container').children.length : 0;
        const gamesCount = document.getElementById('games-container') ? document.getElementById('games-container').children.length : 0;
        const roadmapsCount = document.getElementById('roadmaps-container') ? document.getElementById('roadmaps-container').children.length : 0;
        const projectsCount = document.getElementById('projects-container') ? document.getElementById('projects-container').children.length : 0;

        // تحديث أرقام الإحصائيات
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 4) {
            statNumbers[0].textContent = coursesCount;
            statNumbers[1].textContent = lessonsCount;
            statNumbers[2].textContent = gamesCount;
            statNumbers[3].textContent = roadmapsCount;
        }

        // حفظ الإحصائيات في localStorage
        localStorage.setItem('dashboardStats', JSON.stringify({
            coursesCount,
            lessonsCount,
            gamesCount,
            roadmapsCount,
            projectsCount
        }));
    }

    // تحميل الإحصائيات
    function loadStats() {
        const savedStatsJSON = localStorage.getItem('dashboardStats');
        if (savedStatsJSON) {
            const savedStats = JSON.parse(savedStatsJSON);

            // تحديث أرقام الإحصائيات
            const statNumbers = document.querySelectorAll('.stat-number');
            if (statNumbers.length >= 4) {
                statNumbers[0].textContent = savedStats.coursesCount;
                statNumbers[1].textContent = savedStats.lessonsCount;
                statNumbers[2].textContent = savedStats.gamesCount;
                statNumbers[3].textContent = savedStats.roadmapsCount;
            }
        }
    }

    // تحسين دالة إعداد تبويبات الإعدادات
    function setupSettingsTabs() {
        console.log('تهيئة تبويبات الإعدادات');
        const tabs = document.querySelectorAll('.settings-tab');
        const tabContents = document.querySelectorAll('.settings-tab-content');

        if (tabs.length === 0 || tabContents.length === 0) {
            console.log('لم يتم العثور على تبويبات');
            return; // لا توجد تبويبات للإعداد
        }

        // التأكد من تنشيط التبويب الأول افتراضيًا إذا لم يكن هناك تبويب نشط
        let hasActiveTab = false;
        tabs.forEach(tab => {
            if (tab.classList.contains('active')) {
                hasActiveTab = true;
            }
        });

        if (!hasActiveTab && tabs.length > 0) {
            tabs[0].classList.add('active');
            const firstTabId = tabs[0].getAttribute('data-tab');
            const firstTabContent = document.getElementById(firstTabId);
            if (firstTabContent) {
                firstTabContent.classList.add('active');
            }
        }

        // إضافة معالج النقر لكل تبويب
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // إزالة الفئة النشطة من جميع التبويبات
                tabs.forEach(t => t.classList.remove('active'));

                // إضافة الفئة النشطة للتبويب الحالي
                tab.classList.add('active');

                // إخفاء جميع محتويات التبويبات
                tabContents.forEach(content => content.classList.remove('active'));

                // إظهار محتوى التبويب المحدد
                const targetId = tab.getAttribute('data-tab');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    console.log('تم تنشيط التبويب: ' + targetId);
                } else {
                    console.log('لم يتم العثور على محتوى التبويب: ' + targetId);
                }
            });
        });

        console.log('تم تهيئة التبويبات بنجاح');
    }

    // تعديل دالة تحميل الإعدادات
    function loadSettings() {
        console.log('تحميل إعدادات المستخدم');
        const savedSettings = localStorage.getItem('dashboardSettings');

        // الإعدادات الافتراضية
        const defaultSettings = {
            admin: {
                name: '',
                email: ''
            },
            site: {
                title: 'بساطة - عالم الكود العربي',
                description: 'موقع تعليمي يهدف إلى تقديم محتوى برمجي عالي الجودة بطريقة مبسطة ومفهومة'
            },
            privacy: {
                allowRegistration: true,
                showActivity: true
            }
        };

        // دمج الإعدادات المحفوظة مع الإعدادات الافتراضية
        let settings = defaultSettings;

        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                settings = {
                    admin: { ...defaultSettings.admin, ...parsedSettings.admin },
                    site: { ...defaultSettings.site, ...parsedSettings.site },
                    privacy: { ...defaultSettings.privacy, ...parsedSettings.privacy }
                };
            } catch (error) {
                console.error('خطأ في تحليل الإعدادات:', error);
            }
        }

        // تعبئة حقول إعدادات الحساب
        const adminNameInput = document.getElementById('admin-name');
        const adminEmailInput = document.getElementById('admin-email');
        const adminPasswordInput = document.getElementById('admin-password');
        const adminPasswordConfirmInput = document.getElementById('admin-password-confirm');

        if (adminNameInput) adminNameInput.value = settings.admin.name || '';
        if (adminEmailInput) adminEmailInput.value = settings.admin.email || '';
        if (adminPasswordInput) adminPasswordInput.value = '';
        if (adminPasswordConfirmInput) adminPasswordConfirmInput.value = '';

        // تعبئة حقول إعدادات الموقع
        const siteTitleInput = document.getElementById('site-title');
        const siteDescriptionInput = document.getElementById('site-description');

        if (siteTitleInput) siteTitleInput.value = settings.site.title || defaultSettings.site.title;
        if (siteDescriptionInput) siteDescriptionInput.value = settings.site.description || defaultSettings.site.description;

        // تعبئة حقول إعدادات الخصوصية
        const allowRegistrationCheckbox = document.getElementById('allow-registration');
        const showActivityCheckbox = document.getElementById('show-activity');

        if (allowRegistrationCheckbox) allowRegistrationCheckbox.checked = settings.privacy.allowRegistration !== false;
        if (showActivityCheckbox) showActivityCheckbox.checked = settings.privacy.showActivity !== false;

        console.log('تم تحميل الإعدادات بنجاح');
    }

    // دالة لحفظ الإعدادات
    function saveAllSettings(formId) {
        console.log('حفظ الإعدادات من النموذج: ' + formId);
        // جمع جميع حقول الإدخال من كافة النماذج
        const adminName = document.getElementById('admin-name')?.value || '';
        const adminEmail = document.getElementById('admin-email')?.value || '';
        const adminPassword = document.getElementById('admin-password')?.value || '';
        const adminPasswordConfirm = document.getElementById('admin-password-confirm')?.value || '';
        const siteTitle = document.getElementById('site-title')?.value || '';
        const siteDescription = document.getElementById('site-description')?.value || '';
        const allowRegistration = document.getElementById('allow-registration')?.checked || false;
        const showActivity = document.getElementById('show-activity')?.checked || false;

        // التحقق من صحة البريد الإلكتروني إذا تم إدخاله
        if (adminEmail && !validateEmail(adminEmail)) {
            showSettingsError('يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }

        // التحقق من تطابق كلمات المرور إذا تم تغييرها
        if (adminPassword && adminPassword !== adminPasswordConfirm) {
            showSettingsError('كلمات المرور غير متطابقة');
            return false;
        }

        // إحضار الإعدادات الحالية
        let currentSettings = {};
        const savedSettingsJSON = localStorage.getItem('dashboardSettings');

        if (savedSettingsJSON) {
            try {
                currentSettings = JSON.parse(savedSettingsJSON);
            } catch (error) {
                console.error('خطأ في تحليل الإعدادات المحفوظة:', error);
                currentSettings = {};
            }
        }

        // تحديث الإعدادات بالقيم الجديدة
        const updatedSettings = {
            ...currentSettings,
            admin: {
                ...currentSettings.admin,
                name: adminName,
                email: adminEmail
            },
            site: {
                ...currentSettings.site,
                title: siteTitle,
                description: siteDescription
            },
            privacy: {
                ...currentSettings.privacy,
                allowRegistration: allowRegistration,
                showActivity: showActivity
            },
            updatedAt: new Date().toISOString()
        };

        // إذا تم تغيير كلمة المرور، قم بتحديثها
        if (adminPassword) {
            updatedSettings.admin.password = adminPassword;
        }

        // حفظ الإعدادات في التخزين المحلي
        localStorage.setItem('dashboardSettings', JSON.stringify(updatedSettings));

        // تحديث عنوان الصفحة إذا تم تغييره
        if (document.title !== siteTitle + ' - لوحة التحكم') {
            document.title = siteTitle + ' - لوحة التحكم';
        }

        showSettingsSuccess('تم حفظ الإعدادات بنجاح');
        addActivity('تم تحديث إعدادات الموقع', 'settings');
        console.log('تم حفظ الإعدادات بنجاح');
        return true;
    }

    // إعداد نماذج الإعدادات المختلفة
    function setupSettingsForms() {
        console.log('إعداد نماذج الإعدادات');
        const accountSettingsForm = document.getElementById('account-settings-form');
        const siteSettingsForm = document.getElementById('site-settings-form');
        const privacySettingsForm = document.getElementById('privacy-settings-form');

        // تحميل الإعدادات الحالية
        loadSettings();

        // إعداد نموذج إعدادات الحساب
        if (accountSettingsForm) {
            accountSettingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveAllSettings('account-settings-form');
            });
        }

        // إعداد نموذج إعدادات الموقع
        if (siteSettingsForm) {
            siteSettingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveAllSettings('site-settings-form');
            });
        }

        // إعداد نموذج إعدادات الخصوصية
        if (privacySettingsForm) {
            privacySettingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveAllSettings('privacy-settings-form');
            });
        }
    }

    // التأكد من تهيئة صفحة الإعدادات عند فتحها
    function initializeSettingsPage() {
        // التحقق مما إذا كانت صفحة الإعدادات مفتوحة
        const settingsSection = document.getElementById('settings');
        if (settingsSection && settingsSection.classList.contains('active')) {
            console.log('صفحة الإعدادات مفتوحة، جاري التهيئة...');
            setupSettingsTabs();
            setupSettingsForms();
        }
    }

    // استدعاء دالة تهيئة صفحة الإعدادات عند تحميل الصفحة
    initializeSettingsPage();

    // إضافة معالج خاص للتبديل إلى قسم الإعدادات
    document.querySelectorAll('.dashboard-sidebar a[data-section="settings"]').forEach(link => {
        link.addEventListener('click', function() {
            // تأخير التنفيذ للتأكد من أن القسم أصبح مرئيًا
            setTimeout(initializeSettingsPage, 100);
        });
    });

    // إعداد الإجراءات السريعة
    setupQuickActions();

    // ... existing code ...
});

// إعداد الإجراءات السريعة
function setupQuickActions() {
    console.log('تهيئة الإجراءات السريعة');
    const actionButtons = document.querySelectorAll('.action-btn');

    if (actionButtons.length === 0) {
        console.log('لم يتم العثور على أزرار الإجراءات السريعة');
        return;
    }

    console.log(`تم العثور على ${actionButtons.length} أزرار للإجراءات السريعة`);

    // إزالة معالجات الأحداث القديمة لتجنب التكرار
    actionButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });

    // إعادة تحديد الأزرار بعد الاستبدال
    const refreshedButtons = document.querySelectorAll('.action-btn');

    refreshedButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            console.log(`تم النقر على زر الإجراء السريع: ${action}`);

            switch(action) {
                case 'add-course':
                    const addCourseBtn = document.getElementById('add-course-btn');
                    if (addCourseBtn) {
                        addCourseBtn.click();
                        console.log('تم تنفيذ إجراء: إضافة كورس جديد');
                    } else {
                        console.error('لم يتم العثور على زر إضافة كورس');
                    }
                    break;

                case 'add-lesson':
                    const addLessonBtn = document.getElementById('add-lesson-btn');
                    if (addLessonBtn) {
                        addLessonBtn.click();
                        console.log('تم تنفيذ إجراء: إضافة درس جديد');
                    } else {
                        console.error('لم يتم العثور على زر إضافة درس');
                    }
                    break;

                case 'add-game':
                    const addGameBtn = document.getElementById('add-game-btn');
                    if (addGameBtn) {
                        addGameBtn.click();
                        console.log('تم تنفيذ إجراء: إضافة لعبة جديدة');
                    } else {
                        console.error('لم يتم العثور على زر إضافة لعبة');
                    }
                    break;

                case 'add-roadmap':
                    const addRoadmapBtn = document.getElementById('add-roadmap-btn');
                    if (addRoadmapBtn) {
                        addRoadmapBtn.click();
                        console.log('تم تنفيذ إجراء: إضافة خريطة جديدة');
                    } else {
                        console.error('لم يتم العثور على زر إضافة خريطة');
                    }
                    break;

                default:
                    console.log(`إجراء غير معروف: ${action}`);
            }
        });
    });

    console.log('تم تهيئة الإجراءات السريعة بنجاح');
}

// دوال حفظ وتحميل الألعاب
function saveGames() {
    const gamesContainer = document.getElementById('games-container');
    if (!gamesContainer) return;

    const gameCard = document.createElement('div');
    gameCard.className = 'item-card';

    gameCard.innerHTML = `
        <div class="item-content">
            <h3 class="item-title">${gameData.title}</h3>
            <p class="item-description">${gameData.description}</p>
            <div class="item-meta">
                <span class="item-category">التصنيف: ${gameData.category}</span>
                <span class="item-level">المستوى: ${gameData.level}</span>
            </div>
            <div class="item-actions">
                <button class="edit-btn">تعديل</button>
                <button class="delete-btn">حذف</button>
            </div>
        </div>
    `;

    // إضافة معالجات الأحداث للأزرار
    const editBtn = gameCard.querySelector('.edit-btn');
    const deleteBtn = gameCard.querySelector('.delete-btn');

    editBtn.addEventListener('click', function () {
        alert('تعديل اللعبة: ' + gameData.title);
    });

    deleteBtn.addEventListener('click', function () {
        if (confirm('هل أنت متأكد من حذف هذه اللعبة؟')) {
            gameCard.remove();
            addActivity(`تم حذف اللعبة: ${gameData.title}`);
            updateStats();
            if (saveAfterAdd) {
                saveGames();
                saveGamesToMainSite(JSON.parse(localStorage.getItem('dashboardGames')));
            }
        }
    });

    // إضافة البطاقة إلى الحاوية
    gamesContainer.appendChild(gameCard);

    // حفظ التغييرات إذا كان مطلوباً
    if (saveAfterAdd) {
        saveGames();
        saveGamesToMainSite(JSON.parse(localStorage.getItem('dashboardGames')));
    }
}

// دالة لإضافة خريطة تعلم إلى القائمة
function addRoadmapToList(roadmapData, saveAfterAdd = true) {
    const roadmapsContainer = document.getElementById('roadmaps-container');
    if (!roadmapsContainer) return;

    const roadmapCard = document.createElement('div');
    roadmapCard.className = 'item-card';

    roadmapCard.innerHTML = `
        ${roadmapData.image ? `<img src="${roadmapData.image}" alt="${roadmapData.title}" class="item-image">` : ''}
        <div class="item-content">
            <h3 class="item-title">${roadmapData.title}</h3>
            <p class="item-description">${roadmapData.description}</p>
            <div class="item-meta">
                <span class="item-category">${roadmapData.category}</span>
                <span class="item-steps">${roadmapData.steps}</span>
            </div>
            <div class="item-actions">
                <button class="edit-btn">تعديل</button>
                <button class="delete-btn">حذف</button>
            </div>
        </div>
    `;

    // إضافة معالجات الأحداث للأزرار
    const editBtn = roadmapCard.querySelector('.edit-btn');
    const deleteBtn = roadmapCard.querySelector('.delete-btn');

    editBtn.addEventListener('click', function() {
        alert('تعديل خريطة التعلم: ' + roadmapData.title);
    });

    deleteBtn.addEventListener('click', function() {
        if (confirm('هل أنت متأكد من حذف هذه الخريطة؟')) {
            roadmapCard.remove();
            addActivity(`تم حذف خريطة التعلم: ${roadmapData.title}`);
            updateStats();
            if (saveAfterAdd) {
                saveRoadmaps();
            }
        }
    });

    // إضافة البطاقة إلى الحاوية
    roadmapsContainer.appendChild(roadmapCard);

    // حفظ التغييرات إذا كان مطلوباً
    if (saveAfterAdd) {
        saveRoadmaps();
    }
}

// إدارة نماذج الكتب
const addBookBtn = document.getElementById('add-book-btn');
const bookFormContainer = document.getElementById('book-form-container');
const cancelBookBtn = document.getElementById('cancel-book-btn');
const bookForm = document.getElementById('book-form');
const bookImageInput = document.getElementById('book-image');
const bookImagePreview = document.getElementById('book-image-preview');

if (addBookBtn) {
    addBookBtn.addEventListener('click', function() {
        bookFormContainer.style.display = 'block';
        bookForm.reset();
        bookImagePreview.innerHTML = '';
    });
}

if (cancelBookBtn) {
    cancelBookBtn.addEventListener('click', function() {
        bookFormContainer.style.display = 'none';
    });
}

if (bookImageInput) {
    bookImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                bookImagePreview.innerHTML = `<img src="${e.target.result}" alt="معاينة الصورة">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

if (bookForm) {
    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // جمع بيانات الكتاب
        const bookData = {
            title: document.getElementById('book-title').value,
            author: document.getElementById('book-author').value,
            description: document.getElementById('book-description').value,
            category: document.getElementById('book-category').value,
            level: document.getElementById('book-level').value,
            image: bookImageInput.files[0] ? URL.createObjectURL(bookImageInput.files[0]) : null,
            link: document.getElementById('book-link').value
        };

        // إضافة الكتاب إلى القائمة
        addBookToList(bookData, true);

        // إخفاء النموذج
        bookFormContainer.style.display = 'none';

        // إضافة نشاط جديد
        addActivity(`تمت إضافة كتاب جديد: ${bookData.title}`);

        // تحديث الإحصائيات
        updateStats();
    });
}

// دالة لإضافة كتاب إلى القائمة
function addBookToList(bookData, saveAfterAdd = true) {
    const booksContainer = document.getElementById('books-container');
    if (!booksContainer) return;

    const bookCard = document.createElement('div');
    bookCard.className = 'item-card';
    // حفظ رابط الكتاب كخاصية للبطاقة
    bookCard.dataset.link = bookData.link || '';

    bookCard.innerHTML = `
        ${bookData.image ? `<img src="${bookData.image}" alt="${bookData.title}" class="item-image">` : ''}
        <div class="item-content">
            <h3 class="item-title">${bookData.title}</h3>
            <p class="item-description">${bookData.description}</p>
            <div class="item-meta">
                <span class="item-author">المؤلف: ${bookData.author}</span>
                <span class="item-category">${bookData.category}</span>
                <span class="item-level">${bookData.level}</span>
                ${bookData.link ? `<span class="item-link">الرابط: <a href="${bookData.link}" target="_blank">${bookData.link}</a></span>` : ''}
            </div>
            <div class="item-actions">
                <button class="edit-btn">تعديل</button>
                <button class="delete-btn">حذف</button>
            </div>
        </div>
    `;

    // إضافة معالجات الأحداث للأزرار
    const editBtn = bookCard.querySelector('.edit-btn');
    const deleteBtn = bookCard.querySelector('.delete-btn');

    editBtn.addEventListener('click', function() {
        alert('تعديل الكتاب: ' + bookData.title);
    });

    deleteBtn.addEventListener('click', function() {
        if (confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
            bookCard.remove();
            addActivity(`تم حذف الكتاب: ${bookData.title}`);
            updateStats();
            if (saveAfterAdd) {
                saveBooks();
            }
        }
    });

    // إضافة البطاقة إلى الحاوية
    booksContainer.appendChild(bookCard);

    // حفظ التغييرات إذا كان مطلوباً
    if (saveAfterAdd) {
        saveBooks();
    }
}

// دالة لإضافة مشروع إلى القائمة
function addProjectToList(projectData, saveAfterAdd = true) {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    const projectCard = document.createElement('div');
    projectCard.className = 'item-card';

    projectCard.innerHTML = `
        ${projectData.image ? `<img src="${projectData.image}" alt="${projectData.title}" class="item-image">` : ''}
        <div class="item-content">
            <h3 class="item-title">${projectData.title}</h3>
            <p class="item-description">${projectData.description}</p>
            <div class="item-meta">
                <span class="item-category">${projectData.category}</span>
                <span class="item-level">${projectData.level}</span>
            </div>
            <div class="item-actions">
                <button class="edit-btn">تعديل</button>
                <button class="delete-btn">حذف</button>
            </div>
        </div>
    `;

    // إضافة معالجات الأحداث للأزرار
    const editBtn = projectCard.querySelector('.edit-btn');
    const deleteBtn = projectCard.querySelector('.delete-btn');

    editBtn.addEventListener('click', function() {
        alert('تعديل المشروع: ' + projectData.title);
    });

    deleteBtn.addEventListener('click', function() {
        if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
            projectCard.remove();
            addActivity(`تم حذف المشروع: ${projectData.title}`);
            updateStats();
            if (saveAfterAdd) {
                saveProjects();
                saveProjectsToMainSite(JSON.parse(localStorage.getItem('dashboardProjects')));
            }
        }
    });

    // إضافة البطاقة إلى الحاوية
    projectsContainer.appendChild(projectCard);

    // حفظ التغييرات إذا كان مطلوباً
    if (saveAfterAdd) {
        saveProjects();
        saveProjectsToMainSite(JSON.parse(localStorage.getItem('dashboardProjects')));
    }
}

// إدارة نماذج المشاريع
const addProjectBtn = document.getElementById('add-project-btn');
const projectFormContainer = document.getElementById('project-form-container');
const cancelProjectBtn = document.getElementById('cancel-project-btn');
const projectForm = document.getElementById('project-form');
const projectImageInput = document.getElementById('project-image');
const projectImagePreview = document.getElementById('project-image-preview');

if (addProjectBtn) {
    addProjectBtn.addEventListener('click', function() {
        projectFormContainer.style.display = 'block';
        projectForm.reset();
        projectImagePreview.innerHTML = '';
    });
}

if (cancelProjectBtn) {
    cancelProjectBtn.addEventListener('click', function() {
        projectFormContainer.style.display = 'none';
    });
}

if (projectImageInput) {
    projectImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                projectImagePreview.innerHTML = `<img src="${e.target.result}" alt="معاينة الصورة">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

if (projectForm) {
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // جمع بيانات المشروع
        const projectData = {
            title: document.getElementById('project-title').value,
            description: document.getElementById('project-description').value,
            category: document.getElementById('project-category').value,
            level: document.getElementById('project-level').value,
            link: document.getElementById('project-link').value,
            image: projectImagePreview.querySelector('img')?.src || ''
        };

        // إضافة المشروع إلى القائمة
        addProjectToList(projectData, true);

        // إخفاء النموذج
        projectFormContainer.style.display = 'none';

        // إضافة نشاط جديد
        addActivity(`تمت إضافة مشروع جديد: ${projectData.title}`);

        // تحديث الإحصائيات
        updateStats();
    });
}

// دالة لحفظ المشاريع
function saveProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    const projects = [];
    const projectCards = projectsContainer.querySelectorAll('.item-card');

    projectCards.forEach(card => {
        const project = {
            title: card.querySelector('.item-title').textContent,
            description: card.querySelector('.item-description').textContent,
            category: card.querySelector('.item-category').textContent,
            level: card.querySelector('.item-level').textContent,
            image: card.querySelector('.item-image')?.src || ''
        };
        projects.push(project);
    });

    localStorage.setItem('dashboardProjects', JSON.stringify(projects));
}

// دالة لتحميل المشاريع
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('dashboardProjects') || '[]');
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    projectsContainer.innerHTML = '';
    projects.forEach(project => addProjectToList(project, false));

    // إضافة معالجات الأحداث للأزرار بعد تحميل المشاريع
    attachProjectButtonHandlers();
}

// إعداد الرسوم البيانية
function setupCharts() {
    console.log('تهيئة الرسوم البيانية');
    const contentStatsCtx = document.getElementById('contentStatsChart');
    const userActivityCtx = document.getElementById('userActivityChart');

    // إنشاء متغيرات عامة للرسوم البيانية
    let contentStatsChart;
    let userActivityChart;

    // الحصول على البيانات الفعلية من الإحصائيات
    const stats = JSON.parse(localStorage.getItem('dashboardStats') || '{}');
    const coursesCount = stats.coursesCount || 0;
    const lessonsCount = stats.lessonsCount || 0;
    const gamesCount = stats.gamesCount || 0;
    const roadmapsCount = stats.roadmapsCount || 0;
    const booksCount = stats.booksCount || 0;
    const projectsCount = stats.projectsCount || 0;

    console.log('تم تحميل الإحصائيات للرسوم البيانية');

    if (contentStatsCtx) {
        contentStatsChart = new Chart(contentStatsCtx, {
            type: 'doughnut',
            data: {
                labels: ['الكورسات', 'الدروس', 'الألعاب', 'خرائط التعلم', 'الكتب', 'المشاريع'],
                datasets: [{
                    data: [coursesCount, lessonsCount, gamesCount, roadmapsCount, booksCount, projectsCount],
                    backgroundColor: [
                        '#3498db', // أزرق
                        '#2980b9', // أزرق داكن
                        '#2ecc71', // أخضر
                        '#27ae60', // أخضر داكن
                        '#e74c3c', // أحمر
                        '#c0392b'  // أحمر داكن
                    ],
                    borderColor: [
                        '#ffffff',
                        '#ffffff',
                        '#ffffff',
                        '#ffffff',
                        '#ffffff',
                        '#ffffff'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        rtl: true,
                        labels: {
                            font: {
                                family: 'Cairo, sans-serif'
                            }
                        }
                    }
                }
            }
        });
    }

    if (userActivityCtx) {
        userActivityChart = new Chart(userActivityCtx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'زيارات الموقع',
                    data: [650, 850, 1200, 1100, 1500, 1800],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: '#3498db',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'تسجيلات جديدة',
                    data: [120, 210, 380, 400, 450, 520],
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: '#2ecc71',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        rtl: true,
                        labels: {
                            font: {
                                family: 'Cairo, sans-serif'
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Cairo, sans-serif'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Cairo, sans-serif'
                            }
                        }
                    }
                }
            }
        });
    }

    // إرجاع الرسوم البيانية للاستخدام في أماكن أخرى
    return {
        contentStatsChart,
        userActivityChart
    };
}

// إعداد الإجراءات السريعة
function setupQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            switch(action) {
                case 'add-course':
                    document.getElementById('add-course-btn').click();
                    break;
                case 'add-lesson':
                    document.getElementById('add-lesson-btn').click();
                    break;
                case 'add-game':
                    document.getElementById('add-game-btn').click();
                    break;
                case 'add-roadmap':
                    document.getElementById('add-roadmap-btn').click();
                    break;
            }
        });
    });
}

// تحديث الإحصائيات مع الاتجاهات
function updateStatsWithTrends() {
    const stats = {
        courses: {
            count: document.getElementById('courses-container')?.children.length || 0,
            trend: '+5%'
        },
        lessons: {
            count: document.getElementById('lessons-container')?.children.length || 0,
            trend: '+12%'
        },
        games: {
            count: document.getElementById('games-container')?.children.length || 0,
            trend: '+8%'
        },
        roadmaps: {
            count: document.getElementById('roadmaps-container')?.children.length || 0,
            trend: '+15%'
        }
    };

    // تحديث الأرقام والاتجاهات
    const statNumbers = document.querySelectorAll('.stat-number');
    const statTrends = document.querySelectorAll('.stat-trend');

    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = stats.courses.count;
        statNumbers[1].textContent = stats.lessons.count;
        statNumbers[2].textContent = stats.games.count;
        statNumbers[3].textContent = stats.roadmaps.count;
    }

    if (statTrends.length >= 4) {
        statTrends[0].textContent = stats.courses.trend + ' هذا الشهر';
        statTrends[1].textContent = stats.lessons.trend + ' هذا الشهر';
        statTrends[2].textContent = stats.games.trend + ' هذا الشهر';
        statTrends[3].textContent = stats.roadmaps.trend + ' هذا الشهر';
    }

    // تحديث الرسوم البيانية
    updateCharts(stats);
}

// تحديث الرسوم البيانية
function updateCharts(stats) {
    // تحديث بيانات الرسم البياني للمحتوى
    const contentStatsChart = Chart.getChart('contentStatsChart');
    if (contentStatsChart) {
        contentStatsChart.data.datasets[0].data = [
            stats.courses.count,
            stats.lessons.count,
            stats.games.count,
            stats.roadmaps.count
        ];
        contentStatsChart.update();
    }

    // تحديث بيانات الرسم البياني لنشاط المستخدمين
    const userActivityChart = Chart.getChart('userActivityChart');
    if (userActivityChart) {
        // هنا يمكنك إضافة منطق لتحديث بيانات نشاط المستخدمين
        // على سبيل المثال، من API أو قاعدة البيانات
    }
}

// دالة لحفظ الأنشطة في التخزين المحلي
function saveActivitiesNew() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;

    const activities = [];

    for (let i = 0; i < activityList.children.length; i++) {
        const activityItem = activityList.children[i];
        activities.push({
            html: activityItem.innerHTML,
            timestamp: new Date().getTime()
        });
    }

    // حفظ فقط آخر 10 أنشطة
    const recentActivities = activities.slice(0, 10);
    localStorage.setItem('dashboardActivities', JSON.stringify(recentActivities));
}
