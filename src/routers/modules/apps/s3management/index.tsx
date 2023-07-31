import { S3CLIENT } from '@/routers/constant';
import S3Client from '@/apps/s3management';
import { Route } from 'react-router-dom';

export default
    <Route key={S3CLIENT} path={S3CLIENT} element={<S3Client />} />

