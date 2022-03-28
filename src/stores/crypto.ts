
import { ethers } from 'ethers'
import { acceptHMRUpdate, defineStore } from 'pinia'
import contractABI from '../artifacts/contracts/ClinicBank.sol/ClinicBank.json'
const contractAddress = '0x86c12a724340f3f4f6142789808874d0a55bd01f'

export const useCryptoStore = defineStore('user', () => {
  const account = ref(null)
  const transactions = ref([] as any)
  const loading = ref(false)

  async function transfer(addressInput: string, amountInput: string) {
    // console.log('setting loader')
    setLoader(true)
    try {
      console.log('got', addressInput, amountInput)
      const { ethereum } = window
      if (ethereum) {
        // create provider object from ethers library, using ethereum object injected by metamask
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const clinicBankContract = new ethers.Contract(contractAddress, contractABI, signer)

        clinicBankContract.on('Transfer', (sender, receiver, amount) => {
          // console.log('Transfered! %s received ', receiver, amount.toNumber())
          transactions.value.push({ from: sender, to: receiver, amount })
        })

        const amount = ethers.utils.parseEther(String(amountInput)) // sending one ether

        /*
        * Execute the actual transfer from your smart contract
        */
        clinicBankContract.transfer(addressInput, amount).then(async(transferTxn: any) => {
          console.log('Mining...', transferTxn.hash)
          await transferTxn.wait()
          console.log('Mined -- ', transferTxn.hash)
          // reset input fields
          addressInput = ''
          amountInput = ''
        }).catch((error: any) => {
          console.log('Transfer falied', error)
          alert(error.message)
        })
        // toggle loading state
        setLoader(false)
      }
      else {
        console.log('Ethereum object doesn\'t exist!')
      }
    }
    catch (error) {
      setLoader(false)
      console.log(error)
    }
  }

  async function approve(addressInput: string, amountInput: string) {
    console.log('got', addressInput, amountInput)
  }

  async function connectWallet() {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Must connect to MetaMask!')
        return
      }
      const myAccounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected: ', myAccounts[0])
      account.value = myAccounts[0]
    }
    catch (error) {
      console.log(error)
    }
  }

  function setLoader(value: boolean) {
    loading.value = value
  }

  return {
    setLoader,
    loading,
    transfer,
    approve,
    connectWallet,
    account,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCryptoStore, import.meta.hot))
