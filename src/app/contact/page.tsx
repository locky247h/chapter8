'use client'

import React, { useState } from "react";

// APIレスポンスの型
type ContactResponse = {
  message: string;
};

export default function Contact() {
  // ユーザーが入力した文字を保持する状態
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // エラー状態管理
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');

  //送信状態管理
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const valid = (): boolean => {
    let isValid = true;

    //名前のバリデーション
    if (!name) {
      setNameError('名前は必須です');
      isValid = false;
    } else if (name.length > 30) {
      setNameError('名前は30文字以内で入力してください');
      isValid = false;
    } else {
      setNameError('');
    }

    //メールのバリデーション
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email){
      setEmailError('メールアドレスは必須です');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError('有効なメールアドレスを入力してください');
      isValid = false;
    } else {
      setEmailError('');
    }

    // 本文のバリデーション
    if (!message) {
      setMessageError('本文は必須です');
      isValid = false;
    } else if (message.length > 500) {
      setMessageError('本文は500文字以内で入力してください');
      isValid = false;
    } else {
      setMessageError('');
    }

    if (!isValid) return false;

    return isValid;
  }

  //送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!valid()) return;

    setIsSubmitting(true);  //送信中フラグON
  
    try {
      const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, email, message })
      });

      const data: ContactResponse = await res.json();
      console.log(data.message);

      alert("送信しました！");
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error("送信に失敗しました", error);
      alert("送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);   //送信完了でOFFに戻す
    }
  };

  return(
    <div className="max-w-[800px] mx-auto py-8 px-4">
    <h1 className="text-xl font-bold mb-15">問い合わせフォーム</h1>
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* お名前 */}
      <div className="flex items-start">
        <label className="w-28 pt-2">お名前</label>
        <div className="flex-1 ml-10 pb-5">
          <input
            type="text"
            className="w-full border p-2 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          /> 
          {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
        </div> 
      </div>

      {/* メールアドレス */}
      <div className="flex item-start">
        <label className="w-28 pt-2">メールアドレス</label>
        <div className="flex-1 ml-10 pb-5">
          <input
          type="email"
          className="w-full border p-2 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>
      </div>

      {/* 本文 */}
      <div className="flex items-start">
        <label className="w-28 pt-2">本文</label>
        <div className="flex-1 ml-10 pb-5">
          <textarea
            className="w-full border p-2 rounded-md"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
          />
          {messageError && <p className="text-red-500 text-sm mt-1">{messageError}</p>}
        </div>
      </div>

      {/* ボタン */}
      <div className="flex space-x-4 justify-center pt-4">
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "送信中..." : "送信"}
        </button>
        <button
        type="button"
        className="bg-gray-300 text-black px-4 py-2 rounded-md"
        onClick={()=> {
          setName('');
          setEmail('');
          setMessage('');
        }}
        disabled={isSubmitting}
        >
          クリア
        </button>
      </div>
      </form>
  </div>
  );
}
