import { TextInput, TextInputProps, ActionIcon } from '@mantine/core';
import { IconBrandTelegram } from '@tabler/icons-react';

export default function InputWithButton(props: TextInputProps) {

  return (
    <TextInput
      radius="10px"
      size="lg"
      w={'80%'}
      rightSection={
        <ActionIcon size={32} radius="xl"  >
            <IconBrandTelegram size="1.1rem"  />
        </ActionIcon>
      }
      placeholder="Send a message"
      {...props}
    />
  );
}