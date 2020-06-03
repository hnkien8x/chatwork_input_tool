/**
 * Ref:
 *  https://developer.chatwork.com/vi/messagenotation.html
 *  https://stackoverflow.com/questions/14484613/load-local-json-file-into-variable
 *  https://developer.chrome.com/extensions/storage
 */

const NEW_LINE = "\n";
const PREFIX_TO_SINGLE = "to";
const PREFIX_TO_MULTI = "to_multi";
const PREFIX_ICON = "tag";
const TEXT_TO_ICON = {
    ":)": "https://assets.chatwork.com/images/emoticon2x/emo_smile.gif",
    ":(": "https://assets.chatwork.com/images/emoticon2x/emo_sad.gif",
    ":D": "https://assets.chatwork.com/images/emoticon2x/emo_more_smile.gif",
    "8-)": "https://assets.chatwork.com/images/emoticon2x/emo_lucky.gif",
    ":o": "https://assets.chatwork.com/images/emoticon2x/emo_surprise.gif",
    ";)": "https://assets.chatwork.com/images/emoticon2x/emo_wink.gif",
    ";(": "https://assets.chatwork.com/images/emoticon2x/emo_tears.gif",
    "(sweat)": "https://assets.chatwork.com/images/emoticon2x/emo_sweat.gif",
    ":|": "https://assets.chatwork.com/images/emoticon2x/emo_mumu.gif",
    ":*": "https://assets.chatwork.com/images/emoticon2x/emo_kiss.gif",
    ":p": "https://assets.chatwork.com/images/emoticon2x/emo_tongueout.gif",
    "(blush)": "https://assets.chatwork.com/images/emoticon2x/emo_blush.gif",
    ":^)": "https://assets.chatwork.com/images/emoticon2x/emo_wonder.gif",
    "|-)": "https://assets.chatwork.com/images/emoticon2x/emo_snooze.gif",
    "(inlove)": "https://assets.chatwork.com/images/emoticon2x/emo_love.gif",
    "]:)": "https://assets.chatwork.com/images/emoticon2x/emo_grin.gif",
    "(talk)": "https://assets.chatwork.com/images/emoticon2x/emo_talk.gif",
    "(yawn)": "https://assets.chatwork.com/images/emoticon2x/emo_yawn.gif",
    "(puke)": "https://assets.chatwork.com/images/emoticon2x/emo_puke.gif",
    "(emo)": "https://assets.chatwork.com/images/emoticon2x/emo_ikemen.gif",
    "8-|": "https://assets.chatwork.com/images/emoticon2x/emo_otaku.gif",
    ":#)": "https://assets.chatwork.com/images/emoticon2x/emo_ninmari.gif",
    "(nod)": "https://assets.chatwork.com/images/emoticon2x/emo_nod.gif",
    "(shake)": "https://assets.chatwork.com/images/emoticon2x/emo_shake.gif",
    "(^^;)": "https://assets.chatwork.com/images/emoticon2x/emo_wry_smile.gif",
    "(whew)": "https://assets.chatwork.com/images/emoticon2x/emo_whew.gif",
    "(clap)": "https://assets.chatwork.com/images/emoticon2x/emo_clap.gif",
    "(bow)": "https://assets.chatwork.com/images/emoticon2x/emo_bow.gif",
    "(roger)": "https://assets.chatwork.com/images/emoticon2x/emo_roger.gif",
    "(flex)": "https://assets.chatwork.com/images/emoticon2x/emo_muscle.gif",
    "(dance)": "https://assets.chatwork.com/images/emoticon2x/emo_dance.gif",
    "(:/)": "https://assets.chatwork.com/images/emoticon2x/emo_komanechi.gif",
    "(gogo)": "https://assets.chatwork.com/images/emoticon2x/emo_gogo.gif",
    "(think)": "https://assets.chatwork.com/images/emoticon2x/emo_think.gif",
    "(please)": "https://assets.chatwork.com/images/emoticon2x/emo_please.gif",
    "(quick)": "https://assets.chatwork.com/images/emoticon2x/emo_quick.gif",
    "(anger)": "https://assets.chatwork.com/images/emoticon2x/emo_anger.gif",
    "(devil)": "https://assets.chatwork.com/images/emoticon2x/emo_devil.gif",
    "(lightbulb)": "https://assets.chatwork.com/images/emoticon2x/emo_lightbulb.gif",
    "(*)": "https://assets.chatwork.com/images/emoticon2x/emo_star.gif",
    "(h)": "https://assets.chatwork.com/images/emoticon2x/emo_heart.gif",
    "(F)": "https://assets.chatwork.com/images/emoticon2x/emo_flower.gif",
    "(cracker)": "https://assets.chatwork.com/images/emoticon2x/emo_cracker.gif",
    "(eat)": "https://assets.chatwork.com/images/emoticon2x/emo_eat.gif",
    "(^)": "https://assets.chatwork.com/images/emoticon2x/emo_cake.gif",
    "(coffee)": "https://assets.chatwork.com/images/emoticon2x/emo_coffee.gif",
    "(beer)": "https://assets.chatwork.com/images/emoticon2x/emo_beer.gif",
    "(handshake)": "https://assets.chatwork.com/images/emoticon2x/emo_handshake.gif",
    "(y)": "https://assets.chatwork.com/images/emoticon2x/emo_yes.gif"
};

