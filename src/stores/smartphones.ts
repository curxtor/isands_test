import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Smartphone } from '@/types/SmartphoneTypes'

export const useSmartphoneStore = defineStore('smartphones', () => {
  const smartphones = ref<Smartphone[]>([
    {
      id:1,
      name: "Apple iPhone 12",
      image_url: "https://nanoreview.net/common/images/phone/apple-iphone-12-mini.jpeg",
      price: 81990,
      specs: {
        manufacturer: "Apple",
        release_year: 2020,
        diagonal: "6.1",
        country: "Китай",
        memory_capacity: 128,
        refresh_rate: 60,
        nfc: false,
        esim: true,
        wireless_charge: true
      }
    },
    {
      id: 2,
      name: "Xiaomi Mi 11 Lite",
      image_url: "https://nanoreview.net/common/images/phone/xiaomi-mi-11-lite-mini.jpeg",
      price: 27490,
      specs: {
        manufacturer: "Xiaomi",
        release_year: 2021,
        diagonal: "6.55",
        country: "Китай",
        memory_capacity: 128,
        refresh_rate: 90,
        nfc: true,
        esim: true,
        wireless_charge: false
      }
    },
    {
      id: 3,
      name: "Samsung Galaxy A72",
      image_url: "https://nanoreview.net/common/images/phone/samsung-galaxy-a72-mini.jpeg",
      price: 32890,
      specs: {
        manufacturer: "Samsung",
        release_year: 2021,
        diagonal: "6.7",
        country: "Вьетнам",
        memory_capacity: 128,
        refresh_rate: 90,
        nfc: true,
        esim: false,
        wireless_charge: true
      }
    },
    {
      id: 4,
      name: "Samsung Galaxy S21",
      image_url: "https://nanoreview.net/common/images/phone/samsung-galaxy-s21-mini.jpeg",
      price: 49990,
      specs: {
        manufacturer: "Samsung",
        release_year: 2021,
        diagonal: "6.2",
        country: "Вьетнам",
        memory_capacity: 128,
        refresh_rate: 120,
        nfc: true,
        esim: false,
        wireless_charge: true
      }
    },
    {
      id: 5,
      name: "Apple iPhone Xr",
      image_url: "https://nanoreview.net/common/images/phone/apple-iphone-xr-mini.jpeg",
      price: 51990,
      specs: {
        manufacturer: "Apple",
        release_year: 2018,
        diagonal: "6.1",
        country: "Китай",
        memory_capacity: 64,
        refresh_rate: 60,
        nfc: true,
        esim: false,
        wireless_charge: false
      }
    },
    {
      id: 6,
      name: "Realme 8 Pro",
      image_url: "https://nanoreview.net/common/images/phone/oppo-realme-8-pro-mini.jpeg",
      price: 27490,
      specs: {
        manufacturer: "Oppo",
        release_year: 2021,
        diagonal: "6.4",
        country: "Китай",
        memory_capacity: 128,
        refresh_rate: 90,
        nfc: true,
        esim: true,
        wireless_charge: false
      }
    },
  ])
  const displayed = ref<Smartphone[]>([]);
  const showDifferences = ref(false);
  const searchQuery = ref('');

  const hiddenSmartphones = computed(() => {
    const displayedIds = new Set(displayed.value.map(s => s.id));
    return smartphones.value.filter(s =>
      !displayedIds.has(s.id) &&
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  const visibleSpecKeys = computed(() => [
    'manufacturer',
    'release_year',
    'diagonal',
    'country',
    'memory_capacity',
    'refresh_rate',
    'nfc',
    'esim',
    'wireless_charge'
  ]);

  const shouldShowSpec = (key: keyof Smartphone['specs']) => {
    if (!showDifferences.value) return true;
    const first = displayed.value[0]?.specs[key];
    return !displayed.value.every(s => s.specs[key] === first);
  };

  const setDisplayedCount = (count: number) => {
    const min = 2;
    const max = smartphones.value.length;
    const clamped = Math.max(min, Math.min(max, count));

    if (displayed.value.length > clamped) {
      displayed.value = displayed.value.slice(0, clamped);
    } else if (displayed.value.length < clamped) {
      const available = hiddenSmartphones.value.slice(0, clamped - displayed.value.length);
      displayed.value.push(...available);
    }
    updateChecked();
  };

  const replaceSmartphone = (oldId: number, newId: number) => {
    const newPhone = smartphones.value.find(s => s.id === newId);
    if (!newPhone) return;
    const index = displayed.value.findIndex(s => s.id === oldId);
    if (index !== -1) {
      displayed.value[index] = newPhone;
      updateChecked();
    }
  };

  const toggleDifferences = () => {
    showDifferences.value = !showDifferences.value;
  };

  const setSearch = (query: string) => {
    searchQuery.value = query;
  };

  const updateChecked = () => {
    smartphones.value.forEach(s => {
      s.checked = displayed.value.some(d => d.id === s.id);
    });
  };

  // Инициализация
  displayed.value = smartphones.value.slice(0, 3);
  updateChecked();

  return {
    smartphones,
    displayed,
    showDifferences,
    hiddenSmartphones,
    searchQuery,
    visibleSpecKeys,
    shouldShowSpec,
    setDisplayedCount,
    replaceSmartphone,
    toggleDifferences,
    setSearch
  };
  
})
