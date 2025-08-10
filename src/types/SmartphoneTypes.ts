export interface Smartphone {
  id: number,
  name: string,
  image_url: string,
  price: number,
  specs: {
    manufacturer: string,
    release_year: number,
    diagonal: string,
    country: string,
    memory_capacity: number,
    refresh_rate: number,
    nfc: boolean,
    esim: boolean,
    wireless_charge: boolean,
  },
  checked: boolean
}