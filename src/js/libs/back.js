chrome.runtime.onMessage.addListener(function(msg, sender) {
    /* First, validate the message's structure */
    console.log('dfdfdfdfdfdfdfdf');
    if ((msg.from === 'content')){
        chrome.pageAction.show(sender.tab.id);
    }
});

