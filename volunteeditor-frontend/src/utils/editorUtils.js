// Block Tools
// Text and Typography
import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
// Lists
import EditorjsList from '@editorjs/list';
// Media and Embed
import ImageTool from '@editorjs/image';
import LinkTool from '@editorjs/link';
import AttachesTool from '@editorjs/attaches';

// Table
import Table from '@editorjs/table';

// Inline Tools
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';

// Custom Block Tools
import ContactTool from '@/components/editors/editor-js/tools/ContactTool.js';
import DividerTool from '@/components/editors/editor-js/tools/DividerTool.js';
import HighlightedParagraphTool from '@/components/editors/editor-js/tools/HighlightedParagraphTool.js';
import TagsTool from '@/components/editors/editor-js/tools/TagsTool.js';
// organisation-profile
import TextHighlightTool from "@/components/editors/editor-js/tools/TextHighlightTool.js";
import LogoTool from "@/components/editors/editor-js/tools/LogoTool.js";
import OrganisationDetailsTool from "@/components/editors/editor-js/tools/organisation-profile/OrganisationDetailsTool.js";
import TimeSlotsTool from "@/components/editors/editor-js/tools/organisation-profile/TimeSlotsTool.js";
// task
import TaskSitesBlock from '@/components/editors/editor-js/tools/task/TaskSitesBlock.js';
import TemporalDemandTool from '@/components/editors/editor-js/tools/task/TemporalDemandTool.js';
import WorkTypeAndDemandTool from '@/components/editors/editor-js/tools/task/WorkTypeAndDemandTool.js';

import { toastStore } from "@/services/toastStore.js";
import TemplateTool from "@/components/editors/editor-js/tools/TemplateTool.js";



export function getEditorTools(overrides = {}) {
    return {
        ...overrides,
        contact: ContactTool,

        paragraph: {
            class: Paragraph,
            config: {
                placeholder: "Text eingeben ..."
            }
        },
        highlightedParagraph: {
            class: HighlightedParagraphTool,
            config: {
                title: { enabled: false },
                text: { placeholder: "" }
            }
        },
        header: {
            class: Header,
            config: {
                placeholder: "Titel ...",
                levels: [2, 3, 4],
                defaultLevel: 3,
            },
            inlineToolbar: ['link']
        },

        list: {
            class: EditorjsList,
            inlineToolbar: true,
            config: {
                placeholder: "Text ...",
                defaultStyle: 'unordered'
            },
            icon: '<i class="bi bi-list-task"></i>'
        },

        image: {
            class: ImageTool,
            toolbox: {
                icon: '<i class="bi bi-images"></i>'
            },
            config: {
                buttonContent: "Bild auswählen",
                endpoints: {
                    byFile: 'http://localhost:3000/upload/',
                },
                features: {
                    caption: false,
                    stretch: false
                }
            },
        },
        linkTool: {
            class: LinkTool,
            config: {
                endpoint: 'http://localhost:3000/fetchUrl',
            },
        },
        attaches: {
            class: AttachesTool,
            config: {
                endpoint: 'http://localhost:3000/uploadFile'
            }
        },

        table: {
            class: Table,
            inlineToolbar: true,
        },

        divider: DividerTool,

        underline: Underline,
        marker: Marker,
    };
}

export const organisationEditorTools = {
    logo: {
        class: LogoTool,
        config: {
            buttonContent: "Bild auswählen",
            endpoints: {
                byFile: 'http://localhost:3000/upload/logo',
            },
            features: {
                caption: false,
                stretch: false
            }
        },
    },
    orgDetails: OrganisationDetailsTool,
    aboutUs: {
        class: TextHighlightTool,
        inlineToolbar: true,
    },
    timeSlots: TimeSlotsTool,
    tags: TagsTool
};

