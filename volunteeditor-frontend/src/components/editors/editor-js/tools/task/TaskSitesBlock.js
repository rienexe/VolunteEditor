export default class TaskSitesBlock {
    static get toolbox() {
        return {
            title: 'Einsatzort(e)',
            icon: '<i class="bi bi-geo-alt-fill"></i>',
        };
    }

    static get enableLineBreaks() {
        return true;
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ api, data, readOnly }) {
        this.api = api;
        this.data = {
            title: data.title ?? 'Einsatzort(e)',
            isRemote: data.isRemote || false,
            isChanging: data.isChanging || false,
            sites: Array.isArray(data.sites) ? data.sites : [],
        };
        this.readOnly = !!readOnly;

        this._uid = Math.random().toString(36).substr(2, 9);
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'cdx-block';

        const title = document.createElement('div');
        title.className = 'lead focus-ring mb-1';
        title.setAttribute('data-ref', 'title');
        title.innerText = this.data.title;
        if (!this.readOnly) {
            title.contentEditable = 'true';
            title.dataset.placeholder = 'Titel eingeben...';
        }
        this.wrapper.appendChild(title);

        if (this.readOnly) {
            this._renderReadOnly();
            return this.wrapper;
        }

        const checkOptionsWrapper = document.createElement('div');
        checkOptionsWrapper.className = 'mb-2';

        const remoteCheck = document.createElement('div');
        remoteCheck.className = 'form-check';

        let inputId = `remoteCheck_${this._uid}`;

        const remoteInput = document.createElement('input');
        remoteInput.className = 'form-check-input';
        remoteInput.id = inputId;
        remoteInput.type = 'checkbox';
        remoteInput.addEventListener('change', () => {
            this.data.isRemote = remoteInput.checked;
            this._renderInput();
            this._renderSites();
        })
        if (this.data.isRemote) remoteInput.checked = true;

        const remoteLabel = document.createElement('label');
        remoteLabel.className = 'form-check-label';
        remoteLabel.htmlFor = inputId;
        remoteLabel.innerHTML = '<b><i class="bi bi-wifi"></i> Ortsunabhängig / Remote</b>';

        remoteCheck.appendChild(remoteInput);
        remoteCheck.appendChild(remoteLabel);
        checkOptionsWrapper.appendChild(remoteCheck);

        const changingCheck = document.createElement('div');
        changingCheck.className = 'form-check';

        inputId = `changingCheck_${this._uid}`;

        const changingInput = document.createElement('input');
        changingInput.className = 'form-check-input';
        changingInput.id = inputId;
        changingInput.type = 'checkbox';
        changingInput.addEventListener('change', () => {
            this.data.isChanging = changingInput.checked;
        })
        if (this.data.isChanging) changingInput.checked = true;

        const changingLabel = document.createElement('label');
        changingLabel.className = 'form-check-label';
        changingLabel.htmlFor = inputId;
        changingLabel.innerHTML = '<b><i class="bi bi-arrow-repeat"></i> Einsatzort wechselnd</b>';

        changingCheck.appendChild(changingInput);
        changingCheck.appendChild(changingLabel);
        checkOptionsWrapper.appendChild(changingCheck);

        this.wrapper.appendChild(checkOptionsWrapper);

        this._renderInput();
        this._renderSites();

        return this.wrapper;
    }

    _renderReadOnly() {
        const list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.className = 'ps-0 mb-2';

        if (this.data.isRemote) {
            const remoteItem = document.createElement('li');
            remoteItem.innerHTML = '<b><i class="bi bi-wifi"></i> Ortsunabhängig / Remote</b>';

            list.appendChild(remoteItem);
        }

        if (this.data.isChanging) {
            const changingItem = document.createElement('li');
            changingItem.innerHTML = '<b><i class="bi bi-arrow-repeat"></i> Einsatzort wechselnd</b>';

            list.appendChild(changingItem);
        }

        this.wrapper.appendChild(list);

        if (!this.data.isRemote) {
            this.sitesWrapper = document.createElement('div');
            this.sitesWrapper.className = 'mb-2';

            this.sitesWrapper.innerHTML = `<b><i class="bi bi-geo"></i> ${this.data.sites.join(', ')}</b>`;
            this.wrapper.appendChild(this.sitesWrapper);
        }
    }

    _renderInput() {
        if (this.sitesInput) {
            this.sitesInput.remove();
            this.sitesInput = null;
        }

        if (!this.data.isRemote) {
            this.sitesInput = document.createElement('div');
            this.sitesInput.className = 'input-group input-group-sm mb-1';

            const siteInput = document.createElement('input');
            siteInput.className = 'form-control form-control-sm';
            siteInput.placeholder = 'Ort hinzufügen...';

            siteInput.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ',') && siteInput.value.trim()) {
                    e.preventDefault();
                    this._addSite(siteInput);
                }
            });
            siteInput.addEventListener('blur', () => {
                if (siteInput.value.trim()) {
                    this._addSite(siteInput);
                }
            });

            const addButton = document.createElement('button');
            addButton.type = 'button';
            addButton.className = 'btn btn-primary';
            addButton.innerHTML = '<i class="bi bi-plus-lg"></i>';
            addButton.addEventListener('click', () => this._addSite(siteInput));

            this.sitesInput.appendChild(siteInput);
            this.sitesInput.appendChild(addButton);

            this.wrapper.appendChild(this.sitesInput);
        }
    }

    _addSite(siteInput) {
        if (!siteInput.value) return;

        if (!this.data.sites.includes(siteInput.value)) {
            this.data.sites.push(siteInput.value);
            this._renderSites();
        }

        siteInput.value = '';
    }

    _renderSites() {
        if (this.sitesWrapper) {
            this.sitesWrapper.remove();
            this.sitesWrapper = null;
        }

        if (!this.data.isRemote) {
            this.sitesWrapper = document.createElement('div');
            this.sitesWrapper.className = 'mb-2';

            if (!Array.isArray(this.data.sites)) return;

            this.data.sites.forEach((site, index) => {
                const siteEl = document.createElement('span');
                siteEl.className = 'fw-bold';
                siteEl.innerText = site;

                if (!this.readOnly) {
                    const removeButton = document.createElement('a');
                    removeButton.className = 'link-danger p-0 ms-1 me-2';
                    removeButton.innerHTML = '<i class="bi bi-x-lg"></i>';
                    removeButton.style.cursor = 'pointer';
                    removeButton.addEventListener('click', () => {
                        this.data.sites.splice(index, 1);
                        this._renderSites();
                    });

                    siteEl.appendChild(removeButton);
                }

                this.sitesWrapper.appendChild(siteEl);
            });

            this.wrapper.appendChild(this.sitesWrapper);
        }
    }

    save(blockContent) {
        const titleEl = blockContent.querySelector('[data-ref="title"]');

        return {
            title: titleEl?.innerText.trim() || '',
            isRemote: this.data.isRemote,
            isChanging: this.data.isChanging,
            sites: this.data.sites,
        }
    }

    validate(savedData) {
        if (savedData.isRemote) {
            return true;
        } else if (Array.isArray(savedData.sites) && savedData.sites.length > 0) {
            return true;
        } else  {
            return {
                valid: false,
                message: 'Bitte mindestens einen Einsatzort angeben.'
            }
        }
    }
}
