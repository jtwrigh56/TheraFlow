// TheraFlow Application JavaScript

// Data storage using localStorage
class DataStore {
    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    static set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Application state
let currentSection = 'dashboard';
let patients = [];
let sessions = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    showSection('dashboard');
    updateDashboard();
    
    // Load demo data if no data exists
    if (patients.length === 0 && sessions.length === 0) {
        loadDemoData();
        updateDashboard();
    }
});

// Load data from localStorage
function loadData() {
    patients = DataStore.get('theraflow_patients');
    sessions = DataStore.get('theraflow_sessions');
}

// Save data to localStorage
function saveData() {
    DataStore.set('theraflow_patients', patients);
    DataStore.set('theraflow_sessions', sessions);
}

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('d-none');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.remove('d-none');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    currentSection = sectionName;
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'patients':
            loadPatientsTable();
            break;
        case 'sessions':
            loadSessionsTable();
            break;
        case 'attendance':
            loadAttendanceData();
            break;
        case 'checkin':
            loadCheckinKiosk();
            break;
    }
}

// Dashboard functions
function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(session => session.date === today);
    const checkedInToday = todaySessions.filter(session => session.status === 'checked-in').length;
    
    document.getElementById('total-patients').textContent = patients.length;
    document.getElementById('today-sessions').textContent = todaySessions.length;
    document.getElementById('checked-in').textContent = checkedInToday;
    
    const attendanceRate = todaySessions.length > 0 ? 
        Math.round((checkedInToday / todaySessions.length) * 100) : 0;
    document.getElementById('attendance-rate').textContent = attendanceRate + '%';
    
    loadTodaysSchedule();
}

function loadTodaysSchedule() {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(session => session.date === today);
    
    const scheduleContainer = document.getElementById('todays-schedule');
    
    if (todaySessions.length === 0) {
        scheduleContainer.innerHTML = '<p class="text-muted">No sessions scheduled for today.</p>';
        return;
    }
    
    const table = `
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Therapist</th>
                    <th>Type</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${todaySessions.map(session => {
                    const patient = patients.find(p => p.id === session.patientId);
                    return `
                        <tr>
                            <td>${session.time}</td>
                            <td>${patient ? patient.name : 'Unknown'}</td>
                            <td>${session.therapist}</td>
                            <td>${session.type}</td>
                            <td><span class="badge status-${session.status}">${formatStatus(session.status)}</span></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    scheduleContainer.innerHTML = table;
}

// Patient management functions
function showAddPatientModal() {
    document.getElementById('addPatientForm').reset();
    const modal = document.getElementById('addPatientModal');
    modal.style.display = 'block';
    modal.classList.add('show');
    modal.classList.add('fade');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.id = 'modal-backdrop';
    document.body.appendChild(backdrop);
    document.body.classList.add('modal-open');
}

function addPatient() {
    const form = document.getElementById('addPatientForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    const patient = {
        id: DataStore.generateId(),
        name: document.getElementById('patientName').value,
        age: parseInt(document.getElementById('patientAge').value),
        guardian: document.getElementById('guardianName').value,
        phone: document.getElementById('guardianPhone').value,
        notes: document.getElementById('patientNotes').value,
        createdAt: new Date().toISOString()
    };
    
    patients.push(patient);
    saveData();
    
    hideModal('addPatientModal');
    loadPatientsTable();
    updateDashboard();
    
    showAlert('Patient added successfully!', 'success');
}

function loadPatientsTable() {
    const tableBody = document.getElementById('patients-table');
    
    if (patients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No patients found. Add your first patient to get started.</td></tr>';
        return;
    }
    
    tableBody.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.id.substr(-6)}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.guardian}</td>
            <td>${patient.phone}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editPatient('${patient.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletePatient('${patient.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function editPatient(patientId) {
    // For now, just show an alert. This could be expanded to a full edit modal
    showAlert('Edit functionality coming soon!', 'info');
}

function deletePatient(patientId) {
    if (confirm('Are you sure you want to delete this patient? This will also remove all their sessions.')) {
        patients = patients.filter(p => p.id !== patientId);
        sessions = sessions.filter(s => s.patientId !== patientId);
        saveData();
        loadPatientsTable();
        updateDashboard();
        showAlert('Patient deleted successfully!', 'success');
    }
}

// Session management functions
function showAddSessionModal() {
    if (patients.length === 0) {
        showAlert('Please add patients before scheduling sessions.', 'warning');
        return;
    }
    
    document.getElementById('addSessionForm').reset();
    loadPatientOptions();
    
    // Set default date to today
    document.getElementById('sessionDate').value = new Date().toISOString().split('T')[0];
    
    const modal = document.getElementById('addSessionModal');
    modal.style.display = 'block';
    modal.classList.add('show');
    modal.classList.add('fade');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.id = 'modal-backdrop';
    document.body.appendChild(backdrop);
    document.body.classList.add('modal-open');
}

function loadPatientOptions() {
    const select = document.getElementById('sessionPatient');
    select.innerHTML = '<option value="">Select a patient...</option>';
    
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.name;
        select.appendChild(option);
    });
}

