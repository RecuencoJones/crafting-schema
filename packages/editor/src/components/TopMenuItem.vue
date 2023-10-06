<template>
  <nav class="top-menu__item" @mouseenter="show = true" @mouseleave="show = false">
      <span>{{ menu.title }}</span>
      <menu class="sub-menu" v-show="show">
        <template v-for="child of menu.children">
          <li
            class="sub-menu__item"
            :class="{ 'sub-menu__item--disabled': child.disabled }"
            @click="!disabled && handleClick(child)">
            <span class="sub-menu__item__icon" v-if="child.icon">
              <i :class="child.icon"></i>
            </span>
            <span class="sub-menu__item__text">{{ child.title }}</span>
            <span class="sub-menu__item__binding" v-if="child.binding">{{ child.binding }}</span>
          </li>
        </template>
      </menu>
    </nav>
</template>

<script>
export default {
  props: [ 'menu' ],
  emits: [ 'command' ],
  data() {
    return {
      show: false
    };
  },
  methods: {
    handleClick(child) {
      this.$emit('command', {
        command: child.command,
        args: child.args
      })
    }
  }
}
</script>
