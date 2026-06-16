"use client";

import { useState, useEffect, useRef } from "react";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  layout?: "header" | "hero";
  searchable?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  layout = "hero",
  searchable = true,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto focus input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isHero = layout === "hero";

  return (
    <div ref={dropdownRef} className="relative w-full text-left">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white text-gray-700 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 flex justify-between items-center cursor-pointer select-none transition-all ${
          isHero
            ? "p-4 rounded-lg font-medium text-base"
            : "px-3 py-1.5 rounded text-sm max-w-xs"
        }`}
      >
        <span className={`truncate ${value ? "text-gray-900" : "text-gray-400"}`}>
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 ml-2 text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown container */}
      {isOpen && (
        <div
          className="absolute z-[100] mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden flex flex-col w-full left-0 min-w-[200px]"
        >
          {/* Search bar inside the dropdown */}
          {searchable && (
            <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400 shrink-0 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400 py-1"
                placeholder="Type to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded text-xs font-bold transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Options list */}
          <div className="overflow-y-auto max-h-56 divide-y divide-gray-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex justify-between items-center ${
                    value === option ? "bg-red-50 text-red-600 font-semibold" : ""
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {value === option && (
                    <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
