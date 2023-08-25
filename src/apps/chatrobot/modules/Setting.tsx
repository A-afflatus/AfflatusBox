import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Box } from '@mantine/core';
import {ChatContext} from '@/apps/chatrobot';
import { useContext } from 'react';
import emitter,{UPDATECONFIG} from '../event';
export default function Setting() {
  const robotContext = useContext(ChatContext)
  const form = useForm({
    initialValues: {
      openaikey: robotContext.currentOpenAiKey??'',
    },
    validate:{
      openaikey: (value) => value.trim().length > 0?null:'请输入openAiKey',
    }
  });

  return (
    <Box maw={320} mx="auto">
      <TextInput label="OpenAiKey" placeholder="请输入openAiKey" {...form.getInputProps('openaikey')} />
      <Group position="center" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            const error = form.validate();
            if(!error.hasErrors){
              emitter.emit(UPDATECONFIG,{openAiKey:form.values.openaikey})
            }
          }}
        >
          保存
        </Button>
      </Group>
    </Box>
  );
}