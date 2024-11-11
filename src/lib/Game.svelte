<script lang="ts">
  import { onMount } from "svelte";
  import { Contract, type AccountInterface } from "starknet";
  import type { SessionAccountInterface } from "@argent/tma-wallet";
  import artifact from "../utils/abi/telegramdapp_integrationtest_Tamagotchi.test.contract_class.json";
  import { executeContractAction, initWallet } from "./contracts";

  const ABI = artifact.abi;
  const DATING_CONTRACT_ADDRESS = import.meta.env.VITE_DATING_CONTRACT_ADDRESS;

  const argentTMA = initWallet(DATING_CONTRACT_ADDRESS);

  let account: SessionAccountInterface | undefined;
  let isConnected = false;
  let isLoading = false;
  let contract: Contract | undefined;

  // User details
  let userProfile = {
    gender: "", // "male" or "female"
    selectedNumber: 0,
    matched: false,
  };

  onMount(async () => {
    try {
      const res = await argentTMA.connect();
      if (!res) {
        isConnected = false;
        return;
      }

      account = res.account;
      if (account.getSessionStatus() !== "VALID") {
        isConnected = false;
        return;
      }

      contract = new Contract(
        ABI,
        DATING_CONTRACT_ADDRESS,
        account as unknown as AccountInterface
      );

      isConnected = true;
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  });

  async function handleConnect() {
    try {
      await argentTMA.requestConnection("datingapp_connection");
    } catch (error) {
      console.error("Connection failed:", error);
    }
  }

  async function handleDisconnect() {
    try {
      await argentTMA.clearSession();
      account = undefined;
      isConnected = false;
      contract = undefined;
      userProfile = {
        gender: "",
        selectedNumber: 0,
        matched: false,
      };
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }

  async function selectNumber(number: number) {
    if (!contract || !isConnected || !account) return;
    isLoading = true;

    const result = await executeContractAction(
      contract,
      account,
      argentTMA,
      "select_number", // Contract function to set the selected number
      `Selected number ${number}`,
      "Failed to select number 😕",
      [number] // Pass selected number as an argument
    );

    if (result) {
      userProfile.selectedNumber = number;
      await checkMatch();
    }
    isLoading = false;
  }

  async function checkMatch() {
    if (!contract) return;

    const isMatched = await contract.is_matched(userProfile.selectedNumber); // Hypothetical function in the contract
    userProfile.matched = Boolean(isMatched);
  }
</script>

<div class="min-h-screen bg-gray-100 px-4 py-8">
  <div class="mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg">
    <h1 class="mb-6 text-center text-2xl font-bold text-black">
      Dating App Game
    </h1>

    {#if isConnected}
      <div class="flex justify-center">
        <button
          on:click={handleConnect}
          class="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors
                 hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      </div>
    {:else}
      <button on:click={handleDisconnect} class="w-full text-left">
        Account address: <code
          >{account?.address.slice(0, 6)}...{account?.address.slice(-4)}</code
        >
      </button>

      <div class="mt-4">
        <label for="gender">Select Gender:</label>
        <select id="gender" bind:value={userProfile.gender} class="mt-2 w-full">
          <option value="" disabled>Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="mt-4">
        <h2 class="text-center text-lg font-semibold">Choose a Number</h2>
        <div class="grid grid-cols-5 gap-2 mt-4">
          {#each Array.from({ length: 10 }) as _, i}
            <button
              on:click={() => selectNumber(i + 1)}
              class="w-full rounded-lg bg-gray-300 p-2 hover:bg-gray-400"
              disabled={isLoading}
            >
              {i + 1}
            </button>
          {/each}
        </div>
      </div>

      {#if userProfile.matched}
        <div class="mt-6 text-center text-green-600">
          🎉 Congratulations! You have a match! 🎉
        </div>
      {:else}
        <div class="mt-6 text-center text-gray-600">
          No match found. Try a different number!
        </div>
      {/if}
    {/if}
  </div>
</div>