export const taskEditorTools = {
    taskTeaser: {
        class: TextHighlightTool,
        toolbox: {
            title: 'Aufgaben-Teaser',
            icon: '<i class="bi bi-card-text"></i>'
        },
        config: {
            title: true,
            text: {
                placeholder: '2–3 Sätze, die das Angebot auf den Punkt bringen',
            }
        },
    },
    organisationTeaser : {
        class: TextHighlightTool,
        toolbox: {
            title: 'Organisations Beschr.',
            icon: '<i class="bi bi-card-text"></i>'
        },
        config: {
            title: {
                placeholder: 'Organisationsname',
            },
            text: {
                placeholder: 'Kurze Beschreibung der Organisation',
            },
            color: 'secondary'
        },
    },
    tags: {
        class: TagsTool,
        toolbox: {
            title: 'Themenbereich',
            icon: '<i class="bi bi-bookmark-heart"></i>'
        },
        config: {
            mode: 'select-only',
            tags: [
                "Bildung",
                "Demokratie & Menschenrechte",
                "Digitales Engagement",
                "Diversity & Vielfalt",
                "Engagement im Ausland",
                "Entwicklungszusammenarbeit",
                "Flucht & Integration",
                "Gesundheit & Selbsthilfe",
                "Katastrophen-, Hilfs- & Rettungsdienste",
                "Kinder, Jugendliche & Familien",
                "Klima, Natur & Nachhaltigkeit",
                "Kunst & Kultur",
                "Menschen im Alter",
                "Menschen in besonderen Lebenslagen",
                "Menschen mit Beeinträchtigungen",
                "Nachbarschaftshilfe",
                "Religiöse Gemeinschaften",
                "Sport & Bewegung",
                "Tierschutz"
            ],
            link: 'task/list?tag='
        }
    },
    taskSites: TaskSitesBlock,
    temporalDemand: TemporalDemandTool,
    workTypeAndDemand: WorkTypeAndDemandTool
};

export const taskTemplates = {
    taskDescription: {
        class: TemplateTool,
        inlineToolbar: true,
        toolbox: {
            title: 'Aufgabenbeschreibung'
        },
        config: {
            title: 'Aufgabenbeschreibung',
            placeholder: 'Beschreiben Sie die konkrete Tätigkeit der Freiwilligen möglichst anschaulich: Welche Aufgaben werden übernommen? Wie sieht ein typischer Einsatz aus? In welchem Umfeld (z. B. Einrichtung, öffentlich, digital) findet die Tätigkeit statt? Welche Ziele werden mit der Aufgabe verfolgt?'
        }
    },
    targetGroup: {
        class: TemplateTool,
        inlineToolbar: true,
        toolbox: {
            title: 'Zielgruppe'
        },
        config: {
            title: 'Zielgruppe',
            placeholder: 'Beschreiben Sie die Zielgruppe dieses Angebots: Wer wird unterstützt (z. B. Alter, Lebenssituation, Hintergründe)? Gibt es besondere Bedürfnisse oder Herausforderungen? Welchen Beitrag leisten die Freiwilligen für diese Zielgruppe?'
        }
    },
    benefits: {
        class: TemplateTool,
        inlineToolbar: true,
        toolbox: {
            title: 'Mehrwert & Nutzen'
        },
        config: {
            title: 'Mehrwert & Nutzen',
            placeholder: 'Beschreiben Sie den Mehrwert für Freiwillige: Welche persönlichen, sozialen oder fachlichen Erfahrungen können gesammelt werden? Gibt es Anerkennung (z. B. Zertifikate, Bestätigungen), Austauschmöglichkeiten oder Aufwandsentschädigungen?'
        }
    },
    support: {
        class: TemplateTool,
        inlineToolbar: true,
        toolbox: {
            title: 'Einarbeitung & Begleitung'
        },
        config: {
            title: 'Einarbeitung & Begleitung',
            placeholder: 'Erläutern Sie, wie Freiwillige auf ihre Tätigkeit vorbereitet und begleitet werden: Gibt es eine Einschulung oder ein Training? Stehen Ansprechpersonen zur Verfügung? Werden Austauschformate, Reflexion oder Supervision angeboten?'
        }
    },
    stepByStep: {
        class: TemplateTool,
        inlineToolbar: true,
        toolbox: {
            title: 'Ablauf & Prozess'
        },
        config: {
            title: 'Ablauf & Prozess',
            placeholder: 'Beschreiben Sie den Ablauf von der ersten Kontaktaufnahme bis zum Einsatz: Welche Schritte durchlaufen Interessierte (z. B. Anmeldung, Kennenlernen, Einführung)? Gibt es feste Abläufe oder flexible Einstiegsmöglichkeiten?'
        }
    },
    requirements: {
        class: TemplateTool,
        inlineToolbar: true,
        toolbox: {
            title: 'Anforderungen'
        },
        config: {
            title: 'Anforderungen',
            placeholder: 'Beschreiben Sie die Voraussetzungen für die Teilnahme: Welche Interessen, Fähigkeiten oder zeitlichen Ressourcen sollten Freiwillige mitbringen? Sind bestimmte Kenntnisse, Sprachfähigkeiten oder ein Mindestalter erforderlich?'
        }
    },
    framework: {
        class: TemplateTool,
        inlineToolbar: true,
        toolbox: {
            title: 'Rahmenbedingungen'
        },
        config: {
            title: 'Rahmenbedingungen',
            placeholder: 'Beschreiben Sie die organisatorischen und rechtlichen Rahmenbedingungen: Besteht Versicherungsschutz? Werden Aufwandsersatz oder Fahrtkosten übernommen? Gibt es Vereinbarungen, Verschwiegenheitspflichten oder Datenschutzregelungen?'
        }
    },
    testimonials: {
        class: TemplateTool,
        inlineToolbar: true,
        toolbox: {
            title: 'Erfahrungsberichte'
        },
        config: {
            title: 'Erfahrungsberichte',
            placeholder: 'Fügen Sie einen kurzen Erfahrungsbericht oder ein Zitat hinzu: Welche Eindrücke haben Freiwillige gesammelt? Was motiviert sie? Welche Wirkung erleben sie durch ihr Engagement?'
        }
    }
};