/**
 * Create html element from string
 * @param {String} str 
 */
const createElement = (str) => {
    const el = document.createElement("template");
    el.insertAdjacentHTML("beforeend", str);
    return el.firstElementChild;
};

/**
 * Create Icon
 * @param {String} name This text will be displayed on web
 * @param {String} type Type of Icon, use for CSS
 * @param {Function} handler Click function
 * @param {String} desc Tooltip
 */
const createIcon = (name, type, handler, desc, isIcon) => {
    let html = `
        <li class="_showDescription __lftv___toolbarIcon" role="button" aria-label="${desc}" >
        <span class="__lftv___toolbarIcon_${type}">${name}</span>
        </li>
    `.trim();
    if (isIcon) {
        html = `
        <li class="_showDescription __lftv___toolbarIcon" role="button" aria-label="${desc}" >
            <span class="__lftv___toolbarIcon_${type}">
                <img src="${name}" class="emoticonTooltip__emoticon" title="" alt="">
            </span>
        </li>
        `.trim();
    }
    const el = createElement(html);
    el.addEventListener("click", handler);
    return el;
};

/**
 * Add Begin Text and End Text surround selected text in chatwork input textarea
 * @param {String} startTag 
 * @param {String} endTag 
 */
const surround = (startTag, endTag) => () => {
    const textarea = document.getElementById("_chatText");
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    const replaceText = `${startTag}${selectedText}${endTag}`;
    textarea.focus();
    document.execCommand("insertText", false, replaceText);
    if (selectedText.length == 0) {
        const cursor = textarea.selectionStart - endTag.length;
        textarea.setSelectionRange(cursor, cursor);
    }
};

/**
 * Click action when click on Icon
 * Insert text into cursor position
 * @param {String} tag Text will be inserted
 */
const insert = (tag) => () => {
    const textarea = document.getElementById("_chatText");
    const cursor = textarea.selectionStart;
    textarea.setSelectionRange(cursor, cursor);
    textarea.focus();
    document.execCommand("insertText", false, tag);
};

/**
 * Create wrapper of list Icon
 * @param {Array} icons List Icons
 */
const createIconWrapper = (icons) => {
    const html = '<ul id="__lftv___toolbarIcons"></ul>';
    const el = createElement(html);
    const f = document.createDocumentFragment();
    for (const icon of icons) {
        f.appendChild(icon);
    }
    el.appendChild(f);
    return el;
};

/**
 * Read json data, build Icon
 * @param {Object} json Config from config.json file
 */
