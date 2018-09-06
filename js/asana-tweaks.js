'use strict';

function doTweaks() {
  // Get the existing elements we need in advance
  var sidebarHeaders = document.querySelectorAll('.SidebarCollapsibleHeader-name');
  // Sidebar inbox menu item:
  var notificationsButton = document.querySelector('.SidebarTopNavLinks-notificationsButton');
  // Top bar buttons:
  var globalActions = document.querySelector('.TopbarPageHeaderGlobalActions');
  
  // When everything's ready, start manipulating!
  if (sidebarHeaders.length > 0 && !!notificationsButton && globalActions.childNodes.length > 0 && globalActions.childNodes[0].className.indexOf('Placeholder') < 0) {
    window.clearInterval(timer);
  } else {
    return;
  }
  
  
  /*
   * In the sidebar, change the "Reports" header.
   */
  
  sidebarHeaders.forEach(function(sidebarHeader) {
    if (sidebarHeader.textContent === 'Reports') {
      sidebarHeader.textContent = 'Reports & Saved Searches';
    }
  });


  /*
   * In task lists, show the full task name as a tooltip, in case normal display is truncated.
   */
  
  function getTaskTitles() {
    // Task list items:
    var taskNames = document.querySelectorAll('.TaskName, .TaskRow-parentTaskName');
    if (taskNames.length > 0) {
      taskNames.forEach(function(taskName) {
        var titles = taskName.textContent.split('|');
        taskName.title = titles[0];
      });
    }
  }
  getTaskTitles();

  // Check for changes to the page title and rebuild the task list if necessary
  var pageTopbar = document.querySelector('.page-topbar');
  if (!!pageTopbar) {
    var topbarObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === "childList") {
          getTaskTitles();
        }
      });
    });

    topbarObserver.observe(pageTopbar, {
      childList: true //configure it to listen to childList changes
    });
  }
  
  
  /*
   * Add an "Inbox" button to the main header.
   */
  
  var inboxButton;
  globalActions.childNodes.forEach(function(globalAction) {
    if (globalAction.className.indexOf('CircularButton') > -1 && inboxButton === undefined) {
      inboxButton = globalAction.cloneNode(true);
      inboxButton.classList.add('CircularButton-inboxButton');
      inboxButton.href = '/0/inbox';
      
      // Ideally, fire the existing inbox button for a faster view change.
      if (!!notificationsButton) {
        inboxButton.onclick = function(e) {
          e.preventDefault();
          notificationsButton.click();
        };
      }
      
      // Image credit goes to the wonderful https://iconmonstr.com
      inboxButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="Icon InboxIcon" width="16" height="16" viewBox="0 0 24 24"><path d="M10 3h4v5h3l-5 5-5-5h3v-5zm8.546 0h-2.344l5.467 9h-4.669l-2.25 3h-5.5l-2.25-3h-4.666l5.46-9h-2.317l-5.477 8.986v9.014h24v-9.014l-5.454-8.986z"/></svg>';
      globalActions.insertBefore(inboxButton, globalAction);
    
    }
  })

  // Toggle the inbox notification on and off
  function toggleNotification(element) {
    if (element.className.indexOf('hasNewNotifications') > -1) {
      inboxButton.classList.add('CircularButton-inboxButton--hasNewNotifications');
    } else {
      inboxButton.classList.remove('CircularButton-inboxButton--hasNewNotifications');
    }
  }

  // Check for changes to the main inbox notification, and toggle if necessary
  if (!!notificationsButton) {
    toggleNotification(notificationsButton);

    var notificationsObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName == "class") {
          toggleNotification(mutation.target);
        }
      });
    });

    notificationsObserver.observe(notificationsButton, {
      attributes: true //configure it to listen to attribute changes
    });
  }
}

var timer = window.setInterval(doTweaks, 500);
