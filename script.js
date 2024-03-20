document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const userInputField = document.getElementById('user-input');
    const sendButton = this.querySelector('button[type="submit"]');
    const userInput = userInputField.value;
    if (!userInput.trim()) return; // Skip empty inputs

    const chatBox = document.getElementById('chat-box');
    
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-message');
    userDiv.textContent = `You: ${userInput}`;
    chatBox.appendChild(userDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

    const placeholderDiv = document.createElement('div');
    placeholderDiv.classList.add('loading-placeholder');
    chatBox.appendChild(placeholderDiv);

    const loadingIndicator = document.getElementById('loading-indicator').cloneNode(true);
    loadingIndicator.style.display = 'block';
    placeholderDiv.appendChild(loadingIndicator);

    userInputField.disabled = true;
    sendButton.disabled = true;

    userInputField.value = '';

    let sessionData = sessionStorage.getItem('sessionData');
    let threadID = null;
    if (sessionData) {
        threadID = JSON.parse(sessionData).threadID;
    }

    fetch('https://us-central1-cbbbot-413503.cloudfunctions.net/barrysnipesv3', {
        method: 'OPTIONS',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            return fetch('https://us-central1-cbbbot-413503.cloudfunctions.net/barrysnipesv3', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: userInput, thread_id: threadID })
            });
        } else {
            throw new Error('Failed to fetch');
        }
    })
    .then(response => response.json())
    .then(data => {
        placeholderDiv.remove();
        if (data.thread_id) {
            sessionStorage.setItem('sessionData', JSON.stringify({threadID: data.thread_id}));
            pollForMessages(data.thread_id); // Start polling for messages
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        placeholderDiv.remove();
    })
    .finally(() => {
        userInputField.disabled = false;
        sendButton.disabled = false;
    });
});

function pollForMessages(threadID, lastMessageID = null) {
    fetch('https://us-central1-cbbbot-413503.cloudfunctions.net/message_poll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thread_id: threadID, last_message_id: lastMessageID })
    })
    .then(response => response.json())
    .then(data => {
        const chatBox = document.getElementById('chat-box');
        if (data && data.length > 0) {
            data.forEach((message) => {
                const responseDiv = document.createElement('div');
                responseDiv.classList.add('assistant-response');
                responseDiv.innerHTML = message.content; // Assuming your backend sends HTML content
                chatBox.appendChild(responseDiv);

                lastMessageID = message.id; // Update the lastMessageID with the newest message
            });

            chatBox.scrollTop = chatBox.scrollHeight;
        }
        // Continue polling
        setTimeout(() => pollForMessages(threadID, lastMessageID), 5000);
    })
    .catch((error) => {
        console.error('Polling error:', error);
    });
}
