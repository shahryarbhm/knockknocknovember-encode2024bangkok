import { ArgentTMA, type Environment, type SessionAccountInterface, } from '@argent/tma-wallet';
import type { Call, Contract } from 'starknet';
import toast from 'svelte-french-toast';

export const initWallet = (contractAddress: string) =>
    ArgentTMA.init({
        environment: 'sepolia',
        appName: import.meta.env.VITE_TELEGRAM_APP_NAME,
        appTelegramUrl: import.meta.env.VITE_TELEGRAM_APP_URL,
        sessionParams: {
            allowedMethods: [
                { contract: contractAddress, selector: 'register_user' },
                { contract: contractAddress, selector: 'get_match' },
                { contract: contractAddress, selector: 'is_matched' },
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
    number: Number,
    gender: Boolean
) {
    const call: Call = {
        contractAddress: contract.address,
        entrypoint: action,
        calldata: [gender, number],
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