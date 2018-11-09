'use strict';

function doTweaks() {
  // Get the existing elements we need in advance
  var sidebarHeaders = document.querySelectorAll('.SidebarCollapsibleHeader-name');
  // Sidebar inbox menu item:
  var notificationsButton = document.querySelector('.SidebarTopNavLinks-notificationsButton');
  // Top bar buttons:
  var globalActions = document.querySelector('.TopbarPageHeaderGlobalActions');
  // "New task" button in top bar:
  var taskButton = document.querySelector('.TopbarPageHeaderGlobalActions-omnibutton--newOmniButton');
  
  // When everything's ready, start manipulating!
  if (sidebarHeaders.length > 0 && !!notificationsButton && globalActions.childNodes.length > 0 && globalActions.childNodes[0].className.indexOf('Placeholder') < 0) {
    window.clearInterval(timer);
  } else {
    return;
  }
  
  // Get user ID for later use
  var homeButton = document.querySelector('.Sidebar a.SidebarTopNavLinks-homeButton');
  var homeLink = homeButton.href.split('/');
  var userId = (homeLink.pop() * 1) + 1; // Cast as integer to add 1
  
  
  /*
   * Remove the text in the "new task" button
   */
  var tmpHTML = taskButton.innerHTML.replace('New', '');
  taskButton.innerHTML = tmpHTML;


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
   * Add an "Inbox" button and "My Tasks" button to the main header.
   */
  
  var inboxButton, myTaskButton;
  globalActions.childNodes.forEach(function(globalAction) {
    if (globalAction.className.indexOf('CircularButton') > -1 && inboxButton === undefined) {
      // My Tasks button first - same order as in the sidebar.
      myTaskButton = globalAction.cloneNode(true);
      myTaskButton.classList.add('CircularButton-inboxButton');
      myTaskButton.href = '/0/' + userId + '/list';
      
      myTaskButton.innerHTML = '<svg class="NavIcon CheckNavIcon SidebarTopNavLinks-typeIcon" viewBox="0 0 40 40"><path d="M20,37.5c-9.6,0-17.5-7.9-17.5-17.5S10.4,2.5,20,2.5S37.5,10.4,37.5,20S29.6,37.5,20,37.5z M20,5.5C12,5.5,5.5,12,5.5,20S12,34.5,20,34.5S34.5,28,34.5,20S28,5.5,20,5.5z"></path><path d="M16.7,27.4c-0.4,0-0.8-0.1-1.1-0.4l-4.1-4.1c-0.6-0.6-0.6-1.5,0-2.1s1.5-0.6,2.1,0l3.1,3.1l8.9-8.9c0.6-0.6,1.5-0.6,2.1,0s0.6,1.5,0,2.1l-10,10C17.5,27.3,17.1,27.4,16.7,27.4z"></path></svg>';
      globalActions.insertBefore(myTaskButton, globalAction);
      
      // Inbox button next.
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
      
      inboxButton.innerHTML = '<svg class="NavIcon BellNavIcon SidebarTopNavLinks-typeIcon" viewBox="0 0 40 40"><path d="M7.5,32L7.5,32h-1c-1.5,0-2.8-0.8-3.4-2c-0.8-1.5-0.4-3.4,0.9-4.5c1.2-1,1.9-2.4,2-3.9v-6.1C6,8.1,12.3,2,20,2s14,6.1,14,13.5V22c0.2,1.4,0.9,2.6,2,3.5c1.3,1.1,1.7,2.9,0.9,4.5c-0.6,1.2-2,2-3.4,2h-0.9H7.5z M7.6,29h25.8c0.3,0,0.7-0.2,0.8-0.4c0.2-0.4,0-0.7-0.2-0.8l0,0c-1.6-1.4-2.7-3.3-3-5.5c0-0.1,0-0.1,0-0.2v-6.6C31,9.7,26.1,5,20,5S9,9.7,9,15.5v6.1v0.1c-0.2,2.4-1.3,4.5-3.1,6c-0.2,0.2-0.3,0.5-0.2,0.8C5.9,28.8,6.2,29,6.5,29H7.6L7.6,29z M24.7,34c-0.7,1.9-2.5,3.2-4.7,3.2s-4-1.3-4.7-3.2H24.7z"></path></svg>';
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
