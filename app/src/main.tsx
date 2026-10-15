import React from 'react';import {createRoot} from 'react-dom/client';import App from './App';import './style.css';
class Boundary extends React.Component<{children:React.ReactNode},{error:boolean}>{state={error:false};static getDerivedStateFromError(){return {error:true}}render(){return this.state.error?<main><h1>Kemet needs a fresh start</h1><p>The current screen could not load. Your stored data has not been deleted.</p><button onClick={()=>location.reload()}>Reload</button></main>:this.props.children}}
createRoot(document.getElementById('root')!).render(<Boundary><App/></Boundary>);
