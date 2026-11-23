let list = document.querySelector("ul");
let loader = document.querySelector(".lds-facebook");
let fill = document.querySelector(".fill");
let empty = document.querySelector(".empty");
let listScrollHideTimeout;

list.addEventListener(
  "scroll",
  () => {
    list.classList.add("is-scrolling");
    clearTimeout(listScrollHideTimeout);
    listScrollHideTimeout = setTimeout(() => {
      list.classList.remove("is-scrolling");
    }, 700);
  },
  { passive: true }
);

let isDarkLocal = localStorage.getItem("darkmode");

let darkmodetext = document.querySelector("#darkmodetext");

// Get a reference to the theme color meta tag
const themeColorMeta = document.querySelector("#theme-color");

// Function to update the theme color
function updateThemeColor(newColor) {
  themeColorMeta.setAttribute("content", newColor);
}

let dark = () => {

  darkmodetext.innerHTML = `<span>Light mode</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" viewBox="0 0 16 16">
 <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>
 <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
</svg>`;
  darkmodetext.setAttribute("aria-label", "Switch to light mode");

  darkmode = true;
  document.cookie = "darkmode=true";
  updateThemeColor("#292929");
  document.querySelectorAll(".maincontent1 > li").forEach((li) => {
    if (
      li.dataset.pin != "true" &&
      li.dataset.important != "true" &&
      !(li.dataset.created == "Just now")
    ) {
      li.classList.add("bg-toodark", "text-white");
    }
  });
  

};
let light = () => {

  darkmodetext.innerHTML = `<span>Dark mode</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" viewBox="0 0 16 16">
  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
  <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
</svg>`;
  darkmodetext.setAttribute("aria-label", "Switch to dark mode");


  darkmode = false;
  document.querySelectorAll(".maincontent1 > li").forEach((li) => {
    if (
      li.dataset.pin != "true" &&
      li.dataset.important != "true" &&
      !(li.dataset.created == "Just now")
    ) {
      li.classList.remove("bg-toodark", "text-white");
      if (li.classList.contains("no-text")) {
        li.classList.add("text-white");
      }
    }
  });

  document.cookie = "darkmode=false";
  updateThemeColor("#fff");
};

if (isDarkLocal === "false") {
  document.body.setAttribute('data-theme', 'light');
  light();
} else {
  document.body.setAttribute('data-theme', 'dark');
  dark();
}

darkmodetext.addEventListener("click", () => {
  if (darkmode) {
    light();
    localStorage.setItem("darkmode", false);
    document.body.setAttribute('data-theme', 'light');
  } else {
    dark();
    localStorage.setItem("darkmode", true);
    document.body.setAttribute('data-theme', 'dark');
  }
});

let random1 = Math.floor(Math.random() * 8);

if (random1 == 4) {
  let random2 = Math.floor(Math.random() * 2);
  let inpz = document.querySelector(".inpz2");
  if (random2 == 0) {
    let tipinfo = document.querySelector(".tipinfo");
    let icon = document.createElement("span");
    icon.classList.add("composer-random-icon", "composer-tip-icon");
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 18h6m-5 4h4m-2-20a7 7 0 0 0-4 12.7c.6.4 1 1.1 1 1.8h6c0-.7.4-1.4 1-1.8A7 7 0 0 0 12 2Z" />
    </svg>`;
    icon.addEventListener("click", () => {
      tipinfo.click();
    });
    inpz.appendChild(icon);
  } else {
    let cmd = document.createElement("span");
    cmd.classList.add("composer-random-icon", "composer-command-icon");
    cmd.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>`;
    inpz.appendChild(cmd);
    let command = document.querySelector(".command");
    cmd.addEventListener("click", () => {
      command.click();
    });
  }
}

function Empty() {
  fill.style.display = "none";
  empty.style.display = "inline-block";
}
Empty();
function restoreListScrollPosition(scrollTop) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      list.scrollTop = scrollTop;
    });
  });
}
function Fill() {
  fill.style.display = "inline-block";
  empty.style.display = "none";
}
let interval;
let isShowingHiddenTexts = false;
async function getText(
  isError = false,
  isSuccess = false,
  secret = "nothere",
  newlyAddedTextIds = [],
  scrollTop = list.scrollTop
) {
  isShowingHiddenTexts = secret === "!";
  if (interval) {
    clearTimeout(interval);
  }
  const newlyAddedTextIdSet = new Set(newlyAddedTextIds.map(String));
  fetch(`gettext?value=${secret}`)
    .then((res) => res.json())
    .then((data) => {
      loader.style.display = "none";
      if (data.msg) {
        list.classList.remove("empty-state");
        let li = document.createElement("li");
        li.style.cursor = "pointer";
        li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg></span>`;
        li.classList.add("error");
        list.insertBefore(li, list.childNodes[0]);

        return;
      }

      if (isError) {
        list.classList.remove("empty-state");
        let li = document.createElement("li");
        li.style.cursor = "pointer";
        li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg></span>`;
        li.classList.add("error");
        list.insertBefore(li, list.childNodes[0]);
        // list.appendChild(li);
        return;
      }
      list.innerHTML = " ";
      list.classList.remove("empty-state");
      if (data.length === 0) {
        let li = document.createElement("li");
        list.classList.add("empty-state");
        li.innerHTML = `
          <span class="empty-state-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6.5 3.5h7l4 4v13h-11z"/>
              <path d="M13.5 3.5v4h4M8.5 12h7m-7 3h7"/>
            </svg>
          </span>
          <span class="empty-state-copy">
            <strong>No text to display</strong>
            <span>Add a text above to get started.</span>
          </span>
        `;
        li.classList.add("no-text");
        list.appendChild(li);
        restoreListScrollPosition(scrollTop);
        Empty();
        return;
      }

      data.forEach((text) => {
        let li = document.createElement("li");

        li.textContent = text.text;

        li.dataset.id = text._id;
        li.dataset.important = text.important;
        li.dataset.restored = String(Boolean(text.restored));
        li.dataset.date = text.created;
        li.dataset.pin = text.pin;
        const isHidden = text.hidden === true;
        li.dataset.hidden = String(isHidden);
        if (newlyAddedTextIdSet.has(String(text._id))) {
          li.classList.add("card-enter");
        }
        if (darkmode) {
          if (!text.pin && !text.important && !(text.created === "Just now")) {
            li.classList.add("bg-toodark", "text-white");
          }
        }
        if (text.important) {
          if (text.pin) {
            li.classList.add("bg-danger", "text-white", "hover1");
          } else {
            li.classList.add("bg-primary", "text-white", "hover");
          }
        } else if (text.pin) {
          if (text.important) {
            li.classList.add("bg-danger", "text-white", "hover1");
          } else {
            li.classList.add("bg-warning");
          }
        }
        if (text.created == "Just now" || text.created == "1m ago") {
          li.classList.add("bg-success", "text-white");
        }
        if (isHidden) {
          li.classList.add("bg-hidden", "text-white");
        }

        list.appendChild(li);

        Fill();
      });
      restoreListScrollPosition(scrollTop);
    })
    .catch((err) => {
      let li = document.createElement("li");
      li.style.cursor = "pointer";
      li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg></span>`;
      li.classList.add("error");
      list.innerHTML = "";
      list.classList.remove("empty-state");
      list.insertBefore(li, list.childNodes[0]);
      // list.appendChild(li);
    });

  // interval = setInterval(getText, 1000 * 60 * 1);
}

function deleteOne(id) {
  loader.style.display = "inline-block";
  fetch("deleteone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg == "Server error") {
        throw new Error();
      }
      let removed = document.querySelector(`li[data-id='${id}']`);
      removed.remove();
      loader.style.display = "none";
      getText();
    })
    .catch((err) => {
      let li = document.createElement("li");
      li.style.cursor = "pointer";
      li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
      <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
      </svg></span>`;
      li.classList.add("error");
      list.appendChild(li);
      let firstChild = list.firstChild;
      list.insertBefore(li, firstChild);
      loader.style.display = "none";
    });
}

