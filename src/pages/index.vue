<script setup lang="ts">

import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCryptoStore } from '~/stores/crypto'

const addressInput = ref(null as any)
const amountInput = ref(null as any)
const cryptoStore = useCryptoStore()
const { loading, transfer, connectWallet } = useCryptoStore()
const { account, approve } = storeToRefs(cryptoStore)

onMounted(() => {
  connectWallet()
})

</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl m-4">
      Peter Odetayo Crypto Transfer Assessment Test
    </h1>
    <button v-if="!account" class="bg-green-500 rounded px-6 py-4" @click="connectWallet">
      Connect Wallet
    </button>
    <div v-if="account" class="flex flex-col w-full max-w-lg mx-auto mt-5">
      <div class="flex flex-col gap-y-5 text-dark-50">
        <input
          v-model="addressInput"
          name="toAddress"
          placeholder="Reciever's Address"
          class="py-4 px-4  shadow border rounded outline-none"
          maxlength="50"
        >
        <input
          v-model="amountInput"
          type="number"
          name="toAddress"
          placeholder="ETH Amount"
          class="py-4 px-4  shadow border rounded outline-none"
          maxlength="20"
        >
        <button :disabled="loading || !amountInput || !addressInput" class="bg-blue-500 text-white rounded p-4" @click="transfer(addressInput, amountInput)">
          <span v-if="!loading">Transfer</span>
          <span v-else>Loading...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
