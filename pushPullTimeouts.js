let submitTimeout;
let pullTimeout;
function rescheduleSubmit() {
    clearTimeout(submitTimeout);
    clearTimeout(pullTimeout);
    submitTimeout = setTimeout(async () => {
        // Wait to pull from server until we've sent
        console.log(await submitNotes(quill.getContents()));
        console.log(`Synced with cloud (upload style)`);
        // Restart the regular pulls from server
        reschedulePull();
    }, 1000);
}
function reschedulePull() {
    clearTimeout(pullTimeout);
    pullTimeout = setTimeout(async () => {
        const response = await pullNotes();
        const notesFromCloud = JSON.parse(response.body);
        // Record where the cursor was
        const selection = quill.getSelection();
        // Paste over the current editor text
        quill.setContents(notesFromCloud.data);
        // Place the cursor back where it was
        quill.setSelection(selection);
        console.log(`Synced with cloud (download style)`);
        reschedulePull();
    }, 3000);
}
// TODO make a separate, immediate call to pull the notes on startup so we
// have a current copy of the notes
(async () => {
    const response = await pullNotes();
    const notesFromCloud = JSON.parse(response.body);
    quill.setContents(notesFromCloud.data);
})();
reschedulePull();


quill.on('text-change', (delta, oldDelta, source) => {
    if (source == 'user') {
        console.log(`user input caused scheduled change`);
        rescheduleSubmit();
    }
});