import { AppShell} from "@mantine/core";
import Header from './modules/header';
import Navbar from './modules/navbar';
import Detail from './modules/detail';

export default function index() {
    return (
        <AppShell
            padding="md"
            header={<Header/>}
            navbar={<Navbar/>}
        >
            <Detail/>
        </AppShell>
    )
}
