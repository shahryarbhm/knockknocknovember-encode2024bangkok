import { ArgentTMA, type Environment, type SessionAccountInterface, } from '@argent/tma-wallet';
import type { Call, Contract } from 'starknet';
import toast from 'svelte-french-toast';

export const initWallet = (contractAddress: string) =>
    ArgentTMA.init({
        environment: 'mainnet',
        appName: import.meta.env.VITE_TELEGRAM_APP_NAME,
        appTelegramUrl: import.meta.env.VITE_TELEGRAM_APP_URL,
        sessionParams: {
            allowedMethods: [
                { contract: contractAddress, selector: 'feed' },
                { contract: contractAddress, selector: 'play' },
                { contract: contractAddress, selector: 'rest' },
                { contract: contractAddress, selector: 'set_stats_to_half' },
            ],
            validityDays: 90,
        },
    });

export async function executeContractAction(
    contract: Contract,
    account: SessionAccountInterface,
    argentTMA: ArgentTMA,
    action: string,
    successMessage: string,
    errorMessage: string,
    number: Number[]
) {
    const call: Call = {
        contractAddress: contract.address,
        entrypoint: action,
        calldata: [],
    };

    try {
        const fees = await account?.estimateInvokeFee([call]);
        const tx = await contract[action]({
            maxFee: fees?.suggestedMaxFee ? BigInt(fees.suggestedMaxFee) * 2n : undefined,
        });
        await argentTMA.provider.waitForTransaction(tx.transaction_hash);
        toast.success(successMessage);
        return true;
    } catch (error) {
        console.error(`Error performing ${action}:`, error);
        toast.error(errorMessage);
        return false;
    }
}