let listLayoutFrame = null;

function scheduleListLayout() {
  if (listLayoutFrame !== null) {
    cancelAnimationFrame(listLayoutFrame);
  }

  listLayoutFrame = requestAnimationFrame(() => {
    listLayoutFrame = null;
    const items = Array.from(list.children).filter(
      (item) => item.nodeName === "LI"
    );
    const textItems = items.filter(
      (item) => !item.classList.contains("error") && !item.classList.contains("no-text")
    );

    list.classList.toggle("single-item", textItems.length === 1);
    list.classList.toggle("two-items", textItems.length === 2);

    const listStyle = getComputedStyle(list);
    if (listStyle.display !== "grid") {
      return;
    }

    const itemGap =
      Number.parseFloat(listStyle.getPropertyValue("--list-item-row-gap")) || 12;

    items.forEach((item) => {
      item.style.gridRow = "auto";
      item.style.gridColumn =
        item.classList.contains("error") || item.classList.contains("no-text")
          ? "1 / -1"
          : "auto";
      item.style.alignSelf = "start";
      item.style.height = "";
    });

    const itemHeights = items.map((item) => item.getBoundingClientRect().height);
    const rowSpans = itemHeights.map((height) =>
      Math.max(1, Math.ceil(height + itemGap))
    );

    if (items.length <= 2) {
      items.forEach((item, index) => {
        item.style.gridRowEnd = `span ${rowSpans[index]}`;
      });
      return;
    }

    const columnCount = listStyle.gridTemplateColumns.trim().split(/\s+/).length;
    const nextRows = Array(columnCount).fill(1);

    items.forEach((item, index) => {
      const rowSpan = rowSpans[index];

      if (item.classList.contains("error") || item.classList.contains("no-text")) {
        const rowStart = Math.max(...nextRows);
        const rowEnd = rowStart + rowSpan;
        item.style.gridRow = `${rowStart} / span ${rowSpan}`;
        nextRows.fill(rowEnd);
        return;
      }

      const columnIndex = nextRows.indexOf(Math.min(...nextRows));
      const rowStart = nextRows[columnIndex];
      item.style.gridColumn = String(columnIndex + 1);
      item.style.gridRow = `${rowStart} / span ${rowSpan}`;
      nextRows[columnIndex] += rowSpan;
    });
  });
}

function captureListCardPositions() {
  return new Map(
    Array.from(list.children)
      .filter((item) => item.classList.contains("list-text"))
      .map((item) => [item, item.getBoundingClientRect()])
  );
}

function moveEditedCardToFront(card, previousPositions) {
  const otherCards = Array.from(list.children).filter(
    (item) => item.classList.contains("list-text") && item !== card
  );
  const pinnedCards = otherCards.filter((item) => item.dataset.pin === "true");
  const unpinnedCards = otherCards.filter((item) => item.dataset.pin !== "true");
  let insertionPoint;

  if (card.dataset.pin === "true") {
    insertionPoint = pinnedCards[0] || unpinnedCards[0] || null;
  } else if (unpinnedCards.length > 0) {
    insertionPoint = unpinnedCards[0];
  } else if (pinnedCards.length > 0) {
    insertionPoint = pinnedCards[pinnedCards.length - 1].nextElementSibling;
    while (insertionPoint === card) {
      insertionPoint = insertionPoint.nextElementSibling;
    }
  }

  if (insertionPoint !== card && card.nextElementSibling !== insertionPoint) {
    list.insertBefore(card, insertionPoint || null);
  }
  scheduleListLayout();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      previousPositions.forEach((previousRect, item) => {
        if (!item.isConnected || typeof item.animate !== "function") {
          return;
        }
        const currentRect = item.getBoundingClientRect();
        const deltaX = previousRect.left - currentRect.left;
        const deltaY = previousRect.top - currentRect.top;
        if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
          return;
        }

        item.animate(
          [
            { transform: `translate(${deltaX}px, ${deltaY}px)` },
            { transform: "translate(0, 0)" },
          ],
          {
            duration: 420,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          }
        );
      });
    });
  });
}

