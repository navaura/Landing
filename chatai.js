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
            z-index: 1000;
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
            }

            #${CHAT_ID}-user-input {
                bottom: 10px;
            }
        }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const chatWrapper = document.createElement('div');
    chatWrapper.id = `${CHAT_ID}-chat-wrapper`;

    const chatHeader = document.createElement('div');
    chatHeader.id = `${CHAT_ID}-chat-header`;
    chatHeader.innerHTML = `
        <span>AI Chatbot</span>
        <button onclick="document.getElementById('${CHAT_ID}-chat-wrapper').style.transform = 'translateX(100%)'" style="background: transparent; border: none; color: white; font-size: 20px;">&times;</button>
    `;

    const chatBox = document.createElement('div');
    chatBox.id = `${CHAT_ID}-chat-box`;

    const userInput = document.createElement('input');
    userInput.id = `${CHAT_ID}-user-input`;
    userInput.placeholder = 'Type your message...';
    userInput.addEventListener('keydown', handleInput);

    chatWrapper.appendChild(chatHeader);
    chatWrapper.appendChild(chatBox);
    chatWrapper.appendChild(userInput);
    document.body.appendChild(chatWrapper);

    let sessionId = null;  // Variable to store session ID
    let isSessionInitialized = false;  // Flag to ensure we only initialize the session once

    // Initialize the chat session ID from backend
    async function initializeSession() {
        if (isSessionInitialized) return;
        try {
            const response = await fetch('https://server1001.navaura.in/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Hi!' })
            });
            const data = await response.json();
            sessionId = data.session_id;  // Store session ID from backend
            isSessionInitialized = true;  // Mark session as initialized
        } catch (error) {
            console.error('Error initializing session:', error);
        }
    }

    async function handleInput(event) {
        if (event.key === 'Enter' && event.target.value.trim() !== '') {
            const message = event.target.value.trim();
            displayMessage('user', message);
            event.target.value = '';

            // Show AI-ing indicator
            const chatBox = document.getElementById(`${CHAT_ID}-chat-box`);
            const aiingIndicator = document.createElement('div');
            aiingIndicator.textContent = 'AI-ing...';
            aiingIndicator.className = `${CHAT_ID}-message ${CHAT_ID}-bot-message ${CHAT_ID}-ai-loading`;
            aiingIndicator.id = `${CHAT_ID}-loading-indicator`;
            chatBox.appendChild(aiingIndicator);
            chatBox.scrollTop = chatBox.scrollHeight;

            // Disable input while processing
            const userInput = document.getElementById(`${CHAT_ID}-user-input`);
            userInput.disabled = true;

            // Ensure session is initialized
            if (!sessionId) {
                await initializeSession();  // Wait until the session is initialized
            }

            try {
                const response = await fetch('https://server1001.navaura.in/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, session_id: sessionId })  // Include session_id
                });
                const data = await response.json();
                
                // Remove AI-ing indicator
                const loadingIndicator = document.getElementById(`${CHAT_ID}-loading-indicator`);
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }

                // Display AI response
                displayMessage('bot', data.response);

                // Re-enable input
                userInput.disabled = false;
                userInput.focus();
            } catch (error) {
                // Remove AI-ing indicator in case of error
                const loadingIndicator = document.getElementById(`${CHAT_ID}-loading-indicator`);
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }

                displayMessage('bot', 'Sorry, there was an error processing your message.');
                
                // Re-enable input
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

    // Add event listener to navbar chat toggle
    document.addEventListener('DOMContentLoaded', () => {
        const navbarChatToggle = document.querySelector('.navbar-chat-toggle');
        if (navbarChatToggle) {
            navbarChatToggle.addEventListener('click', toggleChat);
        }
    });

    function toggleChat() {
        const chatWrapper = document.getElementById(`${CHAT_ID}-chat-wrapper`);
        if (chatWrapper.style.transform === 'translateX(0%)') {
            chatWrapper.style.transform = 'translateX(100%)';
        } else {
            chatWrapper.style.transform = 'translateX(0%)';
        }
    }
})();
