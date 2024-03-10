document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Check if a session ID exists in localStorage, otherwise create one
    let sessionID = localStorage.getItem('session_id');
    if (!sessionID) {
        sessionID = Date.now().toString(); // Simple generation, consider UUID for production
        localStorage.setItem('session_id', sessionID);
    }

    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return; // Skip empty inputs

    const chatBox = document.getElementById('chat-box');
    
    // Display user's question
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-message'); // Add class for user messages
    userDiv.textContent = `You: ${userInput}`;
    chatBox.appendChild(userDiv);

    // Scroll to the latest message after adding the user's message
    chatBox.scrollTop = chatBox.scrollHeight;

    // Create a placeholder for the loading indicator
    const placeholderDiv = document.createElement('div');
    placeholderDiv.classList.add('loading-placeholder');
    chatBox.appendChild(placeholderDiv);

    // Show the loading indicator inside the placeholder
    const loadingIndicator = document.getElementById('loading-indicator').cloneNode(true);
    loadingIndicator.style.display = 'block'; // Make it visible
    placeholderDiv.appendChild(loadingIndicator);

    // Make a POST request to your Flask endpoint
    fetch('https://us-central1-cbbbot-413503.cloudfunctions.net/barrysnipesv3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    
    .then(response => response.json())
    .then(data => {
        // Handle success, remove the placeholder, display responses, etc.
        placeholderDiv.remove(); // Remove the loading indicator

        // Display the assistant's response(s)
        data.messages.forEach((message) => {
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('assistant-response'); // Add class for assistant responses
            responseDiv.textContent = message;
            chatBox.appendChild(responseDiv);
        });

        // Scroll to the latest message after adding the assistant's response
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch((error) => {
        console.error('Error:', error);
        placeholderDiv.remove(); // Ensure to remove the placeholder even if an error occurs
    });

    // Clear input after sending
    document.getElementById('user-input').value = '';
});