function updateEditedCard(card, text) {
  const previousPositions = captureListCardPositions();
  card.querySelector(".card-text").textContent = text.trim();
  card.dataset.restored = "false";
  const restoredTag = card.querySelector(".restored-tag");
  if (restoredTag) {
    restoredTag.remove();
  }
  card.dataset.date = "Just now";
  const dateElement = card.querySelector(".date1");

  if (dateElement) {
    dateElement.textContent = "Just now";
  }
  card.classList.add("bg-success");
  moveEditedCardToFront(card, previousPositions);
}

// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            nodeInserted(node)
          }
        });
      }

    }
  }
  scheduleListLayout();
});

// Configuration: Watch for child additions and removals
const config = { childList: true };

// Start observing the list
observer.observe(list, config);

const listContentObserver = new MutationObserver((mutations) => {
  const needsLayout = mutations.some((mutation) => {
    const target =
      mutation.target instanceof Element
        ? mutation.target
        : mutation.target.parentElement;
    const isEditorMutation =
      (target && target.closest(".input-group")) ||
      [...mutation.addedNodes, ...mutation.removedNodes].some(
        (node) => node instanceof Element && node.matches(".input-group")
      );
    if (isEditorMutation) {
      return false;
    }

    const copyFeedback = target && target.closest(".copy-feedback");
    return !copyFeedback || copyFeedback.classList.contains("copy-failed");
  });

  if (needsLayout) {
    scheduleListLayout();
  }
});
listContentObserver.observe(list, {
  childList: true,
  characterData: true,
  subtree: true,
});
window.addEventListener("resize", scheduleListLayout);
document.fonts.ready.then(scheduleListLayout);
scheduleListLayout();

function copyTextFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);

  try {
    textarea.select();
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      if (copyTextFallback(text)) {
        return;
      }

      throw error;
    }
  }

  if (!copyTextFallback(text)) {
    throw new Error("Clipboard copy failed");
  }
}

