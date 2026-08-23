const WORK_TYPES = [
    { type: 'individual', label: 'Einzelarbeit', icon: '<i class="bi bi-person"></i>' },
    { type: 'group', label: 'Gruppenarbeit', icon: '<i class="bi bi-people"></i>' },
];

const ENGAGEMENT_TYPES = [
    { type: 'volunteering', label: 'Ehrenamt' },
    { type: 'voluntaryService', label: 'Freiwilligendienst' },
    { type: 'internship', label: 'Praktikum' },
    { type: 'corporateVolunteering', label: 'Corporate Volunteering' },
    { type: 'onlineVolunteering', label: 'Online-Volunteering / Digitale Helfer:innen' },
    { type: 'mentoring', label: 'Mentor:innen / Pat:innen' },
    { type: 'proBono', label: 'Experten auf Zeit / Pro-Bono-Unterstützung' },
    { type: 'mandatoryHelp', label: 'Pflichthelfer:innen (z. B. Sozialstunden)' }
];



export default class WorkTypeAndDemandTool {
    static get toolbox() {
        return {
            title: 'Arbeitsform & Bedarf',
            icon: '<i class="bi bi-person-raised-hand"></i>'
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
            title: data.title ?? 'Arbeitsform & Bedarf',
            isUrgent: data.isUrgent || false,
            workTypes: Array.isArray(data.workTypes) ? data.workTypes : [],
            engagementTypes: Array.isArray(data.engagementTypes) ? data.engagementTypes : [],
            demand: {
                prefix: data?.demand?.prefix ?? '',
                number: data?.demand?.number ?? 2,
                suffix: data?.demand?.suffix ?? 'Personen gesucht',
            },
        }
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

        const urgentCheck = document.createElement('div');
        urgentCheck.className = 'form-check mb-2';

        const inputId = `urgent_${this._uid}`;

        const urgentInput = document.createElement('input');
        urgentInput.className = 'form-check-input';
        urgentInput.id = inputId;
        urgentInput.type = 'checkbox';
        urgentInput.checked = this.data.isUrgent;
        urgentInput.addEventListener('change', () => {
            this.data.isUrgent = urgentInput.checked;
        });

        const urgentLabel = document.createElement('label');
        urgentLabel.className = 'form-check-label';
        urgentLabel.htmlFor = inputId;
        urgentLabel.innerHTML = '<b><i class="bi bi-alarm"></i> dringender Bedarf</b>';

        urgentCheck.appendChild(urgentInput);
        urgentCheck.appendChild(urgentLabel);
        this.wrapper.appendChild(urgentCheck);

        WORK_TYPES.forEach(workType => {
            const workTypeCheck = document.createElement('div');
            workTypeCheck.className = 'form-check';
            if (workType === WORK_TYPES[WORK_TYPES.length - 1]) { workTypeCheck.classList.add('mb-2');}

            const inputId = `workType_${workType.type}_${this._uid}`;

            const workTypeInput = document.createElement('input');
            workTypeInput.className = 'form-check-input';
            workTypeInput.id = inputId;
            workTypeInput.type = 'checkbox';
            workTypeInput.value = workType.type;

            if (Array.isArray(this.data.workTypes) && this.data.workTypes.includes(workType.type)) {
                workTypeInput.checked = true;
            }

            workTypeInput.addEventListener('change', () => {
                if (!Array.isArray(this.data.workTypes)) {
                    this.data.workTypes = [];
                }

                if (workTypeInput.checked) {
                    if (!this.data.workTypes.includes(workType.type)) {
                        this.data.workTypes.push(workType.type);
                    }
                } else {
                    this.data.workTypes = this.data.workTypes.filter(type => type !== workType.type);
                }
            });

            const workTypeLabel = document.createElement('label');
            workTypeLabel.className = 'form-check-label';
            workTypeLabel.htmlFor = inputId;
            workTypeLabel.innerHTML = `<b>${workType.icon} ${workType.label}</b>`;

            workTypeCheck.appendChild(workTypeInput);
            workTypeCheck.appendChild(workTypeLabel);
            this.wrapper.appendChild(workTypeCheck);
        });

        ENGAGEMENT_TYPES.forEach(engagementType => {
            const engagementTypeCheck = document.createElement('div');
            engagementTypeCheck.className = 'form-check';

            const inputId = `engagementType_${engagementType.type}_${this._uid}`;

            const engagementTypeInput = document.createElement('input');
            engagementTypeInput.className = 'form-check-input';
            engagementTypeInput.id = inputId;
            engagementTypeInput.type = 'checkbox';
            engagementTypeInput.value = engagementType.type;

            if (Array.isArray(this.data.engagementTypes) && this.data.engagementTypes.includes(engagementType.type)) {
                engagementTypeInput.checked = true;
            }

            engagementTypeInput.addEventListener('change', () => {
                if (!Array.isArray(this.data.engagementTypes)) {
                    this.data.engagementTypes = [];
                }

                if (engagementTypeInput.checked) {
                    if (!this.data.engagementTypes.includes(engagementType.type)) {
                        this.data.engagementTypes.push(engagementType.type);
                    }
                } else {
                    this.data.engagementTypes = this.data.engagementTypes.filter(type => type !== engagementType.type);
                }
            });

            const engagementTypeLabel = document.createElement('label');
            engagementTypeLabel.className = 'form-check-label';
            engagementTypeLabel.htmlFor = inputId;
            engagementTypeLabel.innerHTML = engagementType.label;

            engagementTypeCheck.appendChild(engagementTypeInput);
            engagementTypeCheck.appendChild(engagementTypeLabel);
            this.wrapper.appendChild(engagementTypeCheck);
        });

        const demandWrapper = document.createElement('div');
        demandWrapper.className = 'd-flex flex-wrap align-items-baseline gap-1 mt-2';

        const demandPrefix = document.createElement('span');
        demandPrefix.className = 'focus-ring';
        demandPrefix.setAttribute('data-ref', 'demand-prefix');
        demandPrefix.innerText = this.data.demand.prefix;
        demandPrefix.contentEditable = 'true';
        demandPrefix.dataset.placeholder = 'Prefix eingeben...'

        const demandInput = document.createElement('input');
        demandInput.className = 'form-control form-control-sm';
        demandInput.setAttribute('data-ref', 'demand-number');
        demandInput.type = 'number';
        demandInput.style.width = '3rem';
        demandInput.min = '0';
        demandInput.value = this.data.demand.number;
        demandInput.step = '1';

        const demandSuffix = document.createElement('div');
        demandSuffix.className = ' focus-ring';
        demandSuffix.setAttribute('data-ref', 'demand-suffix');
        demandSuffix.innerText = this.data.demand.suffix;
        demandSuffix.contentEditable = 'true';
        demandSuffix.dataset.placeholder = 'Suffix eingeben...'

        demandWrapper.appendChild(demandPrefix);
        demandWrapper.appendChild(demandInput);
        demandWrapper.appendChild(demandSuffix);
        this.wrapper.appendChild(demandWrapper);

        return this.wrapper;
    }

