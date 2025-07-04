"use client";

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';

interface DropdownProps {
  userName: string;
}

const Dropdown: React.FC<DropdownProps> = ({ userName }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(true);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  const handleScroll = useCallback(() => {
    closeDropdown();
  }, [closeDropdown]);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [dropdownOpen, handleClickOutside, handleScroll]);

  const handleSignOut = async () => {
    try {
      // Call your Express logout endpoint
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      // If success, remove local storage or any other client storage
      if (res.ok) {
        localStorage.removeItem("token_FrontEnd");
        localStorage.removeItem("userName");

        // Optionally remove non-HttpOnly cookies if you have them:
        document.cookie = "token_FrontEnd=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Reload or redirect
        window.location.reload();
      } else {
        console.error("Logout error:", await res.text());
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    }
  };

  return dropdownOpen ? (
    <div
      ref={dropdownRef}
      className="flex flex-col w-[200px] max-md:w-[180px] border-[#15335D] border-4 rounded-lg bg-white z-30"
    >
      <div className="px-4 py-2 text-sm text-gray-900">
        <div className="font-bold">{userName}</div>
      </div>
      <div className="border-t border-gray-100"></div>
      <Link
        href="/settings"
        className="block px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white"
      >
        Paramètres
      </Link>
      <Link
        href="/orderhistory"
        className="block px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white"
      >
        Historique des achats
      </Link>
      <Link
        href="#"
        className="block px-4 py-2 text-sm text-primary hover:bg-primary hover:text-white"
        onClick={(e) => {
          e.preventDefault();
          handleSignOut();
        }}
      >
        se déconnecter
      </Link>
    </div>
  ) : null;
};

export default Dropdown;
