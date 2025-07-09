'use Client'
import Link from 'next/link';

export const Header = () => {
  return (
    <header className='w-full h-16 bg-black flex justify-between items-center px-4'>
      <Link href="/" className='text-white mr-4'>
        Blog
      </Link>
      <Link href="/contact" className='text-white'>
        お問い合わせ
      </Link>
    </header>
  )
};