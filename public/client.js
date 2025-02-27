console.log("✅ RTL Powerup loaded");

document.querySelector("iframe.plugin-iframe")?.removeAttribute("title");

// Ensure Trello Power-Up API is loaded before running the script
window.TrelloPowerUp.initialize({
    "card-back-section": function(t, opts) {
      // Return a dynamic object describing how to render your custom editor
      return t.get('card', 'shared', 'myRTLText').then(function(storedText) {
        return {
          // The title appears at the top of your section
          title: "RTL Text Editor",
          icon: "./rtl-icon.png",
          content: {
            // We load an iframe pointing to our custom HTML editor
            type: "iframe",
            url: t.signUrl("./cardBackEditor.html"),
            height: 50 // initial height of the iframe (px)
          }
        };
      });
    },
    "card-buttons": function (t, opts) {
      return [
        {
          icon: "https://rotem-abir.github.io/trello-rtl-powerup/public/rtl-icon.png", // Use any icon
          text: "Toggle RTL Editor",
          callback: function (t) {
            return t.get("card", "shared", "rtlEditorVisible")
              .then(function (visible) {
                let newState = !visible;
                return t.set("card", "shared", "rtlEditorVisible", newState)
                  .then(() => t.alert({ message: newState ? "RTL Editor Enabled" : "RTL Editor Hidden", duration: 0.2 }));
              });
          }
        }
      ];
    }
  });

  


