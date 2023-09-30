import { useEffect } from 'react';
import { useRouter } from 'next/router'


//TODO redo startpage

export default function Home(props) {
  const router = useRouter()
  useEffect(() => {
    //router.push('/login')
  }, [ ]);
 
  return (
    <>
        
    </>
  );
}

export async function getServerSideProps() {
  return { props: { ssrWorking: true } };
}