//import { useEffect, useState } from 'react';
//import './App.css';
import NavigationBar from './components/NavigationBar'
import Quiz from './components/Quiz'

function App() {
    return (
        <>
            {NavigationBar()}
            {Quiz()}
        </>
    );
}

export default App;
