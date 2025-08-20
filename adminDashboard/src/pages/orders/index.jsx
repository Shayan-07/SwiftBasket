import React from 'react'
import OrdersTable from '../../components/ordersTable'

const Orders = () => {
    return (
        <section className="orders">
            <div className="wrapper">
                <div className="ordersTable pt-10">
                    <OrdersTable />
                </div>
            </div>
        </section>
    )
}

export default Orders
