var t = window.TrelloPowerUp.iframe();
var textInput, saveBtn, statusIcon;
var originalText = ""; // Track the original stored text

document.addEventListener("DOMContentLoaded", function() {
  textInput = document.getElementById("text-input"); // Target the correct element
  saveBtn = document.getElementById("saveBtn");
  statusIcon = document.getElementById("statusIcon");

  // 1️⃣ Load stored text from Trello
  t.get('card', 'shared', 'myRTLText').then(function (storedText) {
    if (storedText) {
        originalText = storedText;
        statusIcon.textContent = '✅';
        statusIcon.style.color = 'green';

        // Hide editor & toolbar, display text instead
        document.getElementById("toolbar").style.display = "none";
        textInput.style.display = "none";

        // Create and display saved text
        var savedTextDiv = document.createElement("div");
        savedTextDiv.id = "savedText";
        savedTextDiv.classList.add("savedText");
        savedTextDiv.textContent = storedText;
        document.getElementById("editor").appendChild(savedTextDiv);

        // Add click event to switch back to edit mode
        savedTextDiv.addEventListener("click", function () {
            switchToEditMode();
        });
    } else {
        statusIcon.textContent = '❌';
        statusIcon.style.color = 'red';
    }
  });


  // 2️⃣ Detect text changes, mark as unsaved (Red X)
  textInput.addEventListener('input', function() {
    statusIcon.textContent = '❌';
    statusIcon.style.color = 'red';
    autoResize();
  });

  // 3️⃣ Clicking the red X reverts changes
  statusIcon.addEventListener('click', function() {
    if (statusIcon.textContent === '❌') {
      textInput.value = originalText || "";
      statusIcon.textContent = '✅';
      statusIcon.style.color = 'green';
      autoResize();
    }
  });

  // 4️⃣ Save text to Trello
  saveBtn.addEventListener('click', async function () {
    var text = textInput.value;

    // Save text in Trello
    await t.set('card', 'shared', 'myRTLText', text);

    // Update originalText and set status to saved (✅)
    originalText = text;
    statusIcon.textContent = '✅';
    statusIcon.style.color = 'green';

    // Hide editor & toolbar, display text instead
    document.getElementById("toolbar").style.display = "none"; // Hide toolbar
    textInput.style.display = "none"; // Hide textarea

    // Check if the savedTextDiv already exists
    var savedTextDiv = document.getElementById("savedText");
    if (!savedTextDiv) {
        savedTextDiv = document.createElement("div");
        savedTextDiv.id = "savedText";
        savedTextDiv.classList.add("savedText");
        document.getElementById("editor").appendChild(savedTextDiv);
    }

    savedTextDiv.textContent = text;
    savedTextDiv.style.display = "block"; // Show saved text

    // Add click event to switch back to edit mode
    savedTextDiv.addEventListener("click", function () {
        switchToEditMode();
    });
  });

  function switchToEditMode() {
    document.getElementById("toolbar").style.display = "flex"; // Show toolbar
    textInput.style.display = "block"; // Show textarea
    textInput.value = originalText; // Restore text
    textInput.focus(); // Focus the text input

    var savedTextDiv = document.getElementById("savedText");
    if (savedTextDiv) {
        savedTextDiv.style.display = "none"; // Hide saved text
    }
  }


  // 5️⃣ Auto-resize the editor height based on content
  function autoResize() {
    textInput.style.height = 'auto'; 
    textInput.style.height = textInput.scrollHeight + 'px';
    t.sizeTo('#container').done();
  }

  textInput.addEventListener('input', autoResize);
});
