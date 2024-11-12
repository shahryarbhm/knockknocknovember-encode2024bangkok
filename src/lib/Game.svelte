<script lang="ts">
  import { onMount } from "svelte";
  import { Contract, type AccountInterface } from "starknet";
  import type { SessionAccountInterface } from "@argent/tma-wallet";
  import artifact from "../utils/abi/telegramdapp_UserMatching.contract_class.json";
  import { executeContractAction, initWallet } from "./contracts";

  const ABI = artifact.abi;
  const DATING_CONTRACT_ADDRESS = import.meta.env.VITE_DATING_CONTRACT_ADDRESS;

  const argentTMA = initWallet(DATING_CONTRACT_ADDRESS);

  let account: SessionAccountInterface | undefined;
  let isConnected = false;
  let isLoading = false;
  let contract: Contract | undefined;
  let isRolling = false;
  let diceResult = 0;

  // User details
  let userProfile = {
    id: "", // Unique user ID
    gender: "", // "male" or "female"
    selectedNumber: 0,
    matched: false,
  };

  // Hardcoded mock data for the purpose of testing

  // Simulate contract behavior (mocked functions)
  function mockCheckMatch() {
    if (!userProfile.gender || userProfile.selectedNumber === 0) {
      return false;
    }

    const oppositeGender = userProfile.gender === "male" ? "female" : "male";

    for (const [id, number] of Object.entries(1)) {
      if (number === userProfile.selectedNumber) {
        // Remove matched users from mockMatchData
        return true;
      }
    }
    return false;
  }

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
      await argentTMA.requestConnection("dating_connection");
    } catch (error) {
      await argentTMA.clearSession();
    }
  }

  async function handleDisconnect() {
    try {
      await argentTMA.clearSession();
      account = undefined;
      isConnected = false;
      contract = undefined;
      userProfile = {
        id: "",
        gender: "",
        selectedNumber: 0,
        matched: false,
      };
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }

  async function selectNumber(number: number) {
    if (!isConnected || !account) return;
    isLoading = true;

    userProfile.selectedNumber = number;
    await checkMatch();
    isLoading = false;
  }

  async function checkMatch() {
    userProfile.matched = mockCheckMatch();
  }
  async function updateStats() {
    if (!contract) return;
    const [hunger, happiness, energy] = await Promise.all([
      contract.get_hunger(),
      contract.get_happiness(),
      contract.get_energy(),
    ]);

    stats = {
      hunger: Number(hunger),
      happiness: Number(happiness),
      energy: Number(energy),
    };
  }

  function rollDice() {
    isRolling = true;
    setTimeout(async () => {
      if (!isConnected || !account || !contract) {
        isRolling = false;
        return;
      }
      diceResult = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
      userProfile.selectedNumber = diceResult;
      let gender = userProfile.gender == "male" ? true : false;
      const result = await executeContractAction(
        contract,
        account,
        argentTMA,
        "register_user",
        "User Registered Successfully",
        "User Registration Failed",
        diceResult,
        gender
      );

      if (result) await updateStats();
      isLoading = false;

      isRolling = false;
    }, 1500); // Simulate dice rolling time (1.5 seconds)
  }
</script>

<div class="min-h-screen bg-gray-100 px-4 py-8">
  <div class="mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg">
    <h1 class="mb-6 text-center text-2xl font-bold text-black">
      Roll The Dice And Find Your Date! 🎲💌
    </h1>

    {#if !isConnected}
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
        <h2 class="text-center text-lg font-semibold">Roll the Dice</h2>
        <div class="flex justify-center mt-4">
          <button
            on:click={rollDice}
            class="rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
            disabled={isRolling}
          >
            {#if isRolling}
              <svg
                class="animate-spin h-5 w-5 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  fill="currentColor"
                />
              </svg>
              Rolling...
            {:else}
              <svg
                class="h-5 w-5 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  fill="currentColor"
                />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                <circle cx="16" cy="8" r="1.5" fill="currentColor" />
                <circle cx="8" cy="16" r="1.5" fill="currentColor" />
                <circle cx="16" cy="16" r="1.5" fill="currentColor" />
              </svg>
              Roll the Dice
            {/if}
          </button>
        </div>

        {#if diceResult > 0}
          <div class="mt-6 text-center">
            <h2 class="text-3xl font-bold">You Rolled: {diceResult}</h2>
          </div>
        {/if}
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
