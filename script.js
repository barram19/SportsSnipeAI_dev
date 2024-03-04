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

// Assuming we have a global variable to hold the conversation history
let conversationHistory = [];

function sendToAssistant(message) {
    // Add the user's message to the conversation history
    conversationHistory.push({ role: 'user', content: message });

    // Prepare the request payload, including the conversation history
    const payload = {
        model: "gpt-3.5-turbo", // Specify the model you're using
        messages: conversationHistory, // Include the entire conversation history
    };

    fetch(`https://api.openai.com/v1/assistants/${assistantId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1', // Include if needed, based on API version and requirements
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        // Process the response
        const assistantResponse = data.choices[0].message.content; // Adjust based on actual response structure
        conversationHistory.push({ role: 'assistant', content: assistantResponse }); // Update conversation history with the assistant's response

        displayMessage(assistantResponse, 'bot'); // Display the assistant's response in the UI
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage('Sorry, an error occurred. Please try again.', 'bot');
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
