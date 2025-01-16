import {
   CheckCircleIcon,
   ClockIcon,
   XCircleIcon,
} from "@heroicons/react/24/solid";

const TutorSessionTopDashboardSummary = ({
   approvedCount,
   pendingCount,
   rejectedCount,
}) => {
   const stats = [
      {
         name: "Approved Sessions",
         count: approvedCount,
         icon: <CheckCircleIcon className='h-10 w-10 text-green-600' />,
         bgColor: "bg-green-100",
      },
      {
         name: "Pending Sessions",
         count: pendingCount,
         icon: <ClockIcon className='h-10 w-10 text-yellow-600' />,
         bgColor: "bg-yellow-100",
      },
      {
         name: "Rejected Sessions",
         count: rejectedCount,
         icon: <XCircleIcon className='h-10 w-10 text-red-600' />,
         bgColor: "bg-red-100",
      },
   ];

   return (
      <div className='flex gap-4 flex-wrap my-10'>
         {stats.map((stat, index) => (
            <div
               key={index}
               className={`flex w-64 items-center p-4 rounded-lg shadow ${stat.bgColor}`}>
               <div className='mr-4'>{stat.icon}</div>
               <div>
                  <p className='text-base sm:text-lg font-medium text-gray-800'>
                     {stat.name}
                  </p>
                  <p className='text-xl sm:text-2xl font-bold text-gray-900'>
                     {stat.count}
                  </p>
               </div>
            </div>
         ))}
      </div>
   );
};

export default TutorSessionTopDashboardSummary;
