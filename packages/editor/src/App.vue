<template>
  <div class="app-main" :class="themeClass">
    <Splash v-if="appLoading" />
    <TopMenu @command="handleCommand" />
    <div class="workspace">
      <div class="workspace__editor">
        <div class="workspace__editor__header">
          <h3>Crafting Schema<span v-if="hasChanges">*</span></h3>
        </div>
        <Editor :text="schema" @change="handleChange" @value="handleValue" @error="handleError" />
      </div>
      <div class="workspace__preview">
        <div class="workspace__preview__error" v-if="error">
          <pre>{{ error }}</pre>
        </div>
        <div class="workspace__preview__search">
          <h3>Products</h3>
          <input type="search" placeholder="search by name" v-model="search" />
        </div>
        <div class="workspace__preview__products">
          <div class="overflow">
            <template v-for="category of Object.keys(allProducts)" :key="category">
              <div v-if="Object.values(filteredProducts[category] || {}).length">
                <h4 style="text-transform: capitalize">{{ category }}</h4>
                <RecipeItem
                  v-for="(product, key) of filteredProducts[category]"
                  :key="key"
                  :id="key"
                  :item="product"
                  :capabilities="{ bookmark: true }"
                  @bookmark="handleBookmark(key)" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <BottomAlert v-if="globalState.lastFileHandle">
      <span>File {{ globalState.lastFileHandle.name }} was edited last session, reopen it?</span>
      <button @click="handleOpenLastFile">Yes</button> <button @click="handleIgnoreLastFile">No</button>
    </BottomAlert>
  </div>
</template>

<script>
import * as _ from 'lodash';
import { toRaw } from 'vue';
import { get, set, del } from 'idb-keyval';
import hotkeys from 'hotkeys-js';
import RecipeItem from './components/RecipeItem.vue';
import Editor from './components/Editor.vue';
import TopMenu from './components/TopMenu.vue';
import BottomAlert from './components/BottomAlert.vue';
import Splash from './components/Splash.vue';
import { useGlobalState } from './state';

async function verifyPermission(fileHandle) {
  const options = {
    mode: 'readwrite'
  };

  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return;
  }
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return;
  }

  throw new Error('Cannot open file');
}

const defaultSchema = '# open a file or start editing\nproducts: {}';

