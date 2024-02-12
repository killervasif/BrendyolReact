import { useContext, useEffect, useState } from 'react'
import Context from '../../contexts/GlobalContext';

function ProductInfo({ data }) {
    const { orders, setOrders } = useContext(Context)

    function increment() {
        const updatedOrders = orders.map(order => {
            if (order.id === data.id) {
                const newQuantity = order.quantity + 1;
                return {
                    ...order,
                    quantity: newQuantity <= order.inventory ? newQuantity : order.quantity
                };
            }
        });
        setOrders(updatedOrders)
    }

    function decrement() {
        const updatedOrders = orders.map(order => {
            if (order.id === data.id) {
                const newQuantity = order.quantity - 1;
                return { ...order, quantity: newQuantity > 0 ? newQuantity : 0 };
            }
            return order;
        });

        const filteredOrders = updatedOrders.filter(order => order.quantity > 0);

        setOrders(filteredOrders);
    }

    useEffect(() => {
        if (data.quantity === 0)
            console.log("Temp")
    })

    return (
        <div>
            <div className="flex flex-col-reverse lg:flex-row justify-between">
                <div>
                    <h1 className="text-3xl font-semibold mt-5">{data.brand}</h1>
                    <h2 className="text-3xl font-light mt-2">{data.title}</h2>
                    <div className="mt-5">
                        <p className="text-[18px] font-bold">
                            <span>$</span>{data.price}
                        </p>
                    </div>
                    <div className="mt-5">
                        <p className="text-[18px] font-bold">SIZE:</p>
                        <div className="flex gap-3">
                        {data.size && data.size.map((size) =>
                            (<button className="border-[1.9px] border-zinc-900 py-2 w-[65px] hover:text-white hover:bg-black">
                                {size}
                            </button>))}
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className="text-[18px] font-bold">COLOR:</p>
                        <div className="flex gap-3">
                        {data.colors && data.colors.map((color) =>
                        (<button className="w-[32px] h-[32px] border-2 hover:border-[#5ECE7B]" style={{ backgroundColor: color }}></button>))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col-reverse gap-5 my-5 lg:my-5 lg:flex-row">
                    <div className="flex lg:flex-col h-full my-5 items-center justify-between">
                    <button onClick={()=>increment()} className="flex border order-3 lg:order-1 hover:text-white hover:bg-black border-zinc-900 text-3xl pb-2 justify-center items-center w-[45px] h-[45px]">
                        </button>
                        <p className="order-2">{data.quantity}</p>
                        <button onClick={() => decrement()} className="flex border order-1 lg:order-3 hover:text-white hover:bg-black border-zinc-900 text-3xl pb-2 justify-center items-center w-[45px] h-[45px]">
                            -
                        </button>
                    </div>
                    <div className="flex items-center order-1 lg:order-2 w-full lg:max-w-[250px] h-full my-3">
                        <img
                            className="object-fill w-full h-full"
                            src={data.gallery[0]}
                            alt="hehe"
                        />
                    </div>
                </div>
            </div>
            <div className="border border-zinc-200 w-full my-[25px] lg:mt-[40px]"></div>
        </div>
    );
}

export default ProductInfo