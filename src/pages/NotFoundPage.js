import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <section className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-6xl md:text-7xl lg:text-9xl tracking-tight font-extrabold text-blue-600">
                        404
                    </h1>
                    <p className="mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                        Une erreur s'est produite
                    </p>
                    <p className="mb-4 text-base md:text-lg font-light text-gray-500">
                        La page que vous recherchez n'existe pas.
                    </p>
                    <Link 
                        to="/" 
                        className="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm md:text-base px-4 md:px-5 py-2.5"
                    >
                        Retour à l'accueil
                    </Link>
                </div>   
            </section>
        </div>
    );
};

export default NotFoundPage;
