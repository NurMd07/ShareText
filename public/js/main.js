let list = document.querySelector("ul");
let loader = document.querySelector(".lds-facebook");
let fill = document.querySelector(".fill");
let empty = document.querySelector(".empty");

let isDarkLocal = localStorage.getItem("darkmode");

let darkmodetext = document.querySelector("#darkmodetext");

// Get a reference to the theme color meta tag
const themeColorMeta = document.querySelector("#theme-color");

// Function to update the theme color
function updateThemeColor(newColor) {
  themeColorMeta.setAttribute("content", newColor);
}

let dark = () => {

  darkmodetext.innerHTML = `Light<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-stars ms-2" viewBox="0 0 16 16">
 <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>
 <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
</svg>`;
  darkmodetext.style.color = "white";

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

  darkmodetext.innerHTML = `Dark <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-stars-fill ms-2" viewBox="0 0 16 16">
  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
  <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
</svg>`;
  darkmodetext.style.color = "#575757";


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

if (isDarkLocal === "true") {
  document.body.setAttribute('data-theme', 'dark');
  dark();
  
} else {
    document.body.setAttribute('data-theme', 'light');
  light();

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
    let svg = document.createElement("span");
    svg.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28" height="28" viewBox="0 0 48 48">
    <path fill="#FFF59D" d="M24 2A20 20 0 1 0 24 42A20 20 0 1 0 24 2Z"></path><path fill="#FBC02D" d="M37,22c0-7.7-6.6-13.8-14.5-12.9c-6,0.7-10.8,5.5-11.4,11.5c-0.5,4.6,1.4,8.7,4.6,11.3c1.4,1.2,2.3,2.9,2.3,4.8V37h12v-0.1c0-1.8,0.8-3.6,2.2-4.8C35.1,29.7,37,26.1,37,22z"></path><path fill="#FFF59D" d="M30.6,20.2l-3-2c-0.3-0.2-0.8-0.2-1.1,0L24,19.8l-2.4-1.6c-0.3-0.2-0.8-0.2-1.1,0l-3,2c-0.2,0.2-0.4,0.4-0.4,0.7s0,0.6,0.2,0.8l3.8,4.7V37h2V26c0-0.2-0.1-0.4-0.2-0.6l-3.3-4.1l1.5-1l2.4,1.6c0.3,0.2,0.8,0.2,1.1,0l2.4-1.6l1.5,1l-3.3,4.1C25.1,25.6,25,25.8,25,26v11h2V26.4l3.8-4.7c0.2-0.2,0.3-0.5,0.2-0.8S30.8,20.3,30.6,20.2z"></path><path fill="#5C6BC0" d="M24 41A3 3 0 1 0 24 47A3 3 0 1 0 24 41Z"></path><path fill="#9FA8DA" d="M26,45h-4c-2.2,0-4-1.8-4-4v-5h12v5C30,43.2,28.2,45,26,45z"></path><path fill="#5C6BC0" d="M30 41l-11.6 1.6c.3.7.9 1.4 1.6 1.8l9.4-1.3C29.8 42.5 30 41.8 30 41zM18 38.7L18 40.7 30 39 30 37z"></path>
    </svg> `;
    svg.style = "position:absolute;right:1.5em;top:15%";
    svg.classList.add("d-flex", "justify-content-center", "align-items-center");
    svg.addEventListener("click", () => {
      tipinfo.click();
    });
    inpz.appendChild(svg);
  } else {
    let cmd = document.createElement("span");
    let img = document.createElement("img");

    cmd.style = "position:absolute;right:1.5em;top:15%";
    cmd.classList.add("d-flex", "justify-content-center", "align-items-center");
    img.style.width = "1.8em";
    img.src = "/images/command.png";
    cmd.appendChild(img);
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
function Fill() {
  fill.style.display = "inline-block";
  empty.style.display = "none";
}
let interval;
async function getText(isError = false, isSuccess = false, secret = "nothere") {
  if (interval) {
    clearTimeout(interval);
  }
  fetch(`gettext?value=${secret}`)
    .then((res) => res.json())
    .then((data) => {
      loader.style.display = "none";
      if (data.msg) {
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
      if (data.length === 0) {
        let li = document.createElement("li");
        li.innerHTML = "No text to display";
        li.classList.add("no-text");
        list.appendChild(li);
        Empty();
        return;
      }

      data.forEach((text) => {
        let li = document.createElement("li");

        li.textContent = text.text;

        li.dataset.id = text._id;
        li.dataset.important = text.important;
        li.dataset.date = text.created;
        li.dataset.pin = text.pin;
        li.dataset.hidden = text.hidden;
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
        if (text.created == "Just now" || text.created == "1 min. ago") {
          li.classList.add("bg-success", "text-white");
        }
        if (text.hidden) {
          li.classList.add("bg-info", "text-white");
        }

        list.appendChild(li);

        Fill();
      });
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
});

// Configuration: Watch for child additions and removals
const config = { childList: true };

// Start observing the list
observer.observe(list, config);

function nodeInserted(node) {
  const newNode = node;

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
newNode.style.borderColor = "rgba(0,0,0,0)"
    newNode.textContent.trim();
    newNode.innerHTML += `<span style="flex-shrink:0" class='d-flex ps-3 before1  no-preserve-space'><span class="d-none d-md-inline text-muted contain date1 pe-2">${newNode.dataset.date}</span><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" class="bi bi-clipboard me-2 copy" viewBox="0 0 16 16">
      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
      </svg>
      <div class="dropdown">
      <span class="d-flex justify-content-center align-items-center drop" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" class="bi bi-three-dots-vertical dots" viewBox="0 0 16 16">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
      </span>
      <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">

      <li><a class="dropdown-item text-info fw-bold d-flex justify-content-between align-items-center font-weight-bold important" href="#"><span></span>Mark Important<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-2 bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg></a></li>
      <li><a class="dropdown-item text-warning d-flex justify-content-between align-items-center pintop" href="#"><span ></span>Pin to Top<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16">
      <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
      </svg></a></li>

      <li class="d-inline d-md-none j1"><a class="dropdown-item text-success d-flex justify-content-between align-items-center" href="#"><span ></span>Info<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </svg></a></li>
      <li><a style="color:rgb(212, 23, 77)" class="dropdown-item fw-bold d-flex justify-content-between align-items-center font-weight-bold edit" href="#"><span></span>Edit Text<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square ms-2" viewBox="0 0 16 16">
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
      </svg></a></li>
      <li><hr class="dropdown-divider"></li>

      <li><a class="dropdown-item fw-bold text-danger d-flex justify-content-between align-items-center delete" href="#"><span></span>Delete<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2-fill" viewBox="0 0 16 16">
      <path d="M2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/>
      </svg></a></li>
      </ul>
      </div>

      </span><svg style="position:absolute;right:-0.5em;top:-0.5em;display:none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-star-fill text-info pinstar " viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg><svg style="position:absolute;right:-0.5em;top:0.3em;display:none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-pin-angle-fill text-danger pinicon" viewBox="0 0 16 16">
      <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
      </svg>`;

    newNode.querySelector(".j1").addEventListener("click", (e) => {
      list.querySelectorAll(".date1").forEach((item) => {
        item.classList.toggle("d-none");
        item.style.display = "inline-block";
      });

      newNode.parentNode
        .querySelectorAll(".maincontent1 > li")
        .forEach((li) => {
          if (li.querySelector(".etext")) {
            li.querySelector(".etext").style.height = li.offsetHeight + "px";
          }
        });
    });

    const contain = newNode.querySelector(".contain");
    const copyIcon = contain.nextElementSibling;
    copyIcon.addEventListener("click", function (e) {
      this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check checked" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
        </svg> `;

      let tempElement = document.createElement("div");
      tempElement.innerHTML = newNode.innerHTML;

      while (tempElement.firstElementChild) {
        tempElement.removeChild(tempElement.lastElementChild);
      }
      navigator.clipboard.writeText(tempElement.textContent.trim());
      let ctext = tempElement.textContent.trim();

      let TempText = document.createElement("input");

      TempText.value = ctext;

      document.body.appendChild(TempText);
      TempText.select();

      document.execCommand("copy");
      document.body.removeChild(TempText);

      //end

      setTimeout(() => {
        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard copy" viewBox="0 0 16 16">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
              </svg>`;
      }, 2000);
    });

    let edit = newNode.querySelector(".edit");

    edit.addEventListener("click", function (e) {
      let ele2 = document.createElement("div");
      let inp1 = document.createElement("textarea");
      let btn0 = document.createElement("button");
      let btn9 = document.createElement("button");
      ele2.classList.add("input-group");
      ele2.style =
        "position:absolute;width:101%;height:100%;left:-0.1em;top:-0.1em;z-index:100;";
      inp1.classList.add("form-control", "etext");
      inp1.setAttribute("type", "text");
      inp1.setAttribute("placeholder", "");
      inp1.style.height = newNode.offsetHeight + "px";

      btn0.classList.add("btn", "btn-success");
      btn0.setAttribute("type", "button");
      btn0.innerHTML = "Save";
      btn9.classList.add("btn", "btn-warning", "text-white");
      btn9.setAttribute("type", "button");
      btn9.innerHTML = "X";

      ele2.appendChild(inp1);
      ele2.appendChild(btn0);
      ele2.appendChild(btn9);
      newNode.appendChild(ele2);

      inp1.focus();

      inp1.value = newNode
        .querySelector(".before1")
        .previousSibling.textContent.trim();
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
            const textElement =
              newNode.querySelector(".before1").previousSibling;
            textElement.textContent = data.text.trim();
            newNode.classList.add("bg-success");
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
        newNode.removeChild(ele2);
        newNode.classList.remove("editz");
        newNode.classList.remove("edit1");
      });
    });

    let pintop = newNode.querySelector(".pintop");

    pintop.addEventListener("click", function (e) {
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

      if (newNode.dataset.hidden) {
        newNode.classList.add("bg-info", "text-white");
      }
    });

    newNode.querySelector(".delete").addEventListener("click", function (ef) {
      ef.preventDefault();
      deleteOne(newNode.dataset.id);
    });
    newNode
      .querySelector(".important")
      .addEventListener("click", function (eg) {
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
    if (newNode.dataset.important == "true") {
      newNode.querySelector(".date1").classList.remove("text-muted");
    }
    if (
      newNode.dataset.date == "Just now" ||
      newNode.dataset.date == "1 min. ago"
    ) {
      newNode.querySelector(".date1").classList.remove("text-muted");
    }
 
  }
};

list.addEventListener("mouseover", (e) => {
  const target = e.target;
  if (target.nodeName === "LI") {
    if (darkmode) {
      target.classList.remove("bg-toodark");

      if (target.textContent == "No text to display") {
        target.classList.add("bg-toodark");
      }
    }

    if (
      target.dataset.date == "Just now" ||
      target.dataset.date == "1 min. ago"
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
    if (target.textContent != "No text to display") {
      if (!target.classList.contains("error")) {
        target.querySelector(".date1").classList.remove("text-muted");
      }
    }
  }
});
list.addEventListener("mouseout", (e) => {
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
      target.dataset.date != "1 min. ago"
    ) {
      if (target.textContent != "No text to display") {
        if (!target.classList.contains("error")) {
          target.querySelector(".date1").classList.add("text-muted");
        }
      }
    }
    if (
      target.dataset.date == "Just now" ||
      target.dataset.date == "1 min. ago"
    ) {
      target.classList.remove("text-dark");
      target.classList.add("bg-success", "text-white");
    }
  }
});

getText();

let form = document.querySelector('form[name="form1"]');
let reset = document.querySelector("#reset");
reset.addEventListener("click", (e) => {
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
text.addEventListener("input", autoExpand);
text.addEventListener("paste", autoExpand);

function autoExpand() {
  // Use a slight delay to allow the content to be updated after paste
  setTimeout(() => {
    if (text.scrollHeight <= 150) {
      text.style.height = "auto";
      text.style.height = text.scrollHeight + 4 + "px";
      text.style.overflow = "hidden";
    } else {
      text.style.height = "150px"; // Set to the max height
      text.style.overflow = "auto";
    }
  }, 10);
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
      getText();
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
