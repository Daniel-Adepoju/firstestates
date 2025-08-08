import { parseDate, createdAt } from "@utils/date"

const ManageAppointment = ({nextAppointment,lastAppointment}:{nextAppointment:Date,lastAppointment:Date}) => {

  return (
  <div className="w-full max-w-[90%] g-white dark:bg-darkGray rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
  {/* Card Header */}
  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-100 dark:border-gray-600">
    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
      <svg className="w-4 h-4 dark:text-coffee text-darkblue" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
      Inspection Schedule
    </h3>
  </div>

  {/* Card Body */}
  <div className="p-4 space-y-4">
    {/* Next Viewing */}
    <div className="flex items-start">
      <div className="flex-shrink-0 pt-0.5">
        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-black/20 flex items-center justify-center">
          <svg className="w-4 h-4 dark:text-coffee text-darkblue" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">Next Inspection</p>
        <div className="mt-1 flex items-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{parseDate(nextAppointment)}</p>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-darkblue dark:text-coffee dark:bg-blue-800/30">
            {createdAt(parseDate(nextAppointment))}
          </span>
        </div>
      </div>
    </div>

    {/* Previous Viewing */}
    <div className="flex items-start">
      <div className="flex-shrink-0 pt-0.5">
        <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">Last Inspection</p>
        <div className="mt-1 flex items-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{parseDate(lastAppointment)}</p>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
         {createdAt(parseDate(lastAppointment))}
          </span>
        </div>
      </div>
    </div>

  {/* Progress bar */}

   
  {/* <div className="mt-4">
    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
      <span>Viewing frequency</span>
      <span>5/8 days</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '62%' }}></div>
    </div>
  </div> */}
 

  {/* Card Footer */}
  {/* <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-100 dark:border-gray-600 flex justify-end">
    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
      Manage Schedule
    </button>
  </div> */}

  
  </div>
</div>
  )
}

export default ManageAppointment