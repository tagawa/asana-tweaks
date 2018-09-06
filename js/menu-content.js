'use strict';

var template = "User Agent: " + navigator.userAgent;

// Get the text box that's in focus and fill in the bug report template
var textBox = document.activeElement;
textBox.innerText = template; // For editable elements, e.g. <div>
textBox.value = template; // For <textarea> elements
