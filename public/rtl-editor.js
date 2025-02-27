var t = window.TrelloPowerUp.iframe();
var textInput, saveBtn, statusIcon, editBtn, toolbar, editorControls, editor, savedTextDiv, editorContainer;
var originalText = ""; // Track the original stored text

document.addEventListener("DOMContentLoaded", function () {
    // Store elements in variables once
    textInput = document.getElementById("text-input");
    saveBtn = document.getElementById("saveBtn");
    statusIcon = document.getElementById("statusIcon");
    editBtn = document.getElementById("editBtn");
    toolbar = document.getElementById("toolbar");
    editorControls = document.getElementById("editor-controls");
    editor = document.getElementById("editor");
    editorContainer = document.getElementById("container");
    savedTextDiv = document.getElementById("savedText");

    // Attach event listeners
    editBtn.addEventListener("click", switchToEditMode);

    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.key === "Enter") {
            event.preventDefault();
            saveBtn.click(); // Trigger save button
        }
    });

    // Load stored text from Trello
    t.get("card", "shared", "myRTLText").then(function (storedText) {
        if (storedText) {
            originalText = storedText;
            statusIcon.textContent = "✅";
            statusIcon.style.color = "green";

            toolbar.style.display = "none";
            editorControls.style.display = "none";
            editor.classList.add("saved-mode");
            textInput.style.display = "none";

            if (!savedTextDiv) {
                savedTextDiv = document.createElement("div");
                savedTextDiv.id = "savedText";
                savedTextDiv.classList.add("savedText");
                editor.appendChild(savedTextDiv);
            }
            savedTextDiv.addEventListener("click", switchToEditMode);
            savedTextDiv.textContent = storedText;
            savedTextDiv.style.display = "block"; // Ensure visibility
            editor.style.display = "block"; // Ensure editor is shown

            adjustIframeSize(); // Resize properly after loading
        } else {
            statusIcon.textContent = "❌";
            statusIcon.style.color = "red";
        }
    });

    // Detect text changes, mark as unsaved (Red X)
    textInput.addEventListener("input", function () {
        statusIcon.textContent = "❌";
        statusIcon.style.color = "red";
        autoResize();
    });

    // Clicking the red X reverts changes
    statusIcon.addEventListener("click", function () {
        if (statusIcon.textContent === "❌") {
            textInput.value = originalText || "";
            statusIcon.textContent = "✅";
            statusIcon.style.color = "green";
            autoResize();
        }
    });

    // Save text to Trello
    saveBtn.addEventListener("click", async function () {
        var text = textInput.value;
        await t.set("card", "shared", "myRTLText", text);

        originalText = text;
        statusIcon.textContent = "✅";
        statusIcon.style.color = "green";

        editor.classList.add("saved-mode");
        editorControls.style.display = "none"; // Hide Save & Icon
        editBtn.style.display = "block";
        toolbar.style.display = "none";
        textInput.style.display = "none";

        if (!savedTextDiv) {
            savedTextDiv = document.createElement("div");
            savedTextDiv.id = "savedText";
            savedTextDiv.classList.add("savedText");
            editor.appendChild(savedTextDiv);
        }

        savedTextDiv.textContent = text;
        savedTextDiv.style.display = "block";
        savedTextDiv.addEventListener("click", switchToEditMode);

        adjustIframeSize();
    });

    function switchToEditMode() {
        editor.style.display = "block";
        toolbar.style.display = "flex";
        editBtn.style.display = "none";
        editorControls.style.display = "block";
        textInput.style.display = "block";
        textInput.value = originalText;
        textInput.focus();

        if (savedTextDiv) {
            savedTextDiv.style.display = "none";
        }

        editor.classList.remove("saved-mode");

        requestAnimationFrame(() => {
            textInput.style.height = "auto";
            textInput.style.height = textInput.scrollHeight + "px";
            adjustIframeSize();
        });
    }

    function adjustIframeSize(newHeight = null) {
        if (newHeight) {
            window.iframeHeight = newHeight;
        } else {
            if (editorContainer) {
                window.iframeHeight = Math.max(editorContainer.scrollHeight + 5, 50); // 🔹 Add 5px buffer
            }
        }
        t.sizeTo(window.iframeHeight).done();
    }

    function autoResize() {
        textInput.style.height = "auto";
        textInput.style.height = textInput.scrollHeight + "px";
        t.sizeTo("#container").done();
    }

    textInput.addEventListener("input", autoResize);
});
