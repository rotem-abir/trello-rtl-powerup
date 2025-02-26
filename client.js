console.log("✅ Trello RTL Power-Up: Script Loaded");

// Ensure Trello Power-Up API is loaded before running the script
window.TrelloPowerUp.initialize({
    "board-buttons": function (t, opts) {
        return [{
            icon: "https://cdn-icons-png.flaticon.com/128/725/725107.png",
            text: "Enable RTL",
            callback: function (t) {
                return t.get("board", "shared", "rtlEnabled").then(function (rtlEnabled) {
                    if (rtlEnabled) {
                        console.log("🔄 Disabling RTL Mode");
                        disableRTL();
                        return t.set("board", "shared", "rtlEnabled", false).then(function () {
                            return t.alert({ message: "RTL mode disabled", duration: 3 });
                        });
                    } else {
                        console.log("✅ Enabling RTL Mode");
                        enableRTL();
                        return t.set("board", "shared", "rtlEnabled", true).then(function () {
                            return t.alert({ message: "RTL mode enabled", duration: 3 });
                        });
                    }
                });
            }
        }];
    }
});

function enableRTL() {
    console.log("🌍 Applying RTL Styles...");
    let rtlStyle = document.createElement("style");
    rtlStyle.id = "rtl-styles";
    rtlStyle.innerHTML = `
        body, .list-card-details, .window, .board-header {
            direction: rtl !important;
            text-align: right !important;
        }
        .list-card {
            text-align: right !important;
        }
        .list {
            direction: rtl !important;
        }
        .list-wrapper {
            flex-direction: row-reverse !important;
        }
        .board-header-btn {
            text-align: right !important;
        }
    `;
    document.head.appendChild(rtlStyle);
    console.log("✅ RTL Mode Applied.");
}

function disableRTL() {
    console.log("🔄 Removing RTL Styles...");
    let existingStyle = document.getElementById("rtl-styles");
    if (existingStyle) {
        existingStyle.remove();
        console.log("❌ RTL Mode Disabled.");
    }
}