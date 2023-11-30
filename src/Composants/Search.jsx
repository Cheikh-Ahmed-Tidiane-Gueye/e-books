import "./composant.css";

const Search = ({
  searchTerm,
  handleSearchChange,
  filterBooks,
  handleIconClick,
  isSearchActive,
}) => {
    const handleFilterChange = (e) => {
      console.log("New search term:", e.target.value);
    handleSearchChange(e); // Mettre à jour le searchTerm dans le parent
    filterBooks(e.target.value); // Appeler la fonction de filtrage avec la nouvelle valeur
  };

  return (
    <div
      className="contener-fluid d-flex justify-content-end align-items-center mx-4"
      data-aos="fade-down-right"
    >
      <div className={`search ${isSearchActive ? "active" : ""}`}>
        <div className="iconSearch" onClick={handleIconClick}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4478/4478006.png"
            alt="search"
          />
        </div>

        <div className="input">
          <input
            type="search"
            placeholder="Rechercher"
            id="mysearch"
            value={searchTerm}
            onChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
