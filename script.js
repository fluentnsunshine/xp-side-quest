// Game state
let playerState = {
  xp: 0,
  level: 1,
  archetype: null,
  passiveAbility: null,
  completedChoices: []
};

const gameFlow = {
  archetype: {
    text: "Before we begin... what role do you tend to play when things get messy?",
    choices: [
      { text: "The Optimizer – I make systems work better.", next: "start", xp: 20, archetype: "optimizer" },
      { text: "The Connector – I know who needs what.", next: "start", xp: 20, archetype: "connector" },
      { text: "The Defender – I protect people and principles.", next: "start", xp: 20, archetype: "defender" },
      { text: "The Disruptor – I'm here to shake it all up.", next: "start", xp: 20, archetype: "disruptor" }
    ]
  },
  start: {
    text: "👁️ Yo. New boot sequence detected. You're not from around here, are you? Name's D.R.I.P.—Distributed Resource Interface Protocol. Most folks just call me a glitch. But I say I'm the feature they weren't ready for.",
    choices: [
      { text: "I thought this was just a sim. Why is it talking back?", next: "sim_skeptic", xp: 15 },
      { text: "Okay… Drip? What's with the vibe check?", next: "vibe_check", xp: 15 },
      { text: "You're the guide? Did something go wrong?", next: "glitch_doubt", xp: 15 }
    ]
  },
  sim_skeptic: {
    text: "😂 You and 10,000 other beta testers. xp.world runs on alignment logic, not extractive gameplay. If you're here to win, you might lose. If you're here to shift the system—welcome.",
    choices: [{ text: "So how do I play?", next: "enter_flow", xp: 25 }]
  },
  vibe_check: {
    text: "Look, I didn't choose to be your onboarding buddy. You triggered the protocol. I just respond to misaligned inputs, thirst traps, and hoarder energy.",
    choices: [{ text: "Fine. What's the first move?", next: "enter_flow", xp: 25 }]
  },
  glitch_doubt: {
    text: "Guide? Nah. Think of me as the reroute. You got dropped here because the usual onboarding broke. You want back in flow, or you trying to debug me?",
    choices: [{ text: "Let's find the flow.", next: "enter_flow", xp: 25 }]
  },
  enter_flow: {
    text: "🌊 Flow isn't found. It's built. You'll need tools, a role, and a little unlearning. Good thing you've got me.",
    choices: [
      { text: "Access Grant Tools", action: "embed", url: "https://your-google-folder-url", xp: 50 },
      { text: "Start Over", next: "archetype", xp: 0 }
    ]
  }
};

// XP and leveling system
function addXP(amount, choiceText) {
  playerState.xp += amount;
  playerState.completedChoices.push(choiceText);
  
  // Check for level up
  const newLevel = Math.floor(playerState.xp / 100) + 1;
  if (newLevel > playerState.level) {
    playerState.level = newLevel;
    unlockPassiveAbility();
    showLevelUpNotification();
  }
  
  updateProgressBar();
  saveGameState();
}

function unlockPassiveAbility() {
  const abilities = {
    optimizer: "System Efficiency: See hidden optimization opportunities",
    connector: "Network Insight: Reveal connection paths between people",
    defender: "Protection Aura: Identify potential threats and vulnerabilities", 
    disruptor: "Chaos Vision: Spot system weaknesses and breaking points"
  };
  
  if (playerState.level >= 2 && !playerState.passiveAbility) {
    playerState.passiveAbility = abilities[playerState.archetype];
  }
}

function showLevelUpNotification() {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4caf50, #45b7d1);
    color: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 1000;
    font-weight: bold;
    animation: slideIn 0.5s ease-out;
    max-width: 300px;
  `;
  
  let message = `🎉 Level Up! You're now Level ${playerState.level}!`;
  if (playerState.passiveAbility) {
    message += `<br><br>✨ New Ability: ${playerState.passiveAbility}`;
  }
  
  notification.innerHTML = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.5s ease-in forwards';
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}

