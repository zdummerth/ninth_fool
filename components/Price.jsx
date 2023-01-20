import React from 'react'
// import { Dollar } from '@styled-icons/boxicons-regular'


const Price = ({ price = '' }) => {
    return (
        <div className='price flex fai-c'>
            {/* <Dollar size={18} /> */}
            <div>$</div>
            <div>{`${parseFloat(price).toFixed(2)}`}</div>
        </div>
    )
}

export default Price