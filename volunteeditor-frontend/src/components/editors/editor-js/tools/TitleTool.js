import { createEditableTitle } from "@/components/editors/editor-js/tools/helper.js";



export default class TitleTool {
    static get toolbox() {
        return {
            title: 'Titel',
            icon: '<i class="bi bi-card-text"></i>'
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, readOnly, config }) {
        this.data = {
            title: data.title || '',
        };
        this.placeholder = config?.placeholder || 'Titel eingeben...';
        this.readOnly = !!readOnly;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'cdx-block';

        const title = createEditableTitle(this.data.title, this.readOnly, 1);
        title.dataset.placeholder = this.placeholder;
        wrapper.appendChild(title);

        return wrapper;
    }

    save(blockContent) {
        const titleEl = blockContent.querySelector('[data-ref="title"]');

        return {
            title: titleEl?.innerText.trim() || '',
        };
    }

    validate(savedData) {
        if (savedData.title.trim() === '') {
            return {
                valid: false,
                message: `${this.placeholder} ist erforderlich`
            }
        } else {
            return true;
        }
    }
}