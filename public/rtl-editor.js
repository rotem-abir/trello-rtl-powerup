var t = window.TrelloPowerUp.iframe();
var editor, saveBtn, statusIcon;
var originalText = ""; // Track the original stored text

document.addEventListener("DOMContentLoaded", function() {
  editor = document.getElementById("editor");
  saveBtn = document.getElementById("saveBtn");
  statusIcon = document.getElementById("statusIcon");

  // 1. Load any stored text from Trello
  t.get('card', 'shared', 'myRTLText')
  .then(function(storedText) {
    if (storedText) {
      editor.value = storedText;
      originalText = storedText;
      // If there's stored text, show a green check
      statusIcon.textContent = '✅';
      statusIcon.style.color = 'green';
    } else {
      // No stored text => show a red X
      statusIcon.textContent = '❌';
      statusIcon.style.color = 'red';
    }
    autoResize();
  });

  // 2. Whenever the user types, show a red X
  editor.addEventListener('input', function() {
    statusIcon.textContent = '❌';
    statusIcon.style.color = 'red';
    autoResize();
  });

  // 3. Clicking the red X reverts changes
  statusIcon.addEventListener('click', function() {
    if (statusIcon.textContent === '❌') {
      // Revert to original text
      editor.value = originalText;
      // Switch icon back to green check
      statusIcon.textContent = '✅';
      statusIcon.style.color = 'green';
      autoResize();
    }
  });

  // 4. Save button => store text in Trello
  saveBtn.addEventListener('click', function() {
    var text = editor.value;
    t.set('card', 'shared', 'myRTLText', text)
    .then(function() {
      originalText = text;
      statusIcon.textContent = '✅';
      statusIcon.style.color = 'green';
    });
  });

  // 5. Initial sizing
  t.sizeTo('#container').done();
});

// Auto-resize the <textarea> and the Power-Up iframe
function autoResize() {
  editor.style.height = 'auto';
  editor.style.height = editor.scrollHeight + 'px';
  t.sizeTo('#container').done();
}
