import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../common/components/Navbar'
import ProductInfo from './components/ProductInfo'
import Context from '../contexts/GlobalContext';
import { useCookieContext } from '../contexts/CookieContext';

function Cart() {
  const { orders } = useContext(Context);
  const [sum, setSum] = useState(0)
  const [groupedOrders, setGroupedOrders] = useState([])

  useEffect(() => {
    const groupedElements = orders.reduce((acc, curr) => {
        acc[curr.id] = acc[curr.id] || { id: curr.id, count: 0, totalPrice: 0 };
        acc[curr.id].count++;
        acc[curr.id].totalPrice += curr.price;
        return acc;
    }, {});

    const groupedOrdersArray = Object.values(groupedElements);

    const sum = groupedOrdersArray.reduce((total, order) => total + order.totalPrice, 0);

    setGroupedOrders(groupedOrdersArray);
    setSum(sum);
}, [orders]);

  return (
    <div className="md:px-20 lg:px-28">
      <Navbar></Navbar>
      <div className="mx-10 lg:mx-0">
        <h1 className="text-5xl font-semibold mt-[80px] mb-[40px]">CART</h1>
        <div className="border border-zinc-200 w-full mt-[75px]"></div>
        <div>
          {groupedOrders.length ? groupedOrders.map((productInfo) => (<ProductInfo id={productInfo.id} count={productInfo.count} key={productInfo.id} />)) : null}
        </div>
        <div className="flex flex-col text-2xl font-light">
          <label>Tax 18%: <span className="ml-2 font-bold"><span>$</span>{((sum / 100) * 18).toFixed(2)}</span></label>
          <label>Orders Count: <span className="ml-2 font-bold">{orders.length}</span></label>
          <label>Total: <span className="ml-2 font-bold"><span>$</span>{sum}</span></label>
        </div>
        <button className="bg-[#5ECE7B] active:bg-[#9ce9b1] my-9 text-white w-full max-w-[300px] py-4 font-medium">
          ORDER
        </button>
      </div>
    </div>
  )
}

export default Cart