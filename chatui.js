(function () {
    let chatbot = document.getElementById("chatbot");

    // Inject Styles
    let styles = document.createElement("style");
    styles.innerHTML = `
/* Chatbot Container */
.chatbot-container {
  position: fixed;
  top: 60px;
  bottom: 60px;
  right: -100%;
  width: 90%;
  max-width: 400px;
  height: calc(100% - 120px);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  color: #ffffff;
  border-radius: 15px 0 0 15px;
  box-shadow: -4px 0 25px rgba(0, 0, 0, 0.5), 
              inset 0 0 15px rgba(50, 50, 50, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 9999;
  overflow: hidden;
}

@media (min-width: 768px) {
  .chatbot-container {
    width: 45vw;
    max-width: 500px;
  }
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #000000;
  border-radius: 15px 0 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chatbot-header span {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.chatbot-header button {
  background: rgba(40, 40, 40, 0.8);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  padding: 0;
}

.chatbot-header button:hover {
  background: rgba(60, 60, 60, 0.9);
  transform: translateY(-2px);
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: rgba(5, 5, 5, 0.8);
  word-wrap: break-word;
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 100, 100, 0.4) rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.chat-box::-webkit-scrollbar {
  width: 6px;
}

.chat-box::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.chat-box::-webkit-scrollbar-thumb {
  background: rgba(80, 80, 80, 0.4);
  border-radius: 3px;
}

/* Message styles - will be dynamically created */
.chat-message {
  margin-bottom: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  max-width: 85%;
  animation: fadeIn 0.3s ease;
}

.user-message {
  background: rgba(30, 30, 30, 0.7);
  color: #ffffff;
  align-self: flex-end;
  margin-left: auto;
  border-bottom-right-radius: 2px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.bot-message {
  background: rgba(20, 20, 20, 0.7);
  color: #ffffff;
  align-self: flex-start;
  margin-right: auto;
  border-bottom-left-radius: 2px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.input-box {
  display: flex;
  padding: 15px;
  background: #000000;
  border-radius: 0 0 0 15px;
  flex-direction: column;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.input-box input {
  flex: 1;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background: rgba(15, 15, 15, 0.9);
  color: #ffffff;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5),
              0 0 5px rgba(50, 50, 50, 0.3);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 15px;
}

.input-box input:focus {
  outline: none;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5),
              0 0 15px rgba(50, 50, 50, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.input-box input::placeholder {
  color: rgba(180, 180, 180, 0.5);
}

.input-box button {
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.input-box button:hover {
  background: #2a2a2a;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

/* Topics container styles */
.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.topic {
  padding: 7px 12px;
  background: rgba(20, 20, 20, 0.8);
  color: #ffffff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.topic:hover {
  background: rgba(40, 40, 40, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Click Outside Overlay */
.chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  display: none;
  z-index: 9998;
  transition: all 0.3s ease;
}

/* Animation for messages */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Toggle button that will be added via JS */
.chat-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #1a1a1a;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  z-index: 9997;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-toggle:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  background: #2a2a2a;
}

/* Show chatbot when active */
.chatbot-active {
  right: 0;
}

/* Show overlay when active */
.overlay-active {
  display: block;
}

/* Typing indicator - can be added dynamically */
.typing-indicator {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: rgba(180, 180, 180, 0.7);
  margin: 0 1px;
  display: inline-block;
  animation: bounce 1.5s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 83%, 100% { transform: translateY(0); }
  30% { transform: translateY(-5px); }
}

/* Add some CSS for the chat open state */
.chatbot-open {
  right: 0;
}
    `;
    document.head.appendChild(styles);

    chatbot.innerHTML = `
        <div class="chat-overlay" id="chatOverlay"></div>
        <div class="chatbot-container" id="chatbotPanel">
            <div class="chatbot-header">
                <span style="color: #06b6d4;">KRITTIM</span>
                <button onclick="toggleChat()">X</button>
            </div>
            <div class="chat-box" id="chatBox"></div>
            <div class="input-box">
                <input type="text" id="userInput" placeholder="Type a message..." oninput="handleInput()">
                <div class="topics" id="topicsContainer"></div>
                <button onclick="sendMessage()">Send</button>
            </div>
        </div>
    `;

    // Initialize session ID
    let sessionId = null;

    // Define API endpoint
    const chatApiUrl = "https://server1001.navaura.in/chat";

    // Function to clean URL format from the API response
    function cleanUrlFormat(text) {
        // Fix URLs with duplicated URLs in parentheses
        text = text.replace(/(https?:\/\/[^\s]+)\((?:https?:\/\/[^\s]+)\)/g, '$1');
        
        // Convert bracketed URLs to plain URLs
        text = text.replace(/\[(https?:\/\/[^\]]+)\]/g, '$1');
        
        return text;
    }

    // Function to send messages to the API
    async function sendToApi(message) {
        try {
            // Create request payload based on your FastAPI model requirements
            const requestBody = {
                message: message
            };
            
            // Only include session_id if we have one
            if (sessionId) {
                requestBody.session_id = sessionId;
            }

            const response = await fetch(chatApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                // Log detailed error for debugging
                const errorText = await response.text();
                console.error("API Error:", response.status, errorText);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            
            // Save the session ID for future requests
            if (data.session_id) {
                sessionId = data.session_id;
                console.log("Session established:", sessionId);
            }
            
            // Clean URL format in the response before returning
            return cleanUrlFormat(data.response);
        } catch (error) {
            console.error("Error sending message:", error);
            return "Sorry, there was an error processing your request.";
        }
    }

    function formatResult(result) {
        let formattedText = result;
        
        // Format URLs as clickable links FIRST (before any other formatting)
        formattedText = formattedText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Handle markdown formatting
        formattedText = formattedText.replace(/##\s*(.+?)(\n|$)/g, '<h2>$1</h2>');
        formattedText = formattedText.replace(/#\s*(.+?)(\n|$)/g, '<h1>$1</h1>');
        formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\*(.+?)\*/g, '<em>$1</em>');
        formattedText = formattedText.replace(/(Key Insights:)/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\*\s*(.+?)(\n|$)/g, '<li>$1</li>');
        formattedText = formattedText.replace(/(<li>[\s\S]*<\/li>)/g, '<ul>$1</ul>');
        formattedText = formattedText.replace(/\d+\.\s*(.+?)(\n|$)/g, '<li>$1</li>');
        formattedText = formattedText.replace(/(<li>[\s\S]*<\/li>)/g, '<ol>$1</ol>');
        formattedText = formattedText.replace(/\n(-{3}|\*{3})\n/g, '<hr/>');
        
        // Convert newlines to <br> tags
        formattedText = formattedText.replace(/\n/g, '<br>');
        
        return formattedText;
    }

    const topics = [
        "NEW APPS", "SAYVA", "VEDI+", "Web APP services",
        "Contact to Navaura", "Contact Number", "APP URLS", "What is Navaura?",
        "What is the Mission?"
    ];

    function showTopics() {
        let topicsContainer = document.getElementById("topicsContainer");
        topicsContainer.innerHTML = "";
        topics.forEach(topic => {
            let topicElement = document.createElement("div");
            topicElement.classList.add("topic");
            topicElement.innerText = topic;
            topicElement.onclick = function () {
                document.getElementById("userInput").value = topic;
                topicsContainer.innerHTML = "";
            };
            topicsContainer.appendChild(topicElement);
        });
    }

    function handleInput() {
        let input = document.getElementById("userInput").value.trim();
        let topicsContainer = document.getElementById("topicsContainer");
        if (input === "") {
            showTopics();
        } else {
            topicsContainer.innerHTML = "";
        }
    }

    window.sendMessage = async function () {
        let input = document.getElementById("userInput");
        let chatBox = document.getElementById("chatBox");
        
        if (input.value.trim() !== "") {
            // Add user message to chat
            chatBox.innerHTML += `<div>User: ${input.value}</div>`;
            
            // Show loading indicator
            let loadingId = "loading-" + Date.now();
            chatBox.innerHTML += `<div id="${loadingId}">Bot: Typing...</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
            
            // Send message to API
            const userMessage = input.value;
            input.value = "";
            
            try {
                // Get response from API
                const response = await sendToApi(userMessage);
                
                // Remove loading indicator and add bot response
                const loadingElement = document.getElementById(loadingId);
                if (loadingElement) {
                    loadingElement.remove();
                }
                
                chatBox.innerHTML += `<div>Bot: ${formatResult(response)}</div>`;
            } catch (error) {
                // Handle error
                const loadingElement = document.getElementById(loadingId);
                if (loadingElement) {
                    loadingElement.innerHTML = "Bot: Sorry, there was an error. Please try again.";
                }
                console.error("Message sending error:", error);
            }
            
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    // Add event listener for Enter key
    document.getElementById("userInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            window.sendMessage();
        }
    });

    window.toggleChat = function () {
        let chatbotPanel = document.getElementById("chatbotPanel");
        let overlay = document.getElementById("chatOverlay");

        if (chatbotPanel.style.right === "0px") {
            chatbotPanel.style.right = "-100%";
            overlay.style.display = "none";
        } else {
            chatbotPanel.style.right = "0px";
            overlay.style.display = "block";
            showTopics(); // Show topics when opening
        }
    };

    // If there's a .chatui element, add click event listener
    const chatuiButton = document.querySelector(".chatui");
    if (chatuiButton) {
        chatuiButton.addEventListener("click", toggleChat);
    }

    document.getElementById("chatOverlay").addEventListener("click", toggleChat);
})();
