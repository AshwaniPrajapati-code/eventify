function openHelpModal() {
  const helpModal = document.getElementById("helpModal");
  if (helpModal) helpModal.style.display = "flex";
}

function toggleAIChat() {
  const chatWin = document.getElementById("aiChatWindow");
  if (chatWin) {
    chatWin.style.display = (chatWin.style.display === "flex") ? "none" : "flex";
  }
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById("aiInput");
  if (input) {
    input.value = promptText;
    handleAIChatSubmit(new Event('submit'));
  }
}

function handleAIChatSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("aiInput");
  const query = input.value.trim();
  if (!query) return;

  const messagesBox = document.getElementById("aiMessages");

  const userDiv = document.createElement("div");
  userDiv.className = "user-msg";
  userDiv.innerText = query;
  messagesBox.appendChild(userDiv);

  input.value = "";
  messagesBox.scrollTop = messagesBox.scrollHeight;

  setTimeout(() => {
    const botResponse = generateAIResponse(query);
    const botDiv = document.createElement("div");
    botDiv.className = "bot-msg";
    botDiv.innerText = botResponse;
    messagesBox.appendChild(botDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }, 400);
}

function generateAIResponse(text) {
  const lower = text.toLowerCase();
  const currentEvents = (typeof events !== 'undefined') ? events : [];

  if (lower.includes("pass") || lower.includes("ticket") || lower.includes("entry")) {
    return "Event pass pane ke liye kisi bhi card par 'Register & Get Pass' click karein aur roll number bharein. Screen par QR Entry Pass generate ho jayega!";
  }

  if (lower.includes("technical") || lower.includes("hackathon") || lower.includes("coding")) {
    const tech = currentEvents.filter(e => e.category.toLowerCase() === "technical");
    const names = tech.map(e => e.title).join(", ");
    return `Technical category me active events hain: ${names || "Filhal koi event nahi mila"}.`;
  }

  if (lower.includes("cultural") || lower.includes("music") || lower.includes("dance")) {
    const cult = currentEvents.filter(e => e.category.toLowerCase() === "cultural");
    const names = cult.map(e => e.title).join(", ");
    return `Cultural events me scheduled hain: ${names || "Filhal koi event nahi mila"}.`;
  }

  if (lower.includes("sports") || lower.includes("cricket")) {
    const sports = currentEvents.filter(e => e.category.toLowerCase() === "sports");
    const names = sports.map(e => e.title).join(", ");
    return `Sports events me registered hain: ${names || "Filhal koi event nahi mila"}.`;
  }

  if (lower.includes("live") || lower.includes("all events") || lower.includes("event")) {
    return `Total ${currentEvents.length} events live hain. Technical, Cultural ya Sports tab select karke filter kar sakte hain.`;
  }

  if (lower.includes("free") || lower.includes("fees") || lower.includes("charge")) {
    return "Eventify portal par sabhi college events students ke liye bilkul Free hain!";
  }

  return "Main aapko live events search karne, dates batane aur entry pass generate karne me madad kar sakta hoon. Koi topic ya category likhein!";
}