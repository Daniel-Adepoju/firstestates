"use client"

import { ChevronDownCircle } from "lucide-react"

export default function SortFilters({
  sortOptions,
  sortValues,
  setSortValues,
  confirmSortValues,
  setConfirmSortValues,
  isSortOpen,
  setIsSortOpen,
  selectedSortOpen,
  openSelectOption,
}: any) {
  return (
    <>
      {/* Sort header */}
      <div
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="flex justify-between items-center text-gray-500 dark:text-gray-300 cursor-pointer bg-white dark:bg-darkGray  w-100 border border-gray-300 dark:border-gray-500 p-3 rounded-lg font-semibold"
      >
        Sort
        <ChevronDownCircle
          className={`transition-transform duration-300 ${isSortOpen ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      {/* Sort dropdown */}

      {isSortOpen && (
        <div
          className="
          w-full
          grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-6
          dark:bg-darkGray text-foreground border border-gray-300 dark:border-gray-500 p-3 rounded-lg
        "
        >
          {sortOptions.map(({ label, key, options }: any, index: number) => (
            <div
              key={key}
              className="w-full flex flex-col items-center gap-4 mb-2"
            >
              <span
                onClick={() => openSelectOption(index)}
                className="font-medium cursor-pointer px-8 py-2 rounded-lg bg-gray-500/20 flex items-center gap-2"
              >
                {label}
                <ChevronDownCircle
                  className={`transition-transform duration-200 ${
                    selectedSortOpen.includes(Number(index)) ? "rotate-180" : "rotate-0"
                  }`}
                />
              </span>

              {selectedSortOpen.includes(Number(index)) && (
                <div className="flex flex-col justify-start items-center gap-4 bg-gray-500/20 p-4 rounded-lg w-[90%] md:w-full">
                  {options.map((option: any) => (
                    <label
                      key={option}
                      className=" capitalize inline-flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={key}
                        value={option}
                        className="peer hidden"
                        onChange={(e) =>
                          setSortValues((prev: any) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        checked={sortValues[key] === option}
                      />

                      <span
                        className="
                      h-4 w-4 rounded-full border border-gray-400 
                      peer-checked:border-purple-500 peer-checked:gold-gradient
                      transition-all duration-200
                    "
                      ></span>

                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              setIsSortOpen(false)
              setConfirmSortValues(sortValues)
            }}
            className="px-4 py-2.5 darkblue-gradient text-white rounded-xl w-55
             mx-auto col-span-full dark:outline-1 dark:outline-black smallScale"
          >
            Apply
          </button>
        </div>
      )}
    </>
  )
}
