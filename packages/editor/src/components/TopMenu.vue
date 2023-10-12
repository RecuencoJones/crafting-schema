<template>
  <header class="top-menu">
    <nav class="top-menu__item">
      <b>CraftingSchema</b>
    </nav>
    <template v-for="menuItem of menu">
      <TopMenuItem :menu="menuItem" @command="handleCommand" />
    </template>
  </header>
</template>

<script>
import { useGlobalState } from '../state';
import { isMacOS } from '../utils';
import TopMenuItem from './TopMenuItem.vue';


export default {
  components: {
    TopMenuItem
  },
  setup() {
    return useGlobalState();
  },
  emits: [ 'command' ],
  computed: {
    menu() {
      return [
        {
          title: 'File',
          children: [
            {
              title: 'Load example',
              command: 'cmd.loadExample'
            },
            {
              title: 'Open...',
              icon: 'fa-regular fa-folder-open',
              binding: `${ this.ctrlCmd }O`,
              command: 'cmd.open'
            },
            {
              title: 'Open last',
              binding: `${ this.ctrlCmd }⇧O`,
              disabled: !this.globalState.lastFileHandle
            },
            {
              title: 'Save',
              icon: 'fa-regular fa-floppy-disk',
              binding: `${ this.ctrlCmd }S`,
              command: 'cmd.save'
            },
            {
              title: 'Close',
              icon: 'fa-solid fa-xmark',
              command: 'cmd.close'
            }
          ]
        },
        {
          title: 'View',
          children: [
            {
              title: 'Show bookmarks only',
              icon: this.globalState.showBookmarksOnly ? 'fa fa-check' : null,
              binding: `${ this.ctrlCmd }B`,
              command: 'cmd.showBookmarks'
            },
            {
              title: 'Export materials BOM',
              icon: 'fa-solid fa-file-csv',
              command: 'cmd.exportCSV'
            },
            {
              title: 'Export materials table',
              icon: 'fa-solid fa-table',
              command: 'cmd.exportTable'
            }
          ]
        },
        {
          title: 'Theme',
          children: [
            {
              title: 'Default',
              icon: this.globalState.themeName === 'default' ? 'fa fa-check' : null,
              command: 'cmd.theme',
              args: [ 'default' ]
            },
            {
              title: 'Dark',
              icon: this.globalState.themeName === 'dark' ? 'fa fa-check' : null,
              command: 'cmd.theme',
              args: [ 'dark' ]
            }
          ]
        },
        {
          title: 'About',
          children: [
            {
              title: 'View on GitHub',
              icon: 'fa-brands fa-github',
              command: 'cmd.openGitHub'
            }
          ]
        }
      ]
    },
    ctrlCmd() {
      return isMacOS() ? '⌘' : 'Ctrl ';
    }
  },
  methods: {
    handleCommand({ command, args = [] }) {
      this.$emit('command', { command, args });
    }
  }
}
</script>

<style>
.top-menu {
  display: flex;
  flex-direction: row;
  padding: 0 1rem;
  color: var(--top-bar-text);
  background: var(--top-bar-background);
}

.top-menu__item {
  position: relative;
  padding: 1rem;
  width: fit-content;
}

.top-menu__item:hover {
  background: var(--top-bar-menu-hover-background);
  cursor: pointer;
}

.top-menu__item menu {
  z-index: 1;
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0;
  margin: 0;
  background: var(--top-bar-background);
}

.top-menu__item menu li {
  background: var(--top-bar-background);
}

.top-menu__item menu li:hover {
  background: var(--top-bar-menu-hover-background);
  cursor: pointer;
}

.sub-menu__item {
  display: grid;
  grid-template-areas: "icon text binding";
  grid-template-columns: 1.5rem 1fr 4rem;
  width: 100%;
  padding-right: .5rem;
}

.sub-menu__item.sub-menu__item--disabled {
  color: #ddd;
}

.sub-menu__item__text {
  grid-area: text;
  width: max-content;
  text-align: left;
  padding: .5rem;
}

.sub-menu__item__binding {
  grid-area: binding;
  font-size: 11px;
  align-self: center;
  padding-right: .5rem;
  text-align: right;
}

.sub-menu__item__icon {
  grid-area: icon;
  width: 1rem;
  font-size: 11px;
  align-self: center;
  text-align: center;
  padding: .25rem .5rem;
}


</style>
