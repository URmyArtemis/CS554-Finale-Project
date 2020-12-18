import React from 'react';

const SearchBusinesses = (props) => {
    let term;
    let location;

    return (
        <form className="form" onSubmit={(e) => {
            e.preventDefault();
            props.searchTerm(term.value);
            props.searchLocation(location.value);
        }}
        >
            <div className="form-group" align="center">
                <label>
                    term:
                    <br />
                    <input ref={(node) => term = node} autoFocus />
                </label>
            </div>
            <div className="form-group" align="center">
                <label>
                    location:
                    <br />
                    <input
                        ref={(node) => location = node} required />
                </label>
            </div>
            <br />
            <br />
            <button className="button" type="submit"  >Search</button>
        </form>
    )
};

export default SearchBusinesses;