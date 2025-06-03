// src/app/file-system.js
export function initFileSystem() {
    const openFileButton = document.getElementById('fsa-open-file-btn');
    const saveFileButton = document.getElementById('fsa-save-file-btn');
    const textArea = document.getElementById('fsa-text-area');
    const statusElement = document.getElementById('fsa-status');

    if (!openFileButton || !saveFileButton || !textArea || !statusElement) {
        console.warn('File System Access API HTML elements not found. Skipping initFileSystem.');
        return;
    }

    // Options for file pickers
    const pickerOpts = {
        types: [
            {
                description: 'Text Files',
                accept: { 'text/plain': ['.txt', '.text'] },
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    };

    // Open File Logic
    openFileButton.addEventListener('click', async () => {
        if (!window.showOpenFilePicker) {
            statusElement.textContent = 'File System Access API (showOpenFilePicker) is not supported by this browser.';
            console.warn('showOpenFilePicker not supported.');
            return;
        }

        try {
            statusElement.textContent = 'Opening file picker...';
            const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
            const file = await fileHandle.getFile();
            const contents = await file.text();
            textArea.value = contents;
            statusElement.textContent = `File "${file.name}" opened successfully.`;
            console.log(`File "${file.name}" opened.`);
        } catch (error) {
            if (error.name === 'AbortError') {
                statusElement.textContent = 'File open cancelled by user.';
                console.log('File open aborted by user.');
            } else {
                statusElement.textContent = `Error opening file: ${error.message}`;
                console.error('Error opening file:', error);
            }
        }
    });

    // Save File Logic
    saveFileButton.addEventListener('click', async () => {
        if (!window.showSaveFilePicker) {
            statusElement.textContent = 'File System Access API (showSaveFilePicker) is not supported by this browser.';
            console.warn('showSaveFilePicker not supported.');
            return;
        }

        const textContentFromTextArea = textArea.value;

        try {
            statusElement.textContent = 'Opening save file picker...';
            const fileHandle = await window.showSaveFilePicker(pickerOpts);
            const writable = await fileHandle.createWritable();
            await writable.write(textContentFromTextArea);
            await writable.close();
            statusElement.textContent = `Content successfully saved to "${fileHandle.name}".`;
            console.log(`Content saved to "${fileHandle.name}".`);
        } catch (error) {
            if (error.name === 'AbortError') {
                statusElement.textContent = 'File save cancelled by user.';
                console.log('File save aborted by user.');
            } else {
                statusElement.textContent = `Error saving file: ${error.message}`;
                console.error('Error saving file:', error);
            }
        }
    });

    statusElement.textContent = 'File System Access API demo initialized.';
}