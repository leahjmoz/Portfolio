// const citationsMenu = document.querySelector(".citations");
// function change1() {
//   console.log("it works!");
//   citationsMenu.classList.toggle("active1");
// }

// const imagesMenu = document.querySelector(".images");
// function change2() {
//   console.log("it works!");
//   imagesMenu.classList.toggle("active2");
// }

let topZIndex = 100; // starting z-index for sidebars
let topSidebar = null; // tracks which sidebar is currently on top

const citationsMenu = document.querySelector(".citations");
const imagesMenu = document.querySelector(".images");

function bringToFront(sidebar) {
  topZIndex++;
  sidebar.style.zIndex = topZIndex;
  topSidebar = sidebar;
}

// ---- Citations button ----
function change1() {
  const isActive = citationsMenu.classList.contains("active1");
  
  if (isActive) {
    // If citations is already top → close it
    if (topSidebar === citationsMenu) {
      citationsMenu.classList.remove("active1");
      topSidebar = null;
      return;
    }
    // Else bring it to top
    bringToFront(citationsMenu);
    return;
  }

  // If not active → open and bring to top
  citationsMenu.classList.add("active1");
  bringToFront(citationsMenu);
}

// ---- Images button ----
function change2() {
  const isActive = imagesMenu.classList.contains("active2");

  if (isActive) {
    // If images is already top → close it
    if (topSidebar === imagesMenu) {
      imagesMenu.classList.remove("active2");
      topSidebar = null;
      return;
    }
    // Else bring it to top
    bringToFront(imagesMenu);
    return;
  }

  // If not active → open and bring to top
  imagesMenu.classList.add("active2");
  bringToFront(imagesMenu);
}

const colophonMenu = document.querySelector(".colophon");
function change3() {
  console.log("it works!");
  colophonMenu.classList.toggle("active3");
}


document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("cursor");
  const speed = 33;

  let typingQueue = [];
  let currentIndex = 0;
  let isTyping = false;
  let skipRequested = false;
  let typingFinished = false;

  function typeSection(templateId, textId, callback) {
    const textEl = document.getElementById(textId);
    const rawText = document.getElementById(templateId).innerHTML.trim();

    const segments = [];
    const strikeRegex = /<strike>(.*?)<\/strike>/g;
    let lastIndex = 0, match;

    while ((match = strikeRegex.exec(rawText)) !== null) {
      if (match.index > lastIndex)
        segments.push({ text: rawText.slice(lastIndex, match.index), strike: false });
      segments.push({ text: match[1], strike: true });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < rawText.length)
      segments.push({ text: rawText.slice(lastIndex), strike: false });

    let segIndex = 0;
    let charIndex = 0;
    let currentSpan = null;

    isTyping = true;

    // === Finish instantly (skip)
    function finishInstantly() {
      let finalHTML = "";
      segments.forEach(seg => {
        if (seg.strike) {
          finalHTML += `<span class="strike struck">${seg.text}</span>`;
        } else {
          finalHTML += seg.text;
        }
      });

      textEl.innerHTML = finalHTML;
      textEl.insertAdjacentElement("afterend", cursor);
      isTyping = false;

      if (callback) callback();
    }

    // === Typewriter animation
    function typeWriter() {
      if (skipRequested) {
        skipRequested = false;
        return finishInstantly();
      }

      if (segIndex < segments.length) {
        const segment = segments[segIndex];

        if (segment.strike && !currentSpan) {
          currentSpan = document.createElement("span");
          currentSpan.className = "strike";
          textEl.appendChild(currentSpan);
        }

        const char = segment.text[charIndex];
        if (char) {
          const node = document.createTextNode(char);
          if (segment.strike) currentSpan.appendChild(node);
          else textEl.appendChild(node);
        }

        textEl.insertAdjacentElement("afterend", cursor);
        charIndex++;

        // Move to next segment
        if (charIndex >= segment.text.length) {
          if (segment.strike && currentSpan) {
            currentSpan.classList.add("struck");
            currentSpan = null;
          }

          segIndex++;
          charIndex = 0;
        }

        setTimeout(typeWriter, speed);
      } else {
        isTyping = false;
        if (callback) callback();
      }
    }

    typeWriter();
  }

  typingQueue = [
    ["text-template-title", "typewriter-text-title-1"],
    ["text-template-1", "typewriter-text-1"],
    ["text-template-2", "typewriter-text-2"],
    ["text-template-title-2", "typewriter-text-title-2"],
    ["text-template-3", "typewriter-text-3"],
    ["text-template-4", "typewriter-text-4"],
    ["text-template-5", "typewriter-text-5"],
    ["text-template-title-3", "typewriter-text-title-3"],
    ["text-template-6", "typewriter-text-6"],
    ["text-template-7", "typewriter-text-7"],
    ["text-template-8", "typewriter-text-8"],
    ["text-template-9", "typewriter-text-9"],
    ["text-template-title-4", "typewriter-text-title-4"],
    ["text-template-10", "typewriter-text-10"],
    ["text-template-11", "typewriter-text-11"],
    ["text-template-12", "typewriter-text-12"],
    ["text-template-13", "typewriter-text-13"],
    ["text-template-title-5", "typewriter-text-title-5"],
    ["text-template-14", "typewriter-text-14"],
    ["text-template-15", "typewriter-text-15"],
    ["text-template-16", "typewriter-text-16"],
    ["text-template-17", "typewriter-text-17"],
    ["text-template-18", "typewriter-text-18"],
    ["text-template-title-6", "typewriter-text-title-6"],
    ["text-template-19", "typewriter-text-19"],
    ["text-template-20", "typewriter-text-20"],
    ["text-template-21", "typewriter-text-21"],
    ["text-template-22", "typewriter-text-22"]
  ];


  function runNext() {
    if (typingFinished) return;

    if (currentIndex >= typingQueue.length) {
      typingFinished = true;
      cursor.style.animation = "blink 0.8s steps(1) infinite";
      console.log("🎉 Typing animation finished.");
      return;
    }

    const [templateId, textId] = typingQueue[currentIndex];
    currentIndex++;

    typeSection(templateId, textId, () => {

      // show skip button for titles
      if (textId.includes("title")) {
        const match = textId.match(/title-(\d+)/);
        if (match) {
          const num = match[1];
          const btn = document.querySelector(`.skip-btn[data-next="${num}"]`);
          if (btn) {
            btn.classList.add("visible");
            btn.style.transitionDelay = "0.3s";
          }
        }
      }

      if (!typingFinished) runNext();
    });
  }

  runNext();

  document.querySelectorAll(".skip-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (isTyping) {
        skipRequested = true;
        return;
      }

      if (typingFinished) return;

      const nextNum = parseInt(btn.dataset.next, 10);
      const targetId = `typewriter-text-title-${nextNum}`;
      const nextIndex = typingQueue.findIndex(([t, id]) => id === targetId) + 1;

      if (nextIndex > 0 && nextIndex < typingQueue.length) {
        currentIndex = nextIndex;
        runNext();
      }
    });
  });


  let hasCompletedInstantly = false;