const processJson = (json) => {
    let chatworkItems = [
        createIcon("title", PREFIX_ICON, surround("[title]", "[/title]"), "[title]Text[/title]"),
        createIcon("info", PREFIX_ICON, surround("[info]", "[/info]"), "[info]Text[/info]"),
        createIcon("code", PREFIX_ICON, surround("[code]", "[/code]"), "[code]Text[/code]")
    ];

    // Build Single Items
    if (json.single) {
        for (const item of json.single) {
            if (!item.id) {
                continue;
            }

            const name = item.name || "[pname:" + item.id + "]";
            const text = item.text || "TO: " + item.id;
            const chatworkToName = "[To:" + item.id + "]" + name + "さん";
            const tooltip = chatworkToName;

            const chatworkItem = createIcon(text, PREFIX_TO_SINGLE, insert(chatworkToName + NEW_LINE), tooltip);
            chatworkItems.push(chatworkItem);
        }
    }

    // Build Multiple Items
    if (json.multiple) {
        let groupIndex = 0;
        for (const item of json.multiple) {
            groupIndex += 1;
            let text = item.text || "TO: Group " + groupIndex;
            let users = [];
            let tooltip = [];

            if (item.items) {
                for (const userInto of item.items) {
                    if (!userInto.id) {
                        continue;
                    }

                    const name = userInto.name || "[pname:" + userInto.id + "]";
                    const chatworkToName = "[To:" + userInto.id + "]" + name + "さん";

                    users.push(chatworkToName);
                    tooltip.push(userInto.name);
                }
            }

            if (users.length == 0) {
                groupIndex -= 1;
                continue;
            }

            const chatworkItem = createIcon(text, PREFIX_TO_MULTI, insert(users.join(NEW_LINE) + NEW_LINE), "To: " + tooltip.join(", "));
            chatworkItems.push(chatworkItem);
        }
    }

    // Build Text items
    if (json.text) {
        let replaceTextDisplayByIcon = json.text.replace_text_display_by_icon || false;
        if (json.text.items) {
            for (const item of json.text.items) {
                if (!item.insert) {
                    continue;
                }
                let textDisplay = item.display || item.insert;
                let isIcon = false;
                if (replaceTextDisplayByIcon) {
                    if (TEXT_TO_ICON[item.insert]) {
                        textDisplay = TEXT_TO_ICON[item.insert];
                        isIcon = true;
                    }
                }
                const chatworkItem = createIcon(textDisplay, 'emo', insert(item.insert), item.insert, isIcon);
                chatworkItems.push(chatworkItem);
            }
        }
    }

    let icons = createIconWrapper(chatworkItems);

    const inject = () => {
        if (document.getElementById("__lftv___toolbarIcons") == null) {
            const parent = document.getElementById("_chatSendToolbar");
            const ref = document.getElementById("_chatSendTool");
            if (parent != null && ref != null) {
                parent.insertBefore(icons, ref.nextSibling);
            }
        }

        const prvs = document.getElementsByClassName("llokeD");
        for (let i = 0; i < prvs.length; i++) {
            const prv = prvs[i];
            prv.classList.add("__lftv__hide");
        }
    };
    inject();

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                inject();
            }
        }
    });

    const config = {
        childList: true,
    };

    observer.observe(document.getElementById("_chatSendArea"), config);
};

/**
 * Waiting for Dom load done
 */
const ready = () => {
    const delay = 100;// milliseconds
    const limit = 100;// Max retry 100 time
    let count = 0;

    const find = (resolve, reject) => {
        if (count >= limit) {
            return reject(new Error("Timeline not found."));
        }

        if (document.getElementById("_timeLine")) {
            return resolve();
        }

        count += 1;
        setTimeout(() => find(resolve, reject), delay);
    };

    return new Promise((resolve, reject) => find(resolve, reject));
};

/**
 * Main function
 */
ready().then(() => {
    // Get json from Storage
    chrome.storage.local.get(['lftv_json'], function(result) {
        if (!result.lftv_json) {
            // Get default fromt config.json file
            const url = chrome.extension.getURL("/config.json");
            fetch(url)
                .then((response) => response.json())
                .then((json) => processJson(json));
        } else {
            const json = JSON.parse(result.lftv_json);
            processJson(json)
        }
    });
}).catch((err) => console.log(err));
