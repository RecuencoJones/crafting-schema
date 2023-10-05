import { reactive } from 'vue';

const globalState = reactive({
  themeName: 'default',
  showBookmarksOnly: false,
  lastFileHandle: null,
  bookmarks: new Set()
});

export function useGlobalState() {
  return { globalState };
}
