import { ActionIcon, Tooltip, UnstyledButton, createStyles, Text, rem, TextInput } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconDeviceFloppy, IconMessageDots, IconPencilMinus, IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { deleteChatRobotSession, updateChatRobotSessionName } from "@/redux";
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
        marginRight: '-7px',
        '&:hover': {
            backgroundColor: '#343541',
            color: '#ffffff',
        },
    },

}));
type Props = {
    id: string;
    name: string,
    hoverOrClick?: boolean
    refresh: () => void
}
export default function ChatItem({ id, name, hoverOrClick,refresh }: Props) {
    const { classes } = useStyles()
    const [edit, toggle] = useToggle([false, true])
    const [chatName, setChatName] = useState<string>(name)
    const nameInput = useRef<HTMLInputElement>(null)
    return (
        <div className={classes.link} style={{ display: 'flex', backgroundColor: hoverOrClick ? '#343541' : '' }}>
            <UnstyledButton className={classes.linkInner}>
                <IconMessageDots size={18} className={classes.leftIcon} stroke={1.5} />
                {
                    edit ?
                        <TextInput ref={nameInput} placeholder="请输入会话名称" defaultValue={chatName} radius="xs" size="xs" />
                        : <Text truncate={'end'} w={'100px'}>{chatName}</Text>
                }

            </UnstyledButton>
            {
                hoverOrClick ?
                    <>
                        {edit ?
                            <Tooltip label='保存' withArrow position="right" onClick={() => {
                                toggle()
                                if (nameInput.current && nameInput.current.value && nameInput.current.value !== chatName && nameInput.current.value.trim() !== '') {
                                    setChatName(nameInput.current.value)
                                    //更新会话名称
                                    updateChatRobotSessionName(id, nameInput.current.value)
                                }
                            }}>
                                <ActionIcon className={classes.operationIcon}>
                                    <IconDeviceFloppy size="1rem" />
                                </ActionIcon>
                            </Tooltip>
                            : <>
                                <Tooltip label='编辑名称' withArrow position="right" onClick={() => toggle()}>
                                    <ActionIcon className={classes.operationIcon}>
                                        <IconPencilMinus size="1rem" />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label='删除会话' withArrow position="right" onClick={() => {
                                    deleteChatRobotSession(id)
                                    refresh()
                                }}>
                                    <ActionIcon className={classes.operationIcon} >
                                        <IconTrash size="1rem" />
                                    </ActionIcon>
                                </Tooltip>
                            </>
                        }

                    </>
                    : null
            }

        </div>
    )
}