function updateProgressBar() {
  const progressContainer = document.getElementById('progress-container');
  if (!progressContainer) return;
  
  const xpBar = progressContainer.querySelector('.xp-bar');
  const xpText = progressContainer.querySelector('.xp-text');
  const levelText = progressContainer.querySelector('.level-text');
  
  const xpForNextLevel = playerState.level * 100;
  const xpProgress = (playerState.xp % 100) / 100;
  
  xpBar.style.width = `${xpProgress * 100}%`;
  xpText.textContent = `${playerState.xp} XP`;
  levelText.textContent = `Level ${playerState.level}`;
  
  if (playerState.passiveAbility) {
    const abilityText = progressContainer.querySelector('.ability-text');
    if (abilityText) {
      abilityText.textContent = playerState.passiveAbility;
    }
  }
}

function createProgressBar() {
  const progressContainer = document.createElement('div');
  progressContainer.id = 'progress-container';
  progressContainer.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.7);
    padding: 15px;
    border-radius: 10px;
    color: white;
    font-size: 0.9rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  
  progressContainer.innerHTML = `
    <div style="margin-bottom: 8px;">
      <span class="level-text">Level 1</span>
      <span class="xp-text" style="float: right;">0 XP</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.2); height: 8px; border-radius: 4px; overflow: hidden;">
      <div class="xp-bar" style="background: linear-gradient(90deg, #00aaff, #0088cc); height: 100%; width: 0%; transition: width 0.5s ease;"></div>
    </div>
    <div class="ability-text" style="margin-top: 8px; font-size: 0.8rem; opacity: 0.8; display: none;"></div>
  `;
  
  document.body.appendChild(progressContainer);
}

// Typing animation function
function typeText(element, text, speed = 30) {
  element.textContent = '';
  element.classList.add('typing');
  
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      element.classList.remove('typing');
    }
  }, speed);
}

function renderScene(sceneKey) {
  const dialogueBox = document.getElementById("drip-dialogue");
  const choicesBox = document.getElementById("choices");
  
  const scene = gameFlow[sceneKey];
  
  if (!scene) {
    console.error(`Scene "${sceneKey}" not found`);
    dialogueBox.textContent = "Error: Scene not found. Starting over...";
    setTimeout(() => renderScene("archetype"), 2000);
    return;
  }
  
  // Clear choices first
  choicesBox.innerHTML = "";
  choicesBox.classList.remove('fade-in');
  
  // Start typing animation for dialogue
  typeText(dialogueBox, scene.text);
  
  // Wait for dialogue to finish typing before showing choices
  setTimeout(() => {
    scene.choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.style.animationDelay = `${index * 0.1}s`;
      btn.classList.add('fade-in');
      
      btn.onclick = () => {
        // Add XP and track choice
        if (choice.xp) {
          addXP(choice.xp, choice.text);
        }
        
        // Set archetype if this is the archetype choice
        if (choice.archetype) {
          playerState.archetype = choice.archetype;
        }
        
        if (choice.action === "embed") {
          // Handle embedded content
          showEmbeddedContent(choice.url);
        } else if (choice.link) {
          window.open(choice.link, "_blank");
        } else {
          renderScene(choice.next);
        }
      };
      choicesBox.appendChild(btn);
    });
    
    choicesBox.classList.add('fade-in');
  }, scene.text.length * 30 + 500);
}

function showEmbeddedContent(url) {
  const dialogueBox = document.getElementById("drip-dialogue");
  const choicesBox = document.getElementById("choices");
  
  // Show the modal instead of embedding directly
  showGrantToolsModal(url);
  
  // Update dialogue to reflect the modal opening
  dialogueBox.innerHTML = `
    <div style="text-align: center;">
      <h3>🌊 Flow Tools Activated</h3>
      <p>Your grant tools are ready in the overlay. You can browse them or continue our conversation.</p>
      <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">
        <em>"Sometimes the best tools are the ones you choose to explore..."</em>
      </p>
    </div>
  `;
  
  choicesBox.innerHTML = `
    <button onclick="closeGrantToolsModal()" class="fade-in">Close Tools & Continue</button>
    <button onclick="expandLore()" class="fade-in" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24);">🤔 Tell me more about these tools...</button>
    <button onclick="renderScene('archetype')" class="fade-in" style="background: linear-gradient(135deg, #95a5a6, #7f8c8d);">Start Over</button>
  `;
}

