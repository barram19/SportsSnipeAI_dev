document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const assistantId = 'asst_dZt5ChuOku6xFx3ysGBvZ90u'; // Use your OpenAI Assistant ID
    const apiKey = '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'; // Replace with your actual API key, ensure this is kept secure
    let conversationHistory = []; // To maintain conversation context

    sendButton.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = ''; // Clear input after sending
        }
    });

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            const message = userInput.value.trim();
            if (message) {
                sendMessage(message);
                userInput.value = ''; // Clear input after sending
            }
        }
    });

    const openai = new OpenAI();

    async function main() {
      const myAssistant = await openai.beta.assistants.retrieve(
        "asst_dZt5ChuOku6xFx3ysGBvZ90u"
      );
    
      console.log(myAssistant);
    }
    
 // Handles the conversation flow: creating a thread, adding a message, and getting a response
    async function handleConversation(userMessage) {
        displayMessage(userMessage, 'user'); // Display user's message

        // Step 1: Create a new thread (assuming your server endpoint handles thread creation)
        const threadResponse = await fetch('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey},
                'OpenAI-Beta': 'assistants=v1'
                }
                // No body required for thread creation, assuming your server handles it
        });
        const thread = await threadResponse.json();
        const threadId = thread.id; // Extract the thread ID from the response

        // Step 2: Add the user's message to the thread
        await fetch(`/server/add-message-to-thread/${threadId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ role: "user", content: userMessage })
        });

        // Step 3: Create a run to get the assistant's response
        const runResponse = await fetch(`/server/create-run/${threadId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ assistantId: 'asst_dZt5ChuOku6xFx3ysGBvZ90u' }) // Use your assistant ID
        });
        const runData = await runResponse.json();

        // Assuming the server returns the assistant's latest message in the run's response
        const assistantMessage = runData.latest_message.content;
        displayMessage(assistantMessage, 'bot'); // Display assistant's response
    }

    // Utility function to display messages in the chat box
    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender); // 'user' or 'bot'
        messageElement.textContent = `${sender === 'user' ? 'You' : 'Assistant'}: ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    }
});
    
    // Function to handle threading messages and receiving the response
    const openai = new OpenAI();
// Replace 'YOUR_SERVER_ENDPOINT' with the endpoint where you handle the API request on your server
        fetch('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                'Authorization': `Bearer ${apiKey}`
                'OpenAI-Beta': 'assistants=v1'
    async function main() {
      const messageThread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: message,
            file_ids: [],
          },
          {
            role: "user",
            content: message,
          },
        ],
      });
    
      console.log(messageThread);
    }
        