export const editorJsI18nDE = {
    messages: {
        ui: {
            blockTunes: {
                toggler: {
                    "Click to tune": "Klicke, zum Anpassen",
                    "or drag to move": "oder ziehen, um zu verschieben",
                }
            },
            inlineToolbar: {
                converter: {
                    "Convert to": "Konvertieren zu",
                }
            },
            toolbar: {
                toolbox: {
                    Add: "Block hinzufügen"
                }
            },
            popover: {
                Filter: "Suchen",
                "Nothing found": "Nichts gefunden",
                "Convert to": "Konvertieren zu"
            }
        },
        toolNames: {    // Toolbox
            Attachment: "Dateianhang",
            Bold: "Fett",
            Checklist: "Checkliste",
            Color: "Farbe",
            ConvertTo: "Konvertieren zu",
            Delimiter: "Trennzeichen",
            Heading: "Überschrift",
            Image: "Bild",
            InlineCode: "Inline-Code",
            Italic: "Kursiv",
            "Link Autocomplete": "Link vervollständigen",
            Link: "Verlinkung",
            list: "Auflistung",
            marker: "Marker",
            "Ordered List": "nummerierte Liste",
            "Raw HTML": "HTML-Code",
            Table: "Tabelle",
            Text: "Text",
            underline: "Unterstreichen",
            "Unordered List": "Liste",
        },
        tools: {
            attaches: {
                "Select file to upload": "Datei auswählen"
            },
            header: {
                "Heading 1": "Ebene 1",
                "Heading 2": "Ebene 2",
                "Heading 3": "Ebene 3",
                "Heading 4": "Ebene 4"
            },
            table: {
                "With headings": "mit Kopfzeile",
                "Without headings": "keine Kopfzeile",
                Stretch: "Breit",
                Collapse: "Schmal"
            },
            image: {
                "Select an Image": "Beitragsbild auswählen",
                Caption: "Bildbeschreibung",
            }
        },
        blockTunes: {
            delete: {
                Delete: "Entfernen",
                "Click to delete": "Klicke zum Löschen"
            },
            moveUp: { "Move up": "Nach oben" },
            moveDown: { "Move down": "Nach unten" },
            toggler: {
                "Click to tune": "Klicke, zum Anpassen",
                "or drag to move": "oder ziehen, um zu verschieben",
            }
        },
    }
};



