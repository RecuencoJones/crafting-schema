import { reactive } from 'vue';

const globalState = reactive({
  themeName: 'default',
  showBookmarksOnly: false,
  lastFileHandle: null
});

export function useGlobalState() {
  return { globalState };
}
