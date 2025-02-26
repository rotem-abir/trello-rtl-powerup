console.log("✅");

// Ensure Trello Power-Up API is loaded before running the script
window.TrelloPowerUp.initialize({
    "card-back-section": function(t, opts) {
      // Return a dynamic object describing how to render your custom editor
      return t.get('card', 'shared', 'myRTLText').then(function(storedText) {
        return {
          // The title appears at the top of your section
          title: "My RTL Text Editor",
          icon: "https://cdn-icons-png.flaticon.com/128/724/724933.png",
          content: {
            // We load an iframe pointing to our custom HTML editor
            type: "iframe",
            url: t.signUrl("./cardBackEditor.html"),
            height: 250 // initial height of the iframe (px)
          }
        };
      });
    }
  });
  