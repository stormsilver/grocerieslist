// import { useState } from 'react';
// import { useDebounceCallback } from 'usehooks-ts';

export const Search = ({ onSearch, searchTerm }) => {
  // const [searchTerm, setSearchTerm] = useState('');
  // const performSearch = useDebounceCallback(onSearch, 250);

  const handleSearch = (e) => {
    const { value } = e.target;
    // setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    // setSearchTerm('');
    onSearch('');
  };

  const renderClearButton = () => {
    if (searchTerm.length === 0) return null;

    return (
      <button className="btn btn-outline-secondary" type="button" onClick={clearSearch}>
        <i className="bi bi-x-circle" />
      </button>
    );
  };

  return (
    <div className="input-group">
      <input
        type="search"
        className="form-control"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {renderClearButton()}
    </div>
  );
};
