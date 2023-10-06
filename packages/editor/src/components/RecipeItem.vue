<template>
  <div class="recipe-item">
    <div class="recipe-item__main">
      <div v-if="item.recipe" class="recipe-item__main__expand">
        <button @click="expanded = !expanded">
          <i class="fa" :class="expanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </button>
      </div>
      <div class="recipe-item__main__ingredient">
        <div class="recipe-item__main__ingredient__name">
          <span v-if="item.quality"
            class="recipe-item__main__ingredient__quality"
            :class="`recipe-item__main__ingredient__quality--${item.quality}`"></span>
          {{ item.name }}
        </div>
        <div class="recipe-item__main__ingredient__type" v-if="item.type">
          <span v-if="item.grade">Grade {{ item.grade }}</span>
          {{ item.type }}
        </div>
        <div class="recipe-item__main__ingredient__from" v-if="item.from?.length">
          Obtained from: {{ item.from.join(', ') }}
        </div>
        <div class="recipe-item__main__ingredient__level" v-if="item.level">
          Requires level {{ item.level }}
        </div>
      </div>
      <div class="recipe-item__main__count" v-if="Number.isInteger(count)">{{ count }}x</div>
      <div v-if="capabilities?.select" class="recipe-item__main__select">
        <button @click="handleSelect">
          <i class="fa-regular" :class="selected ? 'fa-square-check' : 'fa-square'"></i>
        </button>
      </div>
      <div class="recipe-item__main__bookmark" v-if="capabilities?.bookmark">
        <button @click="$emit('bookmark')">
          <i class="fa-bookmark" :class="bookmarked ? 'fa-solid' : 'fa-regular'"></i>
        </button>
      </div>
    </div>
    <template v-if="expanded">
      <div class="recipe-item__recipe" v-if="item.recipe">
        <RecipeItem
          v-for="ingredient in item.recipe"
          :key="ingredient.item.name"
          :count="ingredient.count"
          :item="ingredient.item" />
      </div>
    </template>
  </div>
</template>

<script>
import { useGlobalState } from '../state';

export default {
  setup() {
    return useGlobalState();
  },
  name: 'RecipeItem',
  props: [ 'id', 'count', 'item', 'capabilities' ],
  emits: [ 'select', 'bookmark' ],
  data() {
    return {
      expanded: false,
      selected: false
    };
  },
  computed: {
    bookmarked() {
      return this.globalState.bookmarks.has(this.id)
    }
  },
  methods: {
    handleSelect() {
      this.selected = !this.selected;

      this.$emit('select');
    }
  }
};
</script>

<style>
.recipe-item {
  padding-top: .5rem;
  padding-bottom: .5rem;
  padding-left: .5rem;
}

.recipe-item__main {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: .75rem;
  box-sizing: border-box;
}

.recipe-item__main:hover {
  background: #eee;
}

.recipe-item__main__expand,
.recipe-item__main__select,
.recipe-item__main__bookmark {
  flex: 0 0 fit-content;
  padding: .25rem;
}

.recipe-item__main__expand button,
.recipe-item__main__select button,
.recipe-item__main__bookmark button {
  border: none;
  background: none !important;
  color: var(--global-text);
  width: 1.5rem;
}

button {
  cursor: pointer;
}

.recipe-item__main__count {
  flex: 0 0 3rem;
}

.recipe-item__main__ingredient {
  flex: 1;
  padding-top: .25rem;
  padding-left: .25rem;
}

.recipe-item__main__ingredient__name {
  display: flex;
  align-self: center;
  margin-bottom: .25rem;
}

.recipe-item__main__ingredient__quality {
  margin-right: .25rem;
  display: inline-block;
  border: 1px solid black;
  width: 1rem;
  height: 1rem;
  background: #ccc;
}

.recipe-item__main__ingredient__quality--white {
  background: white;
}

.recipe-item__main__ingredient__quality--green {
  background: rgb(18, 255, 18);
}

.recipe-item__main__ingredient__quality--blue {
  background: rgb(97, 129, 255);
}

.recipe-item__main__ingredient__quality--purple {
  background: rgb(197, 22, 197);
}

.recipe-item__main__ingredient__type {
  font-size: 11px;
  font-style: italic;
}

.recipe-item__main__ingredient__from {
  font-size: 11px;
}

.recipe-item__main__ingredient__level {
  font-size: 11px;
  text-align: right;
  margin-top: .25rem;
  padding-right: .5rem;
}

.recipe-item__recipe {
  padding-left: 1rem;
}

</style>
