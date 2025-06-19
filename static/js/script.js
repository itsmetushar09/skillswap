// This is the most important part: The DOMContentLoaded event.
// It ensures that your JavaScript code only runs AFTER the entire HTML page has been loaded.
// This prevents "null" errors where your script tries to find an element that doesn't exist yet.
document.addEventListener('DOMContentLoaded', () => {

    // Initialize Firebase services (auth and db are available from the compat scripts)
    // In a real app, you would use these. For this demo, they are just placeholders.
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- DOM Element Selections ---
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const createSkillModal = document.getElementById('createSkillModal');
    const createSkillBtn = document.getElementById('createSkillBtn');
    const userMenu = document.getElementById('userMenu');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    // --- Modal Controls ---
    // We add a check (if element exists) to make the code more robust.
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            signupModal.classList.add('active');
        });
    }

    if (createSkillBtn) {
        createSkillBtn.addEventListener('click', () => {
            createSkillModal.classList.add('active');
        });
    }

    // Closing modals
    document.getElementById('closeLoginModal')?.addEventListener('click', () => loginModal.classList.remove('active'));
    document.getElementById('closeSignupModal')?.addEventListener('click', () => signupModal.classList.remove('active'));
    document.getElementById('closeCreateSkillModal')?.addEventListener('click', () => createSkillModal.classList.remove('active'));

    // Switching between modals
    document.getElementById('showSignup')?.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    });

    document.getElementById('showLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // Close modals when clicking the background
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // --- User Menu ---
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // In a real app: auth.signOut()...
            loginBtn.style.display = 'inline-block';
            signupBtn.style.display = 'inline-block';
            userMenu.classList.add('hidden');
            userDropdown.classList.add('hidden');
            showNotification('Successfully logged out!', 'info');
        });
    }


    // --- Form Submissions ---
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        // const password = document.getElementById('loginPassword').value;
        console.log('Login attempt:', email);
        simulateLogin(email);
    });

    document.getElementById('signupForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        // ... get other values
        console.log('Signup attempt:', { name, email });
        simulateLogin(email, name);
    });

    document.getElementById('createSkillForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const skillData = {
            type: document.getElementById('skillType').value,
            title: document.getElementById('skillTitle').value,
            description: document.getElementById('skillDescription').value,
            category: document.getElementById('skillCategory').value,
            exchange: document.getElementById('skillExchange').value
        };
        console.log('Creating skill:', skillData);
        createSkillModal.classList.remove('active');
        addSkillCard(skillData);
        document.getElementById('createSkillForm').reset();
    });

    document.getElementById('googleLogin')?.addEventListener('click', () => {
        console.log('Google login clicked');
        simulateLogin('user@gmail.com', 'Google User');
    });

    // --- Helper Functions ---
    function simulateLogin(email, name = null) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userMenu.classList.remove('hidden');
        document.getElementById('userName').textContent = name || email.split('@')[0];
        loginModal.classList.remove('active');
        signupModal.classList.remove('active');
        showNotification('Successfully logged in!', 'success');
    }

    function addSkillCard(skillData) {
        const skillsGrid = document.getElementById('skillsGrid');
        if (!skillsGrid) return; // Don't run if the grid isn't on the page
        const skillCard = document.createElement('div');
        skillCard.className = 'bg-white rounded-xl shadow-lg card-hover p-6';
        const typeColor = skillData.type === 'teaching' ? 'green' : 'blue';
        const typeText = skillData.type === 'teaching' ? 'Teaching' : 'Learning';

        skillCard.innerHTML = `
            <div class="flex items-center mb-4">
                <img src="https://via.placeholder.com/50" alt="User" class="w-12 h-12 rounded-full mr-4">
                <div>
                    <h3 class="font-semibold text-lg">You</h3>
                    <span class="text-sm text-${typeColor}-600 bg-${typeColor}-100 px-2 py-1 rounded">${typeText}</span>
                </div>
            </div>
            <h4 class="text-xl font-bold mb-2">${skillData.title}</h4>
            <p class="text-gray-600 mb-4">${skillData.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                <span class="skill-tag text-white px-3 py-1 rounded-full text-sm">${skillData.category}</span>
                ${skillData.exchange ? `<span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Exchange: ${skillData.exchange}</span>` : ''}
            </div>
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-600"><i class="fas fa-clock mr-1"></i> Just posted</div>
                <button class="bg-${typeColor}-600 text-white px-4 py-2 rounded-lg hover:bg-${typeColor}-700 transition duration-200">
                    ${skillData.type === 'teaching' ? 'Connect' : 'Offer Help'}
                </button>
            </div>
        `;
        skillsGrid.insertBefore(skillCard, skillsGrid.firstChild);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-blue-500';
        notification.className = `fixed top-20 right-4 z-[1001] text-white px-6 py-3 rounded-lg shadow-lg ${bgColor}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }


    <script>
  document.addEventListener("DOMContentLoaded", function () {
    const userBtn = document.getElementById("userMenuBtn");
    const dropdown = document.getElementById("userDropdown");

    if (userBtn && dropdown) {
      userBtn.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
      });
    }
  });
</script>

    // --- Other Page Interactions ---
    document.getElementById('skillFilter')?.addEventListener('change', (e) => {
        const category = e.target.value;
        console.log('Filtering by category:', category);
    });

    // Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    console.log('SkillSwap app initialized successfully!');
}); // This is the closing bracket for the DOMContentLoaded event listener.