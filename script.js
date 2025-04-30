// Mesajları göster/gizle fonksiyonları
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.innerText = message;
  errorDiv.classList.remove('hidden');
  setTimeout(() => errorDiv.classList.add('hidden'), 3000);
}

function showSuccess(message) {
  const successDiv = document.getElementById('success-message');
  successDiv.innerText = message;
  successDiv.classList.remove('hidden');
  setTimeout(() => successDiv.classList.add('hidden'), 3000);
}

// Form göster/gizle fonksiyonları
function showRegisterForm() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
}

function showLoginForm() {
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
}

function showDashboard() {
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('add-student-form').classList.add('hidden');
  document.getElementById('student-list').classList.add('hidden');
  document.getElementById('add-payment-form').classList.add('hidden');
}

function showAddStudentForm() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('add-student-form').classList.remove('hidden');
}

function showStudentList() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('student-list').classList.remove('hidden');
  displayStudents();
}

function showAddPaymentForm() {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('add-payment-form').classList.remove('hidden');
}

// Giriş işlemi
function handleLogin(event) {
  event.preventDefault();
  const emailOrName = document.getElementById('emailOrName').value.trim();
  const password = document.getElementById('password').value;
  
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => (u.email === emailOrName || `${u.firstName} ${u.lastName}` === emailOrName) && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    showSuccess('Giriş başarılı!');
    setTimeout(() => window.location.href = 'dashboard.html', 1000);
  } else {
    showError('E-posta, ad soyad veya şifre yanlış.');
  }
}

