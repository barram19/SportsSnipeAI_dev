document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();

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

    // Retrieve stored thread ID, if any
    const threadID = localStorage.getItem('threadID');

    // Send OPTIONS request first
    fetch('https://us-central1-cbbbot-413503.cloudfunctions.net/barrysnipes', {
        method: 'OPTIONS',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            // If OPTIONS request is successful, proceed with the POST request
            return fetch('https://us-central1-cbbbot-413503.cloudfunctions.net/barrysnipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: userInput, thread_id: threadID }) // Include thread ID in the request
            });
        } else {
            throw new Error('Failed to fetch');
        }
    })
    .then(response => response.json())
    .then(data => {
        // Remove the placeholder
        placeholderDiv.remove();

        // Save the thread ID for future use
        if (data.thread_id) {
            localStorage.setItem('threadID', data.thread_id);
            pollForUpdates(data.thread_id);
        }

        // Display the assistant's response(s)
        data.messages.forEach((message) => {
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('assistant-response'); // Add class for assistant responses
            responseDiv.textContent = message;
            chatBox.appendChild(responseDiv);
        });

        // Scroll to the latest message after adding the assistant's response
        chatBox.scrollTop = chatBox.scrollHeight;

        // Start polling for updates if there's a thread ID
        if (data.thread_id) {
            setTimeout(() => pollForUpdates(data.thread_id), 3000); // Start polling after a delay
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        placeholderDiv.remove(); // Ensure to remove the placeholder even if an error occurs
    });

    // Clear input after sending
    document.getElementById('user-input').value = '';
});

function pollForUpdates(threadID) {
    fetch(`https://us-central1-cbbbot-413503.cloudfunctions.net/barrysnipes/poll?thread_id=${threadID}`, {
        method: 'GET', // Assuming a new endpoint or method to poll for updates
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.messages && data.messages.length > 0) {
            const chatBox = document.getElementById('chat-box');
            data.messages.forEach((message) => {
                const responseDiv = document.createElement('div');
                responseDiv.classList.add('assistant-response');
                responseDiv.textContent = message;
                chatBox.appendChild(responseDiv);
            });
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        // If there's still a thread active, keep polling
        if (data.thread_id) {
            setTimeout(() => pollForUpdates(threadID), 3000); // Adjust delay as needed
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
