import { Tooltip } from 'bootstrap';



const DURATION_TYPES = [
    { type: 'one-time', label: 'Einmalig', description: 'einmaliger, nicht regelmäßiger Einsatz', icon: '<i class="bi bi-calendar3-event"></i>' },
    { type: 'short-term', label: 'Befristet', description: 'Einsatz mit festem Start- und Enddatum', icon: '<i class="bi bi-calendar3-week"></i>' },
    { type: 'long-term', label: 'Unbefristet', description: 'längerfristiger oder offener Einsatz ohne definiertes Ende', icon: '<i class="bi bi-calendar3"></i>' }
];

const SCHEDULE_TYPES = [
    { type: 'single', label: 'fixierte Termine', description: 'mehrere, nicht regelmäßig stattfindende Termine', icon: '<i class="bi bi-calendar-check"></i>' },
    { type: 'recurring', label: 'regelmäßig', description: 'z. B. wöchentlich oder monatlich', icon: '<i class="bi bi-arrow-repeat"></i>' },
    { type: 'flexible', label: 'nach Vereinbarung', description: 'Zeitliche Details werden individuell abgestimmt', icon: '<i class="bi bi-hand-thumbs-up"></i>' }
];



export default class TemporalDemandTool {
    static get toolbox() {
        return {
            title: 'Zeitausmaß',
            icon: '<i class="bi bi-calendar3"></i>'
        }
    }

