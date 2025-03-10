import React, { useState } from 'react'
import "./Search.css"
import Metadata from '../layout/Metadata'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProducts } from '../../features/productSlice';

const Search = () => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const trimmedKeyword = keyword.trim();
        dispatch(getProducts({keyword: trimmedKeyword}))
        navigate(trimmedKeyword ? `/products/search/${encodeURIComponent(trimmedKeyword)}` : '/products');
    }
    return (
        <>
            <Metadata title="Search a product" />
            <form className='searchBox' onSubmit={searchSubmitHandler}>
                <input
                    type="text"
                    placeholder='Search a product'
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    autoFocus
                    aria-label='Search Products'
                />
                <button type='submit'>Search</button>
            </form>
        </>
    )
}

export default Search