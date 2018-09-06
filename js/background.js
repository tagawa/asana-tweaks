'use strict';

/*
Create the context menu item.
*/
chrome.contextMenus.create({
    id: "add-template",
    title: chrome.i18n.getMessage("contextMenuLabel"),
    type: "normal",
    contexts: ["editable"],
    documentUrlPatterns: ["*://app.asana.com/*"]
});

/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === 'add-template') {
      chrome.tabs.executeScript(tab.id, {file: "js/menu-content.js"});
    }
});
