<template>
  <header class="top-menu">
    <nav class="top-menu__item">
      <b>CraftingSchema</b>
    </nav>
    <nav class="top-menu__item" @click="clicked = 'file'" @mouseenter="hovered = 'file'" @mouseleave="hovered = null">
      <span>File</span>
      <menu class="sub-menu" v-show="showMenu === 'file'">
        <li class="sub-menu__item" @click="handleClick('cmd.open')">
          <span class="sub-menu__item__text">Open...</span>
          <span class="sub-menu__item__binding">{{ ctrlCmd }}O</span>
        </li>
        <li class="sub-menu__item" :class="{ 'sub-menu__item--disabled': !globalState.lastFileHandle }" @click="globalState.lastFileHandle && handleClick('cmd.openLast')">
          <span class="sub-menu__item__text">Open last</span>
          <span class="sub-menu__item__binding">{{ ctrlCmd }}⇧O</span>
        </li>
        <li class="sub-menu__item" @click="handleClick('cmd.save')">
          <span class="sub-menu__item__text">Save</span>
          <span class="sub-menu__item__binding">{{ ctrlCmd }}S</span>
        </li>
        <li class="sub-menu__item" @click="handleClick('cmd.close')">
          <span class="sub-menu__item__text">Close</span>
          <span class="sub-menu__item__binding"></span>
        </li>
      </menu>
    </nav>
    <nav class="top-menu__item" @click="clicked = 'view'" @mouseenter="hovered = 'view'" @mouseleave="hovered = null">
      <span>View</span>
      <menu class="sub-menu" v-show="showMenu === 'view'">
        <li class="sub-menu__item" @click="handleClick('cmd.showBookmarks')">
          <span class="sub-menu__item__check">
            <span v-if="globalState.showBookmarksOnly">✓</span>
          </span>
          <span class="sub-menu__item__text">Show bookmarks only</span>
          <span class="sub-menu__item__binding">{{ ctrlCmd }}B</span>
        </li>
      </menu>
    </nav>
    <nav class="top-menu__item" @click="clicked = 'theme'" @mouseenter="hovered = 'theme'" @mouseleave="hovered = null">
      <span>Theme</span>
      <menu class="sub-menu" v-show="showMenu === 'theme'">
        <li class="sub-menu__item" @click="handleClick('cmd.theme', 'default')">
          <span class="sub-menu__item__check">
            <span v-if="globalState.themeName === 'default'">✓</span>
          </span>
          <span class="sub-menu__item__text">Default</span>
        </li>
        <li class="sub-menu__item" @click="handleClick('cmd.theme', 'dark')">
          <span class="sub-menu__item__check">
            <span v-if="globalState.themeName === 'dark'">✓</span>
          </span>
          <span class="sub-menu__item__text">Dark</span>
        </li>
      </menu>
    </nav>
  </header>
</template>

<script>
import { useGlobalState } from '../state';

export default {
  setup() {
    return useGlobalState();
  },
  emits: [ 'command' ],
  data() {
    return {
      clicked: false,
      hovered: false
    };
  },
  computed: {
    showMenu() {
      return this.selected || this.hovered;
    },
    isMacOS() {
      return navigator.userAgentData.platform === 'macOS';
    },
    ctrlCmd() {
      return this.isMacOS ? '⌘' : 'Ctrl ';
    }
  },
  methods: {
    handleClick(command, ...args) {
      this.$emit('command', { command, args });
    },

    close() {
      this.clicked = false;
      this.hovered = false;
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
  grid-template-areas: "check text binding";
  grid-template-columns: 1rem 1fr auto;
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

.sub-menu__item__check {
  grid-area: check;
  width: 1rem;
  font-size: 11px;
  align-self: center;
  text-align: center;
  padding: .25rem .5rem;
}


</style>
