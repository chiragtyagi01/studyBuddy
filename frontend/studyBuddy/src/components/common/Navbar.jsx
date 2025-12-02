import React from 'react'
import { Link, matchPath, Route } from 'react-router-dom'
import { NavbarLinks } from '../../data/navbar-links'


function Navbar() {
    const matchRoute = (route) => {
        return matchPath({path:route},location.pathname);
    }
  return (
    <>
        <div className='flex h-14 items-center justify-center border-b border-b-richblack-700 px-4 '>
            <div className='flex w-[1540px] max-w-maxContent items-center justify-between'>
                <Link to='/'>
                    <h1 className='text-3xl font-bold text-white'>StudyBuddy</h1>
                </Link>
                <nav>
                    <ul className='flex gap-8 text-lg text-richblack-25'>
                        {
                           NavbarLinks.map( (link, index) =>(
                            <li key={index}>
                                {
                                    link.title === "Catalog" ? (
                                        <span className='cursor-not-allowed opacity-50'>{link.title}</span>
                                    ):(
                                        <Link to={link.path}>
                                            <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"} `}>
                                                {link.title}
                                            </p>
                                        </Link>

                                    )
                                }

                            </li>
                           )) 
                        }
                    </ul>
                </nav>

                <div >

                </div>
            </div>
        </div>
    </>
  )
}

export default Navbar