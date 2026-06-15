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

// Heading picker
(function () {
  const toggle = document.getElementById('heading-toggle');
  const menu   = document.getElementById('heading-menu');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    var container = document.getElementById('container');
    var extraHeight = (container ? container.scrollHeight : 100) + 200;
    t.sizeTo(extraHeight).done();
  }

  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    t.sizeTo('#container').done();
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.hidden ? openMenu() : closeMenu();
  });

  menu.querySelectorAll('[data-block]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tag = btn.dataset.block;
      textInput && textInput.focus();
      document.execCommand('formatBlock', false, tag === 'p' ? '<p>' : '<' + tag + '>');
      closeMenu();
      textInput && textInput.focus();
    });
  });

  // Ctrl+Alt+0-6 shortcuts
  const blockMap = { 0:'p', 1:'h1', 2:'h2', 3:'h3', 4:'h4', 5:'h5', 6:'h6' };
  document.addEventListener('keydown', function (e) {
    if (!e.ctrlKey || !e.altKey) return;
    const tag = blockMap[e.key];
    if (!tag) return;
    e.preventDefault();
    textInput && textInput.focus();
    document.execCommand('formatBlock', false, tag === 'p' ? '<p>' : '<' + tag + '>');
  });

  document.addEventListener('click', closeMenu);
  menu.addEventListener('click', function (e) { e.stopPropagation(); });
})();

function onReady(fn) {
    if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); }
}

onReady(function () {
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

            requestAnimationFrame(function () { adjustIframeSize(); });
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
            t.sizeTo(newHeight).done();
        } else {
            t.sizeTo('#container').done();
        }
    }

    function autoResize() {
        textInput.style.height = "auto";
        textInput.style.height = textInput.scrollHeight + "px";
        t.sizeTo("#container").done();
    }

    textInput.addEventListener("input", autoResize);
});