export function markBlockInvalid(block, message = 'Ungültiger Block') {
    if (!block?.holder) return;

    const holder = block.holder;
    holder.classList.add('border', 'border-danger');

    if (!holder.querySelector('.block-error')) {
        const errorEl = document.createElement('div');
        errorEl.className = 'block-error text-danger small mt-1';
        errorEl.textContent = message;
        holder.appendChild(errorEl);
    }
}

export function clearBlockValidation(block) {
    if (!block?.holder) return;

    const holder = block.holder;
    holder.classList.remove('border', 'border-danger');

    const errorEl = holder.querySelector('.block-error');
    if (errorEl) {
        errorEl.remove();
    }
}

export async function validateEditorBlocks({
                                               editorInstance,
                                               editorName = 'Editor',
                                               markInvalid = markBlockInvalid,
                                               clearInvalid = clearBlockValidation,
                                           }) {
    const blocksCount = editorInstance.blocks.getBlocksCount();
    let isValid = true;
    let firstInvalidBlock = null;

    for (let i = 0; i < blocksCount; i++) {
        const block = editorInstance.blocks.getBlockByIndex(i);

        let data;
        try {
            data = await block.save(); // {id, type, data}
        } catch (err) {
            markInvalid(block, 'Speichern des Blocks fehlgeschlagen');
            if (!firstInvalidBlock) firstInvalidBlock = block;
            isValid = false;
            continue;
        }

        try {
            const result = await block.validate(data.data);
            const valid = typeof result === 'boolean' ? result : result?.valid;
            const message = result?.message || 'Bitte erforderliche Eingaben ergänzen';

            if (!valid) {
                markInvalid(block, message);
                if (!firstInvalidBlock) firstInvalidBlock = block;
                isValid = false;
            } else {
                clearInvalid(block);
            }
        } catch (e) {
            console.error('Fehler bei Validierung:', e);
            markInvalid(block, 'Fehler bei der Validierung');
            if (!firstInvalidBlock) firstInvalidBlock = block;
            isValid = false;
        }
    }

    if (!isValid) {
        toastStore.addToast(`Ungültige Eingaben im Bereich "${editorName}" – bitte korrigieren.`, 'warning');

        if (firstInvalidBlock?.holder) {
            firstInvalidBlock.holder.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid;
}

export function extractToolboxMeta(toolsObj) {
    const toolNames = editorJsI18nDE?.messages?.toolNames || {};

    return Object.entries(toolsObj).map(([key, tool]) => {
        const toolClass = tool.class || tool;
        const toolbox = {
            ...(toolClass.toolbox || {}),
            ...(tool.toolbox || {})
        };
        const title = toolbox.title || key;

        return {
            id: key,
            type: key,
            class: toolClass,
            icon: toolbox.icon || toolbox[0]?.icon || null,
            name: toolNames[key] || toolNames[title] || title,
            config: tool.config || {},
        };
    });
}

export function transformSchema(schema, toolMap) {
    const mapBlocks = (blocks) => (blocks || []).map(block => {
        const meta = toolMap[block.type];

        if (!meta) {
            return {
                id: block.type,
                type: block.type,
                icon: null,
                name: block.type,
                config: {}
            };
        }

        return {
            id: meta.id,
            type: meta.type,
            icon: meta.icon,
            name: meta.name,
            config: meta.config
        };
    });

    return {
        slug: schema.slug,
        meta: {
            title: schema.meta?.title || "Kein Titel"
        },
        blockContent: {
            main: {
                blocks: mapBlocks(schema.blockContent?.main?.blocks)
            },
            sidebar: {
                blocks: mapBlocks(schema.blockContent?.sidebar?.blocks)
            }
        }
    };
}