function nodeInserted(node) {
  const newNode = node;

  if (
    newNode.nodeName === "LI" &&
    newNode.dataset.cardInitialized === "true"
  ) {
    return;
  }

  if (newNode.nodeName === "LI") {
    if (newNode.classList.contains("error")) {
      if (newNode.querySelectorAll(".error").length >= 1) {
        newNode.remove();
      } else {
        newNode.classList.add(
          "d-flex",
          "justify-content-center",
          "align-items-center",
          "pe-1",
          "mb-2",
          "alert",
          "alert-danger",
          "hover5"
        );
        newNode.addEventListener("click", () => {
          window.open("/", "_self");
        });
      }
      return;
    }
    if (newNode.classList.contains("no-text")) {
      newNode.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "pe-1",
        "mb-2",
        "bg-secondary",
        "text-white"
      );
      return;
    }

    newNode.dataset.cardInitialized = "true";
    newNode.classList.remove("justify-content-center");
    newNode.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "pe-1",
      "mb-2",
      "w-100",
      "preserve-space",
      "text-break",
      'list-text'
   
    );
    const cardText = document.createElement("div");
   cardText.className = "card-text";
   cardText.textContent = newNode.textContent;
   if (
     newNode.classList.contains("card-enter") &&
     !window.matchMedia("(prefers-reduced-motion: reduce)").matches
   ) {
     const textParts = cardText.textContent.match(/\s+|\S+/g) || [];
     const wordCount = textParts.filter((part) => !/^\s+$/.test(part)).length;
     const wordsPerPiece = Math.max(1, Math.ceil(wordCount / 24));
     const textFragment = document.createDocumentFragment();
     let pieceIndex = 0;
     let pieceWordCount = 0;
     let pieceText = "";

     const appendTextPiece = () => {
       if (!pieceText) {
         return;
       }

       const piece = document.createElement("span");
       piece.className = "card-text-piece";
       piece.textContent = pieceText;
       piece.style.setProperty("--piece-delay", `${pieceIndex * 30}ms`);
       textFragment.appendChild(piece);
       pieceIndex += 1;
       pieceWordCount = 0;
       pieceText = "";
     };

     textParts.forEach((part) => {
       if (/^\s+$/.test(part)) {
         if (
           /[\r\n]/.test(part) ||
           (pieceWordCount >= wordsPerPiece && pieceIndex < 23)
         ) {
           appendTextPiece();
           textFragment.appendChild(document.createTextNode(part));
         } else {
           pieceText += part;
         }
         return;
       }

       if (pieceWordCount >= wordsPerPiece && pieceIndex < 23) {
         appendTextPiece();
       }
       pieceText += part;
       pieceWordCount += 1;
     });

     appendTextPiece();
     cardText.replaceChildren(textFragment);
   }
   cardText.setAttribute("role", "button");
   cardText.setAttribute("tabindex", "0");
   cardText.setAttribute("title", "Click to copy text");
    newNode.textContent = "";
   const cardContent = document.createElement("div");
   cardContent.className = "card-content";
   cardContent.appendChild(cardText);
   newNode.appendChild(cardContent);
   const restoredTag =
     newNode.dataset.restored === "true"
       ? '<span class="restored-tag" title="Restored from backup">Restored</span>'
       : "";
   newNode.insertAdjacentHTML("afterbegin", `<span class='d-flex before1 no-preserve-space'><span class="contain date1">${newNode.dataset.date}</span>${restoredTag}
      <div class="dropdown">
      <span class="d-flex justify-content-center align-items-center drop" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false" aria-label="More options">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" class="bi bi-three-dots-vertical dots" viewBox="0 0 16 16">
      <path d="M8 3.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zm0 6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zm0 6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" class="copy-success-icon" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3.25" y="3.25" width="9.5" height="11.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <rect x="6" y="1.5" width="4" height="3.25" rx="1" />
      <path d="m5.5 9 1.75 1.75 3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </span>
      <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="dropdownMenuButton2">

      <li><a class="dropdown-item text-info fw-bold d-flex justify-content-between align-items-center font-weight-bold important" href="#"><span></span>Mark Important<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2 bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg></a></li>
      <li><a class="dropdown-item text-warning d-flex justify-content-between align-items-center pintop" href="#"><span ></span>Pin to Top<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16">
      <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
      </svg></a></li>

      <li><a style="color:rgb(212, 23, 77)" class="dropdown-item fw-bold d-flex justify-content-between align-items-center font-weight-bold edit" href="#"><span></span>Edit Text<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square ms-2" viewBox="0 0 16 16">
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
      </svg></a></li>
      <li><a class="dropdown-item d-flex justify-content-between align-items-center hide-text" href="#"><span class="hide-text-label">Hide</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2 bi bi-eye-slash" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5c-1.39 0-2.59.43-3.59 1.05l.8.8A5.7 5.7 0 0 1 8 3.5c3.5 0 6 3.5 6.8 4.5a13 13 0 0 1-2.15 2.55l.71.688zM1.646 1.646a.5.5 0 0 1 .708 0l12 12a.5.5 0 0 1-.708.708l-2.1-2.1A7.3 7.3 0 0 1 8 13.5C3 13.5 0 8 0 8s1.08-1.99 2.9-3.51L1.646 2.354a.5.5 0 0 1 0-.708zM4.3 5.71A4.5 4.5 0 0 0 2 8c.8 1 3.3 4.5 6 4.5.8 0 1.55-.25 2.22-.65L9 10.63A3 3 0 0 1 5.37 7L4.3 5.71z"/>
      </svg></a></li>
      <li><hr class="dropdown-divider"></li>

      <li><a class="dropdown-item fw-bold text-danger d-flex justify-content-between align-items-center delete" href="#"><span></span>Delete<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2-fill" viewBox="0 0 16 16">
      <path d="M2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/>
      </svg></a></li>
      </ul>
      </div><span class="copy-feedback" role="status" aria-live="polite"></span>

      </span><svg style="position:absolute;right:-0.5em;top:-0.5em;display:none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-star-fill text-info pinstar " viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg><svg style="position:absolute;right:-0.5em;top:0.3em;display:none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-pin-angle-fill text-danger pinicon" viewBox="0 0 16 16">
      <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
      </svg><svg style="position:absolute;right:-0.5em;top:0.3em;display:none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-eye-slash hiddenicon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5c-1.39 0-2.59.43-3.59 1.05l.8.8A5.7 5.7 0 0 1 8 3.5c3.5 0 6 3.5 6.8 4.5a13 13 0 0 1-2.15 2.55l.71.688zM1.646 1.646a.5.5 0 0 1 .708 0l12 12a.5.5 0 0 1-.708.708l-2.1-2.1A7.3 7.3 0 0 1 8 13.5C3 13.5 0 8 0 8s1.08-1.99 2.9-3.51L1.646 2.354a.5.5 0 0 1 0-.708zM4.3 5.71A4.5 4.5 0 0 1 2 8c.8 1 3.3 4.5 6 4.5.8 0 1.55-.25 2.22-.65L9 10.63A3 3 0 0 1 5.37 7L4.3 5.71z"/>
      </svg>`);
    const cardMeta = newNode.querySelector(".before1");
    cardContent.insertBefore(cardMeta, cardText);
    cardMeta.prepend(
      newNode.querySelector(".pinstar"),
      newNode.querySelector(".pinicon"),
      newNode.querySelector(".hiddenicon")
    );

    const copyFeedback = newNode.querySelector(".copy-feedback");
    const menuButton = newNode.querySelector(".drop");
    const cardDropdown = newNode.querySelector(".dropdown");
    const hideTextAction = newNode.querySelector(".hide-text");
    const hideTextLabel = hideTextAction.querySelector(".hide-text-label");
    hideTextLabel.textContent =
      newNode.dataset.hidden === "true" ? "Unhide" : "Hide";
    hideTextAction.addEventListener("click", async (event) => {
      event.preventDefault();
      const shouldHide = newNode.dataset.hidden !== "true";
      loader.style.display = "inline-block";

      try {
        const response = await fetch("hidden", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: newNode.dataset.id,
            hidden: shouldHide,
          }),
        });
        if (!response.ok) {
          throw new Error("Unable to update hidden text");
        }

        const data = await response.json();
        newNode.dataset.hidden = String(data.hidden);
        hideTextLabel.textContent = data.hidden ? "Unhide" : "Hide";
        getText(false, false, isShowingHiddenTexts ? "!" : "nothere");
      } catch (error) {
        console.error("Unable to update hidden text", error);
        const errorItem = document.createElement("li");
        errorItem.classList.add("error");
        errorItem.textContent = "Could not update hidden text. Please try again.";
        list.appendChild(errorItem);
      } finally {
        loader.style.display = "none";
      }
    });
    cardDropdown.addEventListener("shown.bs.dropdown", () => {
      newNode.classList.add("card-menu-open");
      document.body.classList.add("card-menu-open");
    });
    cardDropdown.addEventListener("hidden.bs.dropdown", () => {
      newNode.classList.remove("card-menu-open");
      if (!list.querySelector(".dropdown-menu.show")) {
        document.body.classList.remove("card-menu-open");
      }
    });
    let copyFeedbackTimeout;
    newNode.querySelector(".card-content").addEventListener("click", async (event) => {
      if (event.target.closest(".before1")) {
        return;
      }

      if (document.body.classList.contains("card-menu-open")) {
        event.preventDefault();
        return;
      }

      try {
        await copyTextToClipboard(newNode.querySelector(".card-text").textContent);
        copyFeedback.textContent = "Copied to clipboard";
        copyFeedback.classList.add("show");
        copyFeedback.classList.remove("copy-failed");
        menuButton.classList.add("is-copied");
        menuButton.setAttribute("aria-label", "Copied to clipboard");
        cardContent.classList.add("is-copied");
      } catch (error) {
        console.error("Unable to copy saved text", error);
        copyFeedback.textContent = "Copy failed";
        copyFeedback.classList.add("copy-failed");
        menuButton.classList.remove("is-copied");
        menuButton.setAttribute("aria-label", "More options");
        copyFeedback.classList.add("show");
        cardContent.classList.remove("is-copied");
      }

      window.clearTimeout(copyFeedbackTimeout);
      copyFeedbackTimeout = window.setTimeout(
        () => {
          copyFeedback.classList.remove("show", "copy-failed");
          copyFeedback.textContent = "";
          menuButton.classList.remove("is-copied");
          menuButton.setAttribute("aria-label", "More options");
          cardContent.classList.remove("is-copied");
        },
        2000
      );
    });
    cardText.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        cardContent.click();
      }
    });

    let edit = newNode.querySelector(".edit");

    edit.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.matchMedia("(max-width: 767px)").matches) {
        const dialog = document.createElement("dialog");
        const panel = document.createElement("div");
        const title = document.createElement("h2");
        const titleIcon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        const titleIconPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        const input = document.createElement("textarea");
        const actions = document.createElement("div");
        const saveButton = document.createElement("button");
        const closeButton = document.createElement("button");

        dialog.classList.add("mobile-edit-dialog");
        dialog.setAttribute("aria-labelledby", "mobile-edit-title");
        panel.className = "mobile-edit-panel";
        title.className = "mobile-edit-title";
        title.id = "mobile-edit-title";
        titleIcon.classList.add("mobile-edit-title-icon");
        titleIcon.setAttribute("viewBox", "0 0 16 16");
        titleIcon.setAttribute("width", "18");
        titleIcon.setAttribute("height", "18");
        titleIcon.setAttribute("fill", "currentColor");
        titleIcon.setAttribute("aria-hidden", "true");
        titleIcon.setAttribute("focusable", "false");
        titleIconPath.setAttribute(
          "d",
          "M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
        );
        titleIcon.append(titleIconPath);
        title.append(titleIcon, document.createTextNode("Edit text"));
        input.classList.add("form-control", "etext", "mobile-edit-textarea");
        input.rows = 8;
        input.value = newNode.querySelector(".card-text").textContent.trim();
        saveButton.className = "mobile-edit-save";
        saveButton.type = "button";
        saveButton.textContent = "Save changes";
        closeButton.className = "mobile-edit-close";
        closeButton.type = "button";
        closeButton.textContent = "Close";
        actions.className = "mobile-edit-actions";
        actions.append(saveButton, closeButton);
        panel.append(title, input, actions);
        dialog.append(panel);
        document.body.append(dialog);

        dialog.addEventListener("close", () => {
          dialog.remove();
          edit.focus({ preventScroll: true });
        });
        dialog.addEventListener("click", (dialogEvent) => {
          if (dialogEvent.target === dialog && !isSaving) {
            dialog.close();
          }
        });

        let isSaving = false;
        dialog.addEventListener("cancel", (dialogEvent) => {
          dialogEvent.preventDefault();
          if (!isSaving) {
            dialog.close();
          }
        });
        saveButton.addEventListener("click", async () => {
          if (isSaving) {
            return;
          }
          isSaving = true;
          saveButton.disabled = true;
          closeButton.disabled = true;
          saveButton.textContent = "Saving...";

          try {
            const response = await fetch("edit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: newNode.dataset.id,
                text: input.value,
              }),
            });
            if (response.status !== 200) {
              if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData.msg);
              }
              throw new Error("Server Error");
            }

            const data = await response.json();
            let nextSibling = newNode.nextElementSibling;
            while (nextSibling && nextSibling.classList.contains("error")) {
              nextSibling.remove();
              nextSibling = newNode.nextElementSibling;
            }
            updateEditedCard(newNode, data.text);
            dialog.close();
          } catch (error) {
            isSaving = false;
            saveButton.disabled = false;
            closeButton.disabled = false;
            saveButton.textContent = "Save changes";
            if (error instanceof Error && error.message === "Please enter text") {
              input.classList.add("is-invalid");
              input.placeholder = error.message;
            } else {
              const errorItem = document.createElement("li");
              errorItem.classList.add("error");
              errorItem.style.cursor = "pointer";
              errorItem.textContent = "Something went wrong! Reload";
              newNode.parentNode.insertBefore(errorItem, newNode.nextSibling);
            }
          }
        });
        closeButton.addEventListener("click", () => {
          if (!isSaving) {
            dialog.close();
          }
        });

        dialog.showModal();
        input.focus({ preventScroll: true });
        return;
      }

      let ele2 = document.createElement("div");
      let inp1 = document.createElement("textarea");
      let btn0 = document.createElement("button");
      let btn9 = document.createElement("button");
      let actions = document.createElement("div");
      ele2.classList.add("input-group", "desktop-edit-panel");
      inp1.classList.add("form-control", "etext", "desktop-edit-textarea");
      inp1.setAttribute("aria-label", "Edit text");
      inp1.setAttribute("placeholder", "");

      btn0.classList.add("desktop-edit-save");
      btn0.setAttribute("type", "button");
      btn0.textContent = "Save changes";
      btn9.classList.add("desktop-edit-cancel");
      btn9.setAttribute("type", "button");
      btn9.textContent = "Cancel";

      actions.className = "desktop-edit-actions";
      actions.append(btn0, btn9);
      ele2.append(inp1, actions);
      newNode.classList.add("editz");
      newNode.appendChild(ele2);

      inp1.focus({ preventScroll: true });

      inp1.value = newNode.querySelector(".card-text").textContent.trim();
      let isSaving = false;
      btn0.addEventListener("click", function (e) {
        if (isSaving) {
          return;
        }
        const loaderContain = document.createElement("div");
        loaderContain.classList.add("loader-contain");
        loaderContain.classList.add("me-md-4");

        // Create the lds-facebook1 div
        const ldsFacebook1 = document.createElement("div");
        ldsFacebook1.classList.add("lds-facebook1");

        // Create the three child divs within lds-facebook1
        for (let i = 0; i < 3; i++) {
          const childDiv = document.createElement("div");
          ldsFacebook1.appendChild(childDiv);
        }

        // Append the lds-facebook1 div to the loaderContain div
        loaderContain.appendChild(ldsFacebook1);

        newNode.parentNode.insertBefore(loaderContain, newNode.nextSibling);

        isSaving = true;

        fetch("edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: newNode.dataset.id, text: inp1.value }),
        })
          .then((res) => {
            loaderContain.remove();
            isSaving = false;
            if (res.status !== 200) {
              if (res.status === 400) {
                return res.json().then((errorData) => {
                  throw new Error(errorData.msg); // Throw the error message as an Error object
                });
              } else {
                throw new Error("Server Error");
              }
            }
            return res.json();
          })
          .then((data) => {
            if (newNode.nextElementSibling.classList.contains("error")) {
              let nextSibling = newNode.nextElementSibling;

              while (nextSibling && nextSibling.classList.contains("error")) {
                nextSibling.remove();
                nextSibling = newNode.nextElementSibling;
              }
            }
            newNode.removeChild(ele2);
            newNode.classList.remove("editz");
            newNode.classList.remove("edit1");
            updateEditedCard(newNode, data.text);
          })
          .catch((err) => {
            if (err.message == "Please enter text") {
              inp1.classList.add("is-invalid");
              inp1.setAttribute("placeholder", err.message);
            } else {
              let li = document.createElement("li");
              li.style.cursor = "pointer";
              li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
              </svg></span>`;
              li.classList.add("error");

              newNode.parentNode.insertBefore(li, newNode.nextSibling);
            }
          });
      });
      btn9.addEventListener("click", function (e) {
        ele2.remove();
        newNode.classList.remove("editz");
        newNode.classList.remove("edit1");
      });
    });

    let pintop = newNode.querySelector(".pintop");

    pintop.addEventListener("click", function (e) {
      e.preventDefault();
      loader.style.display = "inline-block";
      fetch("pintop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: newNode.dataset.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.pin == true) {
            newNode.classList.add("bg-warning");
            newNode.querySelector(".date1").classList.remove("text-muted");

            let nodeText = newNode.querySelector(".pintop");
            let mainText = nodeText.innerHTML.replace("Pin to Top", "UnPin");
            nodeText.innerHTML = mainText;

            getText();
          } else {
            newNode.classList.remove("bg-warning");
            newNode.querySelector(".date1").classList.add("text-muted");
            let nodeText = newNode.querySelector(".pintop");
            let mainText = nodeText.innerHTML.replace("UnPin", "Pin to Top");
            nodeText.innerHTML = mainText;
            getText();
          }
          loader.style.display = "none";
        })
        .catch((err) => {
          let li = document.createElement("li");
          li.style.cursor = "pointer";
          li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
          <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
          </svg></span>`;
          li.classList.add("error");
          list.appendChild(li);
          let firstChild = list.firstChild;
          list.insertBefore(li, firstChild);
          loader.style.display = "none";
        });

    });

    newNode.querySelector(".delete").addEventListener("click", function (ef) {
      ef.preventDefault();
      deleteOne(newNode.dataset.id);
    });
    newNode
      .querySelector(".important")
      .addEventListener("click", function (eg) {
        eg.preventDefault();
        const scrollTop = list.scrollTop;
        loader.style.display = "inline-block";
        fetch("important", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: newNode.dataset.id }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.important) {
              newNode.classList.add("bg-primary", "text-white", "hover");
              newNode.dataset.important = "true";
              let nodeText = this;

              let mainText = nodeText.innerHTML.replace(
                "Mark Important",
                "Mark UnImportant"
              );
              nodeText.innerHTML = mainText;
              newNode.querySelector(".pinstar").style.display = "block";
            } else {
              newNode.classList.remove("bg-dark", "text-white", "hover");
              newNode.dataset.important = "false";
              let nodeText = this;

              let mainText = nodeText.innerHTML.replace(
                "Mark UnImportant",
                "Mark Important"
              );
              nodeText.innerHTML = mainText;
              newNode.querySelector(".pinstar").style.display = "none";
            }
            loader.style.display = "none";
            getText(false, false, "nothere", [], scrollTop);
          })
          .catch((err) => {
            let li = document.createElement("li");
            li.style.cursor = "pointer";
            li.innerHTML = `Something went wrong!<span class="ps-1 text-decoration-underline" style="font-size:0.9em;align-self:center">Reload<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="ms-1 bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
            </svg></span>`;
            li.classList.add("error");
            list.appendChild(li);
            let firstChild = list.firstChild;
            list.insertBefore(li, firstChild);
            loader.style.display = "none";
          });
      });

    if (newNode.dataset.important == "true") {
      let nodeText = newNode.querySelector(".important");
      let mainText = nodeText.innerHTML.replace(
        "Mark Important",
        "Mark UnImportant"
      );
      nodeText.innerHTML = mainText;

      newNode.querySelector(".pinstar").style.display = "block";
    } else {
      let nodeText = newNode.querySelector(".important");
      let mainText = nodeText.innerHTML.replace(
        "Mark UnImportant",
        "Mark Important"
      );

      nodeText.innerHTML = mainText;
      newNode.querySelector(".pinstar").style.display = "none";
    }

    if (newNode.dataset.pin == "true") {
      newNode.querySelector(".pinicon").style.display = "block";
      newNode.classList.add("bg-warning", "text-white");
      newNode.querySelector(".date1").classList.remove("text-muted");
      let nodeText = newNode.querySelector(".pintop");
      let mainText = nodeText.innerHTML.replace("Pin to Top", "UnPin");
      nodeText.innerHTML = mainText;
    } else {
      newNode.querySelector(".pinicon").style.display = "none";
      newNode.classList.remove("bg-warning");
      newNode.querySelector(".date1").classList.add("text-muted");
      let nodeText = newNode.querySelector(".pintop");
      let mainText = nodeText.innerHTML.replace("UnPin", "Pin to Top");
      nodeText.innerHTML = mainText;
    }
    newNode.querySelector(".hiddenicon").style.display =
      newNode.dataset.hidden === "true" ? "block" : "none";
    if (newNode.dataset.important == "true") {
      newNode.querySelector(".date1").classList.remove("text-muted");
    }
    if (
      newNode.dataset.date == "Just now" ||
      newNode.dataset.date == "1m ago"
    ) {
      newNode.querySelector(".date1").classList.remove("text-muted");
    }
 
  }
};

