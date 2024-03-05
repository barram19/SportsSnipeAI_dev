document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return; // Skip empty inputs

    const chatBox = document.getElementById('chat-box');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Display user's question
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-message'); // Add class for user messages
    userDiv.textContent = `You: ${userInput}`;
    chatBox.appendChild(userDiv);

    // Show the loading indicator
    loadingIndicator.style.display = 'block'; // Make it visible

    fetch('https://us-central1-cbbbot-413503.cloudfunctions.net/barrysnipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: userInput})
    })
    .then(response => response.json())
    .then(data => {
        // Hide the loading indicator
        loadingIndicator.style.display = 'none';

        data.messages.forEach((message) => {
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('assistant-response'); // Add class for assistant responses
            responseDiv.textContent = `Assistant: ${message}`;
            chatBox.appendChild(responseDiv);
        });

        // Scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch((error) => {
        console.error('Error:', error);
        // Hide the loading indicator even if there's an error
        loadingIndicator.style.display = 'none';
    });

    // Clear input after sending
    document.getElementById('user-input').value = '';
});
