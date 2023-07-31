import { APPS } from '@/routers/constant';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { toLink } from '@/routers';
import { motion } from "framer-motion"


const BoxComponent = () => {
  const navigate = useNavigate()

  return (
    <>
      <div style={{ textAlign: 'center', padding: 'calc(30vh) calc(35vh)' }} >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 3 }}
        >
          <h1 style={
            {
              fontSize: '3.2em',
              marginBottom: '0.3em',
            }
          }>欢迎使用盒子</h1>
          <Button
            onClick={() => toLink({ route: APPS, navigate })}
            style={{ backgroundColor: '#1b73e8' }}
          >
            拆开胶带
          </Button>
        </motion.div>
      </div >
      <div style={
        {
          position: 'absolute',
          color: 'darkgray',
          bottom: 0,
          width: '100%',
          textAlign: 'center',
        }
      }>
        <p>
          欢迎联系作者 afflatus
          <br />
          &lt;wucuo456@gmail.com&gt;
        </p>
      </div>
    </>
  );
};

export default BoxComponent;