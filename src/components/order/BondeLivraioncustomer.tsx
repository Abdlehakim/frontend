@ -1,535 +0,0 @@
"use client"
import Image from 'next/image';
import React, { Key, useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner';
import { useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



// Define interfaces
interface Address {
  _id: string;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

interface OrderItem {
  _id: Key | null | undefined;
  refproduct:string;
  product: string;
  name: string;
  tva: number;
  quantity: number;
  image: string;
  discount: number;
  price: number;
}

interface Order {
  _id: string;
  user: User;
  ref: string;
  address: Address;
  orderItems: OrderItem[];
  paymentMethod: string;
  deliveryCost:number;
  total: number;
  orderStatus: string;
  statustimbre:boolean;
  createdAt:string
}
interface User{
  username:string
  phone:number
}
interface websiteinfo {
  name: string;
  address:string;
  city:string;
  zipcode:string;
  governorate:string
  logoUrl:string;
  email:string;
  phone:number;
}

const BondeLivraioncustomer=()=>{
  const params = useParams() as { id: string }; // Explicitly type the params object
  const [order, setOrder] = useState<Order | null>(null); 
    const [loading, setLoading] = useState(true);
     const [webinfo,setwebinfo]=useState<websiteinfo>();
      const fetchCompanyinfo =  async () => {
        try {
          const response = await fetch(`/api/websiteinfo/getwebsiteinfo`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error('Error fetching websiteinfo data');
          }
          
          const data = await response.json();
          setwebinfo(data);
        } catch (error) {
          console.error('Error fetching company data:', error);
        }finally{
          setLoading(false);
        }
      }

    useEffect(() => {
      // Fetch category data by ID
      const fetchOrderData = async () => {
        try {
          const response = await fetch(`/api/order/getorderbyref/${params.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch order data');
          }
    
          const data = await response.json();
          setOrder(data);
          setLoading(false);
    
        } catch (error) {
          console.error("Error fetching order data:", error);
        }
      };
      fetchCompanyinfo();
      fetchOrderData();
     
    }, [params.id]);

    const handlePrint = () => {
      const content = document.getElementById('invoice-content');
  if (content) {
    
    html2canvas(content ).then((canvas) => {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const pdfHeight = 297; // A4 height in mm
      const totalPages = Math.ceil(imgHeight / pdfHeight);

      // Add pages and content
      for (let page = 0; page < totalPages; page++) {
        const yOffset = -page * pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
        if (page < totalPages - 1) {
          pdf.addPage();
        }
      }

      // Save the PDF and open it in a new window
      const pdfOutput = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfOutput);
      window.open(pdfUrl);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
  } else {
    console.error('Invoice content is not found');
  }
  };

   const generatePDF = () => {
  const content = document.getElementById('invoice-content');
  if (content) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Use html2canvas to render the content
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Calculate image size in mm
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;

      // Calculate the total number of pages needed
      const pdfHeight = 297; // A4 height in mm
      const totalPages = Math.ceil(imgHeight / pdfHeight);

      // Add pages and content
      for (let page = 0; page < totalPages; page++) {
        const yOffset = -page * pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
        if (page < totalPages - 1) {
          pdf.addPage();
        }
      }

      // Save the PDF
      pdf.save(`INVOICE-${order?.ref.replace('ORDER-', '')}.pdf`);
    });
  } else {
    console.error('Invoice content is not found');
  }
  };
  let ItemsPrice = 0;
  let total = 0;
  let totaltva = 0;
  // Loop through all items in the invoice and calculate their total price
  order?.orderItems.forEach((item) => {
    const discountedPrice = item.price * (1 - item.discount / 100);
    const totalpricetva = discountedPrice * item.quantity;
    totaltva += totalpricetva;
    const priceAfterTax = discountedPrice / (1 + item.tva / 100);
    const totalItemPrice = priceAfterTax * item.quantity; // Multiply by quantity
    total += totalItemPrice;
    const totalPrice = item.price * item.quantity; // Multiply by quantity
    ItemsPrice += totalPrice; // Add to the total of all items
  });

  // Add delivery cost to the total
  const Totalbrut = ItemsPrice;
  const Totalremise = ItemsPrice - total;
  const totaltvas = totaltva - total;
    
if(!order){
    <div>no data</div>
}
if (loading) {
  return <LoadingSpinner />;
}
  return (
<div className="max-w-[200rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
  <div className="sm:w-11/12 lg:w-3/4 mx-auto">

    <div   id="invoice-content" className="flex flex-col p-4 sm:p-10 bg-white  rounded-xl dark:bg-neutral-800">

        <div className="flex justify-between">
             <div>
             <Image src={webinfo?.logoUrl?? '/default-image.jpg'} alt='logo' width={200} height={200} className='bg-primary'/>
               <h1 className="mt-2 text-lg md:text-xl font-semibold text-primary dark:text-white">{webinfo?.name}.inc</h1>
             </div>
       
     
             <div className="text-end">
               <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-neutral-200">Bonde Livraison  #</h2>
               <span className="mt-1 block text-gray-500 dark:text-neutral-500">{order?.ref.replace('ORDER-', '')}</span>
     
               <p className="mt-4 not-italic text-gray-800 dark:text-neutral-200 border p-2 rounded-md">
                 {webinfo?.address} {webinfo?.city}<br/>
                 {webinfo?.governorate} {webinfo?.zipcode}<br/>
                 {webinfo?.phone}<br/>
               </p>
             </div>
       
           </div>
   


      <div className="mt-8 grid sm:grid-cols-2 gap-[12px]">
        <div className=' border border-gray-200 p-2 rounded-md'>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Facturer à:</h3>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 uppercase">{order?.user.username}</h3>
          <span className="mt-2 not-italic text-gray-500 dark:text-neutral-500">
            {order?.address.address}<br/>
           {order?.address.city}, OR {order?.address.zipcode},<br/>
           {order?.address.governorate}<br/>
          </span>
        </div>
   

        <div className="sm:text-end space-y-2">
      
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-[12px] sm:gap-[8px]">
            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Date:</dt>
              <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }) : 'No date available'}</dd>
            </dl>
           
          </div>
    
        </div>
 
      </div>



      <div className="mt-6">
        <div className="border border-gray-200 p-4 rounded-lg space-y-4 dark:border-neutral-700">
        <div className="hidden sm:grid sm:grid-cols-10">
              <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Ref
                </div>
                <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Désignation
                </div>
                <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Qty
                </div>
                <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                  PU Brut
                </div>
                <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Rem
                </div>
                <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                  PU HT
                </div>
                <div className="text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Prix Tot.HT
                </div>
                <div className="text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                  Tva
                </div>
              </div>

          {order?.orderItems.map((item, index) => (
  <div key={index} >
    <div className="hidden sm:block border-b border-gray-200 dark:border-neutral-700"></div>
    <div className="grid grid-cols-10 sm:grid-cols-10 gap-[8px] ">
                  <div className="col-span-full sm:col-span-2">
                      <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                      ref
                      </h5>
                      <span className="font-medium text-gray-800 dark:text-neutral-200">
                        {item.refproduct}
                      </span>
                    </div>
                    <div className="col-span-full sm:col-span-2">
                      <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                      Désignation
                      </h5>
                      <span className="font-medium text-gray-800 dark:text-neutral-200">
                        {item.name}
                      </span>
                    </div>
                    <div>
                      <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                        Qty
                      </h5>
                      <span className="text-gray-800 dark:text-neutral-200">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                        PU Brut
                      </h5>
                      <span className="text-gray-800 dark:text-neutral-200">
                        {(item.price / (1 + item.tva / 100)).toFixed(3)} TND
                      </span>
                    </div>
                    <div>
                      <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                        Rem
                      </h5>
                      <span className="text-gray-800 dark:text-neutral-200">
                        {item.discount}%
                      </span>
                    </div>
                    <div>
                      <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                        PU HT
                      </h5>
                      <span className="text-gray-800 dark:text-neutral-200">
                        {item.discount != null && item.discount > 0 ? (
                          <span>
                            {(
                              (item.price -
                                (item.price * item.discount) / 100) /
                              (1 + item.tva / 100)
                            ).toFixed(3)}{" "}
                            TND
                          </span>
                        ) : (
                          <span>
                            {(item.price / (1 + item.tva / 100)).toFixed(3)} TND
                          </span>
                        )}
                      </span>
                    </div>
                    <div>
                      <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                        Prix Tot.HT{" "}
                      </h5>
                      <span className="sm:text-end text-gray-800 dark:text-neutral-200">
                        {" "}
                        {item.discount != null && item.discount > 0
                          ? // If discount exists, calculate the discounted price multiplied by the quantity
                            (
                              ((item.price -
                                (item.price * item.discount) / 100) *
                                item.quantity) /
                              (1 + item.tva / 100)
                            ).toFixed(3)
                          : // If no discount, simply multiply the price by the quantity
                            (
                              (item.price * item.quantity) /
                              (1 + item.tva / 100)
                            ).toFixed(3)}{" "}
                        TND
                      </span>
                    </div>
                    <div>
                      <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                        Tva
                      </h5>
                      <span className="sm:text-end text-gray-800 dark:text-neutral-200">
                        {item.tva}%
                      </span>
                    </div>
                  </div>
  </div>
))}

        
        

        
          
        </div>
      </div>

      <div className="flex justify-end">
            <div className="mt-8 flex sm:justify-end  border border-gray-200  p-2 rounded-md">
              <div className="w-full max-w-2xl sm:text-end space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-[12px] sm:gap-[8px]">
                  <div className="grid sm:grid-cols-5 gap-x-3">
                    <div className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200 justify-start flex">
                      Total Brut:
                    </div>
                    <div className="col-span-2 text-gray-500 dark:text-neutral-500">
                      {Totalbrut} TND
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-5 gap-x-3">
                    <div className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200 justify-start flex">
                      Total Remise:
                    </div>
                    <div className="col-span-2 text-gray-500 dark:text-neutral-500 ">
                      {Totalremise.toFixed(3)} TND
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-5 gap-x-3">
                    <div className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200 justify-start flex">
                      Total HT:
                    </div>
                    <div className="col-span-2 text-gray-500 dark:text-neutral-500">
                      {total.toFixed(3)} TND
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex sm:justify-end pl-2">
              <div className="w-full max-w-2xl sm:text-end space-y-2 border border-gray-200 p-2 rounded-md">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-[12px] sm:gap-[8px]">
                  <dl className="grid sm:grid-cols-5 gap-x-3">
                    <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200 justify-start flex">
                      TVA:
                    </dt>
                    <dd className="col-span-2 text-gray-500 dark:text-neutral-500">
                      {" "}
                      {totaltvas.toFixed(3)} TND
                    </dd>
                  </dl>
                  <dl className="grid sm:grid-cols-5 gap-x-3">
                    <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200 justify-start flex">
                    Frais de livraison:
                    </dt>
                    <dd className="col-span-2 text-gray-500 dark:text-neutral-500">
                      {order?.deliveryCost
                        ? Number(order.deliveryCost).toFixed(3)
                        : "0.000"}{" "}
                      TND
                    </dd>
                  </dl>
                  <dl className="grid sm:grid-cols-5 gap-x-3">
                    <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200 justify-start flex">
                   Timbre Fiscale:
                    </dt>
                    <dd className="col-span-2 text-gray-500 dark:text-neutral-500">
                    {order?.statustimbre === true ? "1.000 TND" : "0.000 TND"}

                    </dd>
                  </dl>
                  {/*
            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Total:</dt>
              <dd className="col-span-2 text-gray-500 dark:text-neutral-500">$2750.00</dd>
            </dl>

            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Tax:</dt>
              <dd className="col-span-2 text-gray-500 dark:text-neutral-500">$39.00</dd>
            </dl> */}

                  <dl className="grid sm:grid-cols-5 gap-x-3">
                    <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200 uppercase justify-start flex">
                      net:
                    </dt>
                    <dd className="col-span-2 text-gray-500 dark:text-neutral-500">
                    {( (order?.total || 0) ).toFixed(3)} TND
                    </dd>
                  </dl>

                  {/*  <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Due balance:</dt>
              <dd className="col-span-2 text-gray-500 dark:text-neutral-500">$0.00</dd>
            </dl> */}
                </div>
              </div>            
            </div>          
          </div>
      
    </div>
<div className='flex gap-[8px] justify-between'>
    <div className="mt-6 flex justify-s gap-x-3">
    <button onClick={()=>history.back()} type='button' className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#1C274C"  />
<path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C"  />
</svg>
       close
      </button>
    </div>
    <div className="mt-6 flex justify-end gap-x-3">
      
      <button onClick={  generatePDF} type='button' className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" >
      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
      Bon de Livraison PDF
      </button>
      <button onClick={ handlePrint} type='button'  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary text-white hover:bg-[#15335E] focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" >
        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   ><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
        Print
      </button>
    </div>
    </div>
  </div>
</div>

 
  );
};

export default BondeLivraioncustomer;