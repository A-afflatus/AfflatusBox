import { Container, Paper, createStyles } from "@mantine/core";
import { IconRobot, IconUser } from "@tabler/icons-react";
import { render } from '@/utils/markdownit';
import styles from './table.module.css';
import { ChatRobotSessionMessage } from "@/redux";


const useStyles = createStyles((theme) => ({
    context: {
        backgroundColor: theme.colorScheme === 'dark' ? '#25262b' : '#ffffff',
    }
}));
type Props = {
    message:ChatRobotSessionMessage;
}

export default function DialogueContainer({ message }: Props) {
    const { classes } = useStyles();
    //发送消息
    return (
        <>
            <Container fluid={true}>
                <div >
                    {message.role === 'assistant' ? <IconRobot />
                        : <div style={{ height: 30 }}><IconUser style={{ position: 'absolute', right: 40 }} /></div>
                    }
                    <Paper shadow="xl" radius="lg" p="xl" withBorder className={classes.context}>
                        <div className={styles.tableContainer} style={{ fontSize: 15 }} dangerouslySetInnerHTML={{
                            __html: render(message.content??"")
                        }} />
                    </Paper>
                </div>
            </Container>
        </>
    )
}
