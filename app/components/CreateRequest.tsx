"use client"
import Card from "@components/Card"
import Button from "@lib/Button"
import { useSearchParams } from "next/navigation"
import { useGetSingleListing } from "@lib/customApi"
import { WhiteLoader } from "@utils/loaders"
import { useState } from "react"
import { Slider } from "./ui/slider"
import { Calendar } from "./ui/calendar"
import { DatePicker } from "./DatePicker"
import { formatNumber } from "@utils/formatNumber"

type InputConfig = {
  elementType: "input" | "textarea" | "Calendar"
  name: string
  className?: string
  type?: string
  placeholder?: string
  function?: (e: any) => void
}

const CreateRequest = ({ requestType }: { requestType: "co-rent" | "roommate" }) => {
  const searchParams = useSearchParams()
  const listingId = searchParams.get("listing")
  const { data: listing, isLoading } = useGetSingleListing(listingId as string)
  const [isDatePlaceHolder, setIsDatePlaceHolder] = useState(true)
  const [inputValues, setInputValues] = useState({
    description: "",
    budget: "",
    moveInDate: "",
    expirationDate: new Date(),
    preferredGender: new Date(),
  })

  if (isLoading) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInputValues({
      ...inputValues,
      [name]: value,
    })
  }

  const inputConfigs = [
    // desc
    {
      elementType: "textarea",
      label: "Description",
      name: "description",
      type: "textarea",
      placeholder:
        requestType === "co-rent"
          ? "Enter a description for your co-rent request"
          : "Enter a description for your roommate request",
      className: "resize-none h-30 p-2 border rounded-md",
      function: handleInputChange,
    },
    //  budget
    {
      elementType: "Slider",
      label: "Your Budget",
      name: "budget",
      min: 0,
      max: listing?.post.price / 2,
      placeholder: "Enter your budget",
      className: `w-full  border rounded-md
                  [&_[role=slider]]:bg-[#0874c7]
            [&_[role=slider]]:dark:bg-[#A88F6E]
            [&>span:first-child]:bg-white
            [&_[role=slider]]:border-gray-200
            [&_[data-state=active]]:ring-gray-200"
      `,
      function: handleInputChange,
    },
    //   move in date
    requestType === "co-rent" && {
      elementType: "Calendar",
      label: "Preferred Move-In Date",
      name: "moveInDate",
      type: "date",
      placeholder: "Select your preferred move-in date",
      className: "w-full border rounded-md py-5.5",
      function: handleInputChange,
    },
    //   expiration date
    {
      elementType: "Calendar",
      label: "Expiration Date",
      name: "expirationDate",
      type: "date",
      placeholder: "Select when this request should expire",
      className: "w-full  border rounded-md py-5.5",
      function: handleInputChange,
    },
  ].filter(Boolean)

  const selectConfig = [
    {
      label: "Preferred Gender",
      name: "preferredGender",
      options: [
        { value: "", label: "No preference" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "nonbinary", label: "Non-binary" },
      ],
      className: "dark:bg-gray-600 w-full border rounded-sm p-2 py-2.5",
      function: handleInputChange,
    },
  ]

  return (
    <>
      <h1 className="text-3xl font-bold text-center mx-auto mt-25 headersFont capitalize">
        {requestType === "roommate" ? "Make Roomate Request" : "Make a Co-Rent Request"}
      </h1>

      <div className=" mx-auto w-[96%] flex flex-col-reverse md:flex-row-reverse lg:flex-row items-center justify-center pb-10 pt-4 mt-6 gap-4 md:gap-3">
        <div className="flex flex-col items-center justify-center w-[50%] md:w-[31%] lg:w-[35%] md:pr-20 lg:pr-14 p-4">
          <Card
            listing={listing?.post}
            blankSlate={true}
          />
        </div>

        {/* requests container */}

        <div className=" border-1 border-gray-500/30 dark:border-black flex flex-col md:mr-auto gap-4 p-4 w-[98%] md:w-[58%] lg:w-[60%] rounded-md bg-white dark:bg-gray-800/10 shadow-md">
          <h2 className="headersFont mb-4 px-4 text-lg">
            {requestType === "roommate" ? "Create a Roomate Request" : "Create a Co-Rent Request"}
          </h2>

          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* inputs */}
            {/* <div className=" w-full flex flex-col gap-4"> */}
            {inputConfigs.map((input: any) => (
              <div
                key={input.name}
                className={`flex flex-col gap-1 ${input.type === "textarea" && "md:col-span-2"}`}
              >
                <label
                  htmlFor={input.name}
                  className="font-semibold col-span-9"
                >
                  {input.label}
                </label>
                {(input.elementType === "input" || input.elementType === "textarea") && (
                  <input.elementType
                    onChange={input.function}
                    id={input.name}
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                    className={`${input.className} ${
                      input.elementType !== "textarea" && "p-2 py-2.5"
                    }`}
                  />
                )}

                {input.elementType === "Slider" && (
                  <>
                    <Slider
                      min={input.min}
                      max={input.max}
                      name={input.name}
                      className={input.className}
                      onChange={input.function}
                    />
                    <div>
                      &#8358;{Number(inputValues["budget"]).toLocaleString()}/&#8358;
                      {formatNumber(listing?.post.price)}
                    </div>
                  </>
                )}
              
                {input.elementType === "Calendar" && (
                 
                <DatePicker 
                   // @ts-ignore
                    date={inputValues[input.name]}
                    setDate={(date: Date) => {
                      setInputValues({
                        ...inputValues,
                        [input.name]: date.toLocaleDateString("en-CA").split("T")[0],
                      })
                      setIsDatePlaceHolder(false)
                    }}
                    placeholder={isDatePlaceHolder ? input.placeholder : ""}
                    className={input.className}
                  />
                )}
              </div>
            ))}
            {/* </div> */}

            {/* selects */}

            {selectConfig.map((select: any) => (
              <div
                key={select.name}
                className="flex flex-col gap-1"
              >
                <label
                  htmlFor={select.name}
                  className="font-semibold"
                >
                  {select.label}
                </label>
                <select
                  id={select.name}
                  name={select.name}
                  className={select.className}
                  onChange={select.function}
                >
                  {select.options.map((option: any) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <Button
              type="submit"
              text={`Submit ${requestType === "roommate" ? "Roomate Request" : "Co-Rent Request"}`}
              className="self-end  md:col-span-2 justify-self-center place-self-center clickable darkblueBtn directional w-70 p-6 mx-auto"
            >
              {/* {isUpdating && <WhiteLoader />} */}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateRequest
