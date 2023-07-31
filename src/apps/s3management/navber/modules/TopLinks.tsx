import { Modal, UnstyledButton, createStyles, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCloudDownload, IconCloudUpload, IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import DownloadPage from './TopTools/DownloadPage'
import UploadPage from './TopTools/UploadPage'
import SettingsPage from './TopTools/SettingsPage'
const useStyles = createStyles((theme) => ({
    mainLinks: {
        paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
        paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
        paddingBottom: theme.spacing.md,
    },
    mainLink: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        fontSize: theme.fontSizes.xs,
        padding: `${rem(8)} ${theme.spacing.xs}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },

    mainLinkInner: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
    },

    mainLinkIcon: {
        marginRight: theme.spacing.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    },

    mainLinkBadge: {
        padding: 0,
        width: rem(20),
        height: rem(20),
        pointerEvents: 'none',
    },



}));

export default function TopLinks() {
    const { classes } = useStyles()
    const [modalType, setModalType] = useState<'download' | 'upload' | 'setting' | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [currentTitle, setCurrentTitle] = useState<string>('');

    const modalPage = () => {
        switch (modalType) {
            case 'download':
                return <DownloadPage />
            case 'upload':
                return <UploadPage />
            case 'setting':
                return <SettingsPage />
            default:
                return null
        }
    }
    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={currentTitle}
                size="calc(100vw - 10rem)"
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                {modalPage()}
            </Modal>
            <div className={classes.mainLinks}>
                <UnstyledButton disabled className={classes.mainLink} onClick={() => { setCurrentTitle('下载任务'); setModalType('download'); open() }}>
                    <div className={classes.mainLinkInner}>
                        <IconCloudDownload size={20} className={classes.mainLinkIcon} stroke={1.5} />
                        <span>下载任务</span>
                    </div>
                </UnstyledButton>
                <UnstyledButton disabled className={classes.mainLink} onClick={() => { setCurrentTitle('上传任务'); setModalType('upload'); open() }}>
                    <div className={classes.mainLinkInner}>
                        <IconCloudUpload size={20} className={classes.mainLinkIcon} stroke={1.5} />
                        <span>上传任务</span>
                    </div>
                </UnstyledButton>
                <UnstyledButton disabled className={classes.mainLink} onClick={() => { setCurrentTitle('用户配置'); setModalType('setting'); open() }}>
                    <div className={classes.mainLinkInner}>
                        <IconSettings size={20} className={classes.mainLinkIcon} stroke={1.5} />
                        <span>用户配置</span>
                    </div>
                </UnstyledButton>

            </div>
        </>
    )
}