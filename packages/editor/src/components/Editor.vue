<template>
  <div class="editor" ref="editor"></div>
</template>

<script>
import * as monaco from 'monaco-editor';

// sad, editor cannot be part of data, othwerise it will freeze :/
let editor;

export default {
  props: [ 'text' ],
  emits: [ 'change', 'value', 'error', 'save' ],
  watch: {
    text: {
      immediate: true,
      handler(text) {
        editor?.setValue(text);

        this.parseContents(text);
      }
    }
  },
  methods: {
    handleChange() {
      const contents = editor.getValue();

      this.$emit('change', contents);

      this.parseContents(contents);
    },

    async parseContents(contents) {
      try {
        const r = await fetch('/api/schema/parse', {
          method: 'post',
          body: contents
        });

        if (r.ok) {
          const value = await r.json();

          this.$emit('value', value);
        } else {
          const message = await r.text();

          throw new Error(message);
        }
      } catch(error) {
        this.$emit('error', error);
      }
    }
  },
  async mounted() {
    editor = monaco.editor.create(this.$refs.editor, {
      value: this.text,
      language: 'yaml',
      automaticLayout: true,
      tabSize: 2
    });

    editor.onDidChangeModelContent(() => {
      this.handleChange();
    });
  },
  beforeUnmount() {
    editor.dispose();
    editor = null;
  }
};
</script>

<style>
.editor {
  height: 100%;
  width: 100%;
}
</style>
