document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const userInput = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-box');
    const loadingIndicator = document.getElementById('loading-indicator');

    // When displaying the user's question
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-message'); // Add class for user messages
    userDiv.textContent = `You: ${userInput}`;
    chatBox.appendChild(userDiv);

 // Temporarily append the loading indicator to the chat box
    chatBox.appendChild(loadingIndicator);
    loadingIndicator.style.display = 'block'; // Make it visible
    
    // Call the Google Cloud Function
    fetch('https://us-central1-cbbbot-413503.cloudfunctions.net/barrysnipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: userInput})
    })
    .then(response => response.json())
    .then(data => {
        // Once the response is ready, remove the loading indicator
        chatBox.removeChild(loadingIndicator);
        loadingIndicator.style.display = 'none'; // Hide it again for future use

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
        // Ensure to remove the loading indicator even if an error occurs
        chatBox.removeChild(loadingIndicator);
        loadingIndicator.style.display = 'none';
    });

    // Clear input after sending
    document.getElementById('user-input').value = '';
});