function addSession() {
    const form = document.getElementById('addSessionForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    const session = {
        id: DataStore.generateId(),
        patientId: document.getElementById('sessionPatient').value,
        date: document.getElementById('sessionDate').value,
        time: document.getElementById('sessionTime').value,
        therapist: document.getElementById('sessionTherapist').value,
        type: document.getElementById('sessionType').value,
        notes: document.getElementById('sessionNotes').value,
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };
    
    sessions.push(session);
    saveData();
    
    hideModal('addSessionModal');
    loadSessionsTable();
    updateDashboard();
    
    showAlert('Session scheduled successfully!', 'success');
}

function loadSessionsTable() {
    const tableBody = document.getElementById('sessions-table');
    
    if (sessions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No sessions scheduled. Schedule your first session to get started.</td></tr>';
        return;
    }
    
    // Sort sessions by date and time
    const sortedSessions = sessions.sort((a, b) => {
        const dateTimeA = new Date(a.date + 'T' + a.time);
        const dateTimeB = new Date(b.date + 'T' + b.time);
        return dateTimeB - dateTimeA;
    });
    
    tableBody.innerHTML = sortedSessions.map(session => {
        const patient = patients.find(p => p.id === session.patientId);
        return `
            <tr>
                <td>${formatDate(session.date)}</td>
                <td>${session.time}</td>
                <td>${patient ? patient.name : 'Unknown Patient'}</td>
                <td>${session.therapist}</td>
                <td>${session.type}</td>
                <td><span class="badge status-${session.status}">${formatStatus(session.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editSession('${session.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteSession('${session.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editSession(sessionId) {
    // For now, just show an alert. This could be expanded to a full edit modal
    showAlert('Edit functionality coming soon!', 'info');
}

function deleteSession(sessionId) {
    if (confirm('Are you sure you want to delete this session?')) {
        sessions = sessions.filter(s => s.id !== sessionId);
        saveData();
        loadSessionsTable();
        updateDashboard();
        showAlert('Session deleted successfully!', 'success');
    }
}

// Attendance tracking functions
function loadAttendanceData() {
    loadTodaysAttendance();
    document.getElementById('attendance-date').value = new Date().toISOString().split('T')[0];
}

function loadTodaysAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(session => session.date === today);
    
    const container = document.getElementById('todays-attendance');
    
    if (todaySessions.length === 0) {
        container.innerHTML = '<p class="text-muted">No sessions scheduled for today.</p>';
        return;
    }
    
    container.innerHTML = todaySessions.map(session => {
        const patient = patients.find(p => p.id === session.patientId);
        return `
            <div class="d-flex justify-content-between align-items-center p-2 border-bottom">
                <div>
                    <strong>${patient ? patient.name : 'Unknown'}</strong><br>
                    <small class="text-muted">${session.time} - ${session.type}</small>
                </div>
                <div>
                    <span class="badge status-${session.status}">${formatStatus(session.status)}</span>
                    ${session.status === 'scheduled' ? 
                        `<button class="btn btn-sm btn-success ms-2" onclick="markAttendance('${session.id}', 'checked-in')">Check In</button>` :
                        session.status === 'checked-in' ?
                        `<button class="btn btn-sm btn-info ms-2" onclick="markAttendance('${session.id}', 'completed')">Complete</button>` :
                        ''
                    }
                </div>
            </div>
        `;
    }).join('');
}

function loadAttendanceHistory() {
    const selectedDate = document.getElementById('attendance-date').value;
    const dateSessions = sessions.filter(session => session.date === selectedDate);
    
    const container = document.getElementById('attendance-history');
    
    if (dateSessions.length === 0) {
        container.innerHTML = '<p class="text-muted">No sessions scheduled for this date.</p>';
        return;
    }
    
    container.innerHTML = dateSessions.map(session => {
        const patient = patients.find(p => p.id === session.patientId);
        return `
            <div class="d-flex justify-content-between align-items-center p-2 border-bottom">
                <div>
                    <strong>${patient ? patient.name : 'Unknown'}</strong><br>
                    <small class="text-muted">${session.time} - ${session.type}</small>
                </div>
                <div>
                    <span class="badge status-${session.status}">${formatStatus(session.status)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function markAttendance(sessionId, status) {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
        session.status = status;
        saveData();
        loadTodaysAttendance();
        updateDashboard();
        
        const statusText = status === 'checked-in' ? 'checked in' : 'completed';
        showAlert(`Session ${statusText} successfully!`, 'success');
    }
}

// Check-in kiosk functions
function loadCheckinKiosk() {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(session => 
        session.date === today && session.status === 'scheduled'
    );
    
    const container = document.getElementById('checkin-patients');
    
    if (todaySessions.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-white-50 fs-4">No patients scheduled for check-in today.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = todaySessions.map(session => {
        const patient = patients.find(p => p.id === session.patientId);
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card patient-checkin-card" onclick="checkInPatient('${session.id}')">
                    <div class="card-body">
                        <h4>${patient ? patient.name : 'Unknown Patient'}</h4>
                        <p class="text-muted">${session.time}</p>
                        <p class="text-muted">${session.type}</p>
                        <i class="fas fa-hand-pointer fa-2x text-primary"></i>
                        <p class="mt-2">Tap to Check In</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function checkInPatient(sessionId) {
    const card = event.currentTarget;
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
        session.status = 'checked-in';
        saveData();
        
        // Visual feedback
        card.classList.add('checkin-success');
        card.innerHTML = `
            <div class="card-body">
                <h4>✓ Checked In!</h4>
                <p>Thank you</p>
                <i class="fas fa-check-circle fa-3x"></i>
            </div>
        `;
        
        // Reload kiosk after 2 seconds
        setTimeout(() => {
            loadCheckinKiosk();
            updateDashboard();
        }, 2000);
        
        showAlert('Check-in successful!', 'success');
    }
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
}

function showAlert(message, type) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertContainer.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertContainer);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        if (alertContainer.parentNode) {
            alertContainer.remove();
        }
    }, 3000);
}

