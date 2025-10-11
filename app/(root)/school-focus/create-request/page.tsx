'use client'
import Card from "@components/Card"
import Button from "@lib/Button"
import { dummyListing } from "@lib/constants"
import { useSearchParams } from "next/navigation"
import React from "react"

const CreateRequest = () => {
  const searchParams = useSearchParams()
  const isRentedRequest = useSearchParams().get("isRentedRequest")
  return (
    <>
      <h1 className="text-3xl font-bold text-center mx-auto mt-25 headersFont capitalize">
        Create a Request
      </h1>

      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center pb-10 pt-4 mt-6 gap-4">
        <div className="flex flex-col items-center justify-center mx-auto w-[50%] md:w-[50%] lg:w-[20%] p-4">
          <Card listing={dummyListing} blankSlate={true}/>
        </div>

        {/* requests container */}

        <div className="flex flex-col md:mr-auto gap-4 p-4 w-105 md:w-[50%] lg:w-[50%]  rounded-md bg-white dark:bg-gray-700/80 shadow-md">
          <h2 className="headersFont mb-4 px-4 text-lg">
            {isRentedRequest ? "Create a Roomate Request" : "Create a Co-Rent Request"}
          </h2>
          {isRentedRequest ? (
            // co-rent request
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="description"
                  className="font-semibold"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a description for your co-rent request"
                  className="resize-none h-30 p-2 border rounded-md"
                />
              </div>

              <Button
                type="submit"
                text="Submit Co-Rent Request"
                className="clickable darkblueBtn directional w-70 p-6 mx-auto"
              >
                {" "}
                {/* {isUpdating && <WhiteLoader />} */}
              </Button>
            </form>
          ) : (
            // roomate request
            <form>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="description"
                  className="font-semibold"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a description for your roomate request"
                  className="resize-none h-30 p-2 border rounded-md"
                />
              </div>

              <Button
                type="submit"
                text="Submit Roomate Request"
                className="clickable darkblueBtn directional w-70 p-6 mx-auto"
              >
                {" "}
                {/* {isUpdating && <WhiteLoader />} */}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default CreateRequest
