import { FileInput, Group, Radio, Space, rem } from "@mantine/core";
import { useState } from "react";
import { IconUpload } from "@tabler/icons-react";
import CodeMirror, { Extension } from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import React from "react";
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { useColorScheme } from "@mantine/hooks";
// cm-focused
export default function index() {
    const [type, setType] = useState<'none' | 'json' | 'xml' | 'text' | 'binary'>('json')
    const [content, setContent] = useState<string>(`//全局属性
    {
      "enableCross":"开启跨域"
    }
    //目录结构
    {
      "title":"名称(唯一)",
      "id":"id",
      "enable":true
    }
    //元素结构
    {
      "path":"路径(目录下唯一)",
      "method":"请求类型",
      "respBody":{
        "type":"响应类型",
        "body":"响应体 string | filepath | null"
      },
      "respHeaders":[
        {
          "key":"",
          "value":"",
          "open":true
        }
      ]
    }`)
    const theme = useColorScheme()

    const onChange = React.useCallback((val: any) => {
        setContent(val);
    }, []);
    const editMode = () => {
        if (type === 'json' || type === 'xml' || type === 'text') {
            const languageMode: Extension[] = type === 'json' ? [json()] : type === 'xml' ? [xml()] : [];
            return <CodeMirror
                value={content}
                theme={theme === 'dark' ? githubDark : githubLight}
                height="500px"
                editable={false}
                extensions={languageMode}
                onChange={onChange} 
                />;
        }
        if (type === 'binary') {
            return <FileInput placeholder="请选择文件" icon={<IconUpload size={rem(14)} />} />
        }
        return 'none'
    }


    return (
        <>
            <Radio.Group size="xs" value={type}>
                <Group mt="xs">
                    <Radio value="none" label="none" onClick={() => setType('none')} />
                    <Radio value="json" label="json" onClick={() => setType('json')} />
                    <Radio value="xml" label="xml" onClick={() => setType('xml')} />
                    <Radio value="text" label="raw" onClick={() => setType('text')} />
                    <Radio value="binary" label="binary" onClick={() => setType('binary')} />
                </Group>
            </Radio.Group>
            <Space h={20} />
            {
                editMode()
            }


        </>
    )
}