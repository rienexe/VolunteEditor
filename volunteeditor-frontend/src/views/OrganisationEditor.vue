<script setup>
import { ref, defineModel, onMounted, onBeforeUnmount } from 'vue';
import { postOrganisation, getOrganisationProfile, postOrganisationProfile } from '@/api';
import { toastStore, userStore } from '@/services';
import { getEditorTools, organisationEditorTools, editorJsI18nDE, validateEditorBlocks } from '@/utils';

import EditorJS from '@editorjs/editorjs';



const editorMain = ref(null);
const editorSidebar = ref(null);
const showSidebar = defineModel();

const orgId = userStore.id;

const editors = [
  { name: 'main', instance: editorMain },
  { name: 'sidebar', instance: editorSidebar }
];



async function loadData() {
  const data = await getOrganisationProfile(orgId);
  const sidebarData = data?.blockContent?.sidebar;

  showSidebar.value = Array.isArray(sidebarData?.blocks) && sidebarData.blocks.length > 0;

  return data;
}

async function loadEditors(data) {
  if (!data) return;

  await Promise.all(editors.map(e => e.instance.value?.isReady));

  await editorMain.value.render(data.blockContent.main);
  await editorSidebar.value.render(data.blockContent.sidebar);

  toastStore.addToast('Profil erfolgreich geladen', 'success');
}

async function saveEditors() {
  try {
    const editors = [
      { name: 'main', instance: editorMain.value }
    ];

    if (showSidebar.value && editorSidebar.value) {
      editors.push({ name: 'sidebar', instance: editorSidebar.value });
    }

    const validationResults = await Promise.all(
        editors.map(({ name, instance }) =>
            validateEditorBlocks({
              editorInstance: instance,
              editorName: name,
            })
        )
    );

    if (validationResults.includes(false)) return;

    const main = await editorMain.value.save();
    const sidebar = showSidebar.value && editorSidebar.value
        ? await editorSidebar.value.save()
        : { blocks: [] };

    const result = await postOrganisationProfile(orgId, {
      blockContent: {
        main: main,
        sidebar: sidebar
      }
    });

    if (result?.success) {
      const extractedData = extractOrganisationData(main.blocks, sidebar.blocks);

      if (extractedData) await postOrganisation(orgId, extractedData);

      toastStore.addToast('Profil erfolgreich gespeichert', 'success');
    } else {
      toastStore.addToast(`Fehler: ${result?.error || 'Unbekannter Fehler'}`, 'danger');
    }
  } catch (error) {
    toastStore.addToast(`Fehler beim Speichern des Profils: ${error}`, 'danger');
  }
}

function extractOrganisationData(mainBlocks = [], sidebarBlocks = []) {
  const allBlocks = [...sidebarBlocks, ...mainBlocks];

  const logoBlock = findFirstBlock(allBlocks,block => block.type === 'logo' && block.data?.file?.url);
  const logo = logoBlock?.data?.file?.url || '';

  let description = '';

  const aboutUsBlock = findFirstBlock(allBlocks,block => block.type === 'aboutUs' && block.data?.text);

  if (aboutUsBlock) {
    description = aboutUsBlock.data.text.trim();
  } else {
    const paragraphBlock =
        findFirstBlock(mainBlocks,block => block.type === 'paragraph' && block.data?.text) ||
        findFirstBlock(sidebarBlocks,block => block.type === 'paragraph' && block.data?.text);

    description = paragraphBlock?.data?.text?.trim() || '';
  }

  return { logo, description };
}

function findFirstBlock(blocks, predicate) {
  return blocks.find(predicate);
}



onMounted(async () => {
  const data = await loadData();

  editorMain.value = new EditorJS({
    holder: 'editorjsMain',
    tools: getEditorTools(organisationEditorTools),
    i18n: editorJsI18nDE
  });

  editorSidebar.value = new EditorJS({
    holder: 'editorjsSidebar',
    tools: getEditorTools(organisationEditorTools),
    i18n: editorJsI18nDE
  });

  await loadEditors(data);
});

onBeforeUnmount(() => {
  editorMain.value?.destroy();
  editorSidebar.value?.destroy();
});
</script>

<template>
  <section class="container my-5">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <div class="form-check form-switch">
        <input v-model="showSidebar" class="form-check-input" type="checkbox" role="switch">
        <label class="form-check-label">Seitenleiste</label>
      </div>
      <button class="btn btn-primary" @click="saveEditors">Speichern</button>
    </div>

    <div class="border border-3 border-dark rounded">
      <div class="row">
        <div :class="showSidebar ? 'col-lg-8 col-12 order-lg-1 order-2' : 'col-12'">
          <div id="editorjsMain" class="shadow-sm p-1 mb-3"></div>
        </div>
        <div v-show="showSidebar" class="col-lg-4 col-12 order-lg-2 order-1">
          <div id="editorjsSidebar" class="sticky-top sticky-offset shadow-sm p-1 mb-3"></div>
        </div>
      </div>
    </div>
  </section>
</template>