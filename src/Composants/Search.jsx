import React, { useState, useEffect } from 'react';
import recherche from '../assets/gif/recherche.gif';
import './composant.css';

export default function Search({ setSearchTerm }) {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [localSearchTerm, setLocalSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setLocalSearchTerm(term);
        setSearchTerm(term); // Transmission du terme de recherche à TableBook
    };

    const handleIconClick = () => {
        setIsSearchActive(!isSearchActive);
    };

    useEffect(() => {
        const filteredBooks = livres.filter(livre => {
            const fullName = `${livre.titre} ${livre.auteur}`.toLowerCase();
            return fullName.includes(searchTerm.toLowerCase());
        });

        setFilteredBooks(filteredBooks); // Mise à jour du prop setFilteredBooks
    }, [searchTerm, livres, setFilteredBooks]);

    return (
        <div className="contener-fluid d-flex justify-content-end align-items-center m-4" data-aos="fade-down-right">
            <div className={`search ${isSearchActive ? 'active' : ''}`}>
                <div className="iconSearch" onClick={handleIconClick}>
                    <img src={recherche} alt="search" />
                </div>
                <div className="input">
                    <input
                        type="search"
                        placeholder="             Rechercher"
                        id="mysearch"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
        </div>
    );
};