    static get enableLineBreaks() {
        return true;
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, readOnly }) {
        this.data =  {
            durationSubtitle: data.durationSubtitle ?? 'Dauer des Engagements',
            scheduleSubtitle: data.scheduleSubtitle ?? 'Termine',
            durationType: data.durationType || DURATION_TYPES[0],
            scheduleType: data.scheduleType || SCHEDULE_TYPES[0],
            dates: data.dates ?? (data.scheduleType?.type === 'recurring' ? '' : [])
        };
        this.readOnly = !!readOnly;

        this._uid = Math.random().toString(36).substr(2, 9);
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'cdx-block';

        if (this.readOnly) {
            this._renderReadOnly();
            return this.wrapper;
        }

        const durationTypeWrapper = document.createElement('div');
        durationTypeWrapper.className = 'mb-2';

        const durationTypeTitle = document.createElement('div');
        durationTypeTitle.className = 'lead focus-ring mb-1';
        durationTypeTitle.setAttribute('data-ref', 'duration-subtitle');
        durationTypeTitle.innerText = this.data.durationSubtitle;
        durationTypeTitle.contentEditable = 'true';
        durationTypeTitle.dataset.placeholder = 'Titel eingeben...';
        durationTypeWrapper.appendChild(durationTypeTitle);

        let inputName = `durationType_${this._uid}`;

        DURATION_TYPES.forEach(durationType => {
            const durationTypeRadio = document.createElement('div');
            durationTypeRadio.className = 'form-check';

            const inputId = `durationType_${durationType.type}_${this._uid}`;

            const durationTypeInput = document.createElement('input');
            durationTypeInput.className = 'form-check-input';
            durationTypeInput.name = inputName;
            durationTypeInput.id = inputId;
            durationTypeInput.type = 'radio';
            durationTypeInput.value = durationType.type;
            durationTypeInput.addEventListener('change', () => {
                this.data.durationType = DURATION_TYPES.find(item => item.type === durationTypeInput.value);
            });

            if (this.data.durationType === durationType) {
                durationTypeInput.checked = true;
            }

            const durationTypeLabel = document.createElement('label');
            durationTypeLabel.className = 'form-check-label';
            durationTypeLabel.htmlFor = inputId;
            durationTypeLabel.innerHTML =`<b>${durationType.icon} ${durationType.label}</b>`;
            durationTypeLabel.setAttribute('data-bs-toggle', 'tooltip');
            durationTypeLabel.setAttribute('data-bs-placement', 'top');
            durationTypeLabel.setAttribute('data-bs-title', durationType.description);
            new Tooltip(durationTypeLabel);

            durationTypeRadio.appendChild(durationTypeInput);
            durationTypeRadio.appendChild(durationTypeLabel);
            durationTypeWrapper.appendChild(durationTypeRadio);
        })

        this.wrapper.appendChild(durationTypeWrapper);

        const scheduleTypeWrapper = document.createElement('div');
        scheduleTypeWrapper.className = 'mb-2';

        const scheduleTypeTitle = document.createElement('div');
        scheduleTypeTitle.className = 'lead focus-ring mt-2 mb-1';
        scheduleTypeTitle.setAttribute('data-ref', 'schedule-subtitle');
        scheduleTypeTitle.innerText = this.data.scheduleSubtitle;
        scheduleTypeTitle.contentEditable = 'true';
        scheduleTypeTitle.dataset.placeholder = 'Titel eingeben...';
        scheduleTypeWrapper.appendChild(scheduleTypeTitle);

        inputName = `scheduleType_${this._uid}`;

        SCHEDULE_TYPES.forEach(scheduleType => {
            const scheduleTypeRadio = document.createElement('div');
            scheduleTypeRadio.className = 'form-check';

            const inputId = `scheduleType_${scheduleType.type}_${this._uid}`;

            const scheduleTypeInput = document.createElement('input');
            scheduleTypeInput.className = 'form-check-input';
            scheduleTypeInput.name = inputName;
            scheduleTypeInput.id = inputId;
            scheduleTypeInput.type = 'radio';
            scheduleTypeInput.value = scheduleType.type;
            scheduleTypeInput.addEventListener('change', () => {
                this.data.scheduleType = SCHEDULE_TYPES.find(item => item.type === scheduleTypeInput.value);
                this._renderDatesInput();
            });

            if (this.data.scheduleType.type === scheduleType.type) {
                scheduleTypeInput.checked = true;
            }

            const scheduleTypeLabel = document.createElement('label');
            scheduleTypeLabel.className = 'form-check-label';
            scheduleTypeLabel.htmlFor = inputId;
            scheduleTypeLabel.innerHTML =`<b>${scheduleType.icon} ${scheduleType.label}</b>`;
            scheduleTypeLabel.setAttribute('data-bs-toggle', 'tooltip');
            scheduleTypeLabel.setAttribute('data-bs-placement', 'top');
            scheduleTypeLabel.setAttribute('data-bs-title', scheduleType.description);
            new Tooltip(scheduleTypeLabel);

            scheduleTypeRadio.appendChild(scheduleTypeInput);
            scheduleTypeRadio.appendChild(scheduleTypeLabel);
            scheduleTypeWrapper.appendChild(scheduleTypeRadio);
        })

        this.wrapper.appendChild(scheduleTypeWrapper);

        this.datesWrapper = document.createElement('div');
        this.datesWrapper.className = 'mb-2';

        this._renderDatesInput();

        this.wrapper.appendChild(this.datesWrapper);

        return this.wrapper;
    }

    _renderReadOnly() {
        if (this.data.durationType) {
            const durationTypeTitle = document.createElement('div');
            durationTypeTitle.className = 'lead mb-1';
            durationTypeTitle.innerText = this.data.durationSubtitle;
            this.wrapper.appendChild(durationTypeTitle);

            const durationType = this.data.durationType;

            if (durationType) {
                const durationTypeItem = document.createElement('div');
                durationTypeItem.className = 'd-inline-block';
                durationTypeItem.innerHTML =`<b>${durationType.icon} ${durationType.label}</b>`;
                durationTypeItem.setAttribute('data-bs-toggle', 'tooltip');
                durationTypeItem.setAttribute('data-bs-placement', 'top');
                durationTypeItem.setAttribute('data-bs-title', durationType.description);
                new Tooltip(durationTypeItem);

                this.wrapper.appendChild(durationTypeItem);
            }
        }

        if (this.data.scheduleType) {
            const scheduleTypeTitle = document.createElement('div');
            scheduleTypeTitle.className = 'lead mt-2 mb-1';
            scheduleTypeTitle.innerText = this.data.scheduleSubtitle;
            this.wrapper.appendChild(scheduleTypeTitle);

            const scheduleType = this.data.scheduleType;

            if (scheduleType) {
                const scheduleTypeItem = document.createElement('div');
                scheduleTypeItem.className = 'd-inline-block';
                scheduleTypeItem.innerHTML =`<b>${scheduleType.icon} ${scheduleType.label}</b>`;
                scheduleTypeItem.setAttribute('data-bs-toggle', 'tooltip');
                scheduleTypeItem.setAttribute('data-bs-placement', 'top');
                scheduleTypeItem.setAttribute('data-bs-title', scheduleType.description);
                new Tooltip(scheduleTypeItem);

                this.wrapper.appendChild(scheduleTypeItem);
            }

            if (scheduleType.type === 'single') {
                this._renderDates();

                this.wrapper.appendChild(this.datesWrapper);
            }
        }
    }

    _renderDatesInput() {
        if (this.datesInput) {
            this.datesInput.remove();
            this.datesInput = null;
        }

        this._clearRenderedDates();

        switch (this.data.scheduleType.type) {
            case 'single':
                this._renderDatesInputSingle();
                this._renderDates();
                break;
            case 'recurring':
                this._renderDatesInputRecurring();
                break;
            default:
                return;
        }
    }

    _renderDatesInputSingle() {
        this.datesInput = document.createElement('div');
        this.datesInput.className = 'd-flex no-wrap mb-1';

        const dateInputWrapper = document.createElement('div');

        const dateInputGroup = document.createElement('div');
        dateInputGroup.className = 'input-group input-group-sm';

        const dateIcon = document.createElement('label');
        dateIcon.className = 'input-group-text';
        dateIcon.innerHTML = '<i class="bi bi-calendar-date"></i>';
        dateInputGroup.appendChild(dateIcon);

        const startDateInput = document.createElement('input');
        startDateInput.type = 'text';
        startDateInput.className = 'form-control';
        startDateInput.min = new Date().toISOString().split("T")[0];
        startDateInput.placeholder = 'Start';
        startDateInput.onfocus = () => {startDateInput.type='date'};
        startDateInput.onblur = () => {startDateInput.type='text'};
        startDateInput.required = true;
        dateInputGroup.appendChild(startDateInput);

        const endDateInput = document.createElement('input');
        endDateInput.type = 'text';
        endDateInput.className = 'form-control';
        endDateInput.min = new Date().toISOString().split("T")[0];
        endDateInput.placeholder = 'Ende';
        endDateInput.onfocus = () => {endDateInput.type='date'};
        endDateInput.onblur = () => {endDateInput.type='text'};
        dateInputGroup.appendChild(endDateInput);
        dateInputWrapper.appendChild(dateInputGroup);

        const timeInputGroup = document.createElement('div');
        timeInputGroup.className = 'input-group input-group-sm';

        const timeIcon = document.createElement('label');
        timeIcon.className = 'input-group-text';
        timeIcon.innerHTML = '<i class="bi bi-clock"></i>';
        timeInputGroup.appendChild(timeIcon);

        const startTimeInput = document.createElement('input');
        startTimeInput.type = 'text';
        startTimeInput.className = 'form-control';
        startTimeInput.placeholder = 'Von';
        startTimeInput.onfocus = () => {startTimeInput.type='time'};
        startTimeInput.onblur = () => {startTimeInput.type='text'};
        timeInputGroup.appendChild(startTimeInput);

        const endTimeInput = document.createElement('input');
        endTimeInput.type = 'text';
        endTimeInput.className = 'form-control';
        endTimeInput.placeholder = 'Bis';
        endTimeInput.onfocus = () => {endTimeInput.type='time'};
        endTimeInput.onblur = () => {endTimeInput.type='text'};
        timeInputGroup.appendChild(endTimeInput);
        dateInputWrapper.appendChild(timeInputGroup);
        this.datesInput.appendChild(dateInputWrapper);

        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary';
        addBtn.type = 'button';
        addBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
        addBtn.addEventListener('click', () =>
            this._addDate(startDateInput, endDateInput, startTimeInput, endTimeInput)
        );
        this.datesInput.appendChild(addBtn);

        this.wrapper.appendChild(this.datesInput);
    }

    _renderDatesInputRecurring() {
        this.datesInput = document.createElement('textarea');
        this.datesInput.className = 'form-control';
        this.datesInput.placeholder = 'regelmäßige Termine eingeben...';
        this.datesInput.rows = 3;

        if (typeof this.data.dates === 'string') {
            this.datesInput.value = this.data.dates;
        }

        this.datesInput.addEventListener('input', () => {
            this.data.dates = this.datesInput.value;
        });

        this.wrapper.appendChild(this.datesInput);
    }

    _renderDates() {
        this._clearRenderedDates();

        if (this.data.scheduleType.type === 'single') {
            this.datesWrapper = document.createElement('div');
            this.datesWrapper.className = 'mb-2';

            if (!Array.isArray(this.data.dates)) return;

            this.data.dates.forEach((date, index) => {
                const row = document.createElement('div');

                const startDate = date.startDate || '';
                const endDate = date.endDate ? ` bis ${date.endDate}` : '';

                const startTime = date.startTime || '';
                const endTime = date.endTime ? ` bis ${date.endTime} Uhr` : (startTime ? ' Uhr' : '');

                row.innerHTML = `${startDate}${endDate}${(startTime || endTime) ? ` | ${startTime}${endTime}` : ''}`;

                if (!this.readOnly) {
                    const removeBtn = document.createElement('a');
                    removeBtn.className = 'link-danger p-0 ms-1 me-2';
                    removeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
                    removeBtn.addEventListener('click', () => {
                        this.data.dates.splice(index, 1);
                        this._renderDates();
                    });

                    row.append(removeBtn);
                }

                this.datesWrapper.appendChild(row);
            });

            this.wrapper.appendChild(this.datesWrapper);
        }
    }

    _clearRenderedDates() {
        if (this.datesWrapper) {
            this.datesWrapper.remove();
        }
    }

    _addDate(startDate, endDate, startTime, endTime) {
        if (!startDate.value) return;

        const formatDate = (dateStr) => {
            if (!dateStr) return null;
            const [year, month, day] = dateStr.split("-");
            return `${day}.${month}.${year}`;
        };

        const date = {
            startDate: formatDate(startDate?.value),
            endDate: formatDate(endDate?.value),
            startTime: startTime?.value ?? null,
            endTime: endTime?.value ?? null
        };

        this.data.dates.push(date);
        this._renderDates();

        startDate.value = '';
        endDate.value = '';
        startTime.value = '';
        endTime.value = '';
    }

    save(blockContent) {
        const durationSubtitleEl = blockContent.querySelector('[data-ref="duration-subtitle"]');
        const scheduleSubtitleEl = blockContent.querySelector('[data-ref="schedule-subtitle"]');

        return {
            durationSubtitle: durationSubtitleEl?.innerText.trim() || '',
            scheduleSubtitle: scheduleSubtitleEl.innerText.trim() || '',
            durationType: this.data.durationType,
            scheduleType: this.data.scheduleType,
            dates: this.data.dates
        }
    }

    validate(savedData) {
        const { scheduleType, dates } = savedData || {};

        if (scheduleType.type === 'single') {
            if (!Array.isArray(dates) || dates.length === 0) {
                return {
                    valid: false,
                    message: 'Bitte einen Termin für die einmalige Aktivität angeben.'
                };
            }
        }

        return true;
    }
}