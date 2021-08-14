import React from 'react';
import { Select } from 'semantic-ui-react';

const Pagination = ({ postsPerPage, totalPosts, paginate, handleSelectRange }) => {



    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }


    const options = [
        { key: 10, value: 10, text: '10' },
        { key: 20, value: 20, text: '20' },
        { key: 30, value: 30, text: '30' },
    ]

    return (
        <nav>
            <Select
                options={options}
                defaultValue={10}
                style={{ minWidth: "4em" }}
                onChange={(e) => handleSelectRange(e.target.innerText)}
            />
            <ul className="pagination" style={{ float: 'right' }}>
                {pageNumbers.map(number => (
                    <li key={number} className="page-item" >
                        <a onClick={() => paginate(number)} className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>


    )
}

export default Pagination;