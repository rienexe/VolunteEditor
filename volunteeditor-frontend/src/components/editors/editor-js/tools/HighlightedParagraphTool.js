import ParagraphTool from '@editorjs/paragraph';



export default class HighlightedParagraphTool extends ParagraphTool {
    static get toolbox() {
        return {
            title: 'Text hervorgehoben',
            icon: '<i class="bi bi-textarea-t"></i>'
        };
    }

    static get pasteConfig() {
        return {};
    }

    constructor({ data, config, api, readOnly }) {
        super({ api, config, data, readOnly });
        this.data = {
            ...data,
            color: data.color ?? config?.color ?? 'primary'
        };
    }

    render() {
        this.wrapper = super.render();
        this._renderColor();
        return this.wrapper;
    }

    save(blockContent) {
        const baseData = super.save(blockContent);
        return {
            ...baseData,
            color: this.data.color
        };
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
        if (!this.wrapper) return;

        [...this.wrapper.classList]
            .filter(cls => cls.startsWith('text-bg-'))
            .forEach(cls => this.wrapper.classList.remove(cls));

        this.wrapper.classList.add('d-inline-block', `text-bg-${this.data.color}`, 'rounded-4', 'p-3');
    }
}