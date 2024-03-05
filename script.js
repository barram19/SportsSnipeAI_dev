document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const userInput = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-box');

    // Display user's question
    const userDiv = document.createElement('div');
    userDiv.textContent = `You: ${userInput}`;
    chatBox.appendChild(userDiv);

    // Call the Google Cloud Function
    fetch('https://your-cloud-function-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: userInput})
    })
    .then(response => response.json())
    .then(data => {
        // Clear previous assistant responses
        chatBox.querySelectorAll('.assistant-response').forEach(el => el.remove());

        // Iterate over each message in the array and display it
        data.forEach((message) => {
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('assistant-response'); // Add class for styling or clearing
            responseDiv.textContent = `Assistant: ${message}`;
            chatBox.appendChild(responseDiv);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    // Clear input after sending
    document.getElementById('user-input').value = '';
});
//Update1
