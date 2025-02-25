console.log("Trello RTL Power-Up: Board Button Initialized");

TrelloPowerUp.initialize({
    'card-buttons': function(t, options){
      return [{
        icon: 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421',
        text: 'Estimate Size',
      }];
    },
  });



/*
document.addEventListener("DOMContentLoaded", function () {
    console.log("Trello RTL Power-Up: Waiting for Trello API...");

    if (typeof window.TrelloPowerUp !== "undefined") {
        console.log("Trello RTL Power-Up: API Loaded, Initializing...");

        window.TrelloPowerUp.initialize({
            "board-buttons": function (t, opts) {
                console.log("Trello RTL Power-Up: Board Button Initialized");
                return [{
                    icon: "https://cdn-icons-png.flaticon.com/128/725/725107.png",
                    text: "Enable RTL",
                    callback: function (t) {
                        console.log("Trello RTL Power-Up: RTL Mode Activated");
                        applyRTL();
                        return t.alert({
                            message: "RTL mode enabled",
                            duration: 5
                        });
                    }
                }];
            }
        });
    } else {
        console.error("Trello RTL Power-Up: TrelloPowerUp is not defined. Retrying in 2 seconds...");
        setTimeout(() => location.reload(), 2000);
    }
});

function applyRTL() {
    console.log("Trello RTL Power-Up: Applying RTL Styles");
    let styles = document.createElement("style");
    styles.innerHTML = `
        body, .list-card-details, .window {
            direction: rtl !important;
            text-align: right !important;
        }
        .list-card {
            direction: ltr !important;
        }
    `;
    document.head.appendChild(styles);
}
*/