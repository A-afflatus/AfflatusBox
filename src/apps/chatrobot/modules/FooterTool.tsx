import { UnstyledButton, createStyles, Text, rem, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTool } from "@tabler/icons-react";
import Setting from "./Setting";
import { nanoid } from "@reduxjs/toolkit";

const useStyles = createStyles((theme) => ({
    link: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '40px',
        fontSize: theme.fontSizes.xs,
        padding: `${rem(8)} ${theme.spacing.xs}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,
        color: '#ececf1',
        '&:hover': {
            backgroundColor: '#343541',
            color: '#ffffff',
        },
    },

    linkInner: {
        display: 'flex',
        alignItems: 'center',
        fontSize: theme.fontSizes.xs,
        fontWeight: 500,
        color: '#ececf1',
        '&:hover': {
            backgroundColor: '#343541',
            color: '#ffffff',
        },
        flex: 1,
    },

    leftIcon: {
        marginRight: theme.spacing.sm,
        color: '#ececf1',
        '&:hover': {
            backgroundColor: '#343541',
            color: '#ffffff',
        },
    },
    operationIcon: {
        color: '#c5c5d2',
        '&:hover': {
            backgroundColor: '#343541',
            color: '#ffffff',
        },
    },

}));
type Props = {
    name: string,
}
export default function FooterTool({ name }: Props) {
    const { classes } = useStyles()
    const [settingOpend, settingDisclosure] = useDisclosure()

    return (
        <>
            <Modal opened={settingOpend} onClose={settingDisclosure.close} title="设置" centered>
                <Setting key={nanoid()}/>
            </Modal>
            <div className={classes.link} style={{ display: 'flex' }}>
                <UnstyledButton className={classes.linkInner} onClick={settingDisclosure.open}>
                    <IconTool size={18} className={classes.leftIcon} stroke={1.5} />
                    <Text truncate={'end'} w={'100px'}>{name}</Text>
                </UnstyledButton>
            </div>
        </>

    )
}
