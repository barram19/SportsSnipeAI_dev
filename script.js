document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const userInput = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-box');

    // Display user's question
    const userDiv = document.createElement('div');
    userDiv.textContent = `You: ${userInput}`;
    chatBox.appendChild(userDiv);

    // Call the Google Cloud Function
    fetch('YOUR_CLOUD_FUNCTION_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: userInput})
    })
    .then(response => response.json())
    .then(data => {
        // Display assistant's response
        const responseDiv = document.createElement('div');
        responseDiv.textContent = `Assistant: ${data.message}`;
        chatBox.appendChild(responseDiv);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    // Clear input after sending
    document.getElementById('user-input').value = '';
});
