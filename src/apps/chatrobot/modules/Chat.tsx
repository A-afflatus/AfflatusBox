import { ActionIcon, Center, Flex, Space } from "@mantine/core";
import { IconLayoutSidebar } from "@tabler/icons-react";
import DialogueContainer from "./DialogueContainer";
import Welcome from "../Welcome";
import SendInput from "./SendInput";
import { useContext } from "react";
import { ChatContext } from '../index';
type Props = {
    open: () => void;
}
export default function Chat({ open }: Props) {
    const context = useContext(ChatContext)
    return <div>
        <Flex
            w={'100%'}
            justify="center"
            align="center"
            direction="row"
            wrap="nowrap"
        >
            <ActionIcon style={{ border: '0.5px solid #4d4d4f', position: 'absolute', left: 20 }} size="lg" onClick={open} >
                <IconLayoutSidebar />
            </ActionIcon>
            <b>Chat Gpt 3.5</b>
        </Flex>
        <hr />
        {
            //todo 消息列表
            context.currentSessionId ?
                [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((item) => <div key={item}>
                    <DialogueContainer robot={item % 2 === 0} />
                    <Space h={'5px'} />
                </div>)
                : <Welcome />
        }
        <Center w={'80%'} style={{
            position: 'fixed',
            bottom: 20,
        }}>
            <SendInput />
        </Center>
    </div>
}
