/* ============================================================
   PAW-PUFFS DYNAMIC GALLERY SYSTEM (V2.0) - Firebase Stable
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration parameters
const firebaseConfig = {
    apiKey: "AIzaSyCukDlkm1Ur4O4VbdNudk6JBY6b0MGpK0s",
    authDomain: "pawpuffs-90cb5.firebaseapp.com",
    projectId: "pawpuffs-90cb5",
    storageBucket: "pawpuffs-90cb5.firebasestorage.app",
    messagingSenderId: "264389926965",
    appId: "1:264389926965:web:af7f81f38ba487f09f517c",
    measurementId: "G-8Y9ZSKZ1G0"
};

// Initialize Firebase & Cloud Firestore core
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async function() {
    // 1. Storage se data nikaalna
    const rawData = sessionStorage.getItem('selectedBreed');
    const breedData = JSON.parse(rawData || '{}');
    
    // Agar memory khali hai toh home par redirect kar do
    if (!breedData.name) {
        window.location.href = 'index.html';
        return;
    }

    const breedName = breedData.name.toLowerCase().trim();
    
    // 2. UI Elements Link karna
    const breedNameDisplay = document.getElementById('breedNameDisplay');
    const breedDescription = document.getElementById('breedDescription');
    const imageGrid = document.getElementById('imageGrid');

    // Title update karna
    breedNameDisplay.textContent = breedData.name.toUpperCase();

    // 3. 100+ Breeds Logic (Specific for popular, Generic for others)
    const breedInfos = {
        'pug': "Pugs are small, affectionate, and full of personality. They love human cuddles and naps!",
        'husky': "Huskies are energetic, vocal, and thick-coated dogs. They thrive in active and cool environments.",
        'labrador': "Labs are friendly, loyal, and highly intelligent family dogs. They are the world's most popular breed.",
        'golden retriever': "Gentle, smart, and devoted. Goldens are perfect for families and excel in obedience.",
        'beagle': "Curious, merry, and energetic. Beagles are excellent scent hounds and loyal friends.",
        'bulldog': "Docile, willful, and deeply devoted. Bulldogs make excellent and calm indoor companions.",
        'poodle': "Proud, active, and very smart. Poodles are highly trainable and elegant dogs.",
        'german shepherd': "Confident, courageous, and smart. They are known for their loyalty and protective nature.",
        'rottweiler': "A loyal and confident guardian. They are incredibly protective of their families.",
        'chihuahua': "Tiny in size but huge in heart. They are lively, alert, and very devoted pets."
    };

    // Agar breed list mein nahi hai, toh ye automatic description banayega
    const defaultDesc = `The ${breedData.name} is a loyal and loving breed, known for its unique personality and waiting for a forever home with a perfect family.`;
    breedDescription.textContent = breedInfos[breedName] || defaultDesc;

    // 4. Modal Open/Close Logic
    const modal = document.getElementById('adoptionModal');
    const openBtn = document.getElementById('adoptBtnMain');
    const closeBtn = document.getElementById('closeModalBtn');

    if (openBtn) openBtn.onclick = () => modal.style.display = 'flex';
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    
    // Background click par modal band karna
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    // 5. Fetch 12 Images from Dog API
    imageGrid.innerHTML = '<div class="loader">🐕 Loading amazing pups for you...</div>';

    try {
        // API Path Format (e.g. "golden retriever" -> "retriever/golden")
        const nameParts = breedName.split(' ');
        const apiPath = nameParts.length > 1 ? `${nameParts[1]}/${nameParts[0]}` : nameParts[0];

        const response = await fetch(`https://dog.ceo/api/breed/${apiPath}/images/random/12`);
        const data = await response.json();

        if (data.status === "success") {
            imageGrid.innerHTML = ""; // Loader clear karna
            data.message.forEach(url => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `
                    <img src="${url}" alt="dog" loading="lazy">
                    <div class="overlay">
                        <i class="fas fa-heart"></i>
                        <span>Adopt Me</span>
                    </div>
                `;
                // Image par click karne se bhi adoption form khul jaye
                div.onclick = () => modal.style.display = 'flex';
                imageGrid.appendChild(div);
            });
        } else {
            imageGrid.innerHTML = `<div class="error">Sorry, we couldn't find specific photos for "${breedData.name}". Try searching "Pug" or "Husky"!</div>`;
        }
    } catch (err) {
        imageGrid.innerHTML = '<div class="error">Connection Error! Please check your internet.</div>';
    }

    // 6. Form Submission Logic with Safety Check
    const adoptionForm = document.getElementById('adoptionForm');

    if (adoptionForm) {
        adoptionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('submitBtn');
            const breedData = JSON.parse(sessionStorage.getItem('selectedBreed') || '{}');

            // Button loading state
            btn.innerText = "Sending Request... 🐾";
            btn.disabled = true;

            // Form se data nikalna safely using explicit element IDs
            const formData = {
                breed: breedData.name || "Unknown",
                customerName: document.getElementById('applicantName').value,
                customerEmail: document.getElementById('applicantEmail').value,
                reason: document.getElementById('adoptionReason').value,
                submittedAt: serverTimestamp() // Real-time server time payload
            };

            try {
                // Firestore mein 'adoption_requests' naam ke collection mein save karna
                await addDoc(collection(db, "adoption_requests"), formData);
                
                // Success Feedback UI animation sequence
                btn.innerHTML = "Request Sent! ✅";
                btn.style.background = "#22c55e"; 

                setTimeout(() => {
                    modal.style.display = 'none';
                    adoptionForm.reset();
                    btn.innerText = "Submit Request 🐾";
                    btn.disabled = false;
                    btn.style.background = "";
                }, 2500);

            } catch (error) {
                console.error("Firebase Error Details:", error);
                alert("Submission failed! Make sure your Firebase Firestore Rules are set to public.");
                btn.disabled = false;
                btn.innerText = "Try Again 🐾";
                btn.style.background = "";
            }
        });
    }
});