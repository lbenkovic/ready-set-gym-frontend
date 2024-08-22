<template>
  <div class="chat-page">
    <!-- Sidebar for old conversations -->
    <div class="sidebar">
      <h3>Conversations</h3>
      <div class="search-bar">
        <input
          v-model="searchQuery"
          @input="filterConversations"
          placeholder="Search conversations..."
        />
      </div>
      <ul>
        <li
          v-for="(conversation, index) in filteredConversations"
          :key="index"
          @click="selectConversation(conversation)"
          :class="{ selected: conversation.userEmail === userEmail }"
        >
          {{ conversation.userEmail }}
        </li>
      </ul>
    </div>

    <!-- Main chat area -->
    <div class="chat-area">
      <div class="chat-header">
        <div class="header-content">GymGPT</div>
      </div>
      <div class="chat-body">
        <div
          class="message"
          v-for="(message, index) in messages"
          :key="index"
          :class="{
            'my-message': message.isMine,
            'their-message': !message.isMine,
          }"
        >
          <span class="profile-icon material-symbols-outlined"> person </span>
          <div class="message-content">
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>
      <div class="chat-footer">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatBot",

  data() {
    return {
      conversations: [], // Populated from backend or state management
      messages: [], // Populated from backend or state management
      newMessage: "",
      searchQuery: "",
      filteredConversations: [], // Filtered conversations based on search query
    };
  },
  created() {
    this.filteredConversations = this.conversations;
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        this.messages.push({ content: this.newMessage, isMine: true });
        this.newMessage = "";
        // Emit message to backend here
      }
    },
    selectConversation(conversation) {
      // Logic to load selected conversation
      this.userEmail = conversation.userEmail;
      this.messages = conversation.messages;
    },
    filterConversations() {
      this.filteredConversations = this.conversations.filter((conversation) =>
        conversation.userEmail
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.chat-page {
  display: flex;
  height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #121212;
}

.sidebar {
  width: 300px;
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
}

.sidebar h3 {
  margin-top: 0;
  font-size: 20px;
  font-weight: 600;
  color: #d29433;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 25px;
  background-color: #333;
  color: #e0e0e0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  padding: 12px 15px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar li:hover {
  background-color: #333;
  color: #fff;
}

.sidebar li.selected {
  background-color: #444;
  color: #d29433;
  font-weight: bold;
}

.chat-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  color: #e0e0e0;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.chat-header {
  padding: 15px;
  background: linear-gradient(135deg, #ff6f00, #d29433);
  color: #fff;
  text-align: center;
  font-size: 25px;
  font-weight: 700;
  border-bottom: 1px solid #333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  border-radius: 0 0 15px 15px;
}

.header-content {
  display: flex;
  justify-content: start;
  font-size: 30px;
}

.user-icon {
  font-size: 36px;
  margin-right: 10px;
  color: #fff;
}

.chat-body {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.profile-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-right: 12px;
  color: #e0e0e0;
}

.message-content {
  max-width: 75%;
  padding: 12px;
  border-radius: 15px;
  color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.my-message {
  display: flex;
  justify-content: flex-end;
}

.my-message .profile-icon {
  order: 2;
}

.my-message .message-content {
  background-color: #d29433;
  border-radius: 15px 15px 0 15px;
}

.their-message {
  display: flex;
  align-items: flex-start;
  margin-right: auto;
}

.their-message .profile-icon {
  order: 1;
}

.their-message .message-content {
  background-color: #333;
  border-radius: 15px 15px 15px 0;
}

.chat-footer {
  padding: 10px;
  background-color: #d29433;
  display: flex;
  align-items: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
}

.chat-footer input {
  flex-grow: 1;
  padding: 12px;
  border: none;
  border-radius: 25px;
  background-color: #333;
  color: #e0e0e0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.chat-footer button {
  background-color: #000;
  color: #d29433;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  margin-left: 10px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  transition: background-color 0.3s, transform 0.2s;
}

.chat-footer button:hover {
  background-color: #333;
  transform: scale(1.05);
}
</style>
