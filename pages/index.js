import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

//TODO redo startpage

export default function Home(props) {
  const router = useRouter()
  useEffect(() => {
    // router.push('/login')
    if(typeof window !== 'undefined'){
      const M = require('../js/materialize');
      var sidenav = document.querySelectorAll(".sidenav");
      M.Sidenav.init(sidenav, {});
      
        var elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, {});
      
      
    }
  }, [ ]);
 
  return (
    <>
      {props.ssrWorking ? (
        
        <div>
          <img src="/assets/success.jpg" height="500" />
          <h2> Deployment Successful of Nextjs Application with SSR on Firebase. </h2>
          <a className="waves-effect waves-light btn">button</a>
          <a className="waves-effect waves-light btn"><i className="material-icons left">cloud</i>buttohghghn</a> 
        
  <a className='dropdown-trigger btn' href='#' data-target='dropdown1'>Drop Me!</a>

  
  <ul id='dropdown1' className='dropdown-content'>
    <li><a href="#!">one</a></li>
    <li><a href="#!">two</a></li>
    <li className="divider" tabIndex="-1"></li>
    <li><a href="#!">three</a></li>
    <li><a href="#!"><i className="material-icons">view_module</i>four</a></li>
    <li><a href="#!"><i className="material-icons">cloud</i>five</a></li>
  </ul>

  <nav> hu </nav>

<ul id="slide-out" className="sidenav">
  <li><div className="user-view">
    <div className="background">
      <img src="images/office.jpg"/>
    </div>
    <a href="#user"><img className="circle" src="images/yuna.jpg"/></a>
    <a href="#name"><span className="white-text name">John Doe</span></a>
    <a href="#email"><span className="white-text email">jdandturk@gmail.com</span></a>
  </div></li>
  <li><a href="#!"><i className="material-icons">cloud</i>First Link With Icon</a></li>
  <li><a href="#!">Second Link</a></li>
  <li><div className="divider"></div></li>
  <li><a className="subheader">Subheader</a></li>
  <li><a className="waves-effect" href="#!">Third Link With Waves</a></li>
</ul>
<a href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
        </div>
      ) : (
        <h2>SSR not working</h2>
      )}
    </>
  );
}

export async function getServerSideProps() {
  return { props: { ssrWorking: true } };
}