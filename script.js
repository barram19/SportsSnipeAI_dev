document.addEventListener("DOMContentLoaded", function() {
    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    sendBtn.addEventListener('click', sendMessage);

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        displayMessage(message, 'user');

        sendMessageToAI(message).then(response => {
            displayMessage(response, 'ai');
        });

        userInput.value = '';
    }

    async function sendMessageToAI(message) {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: message,
                max_tokens: 150
            })
        });
        const data = await response.json();
        return data.choices[0].text.trim();
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'ai' ? 'ai-message' : 'user-message');
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
