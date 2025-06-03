// Refactored content of src/app/sharing.js
export function initSharing() {
    const shareBtn = document.getElementById('share');

    if (shareBtn) {
        if (navigator.share && navigator.canShare) {
            shareBtn.onclick = async () => {
                // Example: Share some dummy data or data from the page
                const shareData = {
                    title: 'PWAs are awesome!',
                    text: 'I learned how to build a PWA today and use the Web Share API!',
                    url: window.location.href // Share the current page URL
                };

                // Check if we can share specific files (optional, depending on use case)
                // For example, if you have a file to share:
                // const file = new File(["dummy content"], "dummy.txt", {type: "text/plain"});
                // if (navigator.canShare({ files: [file] })) {
                //    shareData.files = [file];
                // }

                try {
                    await navigator.share(shareData);
                    console.log('Data shared successfully');
                } catch (err) {
                    console.error('Error sharing data:', err);
                }
            };
        } else {
            console.warn('Web Share API not supported or cannot share. Button will be ineffective.');
            shareBtn.disabled = true; // Optionally disable the button
        }
    } else {
        console.warn('Share button not found. Skipping init for sharing.');
    }
}