list.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const dateElement = event.target.closest(".date1");
  if (dateElement && list.contains(dateElement)) {
    event.stopPropagation();
    const card = dateElement.closest(".list-text");
    card?.querySelector(".drop")?.click();
  }
});

list.addEventListener("mouseover", (e) => {
  if (document.body.classList.contains("suppress-card-hover")) {
    return;
  }

  const target = e.target;
  if (target.nodeName === "LI") {
    if (darkmode) {
      target.classList.remove("bg-toodark");

      if (target.classList.contains("no-text")) {
        target.classList.add("bg-toodark");
      }
    }

    if (
      target.dataset.date == "Just now" ||
      target.dataset.date == "1m ago"
    ) {
      target.classList.remove("bg-success", "text-white");
    }
    target.classList.toggle("bg-secondary");
    target.classList.toggle("text-white");

    if (darkmode && target.dataset.date != "Just now") {
      target.classList.toggle("text-white");
    }
    if (target.dataset.pin == "true" || target.dataset.important == "true") {
      if (target.dataset.pin == "true" && target.dataset.important == "true") {
        target.classList.remove("bg-danger", "bg-warning", "bg-success");

      } else if (target.dataset.important == "true") {
        target.classList.remove("bg-dark");
      } else {
        target.classList.remove("bg-warning", "bg-success");
      }

      target.classList.add("bg-secondary", "text-white");
    }
    if (!target.classList.contains("no-text")) {
      if (!target.classList.contains("error")) {
        target.querySelector(".date1").classList.remove("text-muted");
      }
    }
  }
});
list.addEventListener("mouseout", (e) => {
  if (document.body.classList.contains("suppress-card-hover")) {
    return;
  }

  const target = e.target;
  if (target.nodeName === "LI") {
    target.classList.toggle("bg-secondary");
    target.classList.toggle("text-white");
    if (darkmode) {
      target.classList.add("bg-toodark", "text-white");
    }

    if (target.dataset.pin == "true" || target.dataset.important == "true") {
      if (target.dataset.pin == "true" && target.dataset.important == "true") {
        target.classList.add("bg-danger", "text-white");
      } else if (target.dataset.important == "true") {
        target.classList.add("bg-primary", "text-white");
      } else {
        target.classList.add("bg-warning", "text-white");
      }

      target.classList.remove("bg-secondary");
    }
    if (
      target.dataset.pin != "true" &&
      target.dataset.important != "true" &&
      target.dataset.date != "Just now" &&
      target.dataset.date != "1m ago"
    ) {
      if (!target.classList.contains("no-text")) {
        if (!target.classList.contains("error")) {
          target.querySelector(".date1").classList.add("text-muted");
        }
      }
    }
    if (
      target.dataset.date == "Just now" ||
      target.dataset.date == "1m ago"
    ) {
      target.classList.remove("text-dark");
      target.classList.add("bg-success", "text-white");
    }
  }
});

