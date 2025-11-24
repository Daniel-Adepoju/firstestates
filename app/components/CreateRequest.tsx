"use client"
import Card from "@components/listing/Card"
import Button from "@lib/Button"
import { useSearchParams } from "next/navigation"
import { useGetSingleListing } from "@lib/customApi"
import { useRouter } from "next/navigation"
import { WhiteLoader } from "@utils/loaders"
import { useState } from "react"
import { Slider } from "./ui/slider"
import { DatePicker } from "./DatePicker"
import { formatNumber } from "@utils/formatNumber"
import { useMutation } from "@tanstack/react-query"
import { axiosdata } from "@utils/axiosUrl"
import { useToast } from "@utils/Toast"

type InputConfig = {
  elementType?: "input" | "textarea" | "Calendar"
  name?: string
  className?: string
  type?: string
  placeholder?: string
  requestType?: "co-rent" | "roommate"
  function?: (e: any) => void
}

const CreateRequest = ({ requestType }: { requestType: "co-rent" | "roommate" }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setToastValues } = useToast()
  const listingId = searchParams.get("listing")
  const { data: listing, isLoading } = useGetSingleListing(listingId as string)
  const [isDatePlaceHolder, setIsDatePlaceHolder] = useState(true)
  const [inputValues, setInputValues] = useState({
    description: "",
    budget: "",
    moveInDate: "",
    expirationDate: "",
    preferredGender: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInputValues({
      ...inputValues,
      [name]: value,
    })
  }
  const resetInputValues = () => {
    setInputValues({
      description: "",
      budget: "",
      moveInDate: "",
      expirationDate: "",
      preferredGender: "",
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
    requestType === "co-rent" && {
      elementType: "Slider",
      label: "Your Budget",
      name: "budget",
      min: listing?.post?.price ? listing.post.price * 0.5 : 0,
      max: listing?.post?.price ? listing.post.price * 0.6 : 0,
      placeholder: "Enter your budget",
      className: `w-full  border rounded-md
                  [&_[role=slider]]:bg-goldPrimary
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
      className: "w-full  border  rounded-md py-5.5",
      function: handleInputChange,
    },
  ].filter(Boolean)

  const selectConfig = [
    {
      label: "Preferred Gender",
      name: "preferredGender",
      options: [
        { value: "", label: "Pick Preferred Roommate Gender" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
      className: "dark:bg-darkGray w-full border rounded-sm p-2 py-2.5",
      function: handleInputChange,
    },
  ]

  const createRequestFn = async (data: any) => {
    try {
      const res = await axiosdata.value.post(`/api/requests`, data)
      if (res.status >= 200 && res.status < 300) {
        setToastValues({
          message: "Request Successful",
          status: "success",
          isActive: true,
          duration: 2000,
        })
        resetInputValues()
        router.back()
      } else {
        setToastValues({
          message: "Request failed, try agin",
          status: "danger",
          isActive: true,
          duration: 2000,
        })
        resetInputValues()
      }
    } catch (err) {
      console.log(err)
      setToastValues({
        message: "An error occured",
        status: "danger",
        isActive: true,
        duration: 2000,
      })
      resetInputValues()
    }
  }

  const createRequestMutation = useMutation({
    mutationFn: createRequestFn,
  })

  const handleRequestMutation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createRequestMutation.mutate({ val: { ...inputValues, requestType, listing: listingId } })
  }

  if (isLoading) return null

  if (requestType === "roommate" && !listing?.post?.isUserResident) {
    return (
      <div className="w-full p-8 text-center text-gray-600 dark:text-gray-300 my-30">
        <h2 className="text-xl font-bold font-head text-red-600">
          Unable To Make Roommate Request
        </h2>
        <br />
        You are not a resident of this listing.
        <br />
        If you have already rented this listing, please contact your agent and ask them to add you
        as a resident.
      </div>
    )
  } else {
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

          <div className=" border-1 border-gray-500/30 dark:border-gray-600 flex flex-col md:mr-auto gap-4 p-4 w-[98%] md:w-[58%] lg:w-[60%] rounded-md bg-white dark:bg-gray-800/10 shadow-md">
            <h2 className="headersFont px-4 text-lg">
              {requestType === "roommate" ? "Create a Roomate Request" : "Create a Co-Rent Request"}
            </h2>

            <details className="px-4 text-[14px]">
  <summary className="cursor-pointer font-bold text-foreground underline underline-offset-1.5 transition-all duration-300 hover:text-gray-500">
    Learn more about request types
  </summary>

<div className="mt-2 text-gray-700 dark:text-gray-300 space-y-4">
  <p>
    <strong>Roommate Request: </strong>
    You must already be a resident of this listing. This request is intended to help you find a compatible roommate to share your current space.
  </p>

  <div>
    <p>
      <strong>Co-Rent Request: </strong>
      This option is for users who want to partner with others to rent a property together. You do not need to be an existing resident of the listing.
    </p>

    <p className="mt-2">
      <strong>Note:</strong>
    </p>

    <ul className="list-disc ml-6 space-y-1">
      <li>Your minimum budget is automatically set to 50% of the listing price, and your maximum is set to 60%.</li>
      <li>Be honest with your budget. Misrepresentation or attempts to deceive others will result in a ban from FirstEstates.</li>
    </ul>
  </div>
</div>
</details>


{/* form */}
            <form
              onSubmit={handleRequestMutation}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* inputs */}

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
                text={`Submit ${
                  requestType === "roommate" ? "Roomate Request" : "Co-Rent Request"
                }`}
                className="self-end  md:col-span-2 justify-self-center place-self-center clickable darkblueBtn directional w-70 p-6 mx-auto"
              >
                {createRequestMutation.isPending && <WhiteLoader />}
              </Button>
            </form>
          </div>
        </div>
      </>
    )
  }
}

export default CreateRequest
