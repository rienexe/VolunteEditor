export default class TextHighlightTool {
    static get toolbox() {
        return {
            title: 'Kurzbeschreibung',
            icon: '<i class="bi bi-card-heading"></i>'
        };
    }

    static get enableLineBreaks() {
        return true;
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ api, config, data, readOnly }) {
        this.api = api;
        this.config = {
            title: {
                enabled: config?.title?.enabled !== false,
                placeholder: config?.title?.placeholder || 'Titel eingeben...',
            },
            text: {
                placeholder: config?.text?.placeholder || 'Text eingeben...',
            },
            getOrganisation: config?.getOrganisation || null
        };
        this.data = {
            title: data.title || '',
            titleEnabled: data.titleEnabled ?? true,
            text: data.text || '',
            color: data.color ?? config?.color ?? 'primary',
        };
        this.readOnly = !!readOnly;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'cdx-block';

        this.coloredWrapper = document.createElement('div');
        this.coloredWrapper.className = 'cdx-block text-highlight-tool w-100 rounded-4 p-3';
        this._renderColor();

        wrapper.appendChild(this.coloredWrapper);

        let title;

        if (this.config.title.enabled) {
            title = document.createElement('h2');
            title.className = 'p-0';
            title.setAttribute('data-ref', 'title');
            title.innerText = this.data.title;

            if (!this.readOnly) {
                title.contentEditable = 'true';
                title.dataset.placeholder = this.config.title.placeholder;
                title.addEventListener('input', () => {
                    this.data.title = title.innerText;
                });
            }

            this.coloredWrapper.appendChild(title);
        }

        const text = document.createElement('div');
        text.setAttribute('data-ref', 'text');
        text.innerText = this.data.text;

        if (!this.readOnly) {
            text.contentEditable = 'true';
            text.dataset.placeholder = this.config.text.placeholder;
            text.addEventListener('input', () => {
                this.data.text = text.innerText;
            });
        }

        this.coloredWrapper.appendChild(text);
        this._loadOrganisationData(title, text);

        return wrapper;
    }

    save(blockContent) {
        const titleEl = blockContent.querySelector('[data-ref="title"]');
        const textEl = blockContent.querySelector('[data-ref="text"]');

        return {
            title: titleEl?.innerText.trim() || '',
            text: textEl?.innerHTML.trim() || ''
        };
    }

    validate(savedData) {
        if (savedData.text.trim() === '') {
            return {
                valid: false,
                message: 'Bitte einen Text angeben.'
            };
        } else {
            return true;
        }
    }

    renderSettings() {
        const colorSettings = [
            {
                name: 'primary',
                icon: `<i class="bi bi-square-fill text-primary"></i>`,
                text: 'Blau'
            },
            {
                name: 'secondary',
                icon: `<i class="bi bi-square-fill text-secondary"></i>`,
                text: 'Grau'
            }
        ];

        const wrapper = document.createElement('div');

        colorSettings.forEach(tune => {
            const button = document.createElement('div');
            button.classList.add(this.api.styles.settingsButton);
            button.classList.toggle(this.api.styles.settingsButtonActive, this.data.color === tune.name);
            button.innerHTML = tune.icon ;
            button.title = tune.text;
            button.addEventListener('click', () => {
                this.data.color = tune.name;
                this._renderColor();

                [...wrapper.children].forEach(btn => btn.classList.remove(this.api.styles.settingsButtonActive));
                button.classList.add(this.api.styles.settingsButtonActive);
            });

            wrapper.appendChild(button);
        });

        return wrapper;
    }

    _renderColor() {
        if (!this.coloredWrapper) return;

        [...this.coloredWrapper.classList]
            .filter(cls => cls.startsWith('text-bg-'))
            .forEach(cls => this.coloredWrapper.classList.remove(cls));

        this.coloredWrapper.classList.add('d-inline-block', `text-bg-${this.data.color || 'primary'}`, 'rounded-4', 'p-3');
    }

    async _loadOrganisationData(titleEl, textEl) {
        if (!this.config.getOrganisation) return;
        if (this.data.title && this.data.text) return;

        try {
            const org = await this.config.getOrganisation();

            if (!org) return;

            if (!this.data.title && this.config.title.enabled) {
                this.data.title = org.name || '';
                if (titleEl) titleEl.innerText = this.data.title;
            }

            if (!this.data.text) {
                this.data.text = org.description || '';
                if (textEl) textEl.innerText = this.data.text;
            }
        } catch (e) {
            console.error('Organisation konnte nicht geladen werden', e);
        }
    }
}