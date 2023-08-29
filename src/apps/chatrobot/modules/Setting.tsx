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
      openAiBaseUrl: robotContext.currentOpenAiBaseUrl??'',
    },
    validate:{
      openaikey: (value) => value.trim().length > 0?null:'请输入openAiKey',
      openAiBaseUrl: (value) => {
        if(value.trim().length !== 0){
          try{
            new URL(value)
            return null
          }catch(e){
            return '请输入正确的url'
          }
        }
        return null
      },
    }
  });

  return (
    <Box maw={320} mx="auto">
      <TextInput label="OpenAiKey" placeholder="请输入openAiKey" {...form.getInputProps('openaikey')} />
      <TextInput label="代理地址" placeholder="请输入代理地址" {...form.getInputProps('openAiBaseUrl')} />
      <Group position="center" mt="xl">
        <Button
          variant="outline"
          onClick={() => {
            const error = form.validate();
            if(!error.hasErrors){
              emitter.emit(UPDATECONFIG,{openAiKey:form.values.openaikey,openAiBaseUrl:form.values.openAiBaseUrl})
            }
          }}
        >
          保存
        </Button>
      </Group>
    </Box>
  );
}