// Kayıt işlemi
function handleRegister(event) {
  event.preventDefault();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const profession = document.getElementById('profession').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('regPassword').value;

  if (!firstName || !lastName || !profession || !email || !password) {
    showError('Lütfen tüm alanları doldurun.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(u => u.email === email)) {
    showError('Bu e-posta zaten kayıtlı.');
    return;
  }

  const newUser = { firstName, lastName, profession, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  showSuccess('Kayıt başarılı! Giriş yapabilirsiniz.');
  setTimeout(showLoginForm, 1000);
}

// Çıkış yapma
function logout() {
  localStorage.removeItem('currentUser');
  showSuccess('Çıkış yapıldı.');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

// Oturum kontrolü
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');
  if (window.location.pathname.includes('dashboard.html') && !currentUser) {
    window.location.href = 'index.html';
  }
  if (window.location.pathname.includes('lesson-tracking.html') && !currentUser) {
    window.location.href = 'index.html';
  }
  if (window.location.pathname.includes('index.html') && currentUser) {
    window.location.href = 'dashboard.html';
  }
});

// Öğrenci ekleme
function addStudent(event) {
  event.preventDefault();
  const student = {
    firstName: document.getElementById('studentFirstName').value.trim(),
    lastName: document.getElementById('studentLastName').value.trim(),
    school: document.getElementById('school').value.trim(),
    class: document.getElementById('class').value,
    field: document.getElementById('field').value,
    exam: document.getElementById('exam').value,
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('studentEmail').value.trim(),
    parentName: document.getElementById('parentName').value.trim(),
    parentRelation: document.getElementById('parentRelation').value.trim(),
    parentPhone: document.getElementById('parentPhone').value.trim(),
    siblings: [
      {
        name: document.getElementById('sibling1Name').value.trim(),
        school: document.getElementById('sibling1School').value.trim(),
        class: document.getElementById('sibling1Class').value.trim(),
      },
      {
        name: document.getElementById('sibling2Name').value.trim(),
        school: document.getElementById('sibling2School').value.trim(),
        class: document.getElementById('sibling2Class').value.trim(),
      },
      {
        name: document.getElementById('sibling3Name').value.trim(),
        school: document.getElementById('sibling3School').value.trim(),
        class: document.getElementById('sibling3Class').value.trim(),
      },
      {
        name: document.getElementById('sibling4Name').value.trim(),
        school: document.getElementById('sibling4School').value.trim(),
        class: document.getElementById('sibling4Class').value.trim(),
      },
    ],
    fee: document.getElementById('fee').value,
    paymentMethod: document.getElementById('paymentMethod').value,
    registrationDate: document.getElementById('registrationDate').value,
  };

  if (!student.firstName || !student.lastName || !student.school || !student.class || !student.field || !student.exam || !student.phone || !student.email || !student.fee || !student.paymentMethod || !student.registrationDate) {
    showError('Lütfen tüm zorunlu alanları doldurun.');
    return;
  }

  const students = JSON.parse(localStorage.getItem('students')) || [];
  students.push(student);
  localStorage.setItem('students', JSON.stringify(students));
  showSuccess('Öğrenci başarıyla eklendi!');
  document.getElementById('addStudentForm').reset();
  setTimeout(showDashboard, 1000);
}

// Öğrenci listeleme
function displayStudents(filteredStudents = null) {
  const students = filteredStudents || JSON.parse(localStorage.getItem('students')) || [];
  const tableBody = document.getElementById('student-table-body');
  if (tableBody) {
    tableBody.innerHTML = '';

    students.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td data-label="Ad Soyad">${student.firstName} ${student.lastName}</td>
        <td data-label="Sınıf">${student.class}</td>
        <td data-label="Okul">${student.school}</td>
        <td data-label="Alan">${student.field}</td>
        <td data-label="Sınav">${student.exam}</td>
        <td data-label="Telefon">${student.phone}</td>
        <td data-label="E-posta">${student.email}</td>
        <td data-label="Ders Ücreti">${student.fee} TL</td>
        <td data-label="Ödeme Şekli">${student.paymentMethod}</td>
        <td data-label="Kayıt Tarihi">${student.registrationDate}</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// Öğrenci filtreleme
function filterStudents() {
  const filterName = document.getElementById('filterName').value.trim().toLowerCase();
  const filterClass = document.getElementById('filterClass').value;
  const filterSchool = document.getElementById('filterSchool').value.trim().toLowerCase();
  const filterField = document.getElementById('filterField').value;
  const filterExam = document.getElementById('filterExam').value;
  const filterPaymentMethod = document.getElementById('filterPaymentMethod').value;
  const filterStartDate = document.getElementById('filterStartDate').value;
  const filterEndDate = document.getElementById('filterEndDate').value;

  const students = JSON.parse(localStorage.getItem('students')) || [];
  const filteredStudents = students.filter(student => {
    const nameMatch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(filterName);
    const classMatch = !filterClass || student.class === filterClass;
    const schoolMatch = !filterSchool || student.school.toLowerCase().includes(filterSchool);
    const fieldMatch = !filterField || student.field === filterField;
    const examMatch = !filterExam || student.exam === filterExam;
    const paymentMethodMatch = !filterPaymentMethod || student.paymentMethod === filterPaymentMethod;
    const dateMatch = (!filterStartDate || student.registrationDate >= filterStartDate) && (!filterEndDate || student.registrationDate <= filterEndDate);
    return nameMatch && classMatch && schoolMatch && fieldMatch && examMatch && paymentMethodMatch && dateMatch;
  });

  displayStudents(filteredStudents);
}

// Ödeme ekleme
function addPayment(event) {
  event.preventDefault();
  const payment = {
    studentName: document.getElementById('paymentStudentName').value.trim(),
    paymentMethod: document.getElementById('paymentMethodPayment').value,
    amount: document.getElementById('paymentAmount').value,
    date: document.getElementById('paymentDate').value,
    payer: document.getElementById('payer').value.trim(),
    receiver: document.getElementById('receiver').value.trim(),
  };

  if (!payment.studentName || !payment.paymentMethod || !payment.amount || !payment.date || !payment.payer || !payment.receiver) {
    showError('Lütfen tüm alanları doldurun.');
    return;
  }

  const payments = JSON.parse(localStorage.getItem('payments')) || [];
  payments.push(payment);
  localStorage.setItem('payments', JSON.stringify(payments));
  showSuccess('Ödeme başarıyla eklendi!');
  document.getElementById('addPaymentForm').reset();
  setTimeout(showDashboard, 1000);
}

// PDF çıktısı alma
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFont("helvetica");
  doc.setFontSize(16);
  doc.text("Mentacc Takip - Öğrenci Listesi", 10, 10);
  
  const table = document.getElementById('student-table');
  const rows = [];
  const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText);
  rows.push(headers);
  
  const tableRows = table.querySelectorAll('tbody tr');
  tableRows.forEach(row => {
    const rowData = Array.from(row.querySelectorAll('td')).map(td => td.innerText);
    rows.push(rowData);
  });
  
  doc.autoTable({
    head: [headers],
    body: rows.slice(1),
    startY: 20,
    styles: { font: "helvetica", fontSize: 10 },
    headStyles: { fillColor: [218, 165, 32] },
  });
  
  doc.save('ogrenci-listesi.pdf');
}

// Excel çıktısı alma
function downloadExcel() {
  const table = document.getElementById('student-table');
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Öğrenci Listesi" });
  XLSX.writeFile(workbook, 'ogrenci-listesi.xlsx');
}

// Tema değiştirme
function changeTheme(theme) {
  const body = document.body;
  body.classList.remove('theme-default', 'theme-neon', 'theme-pastel', 'theme-dark');
  body.classList.add(`theme-${theme}`);
  localStorage.setItem('selectedTheme', theme);
  const themeSelector = document.getElementById('theme-selector');
  if (themeSelector) {
    themeSelector.value = theme;
  }
}

// Tema yükleme
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('selectedTheme') || 'default';
  const body = document.body;
  body.classList.add(`theme-${savedTheme}`);
  const themeSelector = document.getElementById('theme-selector');
  if (themeSelector) {
    themeSelector.value = savedTheme;
  }
});

// Ders Takip Sayfası Fonksiyonları
function showAddLessonForm() {
  document.getElementById('add-lesson-form').classList.remove('hidden');
  document.getElementById('lesson-list').classList.add('hidden');
}

function showLessonList() {
  document.getElementById('add-lesson-form').classList.add('hidden');
  document.getElementById('lesson-list').classList.remove('hidden');
  displayLessons();
}

