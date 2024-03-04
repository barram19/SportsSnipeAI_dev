document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const assistantId = 'asst_dZt5ChuOku6xFx3ysGBvZ90u'; // Use your OpenAI Assistant ID
    const apiKey = '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'; // Replace with your actual API key, ensure this is kept secure
    let conversationHistory = []; // To maintain conversation context

    sendButton.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = ''; // Clear input after sending
        }
    });

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            const message = userInput.value.trim();
            if (message) {
                sendMessage(message);
                userInput.value = ''; // Clear input after sending
            }
        }
    });

    async function sendMessage(message) {
        displayMessage(message, 'user'); // Display user message
        conversationHistory.push({role: "user", content: message}); // Add user message to history
        await sendToOpenAI(message); // Send user message to OpenAI Assistant
    }

    async function sendToOpenAI(message) {
        try {
            const response = await fetch(`https://api.openai.com/v1/assistants/${assistantId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // Specify the model you're using
                    messages: conversationHistory // Include conversation history for context
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const assistantResponse = data.choices[0].message.content; // Assuming this is the correct path to the response
            conversationHistory.push({role: "assistant", content: assistantResponse}); // Add assistant response to history
            displayMessage(assistantResponse, 'bot'); // Display the assistant's response
        } catch (error) {
            console.error('Error:', error);
            displayMessage('Sorry, an error occurred. Please try again.', 'bot');
        }
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender); // 'user' or 'bot'
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
});
