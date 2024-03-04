document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const assistantId = 'asst_dZt5ChuOku6xFx3ysGBvZ90u'; // Use your OpenAI Assistant ID
    const apiKey = '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'; // Replace with your actual API key, ensure this is kept secure
    let sessionId = null; // Store session ID for maintaining conversation context

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = ''; // Clear input after sending
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            const message = userInput.value.trim();
            if (message) {
                sendMessage(message);
                userInput.value = ''; // Clear input after sending
            }
        }
    });

    function sendMessage(message) {
        displayMessage(message, 'user'); // Display user message
        sendToAssistant(message); // Send user message to OpenAI Assistant
    }

    function sendToAssistant(message) {
        // Initialize session if not already done
        if (!sessionId) {
            startSession().then(() => sendToAssistant(message)); // Start session and resend message
            return;
        }

        const requestBody = {
            input: message,
            session: sessionId // Include session ID for maintaining context
        };

        fetch(`https://api.openai.com/v1/assistants/${assistantId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            // Assuming the API returns the assistant's response in a structured format
            const assistantResponse = data.choices[0].message.content; // Adapt based on actual API response structure
            displayMessage(assistantResponse, 'bot'); // Display assistant's response
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('Sorry, an error occurred. Please try again.', 'bot');
        });
    }

    function startSession() {
        // Create a new session for maintaining conversation context
        return fetch(`https://api.openai.com/v1/assistants/${assistantId}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        })
        .then(response => response.json())
        .then(data => {
            sessionId = data.id; // Store new session ID
        })
        .catch(error => {
            console.error('Error starting session:', error);
        });
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender); // Ensure these classes are defined in your CSS
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
});
