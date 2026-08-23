export function createEditableTitle(title, readOnly, level = 3) {
    const titleLevel = Math.min(Math.max(level, 1), 6);
    const titleEl = document.createElement(`h${titleLevel}`);
    titleEl.setAttribute('data-ref', 'title');
    titleEl.innerText = title;

    if (!readOnly) {
        titleEl.contentEditable = 'true';
        titleEl.className = 'focus-ring';
        titleEl.dataset.placeholder = 'Titel eingeben...';
    }

    return titleEl;
}