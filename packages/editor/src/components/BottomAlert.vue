<template>
  <div class="bottom-alert">
    <slot />
  </div>
</template>

<style>
.bottom-alert {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  padding: .5rem;
  color: var(--top-bar-text);
  background: var(--top-bar-background);
}

.bottom-alert button {
  margin: 0 .5rem;
}
</style>
