import { useEffect, useState } from 'react'
import './App.css'
import { ThemeProvider } from './components/theme-provider'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { cn } from "@/lib/utils"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { format } from 'date-fns';
import { AllWalletsProvider } from './services/wallets/AllWalletsProvider'
import { useWalletInterface } from './services/wallets/useWalletInterface';
import { WalletSelectionDialog } from './components/WalletSelectionDialog'

function Home() {
    const [open, setOpen] = useState(false);
    const { accountId, walletInterface } = useWalletInterface();
    const [onGoingElectionsCount, setOnGoingElectionsCount] = useState(1)
    const [pastElectionsCount, setPastElectionsCount] = useState(2)

    const handleConnect = async () => {
        if (accountId) {
            localStorage.removeItem("usedBladeForWalletPairing");
        } else {
            setOpen(true);
        }
    };

    useEffect(() => {
        console.log('App', accountId)
        if (accountId) {
            setOpen(false);
        }
    }, [accountId])


    return (
        <>
            <div className='flex mt-5 px-10 justify-between'>
                <div />
                <div className='text-2xl'>Voting DApp</div>
                <Button onClick={handleConnect}>
                    {accountId ? `Connected: ${accountId}` : 'Connect Wallet'}
                </Button>
            </div>

            <WalletSelectionDialog open={open} onClose={() => setOpen(false)} />


            <div className='px-10 mt-10'>
                <div className='flex justify-between items-center'>
                    <div className='text-2xl'>Ongoing Elections: {onGoingElectionsCount}</div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Add Election</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Election</DialogTitle>
                                <DialogDescription>
                                    Add details of the Election you want to conduct. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid w-full gap-4">
                                    <Label htmlFor="name" className="text-left">
                                        Name
                                    </Label>
                                    <Input id="name" value="" onChange={() => { }} className="col-span-3" />
                                </div>
                                <div className="grid w-full gap-4">
                                    <Label htmlFor="candidates" className="text-left">
                                        Candidates
                                    </Label>
                                    <Textarea id="candidates" value="" onChange={() => { }} className="col-span-3" />
                                    <p className="text-sm text-muted-foreground">
                                        Add candidates seperated by comma
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="submit">Save changes</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className='flex mt-5'>
                    <Card className={cn("w-[380px]")}>
                        <CardHeader>
                            <CardTitle>Election 1</CardTitle>
                            <CardDescription>Results on {format(new Date(), 'PPpp')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Candidates</p>
                            <ul className="list-disc list-inside mt-4">
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <li>Item 3</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Vote</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Cast your Vote</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid w-full gap-4">
                                            <Label htmlFor="name" className="text-left">
                                                Name
                                            </Label>
                                            <Select>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Candidate" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="light">Candidate 1</SelectItem>
                                                    <SelectItem value="dark">Candidate 2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="submit">Save changes</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div className='px-10 mt-10'>
                <div className='flex justify-between items-center'>
                    <div className='text-2xl'>Past Elections: {pastElectionsCount}</div>
                </div>
                <div className='flex mt-5 gap-10'>
                    <Card className={cn("w-[380px]")}>
                        <CardHeader>
                            <CardTitle>Election 1</CardTitle>
                            <CardDescription>Results announced on {format(new Date(), 'PPpp')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Candidates</p>
                            <ul className="list-disc list-inside mt-4">
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <li>Item 3</li>
                            </ul>
                        </CardContent>
                        <CardFooter className='flex justify-center'>
                            <div className='flex items-center'>Winner: <div className='font-bold ml-2'>Candidate 1</div></div>
                        </CardFooter>
                    </Card>
                    <Card className={cn("w-[380px]")}>
                        <CardHeader>
                            <CardTitle>Election 1</CardTitle>
                            <CardDescription>Results announced on {format(new Date(), 'PPpp')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Candidates</p>
                            <ul className="list-disc list-inside mt-4">
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <li>Item 3</li>
                            </ul>
                        </CardContent>
                        <CardFooter className='flex justify-center'>
                            <div className='flex items-center'>Winner: <div className='font-bold ml-2'>Candidate 1</div></div>
                        </CardFooter>
                    </Card>

                </div>
            </div>
        </>
    )
}

export default Home
