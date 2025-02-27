var t = window.TrelloPowerUp.iframe();
var textInput, saveBtn, statusIcon;
var originalText = ""; // Track the original stored text

document.addEventListener("DOMContentLoaded", function() {
  textInput = document.getElementById("text-input"); // Target the correct element
  saveBtn = document.getElementById("saveBtn");
  statusIcon = document.getElementById("statusIcon");

  // 1️⃣ Load stored text from Trello
  t.get('card', 'shared', 'myRTLText')
  .then(function(storedText) {
    if (storedText) {
      textInput.value = storedText; // Corrected target
      originalText = storedText;
      statusIcon.textContent = '✅';
      statusIcon.style.color = 'green';
    } else {
      statusIcon.textContent = '❌';
      statusIcon.style.color = 'red';
    }
    autoResize();
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
  saveBtn.addEventListener('click', async function() {
    var text = textInput.value;
    await t.set('card', 'shared', 'myRTLText', text);
    originalText = text;
    statusIcon.textContent = '✅';
    statusIcon.style.color = 'green';
  });

  // 5️⃣ Auto-resize the editor height based on content
  function autoResize() {
    textInput.style.height = 'auto'; 
    textInput.style.height = textInput.scrollHeight + 'px';
    t.sizeTo('#container').done();
  }

  textInput.addEventListener('input', autoResize);
});
