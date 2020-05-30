/**
 * When popup loaded, get current setting and fill it into Popup
 */
window.onload = function() {
    let textInput = document.getElementById('__lftv___json');

    // Get json from Storage
    chrome.storage.local.get(['lftv_json'], function(result) {
        if (!result.lftv_json) {
            // Get default fromt config.json file
            const url = chrome.extension.getURL("/config.json");
            fetch(url)
                .then((response) => response.json())
                .then((json) => {
                    textInput.value = JSON.stringify(json, null, 4);
                });
        } else {
            const json = JSON.parse(result.lftv_json);
            textInput.value = JSON.stringify(json, null, 4);
        }
    });
}

/**
 * Actions
 */
document.addEventListener('DOMContentLoaded', function() {
    let textInput = document.getElementById('__lftv___json');

    // Save action
    var checkPageButton = document.getElementById('__lftv___btn');
    checkPageButton.addEventListener('click', function() {
        let json = textInput.value;
        json = tryParseJSON(json);
        if (json === false) {
            showMessage("Invalid JSON format");
        } else {
            // Save data
            const jsonStringFormated = JSON.stringify(json, null, 4);
            chrome.storage.local.set({'lftv_json': jsonStringFormated}, function() {
                showMessage("Done\nPlease reload Chatwork to apply new config", true);
            });
        }
    }, false);

    // Reload action
    var checkPageButton = document.getElementById('__lftv___btnLoadDefault');
    checkPageButton.addEventListener('click', function() {
        // Get default fromt config.json file
        const url = chrome.extension.getURL("/config.json");
        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                textInput.value = JSON.stringify(json, null, 4);
            });
    }, false);
}, false);

/**
 * Show alert message
 * @param {String} mess
 */
const showMessage = (mess, closePopup) => {
    alert(mess);
    if (closePopup) {
        window.close();
    }
};

/**
 * Parse json
 * @param {String} jsonString 
 */
const tryParseJSON = (jsonString) => {
    try {
        const o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    } catch (e) {}
    return false;
};