let activeTimeouts = [];

function clearAllTimeouts() {
  activeTimeouts.forEach(id => clearTimeout(id));
  activeTimeouts = [];
}

// Wrap setTimeout so we can cancel ALL of them on restart
const originalSetTimeout = window.setTimeout;
window.setTimeout = function (fn, delay) {
  const id = originalSetTimeout(fn, delay);
  activeTimeouts.push(id);
  return id;
};

document.getElementById("toggle-complete-button").addEventListener("click", () => {

  // ---------------------- FIRST PRESS → SHOW ALL ----------------------
  if (!hasCompletedInstantly) {
    hasCompletedInstantly = true;
    typingFinished = true;
    isTyping = false;
    skipRequested = false;

    clearAllTimeouts();

    typingQueue.forEach(([templateId, textId]) => {
      const template = document.getElementById(templateId).innerHTML.trim();
      const textEl = document.getElementById(textId);

      const finalHTML = template.replace(
        /<strike>(.*?)<\/strike>/g,
        `<span class="strike struck">$1</span>`
      );

      textEl.innerHTML = finalHTML;
    });

    // hide cursor
    cursor.remove();

    // HIDE ALL SKIP BUTTONS
    document.querySelectorAll(".skip-btn").forEach(btn => {
      btn.classList.remove("visible");
    });

    console.log("✨ All text displayed instantly.");
    return;
  }

  // ---------------------- SECOND PRESS → FULL CLEAN RESTART ----------------------
  hasCompletedInstantly = false;

  // 1. Stop EVERYTHING and reset flags
  clearAllTimeouts();
  typingFinished = false;
  isTyping = false;
  skipRequested = false;
  currentIndex = 0;

  // 2. Clear all output fields
  typingQueue.forEach(([templateId, textId]) => {
    document.getElementById(textId).innerHTML = "";
  });

  // 3. Reset skip buttons
  document.querySelectorAll(".skip-btn").forEach(btn => {
    btn.classList.remove("visible");
  });

  // 4. Reset cursor back after the first text block
  const firstOutput = document.getElementById("typewriter-text-title-1");
  if (firstOutput) firstOutput.insertAdjacentElement("afterend", cursor);
  cursor.style.animation = "blink 0.8s steps(1) infinite";

  // 5. Start fresh
  console.log("🔄 Restarting typewriter animation cleanly...");
  runNext();

  });

});