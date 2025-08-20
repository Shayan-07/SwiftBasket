import React from 'react'
import ProductsTable from '../../components/productsTable'

const Products = () => {
    return (
        <section className="productsList">
            <div className="wrapper">
                <div className="productsTable py-10">
                    <ProductsTable />
                </div>
            </div>
        </section>
    )
}

export default Products