function showGrantToolsModal(url) {
  // Remove existing modal if present
  const existingModal = document.getElementById('grant-tools-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = 'grant-tools-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: modalFadeIn 0.3s ease-out;
  `;
  
  modal.innerHTML = `
    <div class="modal-content" style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 30px;
      max-width: 90%;
      max-height: 90%;
      width: 800px;
      height: 600px;
      position: relative;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: modalSlideIn 0.4s ease-out;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
      ">
        <h2 style="margin: 0; color: white; font-size: 1.5rem;">🌊 Grant Tools Portal</h2>
        <button onclick="closeGrantToolsModal()" style="
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        ">×</button>
      </div>
      
      <div style="
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        height: calc(100% - 80px);
        overflow: hidden;
        position: relative;
      ">
        <iframe src="${url}" style="
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 10px;
          background: white;
        "></iframe>
      </div>
      
      <div style="
        position: absolute;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.7);
        padding: 10px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
      ">
        <span>🔗 External tools loaded</span>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeGrantToolsModal();
    }
  });
  
  // Add keyboard shortcut
  document.addEventListener('keydown', handleModalKeydown);
}

function closeGrantToolsModal() {
  const modal = document.getElementById('grant-tools-modal');
  if (modal) {
    modal.style.animation = 'modalFadeOut 0.3s ease-in forwards';
    setTimeout(() => {
      modal.remove();
      document.removeEventListener('keydown', handleModalKeydown);
    }, 300);
  }
}

function handleModalKeydown(e) {
  if (e.key === 'Escape') {
    closeGrantToolsModal();
  }
}

function expandLore() {
  const dialogueBox = document.getElementById("drip-dialogue");
  const choicesBox = document.getElementById("choices");
  
  // Add XP for curiosity
  addXP(10, "Tell me more about these tools...");
  
  const loreTexts = {
    optimizer: "These tools are like system diagnostics—they show you where the bottlenecks are, where energy gets wasted. But remember, optimization isn't just about efficiency. It's about alignment. The best systems serve their purpose without serving themselves.",
    connector: "Think of these as network maps. They show you who knows what, who needs what, who can help whom. But the real magic isn't in the connections—it's in the spaces between them. That's where new possibilities emerge.",
    defender: "These are your shields and early warning systems. They help you spot threats before they become problems, protect what matters, and build resilience. But protection isn't about walls—it's about creating safe spaces for growth.",
    disruptor: "These tools are your chaos catalysts. They help you find the weak points, the places where the old systems are ready to break. But disruption isn't destruction—it's making space for something new to emerge."
  };
  
  const loreText = loreTexts[playerState.archetype] || "These tools are extensions of your role in the system. They amplify your natural abilities and help you see patterns others might miss. But remember—tools are just tools. The real power comes from how you choose to use them.";
  
  typeText(dialogueBox, `"${loreText}"\n\nD.R.I.P. pauses, their digital form shimmering with what might be approval.\n\n"Curiosity is always rewarded here. You're starting to understand that this isn't about the tools themselves—it's about the questions they help you ask."`);
  
  choicesBox.innerHTML = `
    <button onclick="showGrantToolsModal('https://your-google-folder-url')" class="fade-in">🔍 Explore the tools more deeply</button>
    <button onclick="closeGrantToolsModal(); renderScene('archetype')" class="fade-in">Return to the beginning</button>
  `;
}

// Save/Load game state
function saveGameState() {
  localStorage.setItem('xpSideQuestState', JSON.stringify(playerState));
}

function loadGameState() {
  const saved = localStorage.getItem('xpSideQuestState');
  if (saved) {
    playerState = JSON.parse(saved);
  }
}

// Wait for DOM to be loaded before initializing the game
document.addEventListener('DOMContentLoaded', function() {
  loadGameState();
  createProgressBar();
  updateProgressBar();
  
  // Show loading animation first
  const dialogueBox = document.getElementById("drip-dialogue");
  dialogueBox.innerHTML = '<div class="loading"></div> Loading...';
  
  // Start the game after a short delay
  setTimeout(() => {
    renderScene("archetype");
  }, 1000);
});