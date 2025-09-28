// Enable tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
    // Sidebar toggle with overlay
    document.getElementById('mobileToggle').addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (sb.classList.contains('d-none')) {
        sb.classList.remove('d-none');
        sb.classList.add('mobile-sidebar');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        sb.classList.add('d-none');
        sb.classList.remove('mobile-sidebar');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close sidebar on overlay click
document.getElementById('sidebarOverlay').addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    sb.classList.add('d-none');
    sb.classList.remove('mobile-sidebar');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Add Transaction Modal open
document.querySelectorAll('#addTxnBtn, #addTxnBtn2').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('addTxnModal'));
        modal.show();
    });
});

// Switch tabs
function switchTab(tab) {
    document.querySelectorAll('[data-tab]').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(a => {
        if (a.getAttribute('data-tab') === tab) a.classList.add('active');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.mobile-nav-link').forEach(n => {
        if (n.getAttribute('data-tab') === tab) n.classList.add('active');
    });

    document.querySelectorAll('.tab-section').forEach(s => {
        s.classList.add('d-none', 'hidden-section');
    });

    const section = document.getElementById(tab);
    if (section) {
        section.classList.remove('d-none', 'hidden-section');
        section.classList.remove('fade-up');
        void section.offsetWidth;
        section.classList.add('fade-up');

        // Re-trigger scroll animations
        setTimeout(() => {
            initScrollAnimations();
        }, 100);
    }
}

// Tab click handling
document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        const tab = this.getAttribute('data-tab');
        switchTab(tab);

        // Close sidebar on mobile
        if (window.innerWidth < 768) {
            const sb = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');

            sb.classList.add('d-none');
            sb.classList.remove('mobile-sidebar');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate');

    animatedElements.forEach(element => {
        element.classList.remove('animated');
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (elementPosition < screenPosition) {
            element.classList.add('animated');
        }
    });
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-section').forEach(s => s.classList.add('d-none', 'hidden-section'));
    document.getElementById('overview').classList.remove('d-none', 'hidden-section');
    document.getElementById('overview').classList.add('fade-up');

    initScrollAnimations();

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header-enhanced');
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        initScrollAnimations();
    });

    // Set default date for forms
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('txnDate').value = today;
    document.getElementById('modalDate').value = today;
});

// Save transaction (inline form)
document.getElementById('saveTxn')?.addEventListener('click', () => {
    const type = document.getElementById('txnType').value;
    const amount = document.getElementById('txnAmount').value || '0.00';
    const cat = document.getElementById('txnCategory').value;
    const date = document.getElementById('txnDate').value || new Date().toISOString().slice(0, 10);
    const note = document.getElementById('txnNote').value || '—';
    const tbody = document.querySelector('#transactionsTable tbody');

    if (tbody) {
        const row = document.createElement('tr');
        const d = new Date(date);
        const dateStr = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

        row.innerHTML = `
            <td>${dateStr}</td>
            <td>${note}</td>
            <td>${cat}</td>
            <td><span class="badge ${type === 'income' ? 'bg-success' : 'bg-danger'}">${type.charAt(0).toUpperCase() + type.slice(1)}</span></td>
            <td class="text-end ${type === 'income' ? 'text-success' : 'text-danger'}">${type === 'income' ? '+' : '-'}$${parseFloat(amount).toFixed(2)}</td>
        `;

        tbody.prepend(row);
        const historyTabBtn = document.querySelector('[data-bs-target="#historyTab"]');
        if (historyTabBtn) historyTabBtn.click();
    }
});

// Save transaction (modal)
document.getElementById('modalSave')?.addEventListener('click', () => {
    const type = document.getElementById('modalType').value.toLowerCase();
    const amount = document.getElementById('modalAmount').value || '0.00';
    const cat = document.getElementById('modalCategory').value || 'General';
    const date = document.getElementById('modalDate').value || new Date().toISOString().slice(0, 10);
    const note = document.getElementById('modalNote').value || '—';
    const tbody = document.querySelector('#transactionsTable tbody');

    if (tbody) {
        const row = document.createElement('tr');
        const d = new Date(date);
        const dateStr = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

        row.innerHTML = `
            <td>${dateStr}</td>
            <td>${note}</td>
            <td>${cat}</td>
            <td><span class="badge ${type === 'income' ? 'bg-success' : 'bg-danger'}">${type.charAt(0).toUpperCase() + type.slice(1)}</span></td>
            <td class="text-end ${type === 'income' ? 'text-success' : 'text-danger'}">${type === 'income' ? '+' : '-'}$${parseFloat(amount).toFixed(2)}</td>
        `;

        tbody.prepend(row);

        const modalEl = document.getElementById('addTxnModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }
});

// Transaction filtering
function filterTxns(type) {
    const rows = document.querySelectorAll('#transactionsTable tbody tr');
    rows.forEach(r => {
        const badge = r.querySelector('td:nth-child(4) .badge');
        if (!badge) {
            r.style.display = '';
            return;
        }
        const t = badge.textContent.trim().toLowerCase();
        if (type === 'all') r.style.display = '';
        else r.style.display = (t === (type === 'income' ? 'income' : 'expense')) ? '' : 'none';
    });
}

document.getElementById('filterIncome')?.addEventListener('click', () => filterTxns('income'));
document.getElementById('filterExpense')?.addEventListener('click', () => filterTxns('expense'));
document.getElementById('filterAll')?.addEventListener('click', () => filterTxns('all'));

// Global search
const globalSearch = document.getElementById('globalSearch');
function performSearch(q) {
    const rows = document.querySelectorAll('#transactionsTable tbody tr');
    if (!rows) return;

    rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = q ? (text.includes(q) ? '' : 'none') : '';
    });
}
if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        performSearch(q);
    });
}

// View all payments
document.getElementById('viewAllPayments')?.addEventListener('click', () => {
    switchTab('transactions');
    const historyTabBtn = document.querySelector('[data-bs-target="#historyTab"]');
    if (historyTabBtn) historyTabBtn.click();
});

// Dropdown hover animation
document.querySelectorAll('.dropdown-item-enhanced').forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'translateX(4px)';
    });
    item.addEventListener('mouseleave', function () {
        this.style.transform = 'translateX(0)';
    });
});

// Charts
document.addEventListener("DOMContentLoaded", () => {
    // Spending Trend Chart
    var overviewOptions = {
        chart: { type: 'line', height: 300, id: 'spendingChart' },
        series: [
            { name: "Housing", data: [1200, 1100, 1300, 1250, 1400, 1350] },
            { name: "Food", data: [300, 350, 400, 375, 390, 410] },
            { name: "Transport", data: [150, 160, 170, 165, 180, 190] }
        ],
        xaxis: { categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"] },
        stroke: { curve: 'smooth' },
        markers: { size: 4 },
        colors: ['#007bff', '#28a745', '#ffc107']
    };
    new ApexCharts(document.querySelector("#spendingChart"), overviewOptions).render();

    // Income vs Expenses Chart
    var options1 = {
        chart: { type: 'bar', height: 300, id: 'incomeExpenseChart' },
        series: [
            { name: "Income", data: [4000, 4200, 4500, 4800, 5000, 5300] },
            { name: "Expenses", data: [2500, 2700, 3000, 3100, 3300, 3500] }
        ],
        xaxis: { categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"] },
        colors: ['#28a745', '#dc3545']
    };
    new ApexCharts(document.querySelector("#incomeExpenseChart"), options1).render();

    // Savings Chart
    var options2 = {
        chart: { type: 'line', height: 300, id: 'savingsChart' },
        series: [
            { name: "Saved", data: [500, 800, 1200, 1500, 2000, 2500] },
            { name: "Goal", data: [1000, 1500, 2000, 2500, 3000, 3500] }
        ],
        xaxis: { categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"] },
        colors: ['#007bff', '#ffc107']
    };
    new ApexCharts(document.querySelector("#savingsChart"), options2).render();

    var budgetOptions = {
        chart: { type: 'donut', height: 300, id: 'budgetProgressChart' },
        series: [4250, 2870, 1380],
        labels: ['Income', 'Expenses', 'Savings'],
        colors: ['#000000', '#dc3545', '#28a745']
    };
    new ApexCharts(document.querySelector("#budgetProgressChart"), budgetOptions).render();
});
