import ParagraphTool from '@editorjs/paragraph';



export default class TemplateTool extends ParagraphTool {
    static get toolbox() {
        return {
            title: 'Text',
            icon: '<i class="bi bi-card-text"></i>'
        };
    }

    static get conversionConfig() {
        return {
            export: (data) => data.text,
            import: (text) => ({ text }),
        };
    }

    static get pasteConfig() {
        return {};
    }

    constructor({ api, block, config, data, readOnly }) {
        super({ api, config, data, readOnly });
        this.api = api;
        this.block = block;
        this.config = config || {};
    }

    render() {
        const text = super.render();
        text.dataset.placeholder = this.config.placeholder;
        text.setAttribute('data-ref', 'text');

        return text;
    }

    rendered() {
        const index = this.api.blocks.getBlockIndex(this.block.id);
        this.api.blocks.insert('header', { text: this.config.title, level: 2 }, {}, index);
    }
}