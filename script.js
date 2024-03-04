document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const assistantId = 'asst_dZt5ChuOku6xFx3ysGBvZ90u'; // Use your OpenAI Assistant ID
    const apiKey = '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'; // Replace with your actual API key, ensure this is kept secure

    sendButton.addEventListener('click', () => {
        sendMessage(userInput.value);
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(userInput.value);
        }
    });

    function sendMessage(message) {
        // Display user message
        displayMessage(message, 'user');

        // Send user message to OpenAI Assistant
        sendToChatGPT(message);
    }

    function sendToChatGPT(message) {
        // Make API request to OpenAI Assistant using the correct endpoint and method
        fetch(`https://api.openai.com/v1/assistants/${assistantId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4-1106-preview', // Update to the model you're using, if necessary
                messages: [
                    {
                        role: "system",
                        content: "Your assistant-specific instructions here" // Any specific instructions
                    },
                    {
                        role: 'user',
                        content: message,
                    },
                ],
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Assuming the response structure has a list of messages where the last one is the assistant's response
            const assistantResponse = data.messages[data.messages.length - 1].content;

            // Display Assistant response
            displayMessage(assistantResponse, 'bot');
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('Sorry, an error occurred while processing your request. Please try again later.', 'bot');
        });
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender); // Ensure you have CSS classes for 'message', 'user', and 'bot' for styling
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
