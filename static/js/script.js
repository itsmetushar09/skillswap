// --- chatbot NOVA code at beggineing of the chatbot code ---

document.addEventListener('DOMContentLoaded', () => {
    // Remove any existing chatbot elements to prevent duplicates
    const existingIcon = document.getElementById('nova-chatbot-icon');
    const existingModal = document.getElementById('nova-chatbot-modal');
    if (existingIcon) existingIcon.remove();
    if (existingModal) existingModal.remove();

    // Create chatbot icon (bottom right)
    const novaIcon = document.createElement('div');
    novaIcon.id = "nova-chatbot-icon";
    novaIcon.title = "Chat with NOVA";
    novaIcon.style.cssText = `
        position: fixed;
        bottom: 32px;
        right: 36px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        cursor: pointer;
        z-index: 1100;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(118,75,162,0.3);
        transition: all 0.3s ease;
    `;
    novaIcon.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 2C8.925 2 4 6.925 4 13c0 2.368.745 4.564 2.01 6.358L4 26l6.642-2.01C12.436 25.255 14.632 26 17 26c6.075 0 11-4.925 11-11S21.075 2 15 2z" fill="white"/>
        </svg>
    `;
    document.body.appendChild(novaIcon);

    // Create chatbot modal with FIXED SCROLLING
    const novaModal = document.createElement('div');
    novaModal.id = "nova-chatbot-modal";
    novaModal.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 36px;
        width: 350px;
        max-width: 90vw;
        max-height: 500px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        z-index: 1100;
        display: none;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Inter', sans-serif;
    `;
    
    novaModal.innerHTML = `
        <div class="nova-chatbot-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
            <div style="display: flex; align-items: center;">
                <div style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; margin-right: 8px;"></div>
                <span style="font-weight: 600; font-size: 16px;">NOVA</span>
            </div>
            <button id="nova-chatbot-close" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>
        <div class="nova-chatbot-messages" id="nova-chatbot-messages" style="
            height: 300px;
            min-height: 300px;
            max-height: 300px;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 16px;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            gap: 12px;
            flex: 1;
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
        ">
            <div class="nova-message-incoming" style="display: flex; align-items: flex-start; gap: 8px;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="font-size: 16px;">🤖</span>
                </div>
                <div style="background: white; padding: 12px 16px; border-radius: 16px 16px 16px 4px; max-width: 80%; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <p style="margin: 0; font-size: 14px; line-height: 1.4; color: #334155;">Hi! I'm NOVA, your SkillSwap assistant. How can I help you today?</p>
                </div>
            </div>
        </div>
        <div class="nova-chatbot-input" style="display: flex; padding: 16px; background: white; border-top: 1px solid #e2e8f0; gap: 8px; flex-shrink: 0;">
            <input type="text" id="nova-chatbot-input" placeholder="Type your message..." style="flex: 1; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 24px; outline: none; font-size: 14px; background: #f8fafc;">
            <button id="nova-chatbot-send" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 20px; border-radius: 24px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.2s ease;">Send</button>
        </div>
    `;
    document.body.appendChild(novaModal);

    // Add custom scrollbar styles for webkit browsers
    const style = document.createElement('style');
    style.textContent = `
        #nova-chatbot-messages::-webkit-scrollbar {
            width: 6px;
        }
        #nova-chatbot-messages::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
        }
        #nova-chatbot-messages::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }
        #nova-chatbot-messages::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    `;
    document.head.appendChild(style);

    // Get elements after they're created
    setTimeout(() => {
        const chatbotSend = document.getElementById("nova-chatbot-send");
        const chatbotInput = document.getElementById("nova-chatbot-input");
        const chatbotMessages = document.getElementById("nova-chatbot-messages");
        const chatbotClose = document.getElementById("nova-chatbot-close");

        // Verify elements exist before adding listeners
        if (!chatbotSend || !chatbotInput || !chatbotMessages || !chatbotClose) {
            console.error('NOVA: Required elements not found');
            return;
        }

        // Show/Hide chatbot
        novaIcon.addEventListener('click', function() {
            novaModal.style.display = "flex";
            chatbotInput.focus();
        });

        chatbotClose.addEventListener('click', function() {
            novaModal.style.display = "none";
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (novaModal.style.display === "flex" && 
                !novaModal.contains(e.target) && 
                !novaIcon.contains(e.target)) {
                novaModal.style.display = "none";
            }
        });

        // Message functions with IMPROVED SCROLLING
        function appendMessage(text, type) {
            const messageDiv = document.createElement("div");
            
            if (type === "incoming") {
                messageDiv.style.cssText = "display: flex; align-items: flex-start; gap: 8px; margin-bottom: 12px;";
                messageDiv.innerHTML = `
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <span style="font-size: 16px;">🤖</span>
                    </div>
                    <div style="background: white; padding: 12px 16px; border-radius: 16px 16px 16px 4px; max-width: 75%; box-shadow: 0 1px 3px rgba(0,0,0,0.1); word-wrap: break-word;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.4; color: #334155;">${text}</p>
                    </div>
                `;
            } else {
                messageDiv.style.cssText = "display: flex; justify-content: flex-end; margin-bottom: 12px;";
                messageDiv.innerHTML = `
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 16px; border-radius: 16px 16px 4px 16px; max-width: 75%; word-wrap: break-word;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.4;">${text}</p>
                    </div>
                `;
            }
            
            chatbotMessages.appendChild(messageDiv);
            
            // FORCE SCROLL TO BOTTOM - CRITICAL FIX
            setTimeout(() => {
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 10);
        }

        function getBotReply(msg) {
            msg = msg.toLowerCase();
            
            if (msg.includes("find a teacher") || msg.includes("find teacher")) {
                return "I can help you find a teacher! What skill are you looking to learn? For example: Python, Photography, Yoga, etc.";
            }
            if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
                return "Hello! Welcome to SkillSwap. I'm here to help you find teachers, learn new skills, or answer questions about our platform.";
            }
            if (msg.includes("how does") || msg.includes("how to")) {
                return "SkillSwap is simple! You can teach what you know and learn what you need - all for free. Would you like to know more about teaching or learning?";
            }
            if (msg.includes("teach") || msg.includes("teaching")) {
                return "Great! You can share your skills with others. What would you like to teach? Just create a 'Teaching' post and connect with learners.";
            }
            if (msg.includes("learn") || msg.includes("learning")) {
                return "Awesome! What skill would you like to learn? I can help you find teachers or you can create a 'Learning' request.";
            }
            if (msg.includes("python") || msg.includes("coding") || msg.includes("programming")) {
                return "Programming is popular on SkillSwap! I can help you find Python teachers or other coding mentors. Would you like me to search for available teachers?";
            }
            if (msg.includes("thank") || msg.includes("thanks")) {
                return "You're welcome! Is there anything else I can help you with on SkillSwap?";
            }
            if (msg.includes("help") || msg.includes("support")) {
                return "I'm here to help! You can ask me about finding teachers, posting skills, how SkillSwap works, or anything else about our platform.";
            }
            
            return "I'm still learning! You can ask me about finding teachers, posting skills, or how SkillSwap works. What would you like to know?";
        }

        function sendMessage() {
            const userMsg = chatbotInput.value.trim();
            if (!userMsg) return;
            
            // Add user message
            appendMessage(userMsg, "outgoing");
            chatbotInput.value = "";
            
            // Add bot response after delay
            setTimeout(() => {
                appendMessage(getBotReply(userMsg), "incoming");
            }, 800);
        }

        // Event listeners
        chatbotSend.addEventListener('click', sendMessage);
        chatbotInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });

        // Hover effects
        novaIcon.addEventListener('mouseenter', function() {
            novaIcon.style.transform = 'scale(1.1)';
        });
        novaIcon.addEventListener('mouseleave', function() {
            novaIcon.style.transform = 'scale(1)';
        });

        console.log('NOVA chatbot initialized successfully with fixed scrolling!');
    }, 100);
});

// --- Chatbot code ends ---




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
