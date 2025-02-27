"use client";

import React from "react";
import { useState,useEffect } from "react";
import {
    collection,
    addDoc,
    getDocs,
    querySnapshot,
    query,
    onSnapshot,
    deleteDoc,
    doc,
  } from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  const [items, setItems] = useState([
    // { name: 'Coffee', price: 4.95 },
    // { name: 'Movie', price: 24.95 },
    // { name: 'candy', price: 7.95 },
  ])
  const [total, setTotal] = useState(0);
  const [newItem, setNewItem] = useState({name: '', price: ''})

  //add item to database
  const addItem = async (e) =>{
    e.preventDefault();
    try{
      if(newItem.name !== '' && newItem.price !== ''){
        // setItems([...items, newItem]);
          await addDoc(collection(db, "items"),{
          name: newItem.name.trim(),
          price: parseFloat(newItem.price)
        })
        setNewItem({name: '', price: ''});
        }
    } catch(error){
      console.error("adding data failed: ", error)
    }
  }
   //read items from database
    //查询 Firestore 数据 → query(collection(db, "items"))
    // 监听 Firestore 变化 → onSnapshot(q, callback)
    // 遍历 Firestore 数据 → querySnapshot.forEach(doc => {...})
    // 避免内存泄漏 → unsubscribe() 取消监听
  useEffect(()=> {
    //// 获取 Firestore "items" 集合
    const q = query(collection(db, "items"))
    const unsubscribe = onSnapshot(q, (querySnapshot)=> {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id: doc.id})
      })
      setItems(itemsArr);//// 更新 React 状态

      //read total from itemsArr
      //reduce() Round all the numbers and display the sum
      // parseFloat() parse string as number
      const calculateTotal = ()=> {
        const totalPrice = itemsArr.reduce((sum, item)=> sum +parseFloat(item.price), 0)
        setTotal(totalPrice)
      }
      calculateTotal()
      return ()=> unsubscribe();//// 组件卸载时取消监听
    })
  },[])

  //delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db,'items',id))
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 text-white'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
        <h1 className="text-4xl p-4 text-center text-black">Expense Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black bg-slate-900 ">
            <input
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              type="text"
              placeholder="Enter Items"
              value={newItem.name}
              className="col-span-3 p-3 border"
            />
            <input
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              type="number"
              placeholder="Enter $"
              value={newItem.price}
              className="col-span-2 p-3 border mx-3"
            />
            <button
            onClick={addItem}
            type="submit"
            className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
            >+</button>
          </form>
          <ul>
            {items.map((item,id) => (
              <li key={id} className="my-4 w-full flex justify-between bg-slate-950 hover:bg-slate-900">
                <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize'>{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <button
                    onClick={() => deleteItem(item.id)}
                    className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'>
                    X</button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (''): (
            <div className="flex justify-between p-3">
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
