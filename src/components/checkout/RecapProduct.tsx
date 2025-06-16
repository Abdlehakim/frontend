import Image from "next/image";
import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoCheckboxOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

interface RecapProductProps {
  items: CartItem[];
  incrementHandler(item: CartItem): void;
  decrementHandler(item: CartItem): void;
  removeCartHandler(_id: string): void;
}

interface CartItem {
  _id: string;
  name: string;
  ref: string;
  tva?: number;
  price: number;
  imageUrl?: string;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  quantity: number;
}

const RecapProduct: React.FC<RecapProductProps> = ({
  items,
  incrementHandler,
  decrementHandler,
  removeCartHandler,
}) => {
  
  return (
    <div className="w-[70%] h-fit">
      {items.length > 0 ? (
        <div className="flex flex-col gap-[8px]">
          {items.map((item) => (
            <div key={item._id} className="flex justify-around gap-[16px] bg-gray-100 p-4 rounded-md">
                <div className="w-[20%]">
                  <Image
                    className="rounded-lg"
                    src={item.imageUrl || "/path/to/default-image.jpg"}
                    alt={item.name}
                    width={150}
                    height={150}
                  />
                </div>
                <div className="flex flex-col justify-center w-[40%]">
                  <div className="flex flex-col gap-[8px]">
                    <div className="flex gap-[8px]">
                      <p className="text-xl">{item.name}</p>
                      <p>{item.ref}</p>
                    </div>
                    <p>{item.color}</p>

                    <p>
                      {item.discount != null && item.discount > 0 ? (
                        <>
                          {(
                            item.price -
                            (item.price * item.discount) / 100
                          ).toFixed(2)}{" "}
                          TND
                        </>
                      ) : (
                        <>{item.price.toFixed(2)} TND</>
                      )}
                    </p>
                    <div className="flex gap-[8px]">
                      <p className="text-gray-400 font-bold flex items-center gap-[8px]">
                        <IoCheckboxOutline size={25} />{" "}
                      </p>
                      <p className="uppercase font-bold">
                        {item.status || "Status not specified"}
                      </p>
                    </div>
                  </div>
              </div>
              <div className="flex justify-center items-center w-[20%]">
                  <p className="py-2 px-8 border-2 rounded-l-lg w-20">
                    {item.quantity}
                  </p>

                  <div className="border-t-2 border-r-2 border-b-2 py-1 px-2 rounded-r-lg">
                    <IoIosArrowUp
                      className="cursor-pointer"
                      onClick={() => incrementHandler(item)}
                    />
                    <IoIosArrowDown
                      className="cursor-pointer"
                      onClick={() => decrementHandler(item)}
                    />
                  </div>
                </div>
              <div className="flex justify-center items-center w-[20%]">
                <p>
                  {item.discount != null && item.discount > 0 ? (
                    <>
                      {(item.price - (item.price * item.discount) / 100) *
                        item.quantity}{" "}
                      TND
                    </>
                  ) : (
                    <>{item.price * item.quantity} TND</>
                  )}
                </p>
              </div>
              <div className=" flex justify-end w-[10%]">
                <RxCross1
                  className="cursor-pointer"
                  onClick={() => removeCartHandler(item._id)}
                  size={35}
                />
              </div>
            </div>
            
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y-2 items-center"> No iteams
        </div>
      )}
    </div>
  );
};

export default RecapProduct;
