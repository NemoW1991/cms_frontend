import { Affix, Dropdown, Menu } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';
import styled from 'styled-components';
import storage from '../../lib/services/storage';

const SignIn = styled.li`
  @media screen and(min-width: 700px) {
    position: fixed;
    right: 6em;
  }
`;

export default function Header() {
  const router = useRouter();
  const isEvents = router.pathname.match(/events/i);
  const isGallery = router.pathname.match(/gallery/i);
  const isLogin = router.pathname.match(/login/i);
  const isSignUp = router.pathname.match(/signup/i);
  const foreDark = isLogin || isSignUp
  const dark = 'dark-header';
  const light = 'light-header';

  return (
    <>
      <Head>
        <link href="/style.css" type="text/css" rel="stylesheet"></link>
      </Head>

      <nav id="menu">
        <ul>
          <li className={isEvents ? 'current' : ''}>
            <Link href="/events">Courses</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
        </ul>
        <ul>
          <li className={isGallery ? 'current' : ''}>
            <Link href="/events">Students</Link>
          </li>
          <li>
            <Link href="/events">Teachers</Link>
          </li>
          <SignIn className={isLogin ? `current` : ''}>
            {!!storage?.userInfo ? (
              <Link href={`/dashboard/${storage?.userInfo.role}`}></Link>
            ) : (
              <Link href="/login">Sign in</Link>
            )

            }
          </SignIn>
        </ul>
      </nav>
      
    </>
  )
}