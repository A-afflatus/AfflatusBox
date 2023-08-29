import { TextInput, ActionIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBrandTelegram } from '@tabler/icons-react';
import emitter, { SENDMESSAGE } from '../event';
import { ChatContext } from '../index';
import { useContext } from 'react';

export default function InputWithButton() {
  const context = useContext(ChatContext);
  const form = useForm({
    initialValues: {
      content: '',
    },
  });
  //发送消息
  const sendMessage = (message: string) => {
    if (context.currentSessionId) {
      emitter.emit(SENDMESSAGE, {
        sessionId: context.currentSessionId,
        message: message
      });
      form.reset();
    }
  };

  return (
    <form style={{
      width: '80%',
    }}
      onSubmit={form.onSubmit((values) => sendMessage(values.content))}>
      <TextInput
        radius="10px"
        size="lg"
        rightSection={
          <ActionIcon size={32} radius="xl"  >
            <IconBrandTelegram size="1.1rem" />
          </ActionIcon>
        }
        placeholder="Send a message"
        {...form.getInputProps('content')}
      />
    </form>


  );
}