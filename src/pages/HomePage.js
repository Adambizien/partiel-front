import React from 'react';
import Button from '../components/Button/Button';

const HomePage = () => {
    const handleClick = () => {
        alert('Button clicked!');
    };

    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome to the Home Page!</p>
            <Button text="Click Me" onClick={handleClick} />
        </div>
    );
};

export default HomePage;