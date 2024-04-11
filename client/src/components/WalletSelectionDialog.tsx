import { Button, Dialog, Stack } from "@mui/material";
import { BladeConnector, ConnectorStrategy, HederaNetwork } from "@bladelabs/blade-web3.js";
import { connectToMetamask } from "../services/wallets/metamask/metamaskClient";
import { BladeContext } from "@/contexts/BladeContext";
import { useContext } from "react";

const env = HederaNetwork.Testnet;
const bladeLocalStorage = "usedBladeForWalletPairing";

const appMetadata = {
    network: env,
    dAppCode: "voting-dapp",
};
const bladeConnector = await BladeConnector.init(ConnectorStrategy.AUTO, {
    name: "Voting Dapp",
    description: "Voting Dapp",
    url: "",
    icons: [],
});

interface WalletSelectionDialogProps {
    open: boolean;
    onClose: (value: string) => void;
}

export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
    const { onClose, open } = props;
    const { setAccountId, setIsConnected } = useContext(BladeContext);

    const connectToBladeWallet = async () => {
        const accounts = await bladeConnector.createSession(appMetadata);
        console.log(accounts);

        const bladeSigner = bladeConnector.getSigners()[0];
        console.log(bladeSigner);

        if (bladeSigner) {
            const accountId = await bladeSigner.getAccountId();
            const balance = await bladeSigner.getAccountBalance();
            console.log(accountId, balance);
            localStorage.setItem(bladeLocalStorage, "true");
            localStorage.setItem("accountId", accountId.toString());
            setAccountId(accountId.toString());
            setIsConnected(true);
        } else {
            setAccountId("");
            setIsConnected(false);
        }
    }

    return (
        <Dialog onClose={onClose} open={open}>
            <Stack p={2} gap={1}>
                {/* <Button
          variant="contained"
          onClick={() => {
            hashConnect.connectToLocalWallet();
          }}
        >
          <im
            src={HashPackLogo}
            alt='hashpack logo'
            className='walletLogoImage'
            style={{
              marginLeft: '-6px'
            }}
          />
          HashPack
        </Button> */}
                <Button
                    variant="contained"
                    onClick={() => {
                        connectToBladeWallet();
                    }}
                >
                    Blade
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        connectToMetamask();
                    }}
                >
                    {/* <img
            src={MetamaskLogo}
            alt='metamask logo'
            className='walletLogoImage'
            style={{
              padding: '4px 4px 4px 0px'
            }}
          /> */}
                    Metamask
                </Button>
            </Stack>
        </Dialog>
    );
}
