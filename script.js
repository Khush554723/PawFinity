document.addEventListener("DOMContentLoaded", () => {
    // 1. Elements Selection
    const searchForm = document.getElementById("breedSearchForm");
    const searchInput = document.getElementById("breedInput");
    const modal = document.getElementById("adoptionModal");
    const fabBtn = document.getElementById("adoptBtn"); 
    const closeBtn = document.getElementById("closeModal");

    // Chatbot Elements
    const chatBtn = document.getElementById("pawChatToggle");
    const chatWin = document.getElementById("pawChatWindow");
    const chatClose = document.getElementById("pawClose");
    const chatInput = document.getElementById("pawInput");
    const chatSend = document.getElementById("pawSend");
    const msgArea = document.getElementById("pawMessages");
    

    /* =========================
       🔍 SEARCH & REDIRECT
    ========================= */
    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const breedName = searchInput.value.trim().toLowerCase();

            if (breedName) {
                sessionStorage.setItem("selectedBreed", JSON.stringify({ name: breedName }));
                window.location.href = "dog-gallery.html";
            } else {
                alert("Please enter a dog breed! 🐶");
            }
        });
    }

    /* =========================
       🏠 FAB BUTTON & MODAL
    ========================= */
    if (fabBtn && modal) {
        fabBtn.onclick = () => {
            modal.style.display = "flex"; 
        };
    }

    if (closeBtn && modal) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    /* =========================
       💬 CHATBOX LOGIC
    ========================= */
    if (chatBtn && chatWin) {
        chatBtn.onclick = () => {
            // Toggle Chat Window
            const isHidden = chatWin.style.display === "none" || chatWin.style.display === "";
            chatWin.style.display = isHidden ? "flex" : "none";
        };

        if (chatClose) {
            chatClose.onclick = () => {
                chatWin.style.display = "none";
            };
        }

        // Send Message Function
        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (!text) return;

            // User side
            appendMsg(text, 'user');
            chatInput.value = "";

            // Bot side reply
            setTimeout(() => {
                let reply = "Woof! 🐾 I can help you find a breed or start the adoption process. Ask me about breeds!";
                const lowerText = text.toLowerCase();

                if (lowerText.includes("hi") || lowerText.includes("hello")) reply = "Hi there! Looking for a new furry friend?";
                if (lowerText.includes("adopt")) reply = "To adopt, search for a breed or click the '+' button!";
                if (lowerText.includes("husky")) reply = "Huskies are great! Search for 'Husky' to see them.";

                appendMsg(reply, 'bot');
            }, 600);
        };

        const appendMsg = (content, side) => {
            const div = document.createElement("div");
            div.style.margin = "10px 0";
            div.style.padding = "10px";
            div.style.borderRadius = "10px";
            div.style.maxWidth = "80%";
            div.style.fontSize = "0.9rem";

            if (side === 'user') {
                div.style.background = "#ff7e5f";
                div.style.color = "white";
                div.style.marginLeft = "auto";
            } else {
                div.style.background = "#1e293b";
                div.style.color = "white";
                div.style.border = "1px solid #ff7e5f";
            }

            div.innerText = content;
            msgArea.appendChild(div);
            msgArea.scrollTop = msgArea.scrollHeight;
        };

        if (chatSend) chatSend.onclick = sendMessage;
        if (chatInput) {
            chatInput.onkeypress = (e) => {
                if (e.key === "Enter") sendMessage();
            };
        }
    }

    // Modal/Chat band karne ke liye global click
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    
});