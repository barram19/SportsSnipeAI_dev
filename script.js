document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const userInput = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-box');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Show the loading indicator
    loadingIndicator.style.display = 'block';
    // When displaying the user's question
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-message'); // Add class for user messages
    userDiv.textContent = `You: ${userInput}`;
    chatBox.appendChild(userDiv);

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
        // Hide the loading indicator
        loadingIndicator.style.display = 'none';

        data.messages.forEach((message) => {
            const responseDiv = document.createElement('div');
            responseDiv.textContent = `Assistant: ${message}`;
            chatBox.appendChild(responseDiv);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
        // Hide the loading indicator even if there's an error
        loadingIndicator.style.display = 'none';
    });

    // Clear input after sending
    document.getElementById('user-input').value = '';
});
//update 5
