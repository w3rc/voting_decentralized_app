import { useContext } from "react"
import { BladeContext } from "../../contexts/BladeContext"
import { MetamaskContext } from "../../contexts/MetamaskContext";
// import { bladeWallet } from "./blade/bladeClient";
import { metamaskWallet } from "./metamask/metamaskClient";

// Purpose: This hook is used to determine which wallet interface to use
// Example: const { accountId, walletInterface } = useWalletInterface();
// Returns: { accountId: string | null, walletInterface: WalletInterface | null }
export const useWalletInterface = () => {
    const bladeCtx = useContext(BladeContext);
    const metamaskCtx = useContext(MetamaskContext);

    console.log(bladeCtx);

    if (bladeCtx.accountId) {
        return {
            accountId: bladeCtx.accountId,
            walletInterface: null
        };
    } else if (metamaskCtx.metamaskAccountAddress) {
        return {
            accountId: metamaskCtx.metamaskAccountAddress,
            walletInterface: metamaskWallet
        };
    } else {
        return {
            accountId: null,
            walletInterface: null
        };
    }
}