getText();

let commandList = document.querySelector(".command-list");
let commandModal = document.querySelector("#exampleModal");
let commandInput = document.querySelector('textarea[name="text"]');
let focusCommandInputAfterModal = false;

commandList.addEventListener("click", (event) => {
  let commandEntry = event.target.closest(".command-entry");
  if (!commandEntry || !commandList.contains(commandEntry)) {
    return;
  }

  commandInput.value = commandEntry.querySelector(".command-token").textContent.trim();
  commandInput.dispatchEvent(new Event("input", { bubbles: true }));
  focusCommandInputAfterModal = true;
});

commandModal.addEventListener("hidden.bs.modal", () => {
  if (focusCommandInputAfterModal) {
    focusCommandInputAfterModal = false;
    setTimeout(() => commandInput.focus(), 0);
  }
});

let form = document.querySelector('form[name="form1"]');
let reset = document.querySelector("#reset");
let deleteConfirmMenu = document.querySelector("#delete-confirm-menu");
let deleteConfirmPanel = document.querySelector("#delete-confirm-panel");
let confirmDeleteAll = document.querySelector("#confirm-delete-all");

const hasFineHoverPointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

document.addEventListener(
  "pointerdown",
  () => {
    if (!hasFineHoverPointer) {
      document.body.classList.remove("suppress-card-hover");
    }
  },
  true
);