export default {
  setup() {
    return useGlobalState()
  },
  components: {
    Editor,
    RecipeItem,
    TopMenu,
    BottomAlert,
    Splash
  },

  data() {
    return {
      appLoading: true,
      fileHandle: null,
      error: null,
      search: '',
      schema: defaultSchema,
      updatedSchema: null,
      allProducts: {}
    }
  },

  computed: {
    filteredProducts() {
      return (this.search || this.globalState.showBookmarksOnly)
        ? Object.entries(this.allProducts).reduce((accum, [ category, products ]) => {
          accum[category] = Object.entries(products || {}).reduce((accum, [ id, product ]) => {
            if (this.globalState.showBookmarksOnly && !this.globalState.bookmarks.has(id)) {
              return accum;
            }

            if (this.search && !product.name?.toLowerCase().includes(this.search.toLowerCase())) {
              return accum;
            }

            accum[id] = product;
            return accum;
          }, {});

          return accum;
        }, {})
        : this.allProducts;
    },
    themeClass() {
      return `theme--${ this.globalState.themeName }`;
    },
    hasChanges() {
      return this.updatedSchema && this.updatedSchema !== this.schema;
    }
  },

  async mounted() {
    try {
      await this.loadStoredData();
      this.setKeybinds();
    } catch(err) {} finally {
      this.appLoading = false;
    }
  },

  async beforeUnmount() {
    this.unsetKeybinds();
  },

  methods: {
    async loadStoredData() {
      this.globalState.lastFileHandle = await get('file');

      const themeName = await get('themeName');

      if (themeName) {
        this.globalState.themeName = themeName;
      }

      const bookmarks = await get('bookmarks');

      if (bookmarks) {
        this.globalState.bookmarks = bookmarks;
        this.globalState.showBookmarksOnly = !!this.globalState.bookmarks.size;
      }
    },

    setKeybinds() {
      hotkeys.filter = () => true;

      hotkeys('ctrl+s, cmd+s', () => {
        this.handleSave();
        return false;
      });

      hotkeys('ctrl+o, cmd+o', () => this.handleOpen());
      hotkeys('ctrl+shift+o, cmd+shift+o', () => this.handleOpenLastFile());
      hotkeys('ctrl+b, cmd+b', () => this.handleShowBookmarks());
    },

    unsetKeybinds() {
      hotkeys.unbind();
    },

    handleChange(value) {
      this.updatedSchema = value;
    },
    handleValue(value) {
      this.error = null;
      this.allProducts = value?.products || {};
    },
    handleError(error) {
      this.error = error;
    },
    async handleOpenLastFile() {
      if (!this.globalState.lastFileHandle) {
        return;
      }

      this.fileHandle = this.globalState.lastFileHandle;

      await this.loadFile();

      this.globalState.lastFileHandle = null;
    },
    async handleIgnoreLastFile() {
      this.globalState.lastFileHandle = null;
    },
    async handleOpen() {
      const [fileHandle] = await window.showOpenFilePicker?.({
        types: [
          {
            desription: 'Schema files',
            accept: {
              'application/*': [ '.yaml', '.yml' ]
            }
          }
        ],
        multiple: false
      });

      this.globalState.lastFileHandle = null;
      this.fileHandle = fileHandle;

      await this.loadFile();
    },

    async loadFile() {
      await verifyPermission(this.fileHandle).catch((e) => console.error(e));

      const file = await this.fileHandle.getFile();

      this.schema = await file.text();

      await set('file', this.fileHandle);
    },

    async handleSave() {
      if (!this.fileHandle) {
        return this.handleSaveNew();
      }

      if (!this.updatedSchema) {
        return;
      }

      const writable = await this.fileHandle.createWritable();

      await writable.write(this.updatedSchema);
      await writable.close();

      this.updatedSchema = null;
    },
    async handleSaveNew() {
      this.fileHandle = await window.showSaveFilePicker({
        suggestedName: 'crafting-schema.yaml',
        types: [
          {
            desription: 'Schema files',
            accept: {
              'application/*': [ '.yaml', '.yml' ]
            }
          }
        ]
      });

      await set('file', this.fileHandle);
      this.globalState.lastFileHandle = null;
      this.updatedSchema ||= this.schema;

      await this.handleSave();
    },
    async handleClose() {
      this.schema = defaultSchema;

      this.fileHandle = null;

      await del('file');
    },
    async handleThemeChange(themeName) {
      this.globalState.themeName = themeName;

      await set('themeName', themeName);
    },
    handleShowBookmarks() {
      this.globalState.showBookmarksOnly = !this.globalState.showBookmarksOnly;
    },
    handleBookmark(productKey) {
      if (this.globalState.bookmarks.has(productKey)) {
        this.globalState.bookmarks.delete(productKey);
      } else {
        this.globalState.bookmarks.add(productKey);
      }

      set('bookmarks', toRaw(this.globalState.bookmarks));
    },
    handleCommand({ command, args }) {
      switch (command) {
        case 'cmd.open':
          return this.handleOpen();
        case 'cmd.openLast':
          return this.handleOpenLastFile();
        case 'cmd.save':
          return this.handleSave();
        case 'cmd.close':
          return this.handleClose();
        case 'cmd.showBookmarks':
          return this.handleShowBookmarks();
        case 'cmd.theme':
          return this.handleThemeChange(...args);
      }
    }
  }
};
</script>

<style>
html {
  font-family: Arial, Helvetica, sans-serif;
}

html, body, main, .app-main {
  margin: 0;
  height: 100%;
  width: 100%;
}

.app-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.top-menu {
  flex: 0;
}

.workspace {
  flex: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.workspace__editor, .workspace__preview {
  flex: 1;
  width: 100%;
}

.workspace__editor {
  display: flex;
  flex-direction: column;
}

.workspace__editor__header {
  flex: 0;
  height: fit-content;
  width: 100%;
  padding: 1rem .5rem;
  box-sizing: border-box;
}

h3 {
  text-align: center;
}

.workspace__editor .editor {
  flex: 1;
  height: 100%;
}

.workspace__preview {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.workspace__preview__error {
  flex: 0;
  height: fit-content;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
}

.workspace__preview__error pre {
  border: 5px solid #992525;
  background: #edbbbb;
  padding: 1rem;
  outline-offset: .5rem;
  border-radius: 15px;
}

.workspace__preview__search {
  flex: 0;
  height: fit-content;
  width: 100%;
  padding: 1rem .5rem;
  box-sizing: border-box;
}

.workspace__preview__search input[type="search"] {
  width: 100%;
  padding: .25rem .5rem;
  font-size: inherit;
}

.workspace__preview__products {
  flex: 1;
  padding: 1rem .5rem;
  height: 100%;
  overflow: auto;
}

</style>
