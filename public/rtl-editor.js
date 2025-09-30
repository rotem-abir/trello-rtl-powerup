var t = window.TrelloPowerUp.iframe();
var textInput, saveBtn, statusIcon, editBtn, toolbar, editorControls, editor, savedTextDiv, editorContainer;
var originalText = ""; // Track the original stored text

const model = {
    originalText:  "",
    isEditing: false,
};

const vm = {
    editorContainer,
    editor,
    toolbar,
    textInput,
    editorControls,
    saveBtn,
    statusIcon,
    editBtn,
    savedTextDiv,

    init: function () {
        vm.cacheElements();
        vm.bindEvents();
        vm.loadStoredText();
    },

    cacheElements: function () {
        vm.elements = {
            editorContainer: document.getElementById("container"),
            editor: document.getElementById("editor"),
            toolbar: document.getElementById("toolbar"),
            textInput: document.getElementById("text-input"),
            editorControls: document.getElementById("editor-controls"),
            saveBtn: document.getElementById("saveBtn"),
            statusIcon: document.getElementById("statusIcon"),
            editBtn: document.getElementById("editBtn"),
            savedTextDiv: document.getElementById("savedText") || vm.createSavedTextDiv(),    
        }
    }
};

const view = {

};

document.querySelectorAll('#toolbar [data-cmd]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const cmd = e.currentTarget.dataset.cmd;
      if (cmd === 'emoji') {
        const sel = getSelection(); if (!sel.rangeCount) return;
        const r = sel.getRangeAt(0); r.deleteContents();
        r.insertNode(document.createTextNode('🙂')); r.collapse(false);
      } else {
        document.execCommand(cmd, false, null);
      }
      textInput.focus();
    });
  });  

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
            savedTextDiv.innerHTML = storedText;
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
            textInput.innerHTML = originalText || "";
            statusIcon.textContent = "✅";
            statusIcon.style.color = "green";
            autoResize();
        }
    });

    // Save text to Trello
    saveBtn.addEventListener("click", async function () {
        const html = textInput.innerHTML;
        await t.set("card", "shared", "myRTLText", html);

        originalText = html;
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

        savedTextDiv.innerHTML = html;
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
        textInput.innerHTML = originalText;
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
