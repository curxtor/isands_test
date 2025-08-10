<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSmartphoneStore } from "@/stores/smartphones";
import true_image from "@/assets/icons/true.svg";
import false_image from "@/assets/icons/false.svg";
import "./assets/styles/style.css";
import { computed, onMounted } from "vue";

const store = useSmartphoneStore();
const { smartphones, displayed, showDifferences, hiddenSmartphones, searchQuery } = storeToRefs(store);
const { shouldShowSpec } = store;

const compareGridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${displayed.value.length + 1}, 1fr)`,
}));

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
};
const openPopUp = (e: Event) => {
  e.stopPropagation();

  document.querySelectorAll(".pop_up").forEach((popup) => {
    popup.classList.remove("active");
  });

  const popup = e.target?.nextSibling as HTMLElement;
  if (popup && popup.classList.contains("pop_up")) {
    popup.classList.add("active");
  }
};
onMounted(() => {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const insidePopup = target.closest(".pop_up");
    const isArrow = target.closest(".arrow");
    const isSearchInput = target.closest(".search_compare");
    if (!insidePopup && !isArrow && !isSearchInput) {
      document.querySelectorAll(".pop_up").forEach((popup) => {
        popup.classList.remove("active");
      });
    }
  });
});
</script>

<template>
  <header>
    <div class="logotype_block">
      <span>Каталог</span>
    </div>
    <div class="header_right_side">
      <span class="compare">СРАВНЕНИЕ</span>
      <div class="profile">
        <span>Личный кабинет</span>
        <img src="@/assets/icons/profile.svg" alt="profile" />
      </div>
    </div>
  </header>

  <main>
    <div class="phones_block">
      <div class="phones_block_header">
        <span class="phones_block_header_title">Смартфоны</span>
        <div class="cards_selector">
          <span>Отобразить товары:</span>
          <ul>
            <li v-for="i in smartphones.length - 1" :key="i" :class="{ active: i + 1 === displayed.length }" @click="store.setDisplayedCount(i + 1)">
              {{ i + 1 }}
            </li>
          </ul>
        </div>
      </div>

      <div class="compare_block">
        <div class="show_differences" @click="store.toggleDifferences">
          <input v-model="showDifferences" type="checkbox" />
          <span>Показать различия</span>
        </div>

        <div class="smartphones_compare">
          <div v-for="phone in displayed" :key="phone.id" class="smart_card">
            <img :src="phone.image_url" class="smart_card_img" :alt="phone.name" />
            <span>{{ phone.name }}</span>
            <img v-if="hiddenSmartphones.length > 0" class="arrow" src="@/assets/icons/arrow.svg" alt="replace" @click="openPopUp" />
            <Transition name="fade">
              <div class="pop_up" v-if="hiddenSmartphones.length > 0">
                <input v-if="smartphones.filter((item) => item.checked === false).length > 3" v-model="searchQuery" class="search_compare" placeholder="Поиск" @click.stop />
                <div class="compare_available_list">
                  <div v-for="hidden in hiddenSmartphones" :key="hidden.id" class="compare_available">
                    <img src="@/assets/icons/compare.svg" @click="store.replaceSmartphone(phone.id, hidden.id)" />
                    <img :src="hidden.image_url" :alt="hidden.name" />
                    <span>{{ hidden.name }}</span>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <div class="compare_table">
      <div v-if="shouldShowSpec('manufacturer')" class="compare_line" :style="compareGridStyle">
        <span class="category">Производитель</span>
        <span v-for="s in displayed">{{ s.specs.manufacturer }}</span>
      </div>
      <div v-if="shouldShowSpec('release_year')" class="compare_line" :style="compareGridStyle">
        <span class="category">Год релиза</span>
        <span v-for="s in displayed">{{ s.specs.release_year }}</span>
      </div>
      <div v-if="shouldShowSpec('diagonal')" class="compare_line" :style="compareGridStyle">
        <span class="category">Диагональ экрана (дюйм)</span>
        <span v-for="s in displayed">{{ s.specs.diagonal }}</span>
      </div>
      <div v-if="shouldShowSpec('country')" class="compare_line" :style="compareGridStyle">
        <span class="category">Страна-производитель</span>
        <span v-for="s in displayed">{{ s.specs.country }}</span>
      </div>
      <div v-if="shouldShowSpec('memory_capacity')" class="compare_line" :style="compareGridStyle">
        <span class="category">Объем памяти</span>
        <span v-for="s in displayed">{{ s.specs.memory_capacity }}</span>
      </div>
      <div v-if="shouldShowSpec('refresh_rate')" class="compare_line" :style="compareGridStyle">
        <span class="category">Частота обновления экрана</span>
        <span v-for="s in displayed">{{ s.specs.refresh_rate }}</span>
      </div>
      <div v-if="shouldShowSpec('nfc')" class="compare_line" :style="compareGridStyle">
        <span class="category">NFC</span>
        <span v-for="s in displayed">
          <img :src="s.specs.nfc ? true_image : false_image" alt="nfc" />
        </span>
      </div>
      <div v-if="shouldShowSpec('esim')" class="compare_line" :style="compareGridStyle">
        <span class="category">Поддержка ESIM</span>
        <span v-for="s in displayed">
          <img :src="s.specs.esim ? true_image : false_image" alt="esim" />
        </span>
      </div>
      <div v-if="shouldShowSpec('wireless_charge')" class="compare_line" :style="compareGridStyle">
        <span class="category">Поддержка беспроводной зарядки</span>
        <span v-for="s in displayed">
          <img :src="s.specs.wireless_charge ? true_image : false_image" alt="wireless" />
        </span>
      </div>
      <div class="compare_line" :style="compareGridStyle">
        <span class="category">Стоимость</span>
        <span v-for="s in displayed">{{ formatPrice(s.price) }}</span>
      </div>
    </div>
  </main>
</template>
