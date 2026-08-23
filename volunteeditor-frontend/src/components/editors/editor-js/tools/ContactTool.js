const CONTACT_TYPES = [
    { type: 'address', label: 'Adresse' },
    { type: 'email', label: 'E-Mail' },
    { type: 'phone', label: 'Telefon' },
    { type: 'website', label: 'Website' },
    { type: 'person', label: 'Kontaktperson' },
    { type: 'custom', label: 'Sonstiges' }
];



export default class ContactTool {
    static get toolbox() {
        return {
            title: 'Kontaktdaten',
            icon: '<i class="bi bi-person-lines-fill"></i>',
        };
    }

    static get enableLineBreaks() {
        return true;
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, readOnly }) {
        this.data = {
            contacts: data.contacts || []
        };
        this.readOnly = !!readOnly;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'cdx-block';

        if (this.readOnly) {
            this._renderReadOnly();
            return this.wrapper;
        }

        const contactTypeInputGroup = document.createElement('div');
        contactTypeInputGroup.className = 'input-group input-group-sm mb-2';

        const contactTypeSelect = document.createElement('select');
        contactTypeSelect.className = 'form-select';
        contactTypeSelect.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            this._addContactEntry(CONTACT_TYPES.find(item => item.type === selectedType));
        });

        CONTACT_TYPES.forEach(type => {
            const contactTypeOption = document.createElement('option');
            contactTypeOption.value = type.type;
            contactTypeOption.text = type.label;
            contactTypeSelect.appendChild(contactTypeOption);
        });

        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary';
        addBtn.type = 'button';
        addBtn.innerHTML = '<i class="bi bi-plus"></i> Neuer Eintrag';
        addBtn.addEventListener('click', () => {
            this._addContactEntry(CONTACT_TYPES.find(item => item.type === contactTypeSelect.value));
        });

        contactTypeInputGroup.appendChild(contactTypeSelect);
        contactTypeInputGroup.appendChild(addBtn);
        this.wrapper.appendChild(contactTypeInputGroup);


        this.contactList = document.createElement('div');

        this.data.contacts.forEach(entry => {
            this._addContactEntry(entry);
        });

        this.wrapper.appendChild(this.contactList);

        return this.wrapper;
    }

    _renderReadOnly() {
        this.data.contacts.forEach(entry => {
            const entryRow = document.createElement('div');
            entryRow.className = 'd-flex flex-row align-items-baseline gap-2 mb-1';

            if (entry.label) {
                const contactLabel = document.createElement('div');
                contactLabel.className = 'fw-bold';
                contactLabel.style.flexBasis = '25%';
                contactLabel.style.flexShrink = '0';
                contactLabel.style.minWidth = '100px';
                contactLabel.style.hyphens = 'auto';
                contactLabel.innerText = entry.label;

                entryRow.appendChild(contactLabel);
            }

            const contactValue = document.createElement('div');
            contactValue.className = 'flex-grow-1';

            switch (entry.type) {
                case 'address':
                    const encodedAddress = encodeURIComponent(entry.value);
                    const formatted = entry.value.replace(/\n/g, '<br>');
                    contactValue.innerHTML = `<a href="https://www.google.com/maps/search/?q=${encodedAddress}" target="_blank">${formatted}</a>`;
                    break;
                case 'email':
                    contactValue.innerHTML = `<a href="mailto:${entry.value}">${entry.value}</a>`;
                    break;
                case 'phone':
                    contactValue.innerHTML = `<a href="tel:${entry.value.replace(/\s+/g, '')}">${entry.value}</a>`;
                    break;
                case 'website':
                    let url = entry.value.trim();
                    if (!/^https?:\/\//i.test(url)) {
                        url = 'https://' + url;
                    }
                    contactValue.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${entry.value}</a>`;
                    break;
                default:
                    contactValue.innerText = entry.value;
            }

            entryRow.appendChild(contactValue);
            this.wrapper.appendChild(entryRow);
        });

        return this.wrapper;
    }

    _addContactEntry({ type, label = '', value = '' } = {}) {
        const entryRow = document.createElement('div');
        entryRow.className = 'd-flex flex-row align-items-baseline gap-2 mb-1';
        entryRow.setAttribute('data-ref', 'contact');
        entryRow.setAttribute('data-type', type);

        if (label) {
            let contactLabel;
            if (type === 'custom') {
                contactLabel = document.createElement('input');
                contactLabel.className = 'form-control form-control-sm fw-bold';
                contactLabel.placeholder = 'Feldname';
                contactLabel.value = label;
            } else {
                contactLabel = document.createElement('p');
                contactLabel.className = 'fw-bold mb-0 focus-ring';
                contactLabel.contentEditable = 'true';
                contactLabel.innerText = label;
            }
            contactLabel.setAttribute('data-ref', 'contactLabel');
            contactLabel.style.flexBasis = '20%';
            contactLabel.style.flexShrink = '0';
            contactLabel.style.minWidth = '100px';

            entryRow.appendChild(contactLabel);
        }

        let contactInput;
        if (type === 'address' || type === 'person') {
            contactInput = document.createElement('textarea');
            contactInput.rows = 3;
        } else {
            contactInput = document.createElement('input');
            contactInput.type = 'text';
        }
        contactInput.className = 'form-control form-control-sm flex-grow-1';
        contactInput.setAttribute('data-ref', 'contactInput');
        contactInput.placeholder = 'Kontaktinformation';
        contactInput.value = value;

        const removeBtn = document.createElement('a');
        removeBtn.className = 'link-danger';
        removeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
        removeBtn.addEventListener('click', () => {
            entryRow.remove();
        });

        entryRow.appendChild(contactInput);
        entryRow.appendChild(removeBtn);

        this.contactList.appendChild(entryRow);
    }

    save(blockContent) {
        const entryRow = blockContent.querySelectorAll('[data-ref="contact"]');
        const contacts = [];

        entryRow.forEach(entry => {
            const type = entry.getAttribute('data-type');
            const contactLabel = entry.querySelector('[data-ref="contactLabel"]');
            const value = entry.querySelector('[data-ref="contactInput"]').value;
            let label;

            if (type !== 'person') {
                label = contactLabel.tagName === 'INPUT' ? contactLabel.value : contactLabel.innerText;
            }

            contacts.push({type, label, value});
        });

        return {
            contacts: contacts
        };
    }

    validate(savedData) {
        if (!savedData || !Array.isArray(savedData.contacts)) {
            return { valid: false, message: 'Keine Kontaktdaten vorhanden' };
        }

        for (const entry of savedData.contacts) {
            const { type, label, value } = entry;
            if (!type || typeof value !== 'string' || value.trim().length === 0) {
                return { valid: false, message: 'Eintrag mit fehlender oder leerer Kontaktinformation' };
            }

            if (type === 'address') {
                const plzRe = /\b\d{4,5}\b/;
                if (!plzRe.test(value)) {
                    return { valid: false, message: 'Adresse muss eine Postleitzahl enthalten' };
                }
            }

            if (type === 'email') {
                const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRe.test(value)) {
                    return { valid: false, message: `Ungültige E-Mail-Adresse: ${value}` };
                }
            }

            if (type === 'phone') {
                const phoneRe = /^\+?[0-9 ()\-]{6,}$/;
                if (!phoneRe.test(value)) {
                    return { valid: false, message: `Ungültige Telefonnummer: ${value}` };
                }
            }

            if (type === 'website') {
                const urlRe = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
                if (!urlRe.test(value)) {
                    return { valid: false, message: `Ungültige URL: ${value}` };
                }
            }

            if (type === 'custom') {
                if (!label || label.trim() === '') {
                    return { valid: false, message: 'Benutzerdefinierte Felder müssen einen Namen haben' };
                }

            }
        }

        return true;
    }
}
