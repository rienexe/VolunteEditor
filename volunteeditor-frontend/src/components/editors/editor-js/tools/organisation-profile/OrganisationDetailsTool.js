const DATA_TYPES = [
    { type: 'org_name', label: 'Organisationsname' },
    { type: 'legal_form', label: 'Rechtsform' },
    { type: 'founding_year', label: 'Gründungsjahr' },
    { type: 'board', label: 'Vorstand/Obmann' },
    { type: 'address', label: 'Anschrift' },
    { type: 'registration_number', label: 'UID/ZVR' },
    { type: 'tax_number', label: 'Steuernummer' },
    { type: 'bank_account', label: 'Bankverbindung' },
    { type: 'number_of_members', label: 'Anzahl Mitglieder' },
    { type: 'number_of_volunteers', label: 'Anzahl Freiwillige' },
    { type: 'custom', label: 'Sonstiges' }
];

export default class OrganisationDetailsTool {
    static get toolbox() {
        return {
            title: 'Stammdaten',
            icon: '<i class="bi bi-database"></i>',
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
            details: data.details || []
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

        const dataTypeInputGroup = document.createElement('div');
        dataTypeInputGroup.className = 'input-group input-group-sm mb-2';

        const dataTypeSelect = document.createElement('select');
        dataTypeSelect.className = 'form-select';
        dataTypeSelect.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            this._addDataEntry(DATA_TYPES.find(item => item.type === selectedType));
        });


        DATA_TYPES.forEach(type => {
            const dataTypeOption = document.createElement('option');
            dataTypeOption.value = type.type;
            dataTypeOption.text = type.label;
            dataTypeSelect.appendChild(dataTypeOption);
        });

        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary';
        addBtn.type = 'button';
        addBtn.innerHTML = '<i class="bi bi-plus"></i> Neuer Eintrag';
        addBtn.addEventListener('click', () => {
            this._addDataEntry(DATA_TYPES.find(item => item.type === dataTypeSelect.value));
        });

        dataTypeInputGroup.appendChild(dataTypeSelect);
        dataTypeInputGroup.appendChild(addBtn);
        this.wrapper.appendChild(dataTypeInputGroup);


        this.dataList = document.createElement('div');

        this.data.details.forEach(entry => {
            this._addDataEntry(entry);
        });

        this.wrapper.appendChild(this.dataList);

        return this.wrapper;
    }

    _renderReadOnly() {
        this.data.details.forEach(entry => {
            const entryRow = document.createElement('div');
            entryRow.className = 'd-flex flex-row align-items-baseline gap-2 mb-1';

            if (entry.label) {
                const dataLabel = document.createElement('div');
                dataLabel.className = 'fw-bold';
                dataLabel.style.flexBasis = '25%';
                dataLabel.style.flexShrink = '0';
                dataLabel.style.minWidth = '100px';
                dataLabel.style.hyphens = 'auto';
                dataLabel.innerText = entry.label;

                entryRow.appendChild(dataLabel);
            }

            const dataValue = document.createElement('div');
            dataValue.className = 'flex-grow-1';

            if (entry.type === 'address') {
                const encodedAddress = encodeURIComponent(entry.value);
                const formatted = entry.value.replace(/\n/g, '<br>');
                dataValue.innerHTML = `<a href="https://www.google.com/maps/search/?q=${encodedAddress}" target="_blank">${formatted}</a>`;
            } else {
                dataValue.innerText = entry.value;
            }

            entryRow.appendChild(dataValue);
            this.wrapper.appendChild(entryRow);
        });

        return this.wrapper;
    }

    _addDataEntry({ type, label = '', value = '' } = {}) {
        const entryRow = document.createElement('div');
        entryRow.className = 'd-flex flex-row align-items-baseline gap-2 mb-1';
        entryRow.setAttribute('data-ref', 'data');
        entryRow.setAttribute('data-type', type);

        if (label) {
            let dataLabel;
            if (type === 'custom') {
                dataLabel = document.createElement('input');
                dataLabel.className = 'form-control form-control-sm fw-bold';
                dataLabel.placeholder = 'Feldname';
                dataLabel.value = label;
            } else {
                dataLabel = document.createElement('p');
                dataLabel.className = 'fw-bold mb-0 focus-ring';
                dataLabel.contentEditable = 'true';
                dataLabel.innerText = label;
            }
            dataLabel.setAttribute('data-ref', 'dataLabel');
            dataLabel.style.flexBasis = '20%';
            dataLabel.style.flexShrink = '0';
            dataLabel.style.minWidth = '100px';

            entryRow.appendChild(dataLabel);
        }

        let dataInput;
        if (type === 'address' || type === 'bank_account') {
            dataInput = document.createElement('textarea');
            dataInput.rows = 3;
        } else {
            dataInput = document.createElement('input');
            dataInput.type = 'text';
        }
        dataInput.className = 'form-control form-control-sm flex-grow-1';
        dataInput.setAttribute('data-ref', 'dataInput');
        dataInput.placeholder = 'Information ...';
        dataInput.value = value;

        const removeBtn = document.createElement('a');
        removeBtn.className = 'link-danger';
        removeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
        removeBtn.addEventListener('click', () => {
            entryRow.remove();
        });

        entryRow.appendChild(dataInput);
        entryRow.appendChild(removeBtn);

        this.dataList.appendChild(entryRow);
    }

    save(blockContent) {
        const entryRow = blockContent.querySelectorAll('[data-ref="data"]');
        const details = [];

        entryRow.forEach(entry => {
            const type = entry.getAttribute('data-type');
            const dataLabel = entry.querySelector('[data-ref="dataLabel"]');
            const value = entry.querySelector('[data-ref="dataInput"]').value;
            const label = dataLabel.tagName === 'INPUT' ? dataLabel.value : dataLabel.innerText;

            details.push({type, label, value});
        });

        return {
            details: details
        };
    }

    validate(savedData) {
        if (!savedData || !Array.isArray(savedData.details)) {
            return { valid: false, message: 'Keine Daten vorhanden' };
        }

        for (const entry of savedData.details) {
            const { type, label, value } = entry;
            if (!type || typeof value !== 'string' || value.trim().length === 0) {
                return { valid: false, message: 'Eintrag mit fehlender oder leerer Information' };
            }

            if (type === 'founding_year') {
                const year = parseInt(value, 10);
                const currentYear = new Date().getFullYear();
                if (isNaN(year) || year < 1800 || year > currentYear) {
                    return { valid: false, message: `Ungültiges Gründungsjahr: ${value}` };
                }
            }

            if (['tax_number', 'vat_id', 'registration_number'].includes(type)) {
                if (!/\d+/.test(value)) {
                    return { valid: false, message: `Ungültiges Format für ${label}` };
                }
            }

            if (type === 'address') {
                const plzRe = /\b\d{4,5}\b/;
                if (!plzRe.test(value)) {
                    return { valid: false, message: 'Adresse muss eine Postleitzahl enthalten' };
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
