document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const assistantId = 'asst_dZt5ChuOku6xFx3ysGBvZ90u'; // Replace with your OpenAI Assistant ID
    const apiKey = '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'; // Replace with your actual API key

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
        // Make API request to OpenAI Assistant
        fetch(`https://api.openai.com/v1/assistants/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'OpenAI-Beta': 'assistants=v1',
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo-preview', // The model you're using
                messages: [
                    {
                        role: 'user',
                        content: message,
                    },
                ],
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Extract response from OpenAI Assistant
            const assistantResponse = data.choices[0].message.content;

            // Display Assistant response
            displayMessage(assistantResponse, 'bot');
        })
        .catch(error => {
            console.error('Error:', error);
            console.error('Error response:', error.response); // Log the error response
            displayMessage('Sorry, an error occurred while processing your request. Please try again later.', 'bot');
        });

    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
