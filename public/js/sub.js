 
let popup = document.getElementById('account-menu');
let btn = document.getElementById("popup-btn");
let logoutTrigger = document.getElementById("logout-trigger");
let logoutSwipeConfirm = document.getElementById("logout-swipe-confirm");
let logoutSwipeThumb = document.getElementById("logout-swipe-thumb");
let deleteControl = document.querySelector(".clearbtn");
let confirmMenuForDeleteControl = document.getElementById("delete-confirm-menu");
let composerRow = document.querySelector(".composer-row");
let sendButton = composerRow.querySelector(".sb1");
let mobileGuideActions = document.querySelector(".mobile-guide-actions");
let deleteControlHome = deleteControl.parentElement;
let deleteControlHomeNext = deleteControl.nextSibling;
let phoneViewport = window.matchMedia("(max-width: 599px)");

let logoutSwipeDistance = 0;
let logoutSwipeMaxDistance = 0;
let logoutSwipeStartX = 0;
let logoutSwipeStartDistance = 0;
let isLogoutSwiping = false;

function updateLogoutSwipe(distance) {
    const thumbStyle = window.getComputedStyle(logoutSwipeThumb);
    const thumbInset = parseFloat(thumbStyle.left) || 0;
    logoutSwipeMaxDistance = Math.max(
        0,
        logoutSwipeConfirm.clientWidth -
            logoutSwipeThumb.offsetWidth -
            thumbInset * 2
    );
    logoutSwipeDistance = Math.min(
        logoutSwipeMaxDistance,
        Math.max(0, distance)
    );

    const progress = logoutSwipeMaxDistance
        ? Math.round((logoutSwipeDistance / logoutSwipeMaxDistance) * 100)
        : 0;
    logoutSwipeThumb.style.transform = `translate(${logoutSwipeDistance}px, -50%)`;
    logoutSwipeThumb.setAttribute("aria-valuenow", String(progress));
    logoutSwipeThumb.setAttribute(
        "aria-valuetext",
        progress >= 90 ? "Ready to log out" : `${progress}% complete`
    );
}

function resetLogoutSwipe() {
    isLogoutSwiping = false;
    logoutSwipeConfirm.classList.remove("show", "is-swiping");
    logoutSwipeConfirm.setAttribute("aria-hidden", "true");
    logoutTrigger.hidden = false;
    logoutSwipeDistance = 0;
    logoutSwipeThumb.style.transform = "translate(0, -50%)";
    logoutSwipeThumb.setAttribute("aria-valuenow", "0");
    logoutSwipeThumb.setAttribute("aria-valuetext", "Not confirmed");
}

function completeLogoutSwipe() {
    if (
        logoutSwipeMaxDistance > 0 &&
        logoutSwipeDistance >= logoutSwipeMaxDistance * 0.9
    ) {
        window.location.assign("/logout");
        return;
    }

    updateLogoutSwipe(0);
}

function syncDeleteControlLocation() {
    if (popup.classList.contains("show")) {
        if (deleteControl.parentElement !== mobileGuideActions) {
            deleteControl.classList.add("menu-composer-delete");
            mobileGuideActions.appendChild(deleteControl);
        }
        return;
    }

    if (deleteControl.parentElement !== deleteControlHome) {
        deleteControlHome.insertBefore(deleteControl, deleteControlHomeNext);
        deleteControl.classList.remove("menu-composer-delete");
        deleteControl.style.removeProperty("left");
        deleteControl.style.removeProperty("top");
        if (
            phoneViewport.matches &&
            document.activeElement === deleteControl.querySelector("#reset")
        ) {
            sendButton.focus();
        }
    }
}

function closeMenu() {
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("options-menu-open");
    resetLogoutSwipe();
    syncDeleteControlLocation();
}

btn.addEventListener("click", () => {
    const isOpen = popup.classList.toggle("show");
    popup.setAttribute("aria-hidden", String(!isOpen));
    btn.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("options-menu-open", isOpen);
    syncDeleteControlLocation();

    if (isOpen) {
        document.getElementById("darkmodetext").focus();
    }
});

logoutTrigger.addEventListener("click", () => {
    logoutTrigger.hidden = true;
    logoutSwipeConfirm.classList.add("show");
    logoutSwipeConfirm.setAttribute("aria-hidden", "false");
    updateLogoutSwipe(0);
    logoutSwipeThumb.focus();
});

logoutSwipeThumb.addEventListener("pointerdown", (event) => {
    isLogoutSwiping = true;
    logoutSwipeConfirm.classList.add("is-swiping");
    logoutSwipeStartX = event.clientX;
    logoutSwipeStartDistance = logoutSwipeDistance;
    logoutSwipeThumb.setPointerCapture(event.pointerId);
});

logoutSwipeThumb.addEventListener("pointermove", (event) => {
    if (!isLogoutSwiping) {
        return;
    }

    updateLogoutSwipe(
        logoutSwipeStartDistance + event.clientX - logoutSwipeStartX
    );
});

logoutSwipeThumb.addEventListener("pointerup", (event) => {
    if (!isLogoutSwiping) {
        return;
    }

    isLogoutSwiping = false;
    logoutSwipeConfirm.classList.remove("is-swiping");
    completeLogoutSwipe();
    if (logoutSwipeThumb.hasPointerCapture(event.pointerId)) {
        logoutSwipeThumb.releasePointerCapture(event.pointerId);
    }
});

logoutSwipeThumb.addEventListener("pointercancel", () => {
    isLogoutSwiping = false;
    logoutSwipeConfirm.classList.remove("is-swiping");
    updateLogoutSwipe(0);
});

logoutSwipeThumb.addEventListener("keydown", (event) => {
    const step = logoutSwipeMaxDistance / 10;

    if (event.key === "ArrowRight") {
        event.preventDefault();
        updateLogoutSwipe(logoutSwipeDistance + step);
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        updateLogoutSwipe(logoutSwipeDistance - step);
    } else if (event.key === "Home") {
        event.preventDefault();
        updateLogoutSwipe(0);
    } else if (event.key === "End") {
        event.preventDefault();
        updateLogoutSwipe(logoutSwipeMaxDistance);
    } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        completeLogoutSwipe();
    }
});

document.addEventListener("click", (event) => {
    if (
        event.target instanceof Element &&
        mobileGuideActions.contains(event.target) &&
        event.target.closest(".mobile-guide-command, .mobile-guide-hints")
    ) {
        closeMenu();
        return;
    }

    if (!popup.contains(event.target) && !btn.contains(event.target)) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.classList.contains("show")) {
        closeMenu();
        btn.focus();
    }
});

const deleteConfirmObserver = new MutationObserver(syncDeleteControlLocation);
deleteConfirmObserver.observe(confirmMenuForDeleteControl, {
    attributes: true,
    attributeFilter: ["class"],
});

window.addEventListener("resize", syncDeleteControlLocation);