function togglePartialPaymentInput() {
  const paymentStatus = document.getElementById('paymentStatus');
  const partialPaymentInput = document.getElementById('partialPaymentAmount');
  if (paymentStatus && partialPaymentInput) {
    if (paymentStatus.value === 'Kısmi Ödeme') {
      partialPaymentInput.classList.remove('hidden');
    } else {
      partialPaymentInput.classList.add('hidden');
      partialPaymentInput.value = '';
    }
  }
}

function addLesson(event) {
  event.preventDefault();
  const lesson = {
    studentName: document.getElementById('lessonStudentName')?.value.trim() || '',
    dateTime: document.getElementById('lessonDateTime')?.value || '',
    fee: document.getElementById('lessonFee')?.value || '',
    paymentStatus: document.getElementById('paymentStatus')?.value || '',
    partialPaymentAmount: document.getElementById('partialPaymentAmount')?.value || '0',
    topic: document.getElementById('lessonTopic')?.value.trim() || '',
  };

  if (!lesson.studentName || !lesson.dateTime || !lesson.fee || !lesson.paymentStatus || !lesson.topic) {
    showError('Lütfen tüm zorunlu alanları doldurun.');
    return;
  }

  if (lesson.paymentStatus === 'Kısmi Ödeme' && (!lesson.partialPaymentAmount || lesson.partialPaymentAmount <= 0)) {
    showError('Kısmi ödeme miktarı giriniz ve sıfırdan büyük olmalıdır.');
    return;
  }

  const lessons = JSON.parse(localStorage.getItem('lessons')) || [];
  lessons.push(lesson);
  localStorage.setItem('lessons', JSON.stringify(lessons));
  showSuccess('Ders başarıyla kaydedildi!');
  
  const form = document.getElementById('addLessonForm');
  if (form) {
    form.reset();
  }
  togglePartialPaymentInput();
}

function displayLessons(filteredLessons = null) {
  const lessons = filteredLessons || JSON.parse(localStorage.getItem('lessons')) || [];
  const tableBody = document.getElementById('lesson-table-body');
  if (tableBody) {
    tableBody.innerHTML = '';

    lessons.forEach(lesson => {
      const row = document.createElement('tr');
      const paymentStatusClass = lesson.paymentStatus === 'Ödendi' ? 'payment-status-paid' :
                                lesson.paymentStatus === 'Ödenmedi' ? 'payment-status-unpaid' :
                                'payment-status-partial';
      row.innerHTML = `
        <td data-label="Öğrenci Adı Soyadı">${lesson.studentName}</td>
        <td data-label="Tarih ve Saat">${new Date(lesson.dateTime).toLocaleString('tr-TR')}</td>
        <td data-label="Ders Ücreti">${lesson.fee} TL</td>
        <td data-label="Ödeme Durumu" class="${paymentStatusClass}">${lesson.paymentStatus}</td>
        <td data-label="Ödenen Miktar">${lesson.partialPaymentAmount && lesson.partialPaymentAmount !== '0' ? `${lesson.partialPaymentAmount} TL` : '-'}</td>
        <td data-label="Dersin Konusu">${lesson.topic}</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

function filterLessons() {
  const filterStudentName = document.getElementById('filterLessonStudentName')?.value.trim().toLowerCase() || '';
  const filterStartDate = document.getElementById('filterLessonStartDate')?.value || '';
  const filterEndDate = document.getElementById('filterLessonEndDate')?.value || '';

  const lessons = JSON.parse(localStorage.getItem('lessons')) || [];
  const filteredLessons = lessons.filter(lesson => {
    const nameMatch = lesson.studentName.toLowerCase().includes(filterStudentName);
    const dateMatch = (!filterStartDate || lesson.dateTime.split('T')[0] >= filterStartDate) &&
                     (!filterEndDate || lesson.dateTime.split('T')[0] <= filterEndDate);
    return nameMatch && dateMatch;
  });

  displayLessons(filteredLessons);
}

function downloadLessonPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica");
  doc.setFontSize(16);
  doc.text("Mentacc Takip - Ders Listesi", 10, 10);

  const table = document.getElementById('lesson-table');
  const rows = [];
  const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText);
  rows.push(headers);

  const tableRows = table.querySelectorAll('tbody tr');
  tableRows.forEach(row => {
    const rowData = Array.from(row.querySelectorAll('td')).map(td => td.innerText);
    rows.push(rowData);
  });

  doc.autoTable({
    head: [headers],
    body: rows.slice(1),
    startY: 20,
    styles: { font: "helvetica", fontSize: 10 },
    headStyles: { fillColor: [218, 165, 32] },
  });

  doc.save('ders-listesi.pdf');
}

function downloadLessonExcel() {
  const table = document.getElementById('lesson-table');
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Ders Listesi" });
  XLSX.writeFile(workbook, 'ders-listesi.xlsx');
}

function goToDashboard() {
  window.location.href = 'dashboard.html';
}

function goToLessonTracking() {
  window.location.href = 'lesson-tracking.html';
}

// jsPDF ve SheetJS kütüphanelerini eklemek için
document.addEventListener('DOMContentLoaded', () => {
  const script1 = document.createElement('script');
  script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  document.head.appendChild(script2);
});