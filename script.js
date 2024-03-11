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

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message

    const threadID = localStorage.getItem('threadID'); // Retrieve stored thread ID, if any

    sendMessageToServer(userInput, threadID);
    
    // Clear input after sending
    document.getElementById('user-input').value = '';
});

function sendMessageToServer(userInput, threadID) {
    const chatBox = document.getElementById('chat-box');
    // Create a placeholder for the loading indicator
    const placeholderDiv = createLoadingIndicator();
    chatBox.appendChild(placeholderDiv);

    fetch('https://us-central1-cbbbot-413503.cloudfunctions.net/barrysnipesv2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: userInput, thread_id: threadID }) // Include thread ID in the request
    })
    .then(response => response.json())
    .then(data => {
        placeholderDiv.remove(); // Remove the loading indicator

        if (data.thread_id) {
            localStorage.setItem('threadID', data.thread_id); // Save the thread ID for future use
        }

        if (data.messages && data.messages.length > 0) {
            data.messages.forEach(message => {
                displayMessage(message);
            });
        }

        // Start polling for updates after a short delay
        setTimeout(() => checkForUpdates(data.thread_id), 1000);
    })
    .catch(error => {
        console.error('Error:', error);
        placeholderDiv.remove(); // Ensure to remove the placeholder even if an error occurs
    });
}

function createLoadingIndicator() {
    const placeholderDiv = document.createElement('div');
    placeholderDiv.classList.add('loading-placeholder');
    const loadingIndicator = document.getElementById('loading-indicator').cloneNode(true);
    loadingIndicator.style.display = 'block'; // Make it visible
    placeholderDiv.appendChild(loadingIndicator);
    return placeholderDiv;
}

function displayMessage(message) {
    const chatBox = document.getElementById('chat-box');
    const responseDiv = document.createElement('div');
    responseDiv.classList.add('assistant-response');
    responseDiv.textContent = message;
    chatBox.appendChild(responseDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function checkForUpdates(threadID) {
    fetch(`https://us-central1-cbbbot-413503.cloudfunctions.net/barrysnipesv2/check-updates?thread_id=${threadID}`)
        .then(response => response.json())
        .then(data => {
            if (data.messages.length > 0) {
                data.messages.forEach(message => {
                    displayMessage(message.content); // Display each message
                });
            }
            if (!data.final) {
                // If not final, keep checking
                setTimeout(() => checkForUpdates(threadID), 3000);
            }
        })
        .catch(error => console.error('Error:', error));
}
