// Refactored content of src/app/contact-picker.js
export function initContactPicker() {
    const btn = document.getElementById('contacts');
    const supported = ('contacts' in navigator && 'ContactsManager' in window);

    if (btn) {
        if (supported) {
            btn.addEventListener('click', getContacts);
        } else {
            console.warn('Contact Picker API not supported. Button will be ineffective.');
            btn.disabled = true; // Optionally disable the button
        }
    } else {
        console.warn('Contact picker button not found. Skipping init.');
    }
}

async function getContacts() {
    const props = ['name', 'email', 'tel', 'address', 'icon'];
    const opts = {multiple: true};

    try {
        const contacts = await navigator.contacts.select(props, opts);
        console.log(contacts);
    } catch (err) {
        console.error('Error selecting contacts:', err);
    }
}