    _renderReadOnly() {
        const list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.className = 'ps-0 mb-2';

        if (this.data.isUrgent) {
            const urgentItem = document.createElement('li');
            urgentItem.className = 'text-primary';
            urgentItem.innerHTML = '<b><i class="bi bi-alarm"></i> dringender Bedarf</b>';

            list.appendChild(urgentItem);
        }

        if (this.data.workTypes && this.data.workTypes.length > 0) {
            this.data.workTypes.forEach(type => {
                const workType = WORK_TYPES.find(wt => wt.type === type);
                if (workType) {
                    const workTypeItem = document.createElement('li');
                    workTypeItem.innerHTML = `<b>${workType.icon} ${workType.label}</b>`;
                    list.appendChild(workTypeItem);
                }
            });
        }

        if (this.data.engagementTypes && this.data.engagementTypes.length > 0) {
            const engagementLabels = this.data.engagementTypes
                .map(type => {
                    const match = ENGAGEMENT_TYPES.find(et => et.type === type);
                    return match ? match.label : type;
                })
                .join(', ');

            const engagementTypesItem = document.createElement('li');
            engagementTypesItem.innerHTML = `<i class="bi bi-person-check"></i> ${engagementLabels}`;

            list.appendChild(engagementTypesItem);
        }

        this.wrapper.appendChild(list);

        const { prefix = '', number = 0, suffix = '' } = this.data?.demand || {};
        const hasText = prefix.trim().length > 0 || suffix.trim().length > 0;

        if (Number(number) > 0 && hasText) {
            const demandWrapper = document.createElement('div');
            demandWrapper.className = 'fw-bold';
            demandWrapper.innerText = `${prefix} ${number} ${suffix}`.trim();
            this.wrapper.appendChild(demandWrapper);
        }
    }

    save(blockContent) {
        const titleEl = blockContent.querySelector('[data-ref="title"]');
        const demandPrefixEl = blockContent.querySelector('[data-ref="demand-prefix"]');
        const demandNumberEl = blockContent.querySelector('[data-ref="demand-number"]');
        const demandSuffixEl = blockContent.querySelector('[data-ref="demand-suffix"]');

        return {
            title: titleEl?.innerText.trim() || '',
            isUrgent: this.data.isUrgent,
            workTypes: this.data.workTypes,
            engagementTypes: this.data.engagementTypes,
            demand: {
                prefix: demandPrefixEl?.innerText.trim() || '',
                number: Number(demandNumberEl?.value) || 0,
                suffix: demandSuffixEl?.innerText.trim() || ''
            }
        };
    }

    validate(savedData) {
        const demand = savedData?.demand;

        if (!demand) return false;

        const number = Number(demand.number) || 0;
        const prefix = (demand.prefix || '').trim();
        const suffix = (demand.suffix || '').trim();

        const hasText = prefix.length > 0 || suffix.length > 0;

        if (number === 0 || hasText) {
            return true;
        }

        return {
            valid: false,
            message: "Bedarf ist gesetzt, aber es fehlt die Beschreibung dazu (Prefix oder Suffix)"
        };
    }
}