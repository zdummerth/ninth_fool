import React, { useState } from 'react';
import Image from 'next/image';
import Price from './Price';
import { useCart } from '../context/CartContextProvider';
import { toast } from 'react-toastify';
import TrashIcon from './icons/Trash';
import LoadingDots from './ui/LoadingDots';

export default function LineItem({ lineItem }) {
  // console.log(lineItem)
  const { removeCartItems, updateCartItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSelectChange = async (e) => {
    const qtyInt = parseInt(e.target.value);
    try {
      setLoading(true);
      await updateCartItem([
        {
          id: lineItem.id,
          merchandiseId: lineItem.merchandise.id,
          quantity: qtyInt
        }
      ]);
    } catch (e) {
      console.log('error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await removeCartItems([lineItem.id]);
      toast.success('Item Deleted', {
        autoClose: 1500,
        closeOnClick: true
      });
    } catch (e) {
      console.log('error', e);
      setLoading(false);
    }
  };

  const { merchandise } = lineItem;
  const imgSrc = merchandise.image?.src;
  const availableForSaleArray = Array.from(Array(10).keys()).map((k) => k + 1);

  return (
    <div className="relative flex justify-between border rounded p-2">
      <div className="flex">
        <div className="relative w-24 h-24 mr-2">
          {imgSrc ? (
            <Image src={imgSrc} alt="test" layout="fill" objectFit="cover" />
          ) : (
            <div>No image uploaded</div>
          )}
        </div>
        <div className="flex-col">
          <div className="flex">
            <div className="pr-4">{merchandise.product.title}</div>

            <button onClick={handleDelete} disabled={loading} className="">
              <TrashIcon />
            </button>
          </div>
          {/* <div className="font-size-sm">{merchandise.title}</div> */}
          <div>
            <Price price={merchandise.priceV2.amount} />
          </div>
        </div>
      </div>

      <div className="">
        <div className="absolute bottom-3 right-3">
          {loading ? (
            <LoadingDots />
          ) : (
            <>
              {lineItem.merchandise.availableForSale && (
                <select
                  onChange={handleSelectChange}
                  defaultValue={lineItem.quantity}
                  name=""
                  id=""
                  className="bg-gray-900"
                  style={{
                    width: '70px'
                  }}
                >
                  {availableForSaleArray.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