// Modal management functions for fallback
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.classList.remove('show');
    modal.classList.remove('fade');
    
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
    document.body.classList.remove('modal-open');
}

// Add event listeners for modal close buttons
document.addEventListener('DOMContentLoaded', function() {
    // Close buttons
    document.querySelectorAll('.btn-close, [data-bs-dismiss="modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
    
    // Close on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });
});

// Demo data for testing (optional)
function loadDemoData() {
    // Add demo patients
    const demoPatients = [
        {
            id: 'demo-patient-1',
            name: 'Alex Johnson',
            age: 8,
            guardian: 'Sarah Johnson',
            phone: '(555) 123-4567',
            notes: 'Autism spectrum disorder, responds well to visual schedules',
            createdAt: new Date().toISOString()
        },
        {
            id: 'demo-patient-2',
            name: 'Emma Chen',
            age: 6,
            guardian: 'Michael Chen',
            phone: '(555) 987-6543',
            notes: 'Speech delay, working on communication skills',
            createdAt: new Date().toISOString()
        }
    ];
    
    // Add demo sessions for today
    const today = new Date().toISOString().split('T')[0];
    const demoSessions = [
        {
            id: 'demo-session-1',
            patientId: 'demo-patient-1',
            date: today,
            time: '09:00',
            therapist: 'Dr. Smith',
            type: 'Behavioral Therapy',
            notes: 'Focus on social skills',
            status: 'scheduled',
            createdAt: new Date().toISOString()
        },
        {
            id: 'demo-session-2',
            patientId: 'demo-patient-2',
            date: today,
            time: '10:30',
            therapist: 'Dr. Williams',
            type: 'Speech Therapy',
            notes: 'Working on verbal communication',
            status: 'scheduled',
            createdAt: new Date().toISOString()
        }
    ];
    
    patients = demoPatients;
    sessions = demoSessions;
    saveData();
}

// Load demo data on first visit (removing this line since we moved it to DOMContentLoaded)
// loadDemoData();