document.addEventListener(
  "click",
  (event) => {
    if (
      hasFineHoverPointer ||
      ![
        "card-menu-open",
        "delete-menu-open",
        "options-menu-open",
        "modal-open",
      ].some((className) => document.body.classList.contains(className))
    ) {
      return;
    }

    const target = event.target;
    if (
      target instanceof Element &&
      target.closest(
        ".account-menu, #delete-confirm-menu, .dropdown, .modal, #popup-btn, #reset"
      )
    ) {
      return;
    }

    document.body.classList.add("suppress-card-hover");
  },
  true
);

function setDeleteConfirmMenuOpen(isOpen) {
  deleteConfirmMenu.classList.toggle("show", isOpen);
  deleteConfirmMenu.setAttribute("aria-hidden", String(!isOpen));
  reset.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("delete-menu-open", isOpen);
}

reset.addEventListener("click", () => {
  const isOpen = !deleteConfirmMenu.classList.contains("show");
  setDeleteConfirmMenuOpen(isOpen);
  if (isOpen) {
    deleteConfirmPanel.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!deleteConfirmMenu.contains(event.target) && !reset.contains(event.target)) {
    setDeleteConfirmMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && deleteConfirmMenu.classList.contains("show")) {
    setDeleteConfirmMenuOpen(false);
    reset.focus();
  }
});

