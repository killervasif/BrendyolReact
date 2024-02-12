import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../common/components/Navbar'
import { useParams } from 'react-router-dom'
import Context from '../contexts/GlobalContext';

function Product() {
    const { getProductById } = useContext(Context)
    const { id } = useParams();
    const { addProductToOrder } = useContext(Context)
    const [product, setProduct] = useState({});
    const [activeIMG, setActiveIMG] = useState('');

    const configureProduct = async () => {
        const p = await getProductById(id)
        console.log(p)
        setProduct(p);
        console.log(product)
    }

    useEffect(() => {
        configureProduct()
    }, [])

    useEffect(() => {
        if (product && product.gallery && product.gallery.length) {
            setActiveIMG(product.gallery[0]);
        }
    }, [product]);

    return (
        <div className='md:px-20 lg:px-28'>
            <Navbar></Navbar>
            <div className="flex flex-col justify-start gap-14 lg:flex-row mt-[80px] ">
                <div className="flex lg:flex-col mx-14 lg:mx-0 order-2 lg:order-1 gap-[30px]">
                    {product.gallery && product.gallery.map((src) =>
                    (<div onClick={() => setActiveIMG(src)} className="border border-transparent hover:border-zinc-300 hover:shadow-xl hover:shadow-slate-600 w-[90px] h-[90px]">
                        <img
                            className="object-cover w-full h-full"
                            src={src}
                            alt="hehe"
                        />
                    </div>))}
                </div>
                <div className="flex justify-start px-4 order-1 lg:order-2 w-full max-w-[800px] h-[600px]">
                    <img
                        className="object-fill lg:object-cover w-full h-full"
                        src={activeIMG}
                        alt="product IMG"
                    />
                </div>
                <div className="flex flex-col mx-14 lg:mx-0 order-3">
                    <h1 className="text-3xl font-semibold">{product.brand}</h1>
                    <h2 className="text-3xl font-light">{product.title}</h2>
                    <div className="mt-10">
                        <p className="text-[18px] font-bold">SIZE:</p>
                        <div className="flex gap-3">
                            {product.size && product.size.map((size) =>
                            (<button className="border-[1.9px] border-zinc-900 py-2 w-[65px] hover:text-white hover:bg-black">
                                {size}
                            </button>))}
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className="text-[18px] font-bold">COLOR:</p>
                        <div className="flex gap-3">
                            {product.colors && product.colors.map((color) =>
                                (<button className="w-[32px] h-[32px] border-2 hover:border-[#5ECE7B]" style={{ backgroundColor: color }}></button>))}
                        </div>
                    </div>
                    <div className="mt-10">
                        <p className="text-[18px] font-bold">PRICE:</p>
                        <p className="text-[18px] font-bold mt-3">
                            <span>$</span>{product.price}
                        </p>
                    </div>
                    <div className="mt-10">
                        <button onClick={() => {
                            addProductToOrder(product);
                        }} className="bg-[#5ECE7B] text-white w-full max-w-[300px] py-4 font-medium">
                            ADD TO CART
                        </button>
                    </div>
                    <div className="mt-10">
                        <p className="w-full max-w-[300px] font-medium">
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product
