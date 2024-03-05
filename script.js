document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const userInput = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-box');

    // Display user's question
    const userDiv = document.createElement('div');
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
    const responseDiv = document.createElement('div');
    responseDiv.textContent = `Assistant: ${data.your}`; // Adjust this line based on actual key names in your JSON
    chatBox.appendChild(responseDiv);
    })
})
    // Clear input after sending
    document.getElementById('user-input').value = '';
});
