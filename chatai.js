(function () {
    const CHAT_ID = 'navaura-ai-chatbot';

    const aiingStyles = `
        .${CHAT_ID}-ai-loading {
            color: #f1f1f1;
            font-style: italic;
            opacity: 0.7;
        }
    `;
    const loadingStyleSheet = document.createElement("style");
    loadingStyleSheet.type = "text/css";
    loadingStyleSheet.innerText = aiingStyles;
    document.head.appendChild(loadingStyleSheet);

    const styles = `
        * {
            box-sizing: border-box;
        }

        #${CHAT_ID}-chat-wrapper {
            position: fixed;
            bottom: 0;
            right: 0;
            width: 40%;
            height: 90%;
            background-color: rgb(17 24 39 / 90%);
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            z-index: 1001; /* Increased z-index to appear above mobile menu */
        }

        #${CHAT_ID}-chat-header {
            background-color: rgb(17 24 39 / 90%);
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            font-size: 18px;
            font-weight: 500;
        }

        #${CHAT_ID}-chat-box {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background-color: rgb(17 24 39 / 90%);
            margin-bottom: 60px;
            border-radius: 12px;
            max-height: calc(100% - 120px);
        }

        .${CHAT_ID}-message {
            margin: 10px 0;
            padding: 12px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.5;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            word-wrap: break-word;
        }

        .${CHAT_ID}-user-message {
            background-color: rgb(37 99 235);
            color: white;
            align-self: flex-end;
        }

        .${CHAT_ID}-bot-message {
            background-color: #333333;
            color: #f1f1f1;
            align-self: flex-start;
        }

        #${CHAT_ID}-user-input {
            position: absolute;
            bottom: 5px;
            left: 15px;
            width: calc(100% - 30px);
            padding: 12px;
            border: none;
            border-radius: 20px;
            background-color: rgb(37 99 235);
            font-size: 16px;
            color: #f1f1f1;
            transition: background-color 0.2s, border 0.2s;
        }

        #${CHAT_ID}-user-input:focus {
            outline: none;
            border: 2px solid #5c6bc0;
            background-color: rgb(17 24 39 / 100%);
        }

        @media (max-width: 768px) {
            #${CHAT_ID}-chat-wrapper {
                width: 100%;
                height: 100%;
                transform: translateX(100%);
                border-radius: 0;
                top: 0; /* Ensure it covers the full screen */
                bottom: 0;
                right: 0;
                left: 0;
            }

            #${CHAT_ID}-chat-header {
                border-radius: 0;
                position: sticky;
                top: 0;
            }

            #${CHAT_ID}-user-input {
                position: fixed;
                bottom: 10px;
                left: 15px;
                width: calc(100% - 30px);
                z-index: 1002;
            }

            #${CHAT_ID}-chat-box {
                margin-bottom: 80px;
                height: calc(100vh - 140px);
                overflow-y: auto;
            }
        }

        /* Ensure chat toggle is visible in mobile menu */
        .navbar-chat-toggle {
            display: block;
            width: 100%;
            text-align: left;
            padding: 0.5rem 0;
            color: white;
            font-size: 1rem;
        }

        @media (max-width: 768px) {
            .navbar-chat-toggle {
                font-size: 1.5rem;
                padding: 1rem 0;
            }
        }
    `;
    
    const chatWrapper = document.createElement('div');
    chatWrapper.id = `${CHAT_ID}-chat-wrapper`;
    chatWrapper.setAttribute('role', 'dialog');
    chatWrapper.setAttribute('aria-label', 'Chat window');

    const chatHeader = document.createElement('div');
    chatHeader.id = `${CHAT_ID}-chat-header`;
    chatHeader.innerHTML = `
        <span>AI Chatbot</span>
        <button onclick="closeChatWindow()" style="background: transparent; border: none; color: white; font-size: 20px;" aria-label="Close chat">&times;</button>
    `;

    const chatBox = document.createElement('div');
    chatBox.id = `${CHAT_ID}-chat-box`;
    chatBox.setAttribute('role', 'log');
    chatBox.setAttribute('aria-live', 'polite');

    // Create a form wrapper for the input
    const chatForm = document.createElement('form');
    chatForm.id = `${CHAT_ID}-chat-form`;
    chatForm.setAttribute('role', 'form');
    chatForm.onsubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById(`${CHAT_ID}-user-input`);
        if (input.value.trim()) {
            handleInput({ key: 'Enter', target: input });
        }
        return false;
    };

    // Create label for input
    const inputLabel = document.createElement('label');
    inputLabel.htmlFor = `${CHAT_ID}-user-input`;
    inputLabel.className = 'sr-only'; // Visually hidden but accessible to screen readers
    inputLabel.textContent = 'Type your message';

    const userInput = document.createElement('input');
    userInput.id = `${CHAT_ID}-user-input`;
    userInput.name = 'chat-message';  // Add name attribute
    userInput.type = 'text';          // Explicitly set input type
    userInput.autocomplete = 'off';   // Add autocomplete attribute
    userInput.placeholder = 'Type your message...';
    userInput.setAttribute('aria-label', 'Type your message');
    userInput.addEventListener('keydown', handleInput);

    // Add the label and input to the form
    chatForm.appendChild(inputLabel);
    chatForm.appendChild(userInput);

    // Append all elements
    chatWrapper.appendChild(chatHeader);
    chatWrapper.appendChild(chatBox);
    chatWrapper.appendChild(chatForm);
    document.body.appendChild(chatWrapper);

    // Add the sr-only class to styles
    const additionalStyles = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        #${CHAT_ID}-chat-form {
            position: absolute;
            bottom: 5px;
            left: 15px;
            width: calc(100% - 30px);
        }

        @media (max-width: 768px) {
            #${CHAT_ID}-chat-form {
                position: fixed;
                bottom: 10px;
                z-index: 1002;
            }
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles + additionalStyles;
    document.head.appendChild(styleSheet);

    // Add global function for closing chat
    window.closeChatWindow = function() {
        const chatWrapper = document.getElementById(`${CHAT_ID}-chat-wrapper`);
        chatWrapper.style.transform = 'translateX(100%)';
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('translate-x-full');
        }
    };

    let sessionId = null;
    let isSessionInitialized = false;

    async function initializeSession() {
        if (isSessionInitialized) return;
        try {
            const response = await fetch('https://server1001.navaura.in/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Hi!' })
            });
            const data = await response.json();
            sessionId = data.session_id;
            isSessionInitialized = true;
        } catch (error) {
            console.error('Error initializing session:', error);
        }
    }

    async function handleInput(event) {
        if (event.key === 'Enter' && event.target.value.trim() !== '') {
            const message = event.target.value.trim();
            displayMessage('user', message);
            event.target.value = '';

            const chatBox = document.getElementById(`${CHAT_ID}-chat-box`);
            const aiingIndicator = document.createElement('div');
            aiingIndicator.textContent = 'AI-ing...';
            aiingIndicator.className = `${CHAT_ID}-message ${CHAT_ID}-bot-message ${CHAT_ID}-ai-loading`;
            aiingIndicator.id = `${CHAT_ID}-loading-indicator`;
            chatBox.appendChild(aiingIndicator);
            chatBox.scrollTop = chatBox.scrollHeight;

            const userInput = document.getElementById(`${CHAT_ID}-user-input`);
            userInput.disabled = true;

            if (!sessionId) {
                await initializeSession();
            }

            try {
                const response = await fetch('https://server1001.navaura.in/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, session_id: sessionId })
                });
                const data = await response.json();
                
                const loadingIndicator = document.getElementById(`${CHAT_ID}-loading-indicator`);
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }

                displayMessage('bot', data.response);
                userInput.disabled = false;
                userInput.focus();
            } catch (error) {
                const loadingIndicator = document.getElementById(`${CHAT_ID}-loading-indicator`);
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }
                displayMessage('bot', 'Sorry, there was an error processing your message.');
                userInput.disabled = false;
            }
        }
    }

    function displayMessage(sender, message) {
        const chatBox = document.getElementById(`${CHAT_ID}-chat-box`);
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = `${CHAT_ID}-message ` + (sender === 'user' ? `${CHAT_ID}-user-message` : `${CHAT_ID}-bot-message`);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Initialize all chat toggles
    function initializeChatToggles() {
        const chatToggles = document.querySelectorAll('.navbar-chat-toggle');
        chatToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const chatWrapper = document.getElementById(`${CHAT_ID}-chat-wrapper`);
                chatWrapper.style.transform = 'translateX(0%)';
                // Close mobile menu when opening chat
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.add('translate-x-full');
                }
            });
        });
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatToggles);
    } else {
        initializeChatToggles();
    }
})();
