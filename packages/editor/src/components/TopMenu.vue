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
          <span class="sub-menu__item__binding">{{ ctrlCmd }}+O</span>
        </li>
        <li class="sub-menu__item" @click="handleClick('cmd.save')">
          <span class="sub-menu__item__text">Save</span>
          <span class="sub-menu__item__binding">{{ ctrlCmd }}+S</span>
        </li>
        <li class="sub-menu__item" @click="handleClick('cmd.close')">
          <span class="sub-menu__item__text">Close</span>
          <span class="sub-menu__item__binding"></span>
        </li>
      </menu>
    </nav>
    <nav class="top-menu__item" @click="clicked = 'theme'" @mouseenter="hovered = 'theme'" @mouseleave="hovered = null">
      <span>Theme</span>
      <menu class="sub-menu" v-show="showMenu === 'theme'">
        <li class="sub-menu__item" @click="handleClick('cmd.theme', 'default')">
          <span class="sub-menu__item__text">Default</span>
        </li>
        <li class="sub-menu__item" @click="handleClick('cmd.theme', 'dark')">
          <span class="sub-menu__item__text">Dark</span>
        </li>
      </menu>
    </nav>
  </header>
</template>

<script>
export default {
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
      return this.isMacOS ? '⌘' : 'Ctrl';
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
  display: flex;
  flex-direction: column;
  padding: .25rem 0;
  margin: 0;
  background: var(--top-bar-background);
  width: max-content;
}

.top-menu__item menu li {
  list-style-type: none;
  padding: .5rem 1rem;
}

.top-menu__item menu li:hover {
  background: var(--top-bar-menu-hover-background);
  cursor: pointer;
}

.sub-menu__item {
  display: flex;
}

.sub-menu__item__text {
  display: block;
  flex: 1;
  width: max-content;
}

.sub-menu__item__binding {
  display: block;
  flex: 0 0 fit-content;
  margin-left: 1rem;
  font-size: 11px;
  align-self: center;
}


</style>
