window.TrelloPowerUp.initialize({
    "board-buttons": function (t, opts) {
        return [{
            icon: "https://cdn-icons-png.flaticon.com/128/725/725107.png",
            text: "Enable RTL",
            callback: function (t) {
                applyRTL();
                return t.alert({
                    message: "RTL mode enabled",
                    duration: 5
                });
            }
        }];
    }
});

// Ensure JavaScript is executed only when Trello is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    console.log("Trello RTL Power-Up Loaded");
});

function applyRTL() {
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
