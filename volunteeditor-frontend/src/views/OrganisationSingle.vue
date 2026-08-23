<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getOrganisationProfile } from '@/api';
import { getEditorTools, organisationEditorTools, editorJsI18nDE } from '@/utils';

import EditorJS from '@editorjs/editorjs';



const route = useRoute();
const slug = route.params.slug;

const orgProfileData = ref(null);
const editorMain = ref(null);
const editorSidebar = ref(null);
const showSidebar = ref(false);



async function render() {
  const sidebarData = orgProfileData.value?.blockContent?.sidebar;

  showSidebar.value = Array.isArray(sidebarData?.blocks) && sidebarData.blocks.length > 0;

  editorMain.value = new EditorJS({
    holder: 'editorjsMain',
    tools: getEditorTools(organisationEditorTools),
    data: structuredClone(JSON.parse(JSON.stringify(orgProfileData.value.blockContent.main))),
    i18n: editorJsI18nDE,
    readOnly: true,
    minHeight: 0
  });

  if (showSidebar.value) {
    editorSidebar.value = new EditorJS({
      holder: 'editorjsSidebar',
      tools: getEditorTools(organisationEditorTools),
      data: structuredClone(JSON.parse(JSON.stringify(orgProfileData.value.blockContent.sidebar))),
      i18n: editorJsI18nDE,
      readOnly: true,
      minHeight: 0
    });
  }
}

onMounted(async () => {
  orgProfileData.value = await getOrganisationProfile(slug);

  await render();
});
</script>

<template>
  <section class="container my-5">
    <div class="row">
      <div :class="showSidebar ? 'col-lg-8 col-12 order-lg-1 order-2' : 'col-12'">
        <div id="editorjsMain" class="p-1 mb-3"></div>
      </div>
      <div v-if="showSidebar" class="col-lg-4 col-12 order-lg-2 order-1">
        <div id="editorjsSidebar" class="sticky-top sticky-offset p-1 mb-3"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
:deep(.ce-block__content),
:deep(.ce-toolbar__content) {
  max-width: unset;
}
</style>