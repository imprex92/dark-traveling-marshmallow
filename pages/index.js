import { useEffect } from 'react';
import { useRouter } from 'next/router'


//TODO redo startpage

export default function Home(props) {
  const router = useRouter()
  useEffect(() => {
    //router.push('/login')
    /* document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, {
      // specify options here
    });
  }); */
  }, [ ]);
 
  return (
    <>
      <div className="text-center">Move on to login</div>
    </>
  );
}

export async function getServerSideProps() {
  return { props: { ssrWorking: true } };
}