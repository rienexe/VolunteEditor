const DAYS = [
    { id: 'monday', label: 'Montag' },
    { id: 'tuesday', label: 'Dienstag' },
    { id: 'wednesday', label: 'Mittwoch' },
    { id: 'thursday', label: 'Donnerstag' },
    { id: 'friday', label: 'Freitag' },
    { id: 'saturday', label: 'Samstag' },
    { id: 'sunday', label: 'Sonntag' },
];



export default class TimeSlotsTool {
    static get toolbox() {
        return {
            title: 'Zeiten',
            icon: '<i class="bi bi-clock"></i>'
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, readOnly }) {
        const initDay = (dayData) => {
            if (!dayData) return { mode: "closed", periods: [] };

            return {
                mode: dayData.mode || "closed",
                periods: dayData.periods || []
            };
        };

        this.data = {
            days: {
                monday: initDay(data.days?.monday),
                tuesday: initDay(data.days?.tuesday),
                wednesday: initDay(data.days?.wednesday),
                thursday: initDay(data.days?.thursday),
                friday: initDay(data.days?.friday),
                saturday: initDay(data.days?.saturday),
                sunday: initDay(data.days?.sunday),
            }
        };
        this.readOnly = !!readOnly;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'cdx-block';
        this.wrapper = wrapper;

        this.timeList = document.createElement('div');
        this.timeList.className = 'mb-2';

        Object.entries(this.data.days).forEach(([day, config]) => {
            if (this.readOnly && config.mode === "hidden") return;

            this.timeList.appendChild(
                this._addOpeningHoursEntry(day, config)
            );
        });

        wrapper.appendChild(this.timeList);

        return wrapper;
    }

    _rerender() {
        const newBlock = this.render();
        this.wrapper.replaceWith(newBlock);
        this.wrapper = newBlock;
    }

    _addOpeningHoursEntry(day, config) {
        let { mode, periods } = config;

        if (mode !== "hidden") {
            mode = periods.length > 0 ? "open" : "closed";
        }

        const entryWrapper = document.createElement('div');
        entryWrapper.className = 'd-flex flex-row align-items-baseline gap-2 mb-1';
        entryWrapper.setAttribute('data-ref', 'opening-hours');

        const dayLabel = document.createElement('p');
        dayLabel.className = 'fw-bold mb-0';
        dayLabel.style.flexBasis = '20%';
        dayLabel.style.flexShrink = '0';
        dayLabel.style.minWidth = '100px';
        dayLabel.setAttribute('data-ref', 'day-label');
        dayLabel.innerText = DAYS.find(item => item.id === day).label;

        entryWrapper.appendChild(dayLabel);

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'flex-grow-1 d-flex flex-wrap';

        if (mode === "closed") {
            inputWrapper.textContent = this.readOnly ? "geschlossen" : "";
        }

        if (mode === "open") {
            periods.forEach(period => {
                inputWrapper.appendChild(this._addPeriod(period));
            });
        }

        if (!this.readOnly) {
            const addBtn = document.createElement('button');
            addBtn.innerHTML = '<i class="bi bi-plus"></i>';
            addBtn.type = 'button';
            addBtn.className = 'btn btn-sm btn-outline-primary';
            addBtn.addEventListener('click', () => {
                inputWrapper.appendChild(this._addPeriod({ from: '', to: '' }));
            });
            inputWrapper.appendChild(addBtn);

            const isHidden = this.data.days[day].mode === "hidden";

            const hideToggleBtn = document.createElement('button');
            hideToggleBtn.innerHTML = `<i class="bi ${isHidden ? "bi-eye-slash" : "bi-eye"}"></i>`;
            hideToggleBtn.type = 'button';
            hideToggleBtn.className = 'btn btn-sm';

            hideToggleBtn.addEventListener("click", () => {
                const current = this.data.days[day].mode;
                this.data.days[day].mode = current === "hidden" ? "closed" : "hidden";

                hideToggleBtn.innerHTML = `<i class="bi ${this.data.days[day].mode === "hidden" ? "bi-eye-slash" : "bi-eye"}"></i>`;
            });
            inputWrapper.appendChild(hideToggleBtn);
        }

        entryWrapper.appendChild(inputWrapper);

        return entryWrapper;
    }

    _addPeriod(period) {
        const periodWrapper = document.createElement('div');

        if (!this.readOnly) {
            periodWrapper.className = 'd-flex flex-row align-items-baseline gap-1';
            periodWrapper.setAttribute('data-ref', 'period-wrapper')

            const timeFromInput = document.createElement('input');
            timeFromInput.className = 'form-control form-control-sm';
            timeFromInput.type = 'time';
            timeFromInput.value = period.from;

            const timeToInput = document.createElement('input');
            timeToInput.className = 'form-control form-control-sm';
            timeToInput.type = 'time';
            timeToInput.value = period.to;

            const removeBtn = document.createElement('a');
            removeBtn.className = 'link-danger';
            removeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
            removeBtn.addEventListener('click', () => {
                periodWrapper.remove();
            });

            periodWrapper.appendChild(timeFromInput);
            periodWrapper.appendChild(document.createTextNode(' - '));
            periodWrapper.appendChild(timeToInput);
            periodWrapper.appendChild(document.createTextNode('Uhr'));
            periodWrapper.appendChild(removeBtn);
        } else {
            periodWrapper.innerText = `${period.from} - ${period.to} Uhr`;
        }

        return periodWrapper;
    }

    save(blockContent) {
        const days = {};

        blockContent.querySelectorAll('[data-ref="opening-hours"]').forEach(entry => {
            const dayLabel = entry.querySelector('[data-ref="day-label"]')?.innerText?.trim();
            const day = DAYS.find(item => item.label === dayLabel).id;

            const inputWrapper = Array.from(entry.querySelectorAll('[data-ref="period-wrapper"]'));
            const periods = []

            inputWrapper.forEach(period => {
                const inputs = period.querySelectorAll('input');
                if (inputs.length === 2) {
                    const from = inputs[0].value;
                    const to = inputs[1].value;
                    if (from && to && from < to) {
                        periods.push({from, to});
                    } else {
                        period.remove();
                    }
                }
            });

            const mode = this.data.days[day].mode === "hidden"
                ? "hidden"
                : (periods.length ? "open" : "closed");

            days[day] = {
                mode,
                periods
            };
        });

        return {
            days
        };
    }

    validate(savedData) {
        return !!savedData?.days;
    }
}