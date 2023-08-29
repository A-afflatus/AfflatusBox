import { AppShell } from '@mantine/core';
import S3Navbear from './navber/S3Navbear'
import { useEffect, useState } from 'react';
import emitter, { INITS3CLIENT, PITCHBUCKET, PITCHS3CLIENT, REFRESH, UPLOADFILE } from '@/apps/s3management/event';
import { S3ClientInfo } from '@/redux';
import React from 'react'
import { Bucket, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IconCloudUpload, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import S3Welcome from './Welcome'
import ClientInfo from './clientInfo/ClientInfo'
import { nanoid } from '@reduxjs/toolkit';
export type S3Context = {
  currentClientConfig?: S3ClientInfo | null;
  currentClient?: S3Client;
  currentBucket?: Bucket;
}
const initConfig = { currentClientConfig: null }
export const S3ClientContext = React.createContext<S3Context>({});
export default function S3ClientManage() {
  const [s3Context, setS3Context] = useState<S3Context>(initConfig)
  const [key,setKey] = useState<string>('1')
  useEffect(() => {
    //初始化
    const init = () => {
      setS3Context(initConfig)
      setKey("a"+nanoid())
    }
    //选中客户端
    const pitchS3client = (client: S3ClientInfo) => {
      const newContext = {
        currentClientConfig: client,
        currentClient: new S3Client({
          ...client,
        })
      }
      setS3Context(newContext)
    }
    //选中bucket
    const pitchBucket = (bucket: Bucket) => {
      if (s3Context.currentBucket?.Name !== bucket.Name) {
        const newContext = {
          ...s3Context,
          currentBucket: bucket
        }
        setS3Context(newContext)
      }
    }
    //存储上传中的列表
    const uploadFile = (file: File | null, fileKey: string) => {
      if (!file || !s3Context.currentClient || !s3Context.currentBucket || !fileKey) {
        return
      }
      //弹窗提示文件上传中
      notifications.show({
        message: '上传请求已受理,请前往“上传任务”中查看',
        icon: <IconCloudUpload size="1.1rem" />,
        autoClose: 2000
      })
      //开始下载文件
      s3Context.currentClient.send(new PutObjectCommand({
        Bucket: s3Context.currentBucket.Name,
        Key: fileKey,
        Body: file
      }))
        .then(() => {
          emitter.emit(REFRESH)
        }).catch((error) => {
          console.log("上传文件失败", error);
          notifications.show({
            message: '上传文件失败',
            icon: <IconX size="1.1rem" />,
            color: 'red'
          })
        });
    }
    emitter.on(PITCHS3CLIENT, pitchS3client)
    emitter.on(PITCHBUCKET, pitchBucket)
    emitter.on(UPLOADFILE, uploadFile)
    emitter.on(INITS3CLIENT, init)
    return () => {
      emitter.off(PITCHS3CLIENT, pitchS3client)
      emitter.off(PITCHBUCKET, pitchBucket)
      emitter.off(UPLOADFILE, uploadFile)
      emitter.off(INITS3CLIENT, init)
    }
  }, [s3Context])

  return (
    <S3ClientContext.Provider value={s3Context}>
      <AppShell
        padding="md"
        navbar={<S3Navbear key={key}/>}
      >
        {s3Context.currentBucket ? <ClientInfo key={"a"+nanoid()} /> : <S3Welcome />}
      </AppShell>
    </S3ClientContext.Provider>
  );
}