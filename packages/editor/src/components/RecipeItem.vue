<template>
  <div class="recipe-item">
    <div class="recipe-item__main">
      <div class="recipe-item__main__expand">
        <button v-if="item.recipe && !expanded" @click="expanded = true">+</button>
        <button v-else-if="item.recipe && expanded" @click="expanded = false">-</button>
        <span v-else></span>
      </div>
      <div class="recipe-item__main__ingredient">
        <div>{{ item.name }}</div>
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
      <div class="recipe-item__main__bookmark" v-if="capabilities?.bookmark">
        <icon @click="$emit('bookmark')">🔖</icon>
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
export default {
  name: 'RecipeItem',
  props: [ 'count', 'item', 'capabilities' ],
  emits: [ 'bookmark' ],
  data() {
    return {
      expanded: false
    };
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
}

.recipe-item__main__expand {
  flex: 0 0 fit-content;
  padding: .25rem;
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

.recipe-item__main__bookmark icon {
  cursor: pointer;
}
</style>
