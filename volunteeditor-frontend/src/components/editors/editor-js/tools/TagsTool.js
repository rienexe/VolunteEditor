export default class TagsTool {
    static get toolbox() {
        return {
            title: 'Schlagwörter',
            icon: '<i class="bi bi-tags"></i>',
        };
    }

    static get enableLineBreaks() {
        return true;
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ config, data, readOnly }) {
        this.config = {
            mode: config?.mode || 'hybrid',
            availableTags: Array.isArray(config?.tags) ? config.tags : [],
            link: config?.link || null,        };
        this.data = {
            tags: Array.isArray(data?.tags) ? data.tags : [],
            link: data?.link || null,        };
        this.readOnly = !!readOnly;

        this._uid = Math.random().toString(36).substr(2, 9);
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'cdx-block';

        this.tagsWrapper = document.createElement('div');
        this.tagsWrapper.className = 'tags-tool-wrapper d-flex align-items-baseline gap-1';

        this.wrapper.appendChild(this.tagsWrapper);

        if (!this.readOnly) {
            this.inputWrapper = document.createElement('div');

            this.input = document.createElement('input');
            this.input.className = 'form-control form-control-sm';
            this.input.placeholder = 'Tag hinzufügen...';
            this.input.setAttribute('list', `datalist-${this._uid}`);

            this.input.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ',') && this.input.value.trim()) {
                    e.preventDefault();
                    this._handleInput();
                }
            });

            this.input.addEventListener('blur', () => {
                if (this.input.value.trim()) {
                    this._handleInput();
                }
            });

            this.datalist = document.createElement('datalist');
            this.datalist.id = `datalist-${this._uid}`;

            this.inputWrapper.appendChild(this.input);
            this.inputWrapper.appendChild(this.datalist);
        }

        this._renderTags();
        return this.wrapper;
    }

    _handleInput() {
        const value = this.input.value.trim();
        if (!value) return;

        this._addTag(value);
        this.input.value = '';
    }

    _addTag(tag) {
        if (this.data.tags.some(t => t.toLowerCase() === tag.toLowerCase())) return;

        const tagExists = this.config.availableTags.includes(tag);

        if (this.config.mode === 'select-only' && !tagExists) return;

        this.data.tags.push(tag);
        this._renderTags();

        if (!this.readOnly && this.input) {
            this.input.focus();
        }
    }

    _renderTags() {
        this.tagsWrapper.innerHTML = '';

        const link = this.config.link ?? this.data.link ?? null;


        this.data.tags.forEach((tag, index) => {
            let tagEl;

            if (link) {
                const href = `/${link}${encodeURIComponent(tag.toLowerCase())}`;

                tagEl = document.createElement('a');
                tagEl.className = 'badge text-bg-primary text-decoration-none';
                if (this.readOnly) tagEl.href = href;
                tagEl.target = '_blank';
                tagEl.innerText = tag;
            } else {
                tagEl = document.createElement('span');
                tagEl.className = 'badge text-bg-secondary';
                tagEl.innerText = tag;
            }

            if (!this.readOnly) {
                const removeBtn = document.createElement('a');
                removeBtn.className = 'link-danger p-0 ms-1';
                removeBtn.innerHTML = '<i class="bi bi-x"></i>';
                removeBtn.style.cursor = 'pointer';
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.data.tags.splice(index, 1);
                    this._renderTags();
                });

                tagEl.appendChild(removeBtn);
            }

            this.tagsWrapper.appendChild(tagEl);
        });

        if (!this.readOnly && this.inputWrapper) {
            this.tagsWrapper.insertBefore(this.inputWrapper, this.tagsWrapper.firstChild);
            this._renderDatalist();
        }
    }

    _renderDatalist() {
        this.datalist.innerHTML = '';

        const suggestions = this.config.availableTags.filter(tag => !this.data.tags.includes(tag));

        suggestions.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            this.datalist.appendChild(option);
        });
    }

    save() {
        return {
            tags: [...this.data.tags],
            link: this.config.link ?? this.data.link,
        }
    }

    validate(savedData) {
        return Array.isArray(savedData.tags) &&
            savedData.tags.length > 0 &&
            savedData.tags.every(tag => typeof tag === 'string' && tag.length > 0);
    }
}
