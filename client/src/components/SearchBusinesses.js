import React from 'react';

const SearchBusinesses = (props) => {
    return (
        <form className="form" onSubmit={(e) => {
            e.preventDefault();
        }}
        >
            <div className="form-group">
                <label>
                    term:
                    <br />
                    <input
                        ref={(node) => {
                            props.searchTerm(node)
                        }}
                        autoFocus
                    />
                </label>
            </div>
            <div className="form-group">
                <label>
                    location:
                    <br />
                    <input
                        ref={(node) => {
                            props.searchLocation(node)
                        }}
                        required
                    />
                </label>
            </div>
            <br />
            <br />
            <button className="button" type="submit">Search</button>
        </form>
    )
};

export default SearchBusinesses;