confirmDeleteAll.addEventListener("click", (e) => {
  setDeleteConfirmMenuOpen(false);
  closeMenu();
  list.innerHTML = " ";
  loader.style.display = "inline-block";
  let text = document.querySelector('textarea[name="text"]');
  e.preventDefault();
  fetch("deletetext")
    .then((res) => res.json())
    .then((data) => {
      loader.style.display = "none";
      list.innerHTML = " ";
      getText();
      text.value = "";
      Empty();
    })
    .catch((err) => {
      getText();
      Fill();
    });
});
let isInProgess = false;

let submit = document.querySelector('button[type="submit"]');

submit.addEventListener("click", (e) => {
  let text = document.querySelector('textarea[name="text"]');

  if (text.value.includes("+n")) {
    let isValid = text.value.split("+n").filter((item) => item.trim() !== "");

    if (isValid.length == 0) {
      e.preventDefault();

      return;
    }
  }
  submit.classList.add("disabled");
});

let subdata = null;

let text = document.querySelector('textarea[name="text"]');
const visualViewport = window.visualViewport;
let composerViewportHeightBeforeKeyboard = null;
let composerKeyboardWasOpen = false;

text.addEventListener("focus", () => {
  if (visualViewport) {
    composerViewportHeightBeforeKeyboard = visualViewport.height;
    composerKeyboardWasOpen = false;
  }
});

if (visualViewport) {
  visualViewport.addEventListener("resize", () => {
    if (composerViewportHeightBeforeKeyboard === null) {
      return;
    }

    if (composerViewportHeightBeforeKeyboard - visualViewport.height > 100) {
      composerKeyboardWasOpen = true;
    }

    if (
      composerKeyboardWasOpen &&
      visualViewport.height >= composerViewportHeightBeforeKeyboard - 50
    ) {
      composerKeyboardWasOpen = false;
      composerViewportHeightBeforeKeyboard = null;
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  });
}

text.addEventListener("input", autoExpand);
text.addEventListener("paste", autoExpand);

function autoExpand() {
  text.style.height = "auto";
  const styles = window.getComputedStyle(text);
  const borderHeight =
    parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
  const requiredHeight = text.scrollHeight + borderHeight;
  const maxHeight = 150;

  text.style.height = `${Math.min(requiredHeight, maxHeight)}px`;
  text.style.overflow = requiredHeight > maxHeight ? "auto" : "hidden";
}

form.addEventListener("submit", (e) => {
  let text = document.querySelector('textarea[name="text"]');
  e.preventDefault();

  if (isInProgess) {
    return;
  }

  isInProgess = true;

  if (text.value === "") {
    loader.style.display = "none";
    isInProgess = false;
    submit.classList.remove("disabled");
    return;
  }
  loader.style.display = "inline-block";
  let value = text.value;
  let data = {
    text: value,
  };
  if (text.value == "!commands") {
    loader.style.display = "none";
    let command = document.querySelector(".command");
    command.click();
    text.value = "";
    submit.classList.remove("disabled");
    return;
  }
  fetch("addtext", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      isInProgess = false;
      text.value = "";
      text.style.overflow = "auto";
      text.style.height = "auto";
      submit.classList.remove("disabled");
      return res.json();
    })
    .then((data) => {
      isInProgess = false;
      if (data.msg) {
        throw new Error();
      }
      if (window.matchMedia("(max-width: 599px)").matches) {
        submit.blur();
      }
      loader.style.display = "none";
      text.value = "";
      submit.classList.remove("disabled");
      if (data.success) {
        let li = document.createElement("li");
        li.style.cursor = "pointer";
        li.innerHTML = `<div class="alert alert-success alert-dismissible fade show w-100 h-100" role="alert">
              <strong>Successfully removed all backup texts!</strong> 
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        li.classList.add("error", "bg-success");

        setTimeout(() => {
          li.classList.remove(
            "bg-success",
            "hover5",
            "d-flex",
            "justify-content-center",
            "align-items-center",
            "pe-1",
            "mb-2",
            "alert",
            "alert-danger"
          );
          li.style = "list-style-type:none;";
        }, 10);

        list.insertBefore(li, list.childNodes[0]);
        return;
      }

      if (data.status) {
        getText(false, true, data.secret);
        Fill();
        return;
      }
      const newTextItems = Array.isArray(data) ? data : [data];
      const newlyAddedTextIds = newTextItems
        .filter((item) => item && item._id)
        .map((item) => item._id);
      getText(false, false, "nothere", newlyAddedTextIds);
      Fill();
    })
    .catch((err) => {
      submit.classList.remove("disabled");
      isInProgess = false;
      getText(true);
    });
});

let heading = document.querySelectorAll(".l1");
heading.forEach((e) => {
  e.addEventListener("click", (e) => {
    window.open("/", "_self");
  });
});

let eventSource;

function connectToEventSource() {
  eventSource = new EventSource("/data-updates");

  eventSource.onmessage = (event) => {
    getText();
  };

  eventSource.onerror = (error) => {
    console.error("Error connecting to SSE:");
  };
}

// Initial connection
connectToEventSource();
