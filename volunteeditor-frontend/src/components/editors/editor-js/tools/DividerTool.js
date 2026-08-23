export default class DividerTool {
    static get toolbox() {
        return {
            title: 'Trennlinie',
            icon: '<i class="bi bi-hr"></i>'
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ api, data }) {
        this.api = api;
        this.data = {
            color: data.color || 'secondary'
        };
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'cdx-block';

        this.hr = document.createElement('hr');
        this._renderHrColor();

        wrapper.appendChild(this.hr);
        return wrapper;
    }

    save(blockContent) {
        return {
            color: this.data.color
        };
    }

    validate(savedData) {
        return true;
    }

    renderSettings(){
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
            },
            {
                name: 'black',
                icon: `<i class="bi bi-square-fill text-dark"></i>`,
                text: 'Schwarz'
            }
        ];

        const wrapper = document.createElement('div');

        colorSettings.forEach(tune => {
            const button = document.createElement('div');

            button.classList.add(this.api.styles.settingsButton);
            button.classList.toggle(this.api.styles.settingsButtonActive, this.data.color === tune.name);
            button.innerHTML = tune.icon ;
            button.addEventListener('click', () => {
                this.data.color = tune.name;
                this._renderHrColor();
                [...wrapper.children].forEach(btn => btn.classList.toggle(this.api.styles.settingsButtonActive));
            });

            wrapper.appendChild(button);
        });

        return wrapper;
    }

    _renderHrColor() {
        if (this.hr) {
            this.hr.className = '';
            this.hr.classList.add('border', `border-${this.data.color}`, 'opacity-100');
        }
    }
}
