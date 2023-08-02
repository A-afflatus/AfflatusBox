import {
    Navbar, SegmentedControl, createStyles, rem,
} from '@mantine/core';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import TopLinks from './modules/TopLinks';
import Clients from './modules/Clients'
import Buckets from './modules/Buckets'
import emitter, { PITCHS3CLIENT } from '@/apps/s3management/event'

const useStyles = createStyles((theme) => ({
    navbar: {
        paddingTop: 0,
    },

    section: {
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        marginBottom: theme.spacing.md,

        '&:not(:last-of-type)': {
            borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
        },
    },
    searchCode: {
        fontWeight: 700,
        fontSize: rem(10),
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
            }`,
    },
}));
//选择桶或者客户端
type Segments = 'client' | 'bucket'
function SegmentControl({ section, setSection }: { section: Segments, setSection: Dispatch<SetStateAction<Segments>> }) {
    return (
        <SegmentedControl
            radius="lg" size="sm"
            value={section}
            onChange={(value: Segments) => setSection(value)}
            transitionTimingFunction="ease"
            fullWidth
            data={[
                { label: '客户端', value: 'client' },
                { label: '桶', value: 'bucket' },
            ]}
        />
    )
}

export default function NavbarSearch() {
    const { classes } = useStyles();

    //功能控制
    const [section, setSection] = useState<Segments>('client');

    useEffect(() => {
        const listenerFunc = () => {
            setSection('bucket')
        }
        emitter.on(PITCHS3CLIENT, listenerFunc)
        return () => {
            emitter.off(PITCHS3CLIENT,listenerFunc)
        }
    }, [setSection])
    return (
        <Navbar height='100vh' width={{ sm: '200px' }} p="md" className={classes.navbar} 
        // style={{ resize: 'horizontal', overflow: 'auto' }}
        >

            <Navbar.Section className={classes.section}>
                <TopLinks />
            </Navbar.Section>
            <Navbar.Section>
                <SegmentControl section={section} setSection={setSection} />
            </Navbar.Section>
            <Navbar.Section className={classes.section} style={{ marginTop: "10px" }}>
                {
                    section === 'bucket' ? <Buckets /> : <Clients />
                }
            </Navbar.Section>
        </Navbar>
    );
}